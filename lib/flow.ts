/**
 * Kullanıcı akışı (Faz C) paylaşılan tipleri ve hesap yardımcıları.
 * Saf TS — client flow bileşenleri kullanır. Vergi hesabı TEK yerden: lib/tax.ts.
 */
import { calculateTax, type TaxFormula } from '@/lib/tax'
import { taxComponentLabels } from '@/lib/share-card'

export type FlowTag = { slug: string; name: string; emoji: string | null; kind: string }

/** Server'dan client'a geçen ürün. Hayal döngüsü comparisonPrice ile filtreler/harcar (docs/08). */
export type FlowProduct = {
  id: string
  name: string
  emoji: string | null
  retailPrice: number
  taxFreePrice: number
  /** Adil fiyat (matrah × standart KDV). Hayal bütçe filtresi ve satır tutarı bu (docs/08). */
  comparisonPrice: number
  defaultLineText: string | null
  tags: FlowTag[]
  /** variant override formülü (docs/08). Yoksa kategori default'u kullanılır. */
  taxFormula: TaxFormula | null
  /** fixed_per_unit (akaryakıt) hesabı için litre. */
  quantity: number | null
  /** Ana "aldım" akışında seçilebilir mi (ör. kol=false, hayalde görünür). */
  isPurchasable: boolean
}

/** Hazır söz (docs/08). Serbest metin yerine kullanıcı bunlardan seçer. */
export type Quip = {
  scope: 'universal' | 'kategori' | 'urun'
  categorySlug: string | null
  productMatch: string | null
  text: string
  hideIfSameCategory: boolean
}

/**
 * Bir hayal ürünü için geçerli sözleri öncelik sırasıyla döndürür: ürün > kategori > evrensel.
 * hide_if_same_category: alınan ürünün kategorisi = hayal ürününün kategorisi ise o sözler elenir.
 */
export function applicableQuips(
  quips: Quip[],
  dreamProduct: { name: string; categorySlug: string },
  purchasedCategorySlug: string
): Quip[] {
  const sameCategory = purchasedCategorySlug === dreamProduct.categorySlug
  const nameLc = dreamProduct.name.toLocaleLowerCase('tr')

  const matches = (q: Quip): boolean => {
    if (q.hideIfSameCategory && sameCategory) return false
    if (q.scope === 'universal') return true
    if (q.scope === 'kategori') return q.categorySlug === dreamProduct.categorySlug
    return !!q.productMatch && nameLc.includes(q.productMatch.toLocaleLowerCase('tr'))
  }

  const rank = (q: Quip) => (q.scope === 'urun' ? 0 : q.scope === 'kategori' ? 1 : 2)
  return quips.filter(matches).sort((a, b) => rank(a) - rank(b))
}

/**
 * "Kimsin?" adımı seçeneği (docs/07). Katalog DB'den gelir; kullanıcının SEÇİMİ
 * DB'ye yazılmaz — client state'te durur, paylaşım linkinde encode edilir.
 * imageLine null → görselde p4 satırı hiç basılmaz.
 */
export type Persona = {
  key: string
  groupKey: string
  uiLabel: string
  uiHelper: string | null
  imageLine: string | null
}

/**
 * Persona kataloğunu iki adımlı seçim için gruplar: tek satırlı gruplar doğrudan
 * seçilir, çok satırlılar (ucretli/sahis) ikinci dokunuşta dilim sorar.
 * Grup etiketi ui_label'ın ' · ' öncesi ("🧾 Ücretliyim · %27 dilimi" → "🧾 Ücretliyim").
 * Şema'da ayrı group_label yok (docs/07 §4), tekrar etmemek için buradan türetiyoruz.
 */
export function groupPersonas(personas: Persona[]): Array<{ key: string; label: string; options: Persona[] }> {
  const groups: Array<{ key: string; label: string; options: Persona[] }> = []
  for (const p of personas) {
    const existing = groups.find((g) => g.key === p.groupKey)
    if (existing) existing.options.push(p)
    else groups.push({ key: p.groupKey, label: p.uiLabel.split(' · ')[0], options: [p] })
  }
  return groups
}

/** Dilim çipinin etiketi: ui_label'ın ' · ' sonrası ("%27 dilimi"). Yoksa tam etiket. */
export function personaTierLabel(p: Persona): string {
  const parts = p.uiLabel.split(' · ')
  return parts.length > 1 ? parts.slice(1).join(' · ') : p.uiLabel
}

export type FlowCategory = {
  slug: string
  name: string
  emoji: string
  taxFormula: TaxFormula
  isFixedPerUnit: boolean
  isPurchasable: boolean
  isSpendable: boolean
  products: FlowProduct[]
}

/** Hayal döngüsünde eklenen kalem → ShareCard items[]. amount = comparison_price. */
export type DreamItem = {
  emoji: string
  /** Ana satır: ürün adı (docs/08 — söz ürün adının altına gelir). */
  text: string
  /** Seçilen hazır söz; yoksa sadece ürün adı görünür. */
  quip?: string
  amount: number
  tag?: { emoji: string; name: string }
  /** Bağış satırı yeşil tonlu (docs/03 §3 Zone D). */
  positive?: boolean
}

/** "Aldım" seçiminin hesaplanmış hali — şok ekranı + ShareCard bunu kullanır. */
export type PurchaseSelection = {
  product: { name: string; emoji: string }
  categorySlug: string
  /**
   * Aynı kategorideki, ödediğin vergiyle SATIN ALINABİLECEK en pahalı BAŞKA model
   * (retail ≤ totalTax). "Bu vergiyle bir de X alabilirdin" der. Yoksa null.
   * Bilgi amaçlı — sepete eklenmez.
   */
  affordableModel: string | null
  retailPrice: number
  taxFreePrice: number
  totalTax: number
  /** raf − comparisonPrice: ekstra vergiler + üstüne binen KDV. Görsel/bütçe bunu kullanır (docs/01 §4.7). */
  excessTax: number
  /** matrah × (1 + baseline oranlar): sadece standart vergili adil fiyat. */
  comparisonPrice: number
  taxRatio: number
  breakdown: Record<string, number>
  /**
   * Şok ekranı breakdown kartı için: sıralı + TAM etiketli. baseline satır (KDV) için
   * baselineAmount = ürünün kendisine düşen kısım (soluk); kalanı üstüne binen (mercan).
   */
  lines: Array<{ key: string; label: string; amount: number; baselineAmount?: number }>
  /** ShareCard p3 için: kısa etiketli, tutara göre sıralı. */
  taxComponents: string[]
}

/**
 * Ürün veya serbest tutar → hesaplanmış seçim. Ürünlerde de yeniden hesaplarız (stored
 * değerle aynı çıkar, deterministik) ki taxComponents etiketlerini tek yoldan alalım.
 * Hesap patlarsa (geçersiz tutar vb.) null döner, çağıran hata gösterir.
 */
export function computeSelection(
  category: FlowCategory,
  retailPrice: number,
  productName: string,
  emoji: string,
  quantity?: number,
  formulaOverride?: TaxFormula | null
): PurchaseSelection | null {
  try {
    // Ürünün variant formülü varsa o, yoksa kategori default'u (docs/08).
    const result = calculateTax(retailPrice, formulaOverride ?? category.taxFormula, { quantity })

    // Ekstra vergiyle alınabilecek en pahalı BAŞKA model (retail ≤ excessTax).
    const affordable = category.products
      .filter((p) => p.retailPrice <= result.excessTax)
      .reduce<FlowProduct | null>((best, p) => (!best || p.retailPrice > best.retailPrice ? p : best), null)

    return {
      product: { name: productName, emoji },
      categorySlug: category.slug,
      affordableModel: affordable?.name ?? null,
      retailPrice: result.retailPrice,
      taxFreePrice: result.taxFreePrice,
      totalTax: result.totalTax,
      excessTax: result.excessTax,
      comparisonPrice: result.comparisonPrice,
      taxRatio: result.taxRatio,
      breakdown: result.breakdown,
      lines: result.lines.map((l) => ({ key: l.key, label: l.label, amount: l.amount, baselineAmount: l.baselineAmount })),
      taxComponents: taxComponentLabels(result.lines),
    }
  } catch {
    return null
  }
}

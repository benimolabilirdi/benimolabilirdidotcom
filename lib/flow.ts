/**
 * Kullanıcı akışı (Faz C) paylaşılan tipleri ve hesap yardımcıları.
 * Saf TS — client flow bileşenleri kullanır. Vergi hesabı TEK yerden: lib/tax.ts.
 */
import { calculateTax, type TaxFormula } from '@/lib/tax'
import { taxComponentLabels } from '@/lib/share-card'

export type FlowTag = { slug: string; name: string; emoji: string | null; kind: string }

/** Server'dan client'a geçen ürün. taxFreePrice hayal döngüsü için (docs/01 §3.1.4c). */
export type FlowProduct = {
  id: string
  name: string
  emoji: string | null
  retailPrice: number
  taxFreePrice: number
  defaultLineText: string | null
  tags: FlowTag[]
  /** variant override formülü (docs/08). Yoksa kategori default'u kullanılır. */
  taxFormula: TaxFormula | null
  /** fixed_per_unit (akaryakıt) hesabı için litre. */
  quantity: number | null
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

/** Hayal döngüsünde eklenen kalem → ShareCard items[]. amount = vergisiz fiyat. */
export type DreamItem = {
  emoji: string
  /** Kişisel metin (boşsa default_line_text, o da yoksa ürün adı — docs/01 §3.1.4d). */
  text: string
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

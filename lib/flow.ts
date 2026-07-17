/**
 * Kullanıcı akışı (Faz C) paylaşılan tipleri ve hesap yardımcıları.
 * Saf TS — client flow bileşenleri kullanır. Vergi hesabı TEK yerden: lib/tax.ts.
 */
import { calculateTax, type TaxFormula } from '@/lib/tax'
import { taxComponentLabels } from '@/lib/share-card'

/** Server'dan client'a geçen kategori (satın alınabilir, ürünleriyle). */
export type FlowProduct = {
  id: string
  name: string
  emoji: string | null
  retailPrice: number
  defaultLineText: string | null
}

export type FlowCategory = {
  slug: string
  name: string
  emoji: string
  taxFormula: TaxFormula
  isFixedPerUnit: boolean
  products: FlowProduct[]
}

/** "Aldım" seçiminin hesaplanmış hali — şok ekranı + ShareCard bunu kullanır. */
export type PurchaseSelection = {
  product: { name: string; emoji: string }
  categorySlug: string
  /** "bir ___ daha alabilirdin" için sade ad (ürün adı ya da kategori adı). */
  unitNoun: string
  retailPrice: number
  taxFreePrice: number
  totalTax: number
  taxRatio: number
  breakdown: Record<string, number>
  /** Şok ekranı breakdown kartı için: sıralı + TAM etiketli (short_label değil — yer bol, resmi ad güven verir). */
  lines: Array<{ label: string; amount: number }>
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
  unitNoun: string,
  quantity?: number
): PurchaseSelection | null {
  try {
    const result = calculateTax(retailPrice, category.taxFormula, { quantity })
    return {
      product: { name: productName, emoji },
      categorySlug: category.slug,
      unitNoun,
      retailPrice: result.retailPrice,
      taxFreePrice: result.taxFreePrice,
      totalTax: result.totalTax,
      taxRatio: result.taxRatio,
      breakdown: result.breakdown,
      lines: result.lines.map((l) => ({ label: l.label, amount: l.amount })),
      taxComponents: taxComponentLabels(result.lines),
    }
  } catch {
    return null
  }
}

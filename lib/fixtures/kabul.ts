/**
 * docs/03 §7 kabul senaryoları — GERÇEK MOTORDAN beslenir (Fable R3): elle rakam yok.
 * Satın alım excessTax'i ve her hayal kalemi comparison_price'ı calculateTax ile hesaplanır.
 * Kancalar: iPhone şok 48.794 · Bosch ~6.373 · PS5 ~30.000.
 */
import categoriesJson from '@/seed/categories.json'
import { calculateTax, type TaxFormula } from '@/lib/tax'
import { taxComponentLabels, type ShareCardData, type WishItem } from '@/lib/share-card'

const formulaBySlug = new Map(
  (categoriesJson as Array<{ slug: string; tax_formula: TaxFormula }>).map((c) => [c.slug, c.tax_formula])
)
const formula = (slug: string) => formulaBySlug.get(slug)!

type ItemSpec = {
  name: string
  emoji: string
  retail: number
  slug: string
  quip?: string
  chip?: { emoji: string; name: string }
  positive?: boolean
}

/** Hayal kalemi: comparison_price motordan (Fable R3). */
function item(spec: ItemSpec): WishItem {
  const r = calculateTax(spec.retail, formula(spec.slug))
  return {
    emoji: spec.emoji,
    text: spec.name,
    quip: spec.quip,
    amount: r.comparisonPrice,
    tag: spec.chip,
    positive: spec.positive,
  }
}

/**
 * Satın alım senaryosu. Gerçek akış gibi: adaylardan yalnız kalan bütçeye SIĞANLAR eklenir
 * (aşan atlanır), remaining dürüst kalır. excessTax + bileşenler + comparison'lar motordan.
 */
function scenario(
  product: { name: string; emoji: string; retail: number; slug: string },
  pool: ItemSpec[],
  personaLine?: string
): ShareCardData {
  const r = calculateTax(product.retail, formula(product.slug))
  let remaining = r.excessTax
  const items: WishItem[] = []
  for (const spec of pool) {
    const it = item(spec)
    if (it.amount > 0 && it.amount <= remaining) {
      items.push(it)
      remaining -= it.amount
    }
  }
  return {
    product: { name: product.name, emoji: product.emoji },
    retailPrice: r.retailPrice,
    totalTax: r.totalTax,
    excessTax: r.excessTax,
    taxComponents: taxComponentLabels(r.lines),
    personaLine,
    remaining: Math.round(remaining * 100) / 100,
    items,
  }
}

const PERSONA = 'Oysa ben maaşımdan %27’ye varan gelir vergisini zaten ödüyorum.'
const IPHONE = { name: 'iPhone 17', emoji: '📱', retail: 119000, slug: 'telefon' }

// iPhone 17 (119.000, telefon) → excess ≈ 48.794. Chip'ler R5: occasion > recipient.
// Havuz büyükten küçüğe; sonda ucuz kalemler → bütçe küçük kalana kadar dolar.
const IPHONE_POOL: ItemSpec[] = [
  { name: 'PlayStation 5 Slim Digital', emoji: '🎮', retail: 36000, slug: 'oyun-konsolu', quip: 'Save dosyam hazır · konsol bekliyor' },
  { name: 'Bosch Mutfak Robotu', emoji: '🥣', retail: 6800, slug: 'beyaz-esya', quip: 'Annemin mutfak robotu yine benim 🥣', chip: { emoji: '🌷', name: 'Anneler Günü' } },
  { name: 'Konser Bileti x2', emoji: '🎤', retail: 5000, slug: 'kultur-sanat', quip: 'Konseri storylerden izledim 🥲', chip: { emoji: '💑', name: 'Eşime' } },
  { name: 'Hasan Âli Yücel Klasikleri', emoji: '📚', retail: 2700, slug: 'kitap', quip: 'Okuma listem kabarık · rafım sakin' },
  { name: 'LEGO Seti', emoji: '🧱', retail: 1300, slug: 'oyuncak', quip: 'Parça parça biriktirsem mi 🧱', chip: { emoji: '🎂', name: 'Doğum Günü' } },
  { name: 'Tiyatro Bileti x4', emoji: '🎭', retail: 800, slug: 'kultur-sanat', quip: 'Perde açıldı · ben dışarıdaydım 🎭', chip: { emoji: '👨‍👩‍👧', name: 'Aileme' } },
  { name: 'Barbie Bebek', emoji: '🎀', retail: 1400, slug: 'oyuncak', chip: { emoji: '🧒', name: 'Çocuğuma' } },
  { name: 'Çocuk Klasikleri (15 Kitap)', emoji: '📚', retail: 890, slug: 'kitap', chip: { emoji: '👶', name: 'Yeğenime' } },
  { name: 'Yardım Kuruluşuna Bağış', emoji: '❤️', retail: 5000, slug: 'bagis', quip: 'İyilik hayali bile güzel ❤️', positive: true },
]

export const KABUL_PERSONALI: ShareCardData = scenario(IPHONE, IPHONE_POOL, PERSONA)
export const KABUL_PERSONASIZ: ShareCardData = scenario(IPHONE, IPHONE_POOL)
export const KABUL_SENARYOSU = KABUL_PERSONASIZ

/** Simit/çay kapanışı demosu: A56 (excess ~11.071); havuz bütçeyi ~8 TL'ye indirir → "simit yerim". */
export const KABUL_SIMIT: ShareCardData = scenario(
  { name: 'Samsung Galaxy A56', emoji: '📱', retail: 27000, slug: 'telefon' },
  [
    { name: 'Bosch Mutfak Robotu', emoji: '🥣', retail: 6800, slug: 'beyaz-esya', quip: 'Annemin mutfak robotu yine benim 🥣', chip: { emoji: '🌷', name: 'Anneler Günü' } },
    { name: 'Özel Tiyatro Bileti x2', emoji: '🎭', retail: 1600, slug: 'kultur-sanat', chip: { emoji: '💑', name: 'Eşime' } },
    { name: 'Festival Bileti', emoji: '🎪', retail: 1000, slug: 'kultur-sanat' },
    { name: 'Çocuk Klasikleri (15 Kitap)', emoji: '📚', retail: 890, slug: 'kitap', chip: { emoji: '👶', name: 'Yeğenime' } },
    { name: 'Sinema Bileti x2', emoji: '🎬', retail: 500, slug: 'kultur-sanat' },
    { name: 'Resim-Heykel Atölyesi', emoji: '🎨', retail: 450, slug: 'kultur-sanat', quip: 'Alkışı içimden tuttum' },
    { name: 'İlyada', emoji: '📕', retail: 287, slug: 'kitap' },
    { name: 'Karamazov Kardeşler', emoji: '📕', retail: 270, slug: 'kitap' },
    { name: 'Sinema Bileti', emoji: '🎬', retail: 250, slug: 'kultur-sanat' },
    { name: 'Tiyatro Bileti', emoji: '🎭', retail: 200, slug: 'kultur-sanat' },
    { name: 'Venedik Taciri', emoji: '📕', retail: 63, slug: 'kitap' },
    { name: 'Bir Kuzey Macerası', emoji: '📕', retail: 37, slug: 'kitap' },
  ]
)

/** Taşma senaryosu: otomobil (dev ekstra vergi) + çok kalem → emoji özeti + toplam (R4). */
export const KABUL_OTOMOBIL_TASMA: ShareCardData = scenario(
  { name: 'Renault Yeni Clio', emoji: '🚗', retail: 1830000, slug: 'otomobil' },
  [
    { name: '1 Yıllık Kira', emoji: '🏠', retail: 480000, slug: 'sabit-giderler' },
    { name: 'iPhone 17 Pro Max', emoji: '📱', retail: 122000, slug: 'telefon', quip: 'Pro’su da Max’ı da hayali de güzel 🥲', chip: { emoji: '🙋', name: 'Kendime' } },
    { name: 'Madrid-Barcelona Turu 6 Gün x2', emoji: '✈️', retail: 70000, slug: 'tatil', quip: 'İspanyolca öğrendim · gidemedim 🥲', chip: { emoji: '💑', name: 'Eşime' } },
    { name: 'Üniversite Hazırlık Dershanesi', emoji: '🎓', retail: 70000, slug: 'egitim', quip: 'Evladın hayali · babanın hesabı 🥲', chip: { emoji: '🎒', name: 'Okul' } },
    { name: 'Bosch Buzdolabı', emoji: '🧊', retail: 40000, slug: 'beyaz-esya' },
    { name: 'PlayStation 5 Slim Digital', emoji: '🎮', retail: 36000, slug: 'oyun-konsolu', quip: 'Save dosyam hazır · konsol bekliyor' },
    { name: 'Diş İmplantı', emoji: '🦷', retail: 20000, slug: 'saglik' },
    { name: 'Sefiller (Özel Kutulu Set)', emoji: '📚', retail: 6000, slug: 'kitap', quip: 'Okudukça liste uzuyor · bütçe uzamıyor' },
    { name: 'Konser Bileti x2', emoji: '🎤', retail: 5000, slug: 'kultur-sanat', quip: 'Konseri storylerden izledim 🥲' },
    { name: 'Barbie Bebek', emoji: '🎀', retail: 1400, slug: 'oyuncak', chip: { emoji: '🧒', name: 'Çocuğuma' } },
    { name: 'LEGO Seti', emoji: '🧱', retail: 1300, slug: 'oyuncak', chip: { emoji: '🎂', name: 'Doğum Günü' } },
    { name: 'Yardım Kuruluşuna Bağış', emoji: '❤️', retail: 50000, slug: 'bagis', quip: 'Bir öğrenciye burs desteği', positive: true },
  ],
  PERSONA
)

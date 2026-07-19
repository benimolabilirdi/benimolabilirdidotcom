/**
 * ShareCard'ın veri sözleşmesi, formatları ve biçimlendirme kuralları.
 * Kaynak: docs/03-visual-spec.md · Renk/font: .claude/skills/benimolabilirdi-design/tokens/
 *
 * Bu dosya da saf TypeScript — hem client (html-to-image) hem edge (@vercel/og) kullanır.
 */

export type ShareCardFormat = 'story' | 'post' | 'square' | 'og'

export type WishItem = {
  emoji: string
  /** Ana satır: ürün adı (kimlik). */
  text: string
  /** Seçilen hazır söz (docs/08). Ürün adının ALTINA gelir; yoksa sadece ürün adı görünür. */
  quip?: string
  amount: number
  /** Akışta seçilen etiket (occasion > recipient önceliği, docs/03 §4). Yoksa chip çizilmez. */
  tag?: { emoji: string; name: string }
  /** Bağış satırı yeşil tonlu gösterilir (docs/03 §3 Zone D). */
  positive?: boolean
}

export type ShareCardData = {
  product: { name: string; emoji: string }
  retailPrice: number
  totalTax: number
  /** Ekstra vergi (docs/01 §4.7). Verilirse görselin büyük rakamı bu olur; yoksa totalTax. */
  excessTax?: number
  /**
   * Bu ÜRÜNDE gerçekten olan vergilerin adları, gösterim sırasıyla.
   * Üründen ürüne DEĞİŞİR: beyaz eşyada TRT payı yok, kitapta hiçbiri yok.
   * Sabit yazılamaz — olmayan vergiyi göstermek "vergiyi şişirmek" olur (PRD §8).
   * Kaynak: lib/tax.ts → taxComponentLabels(result.lines)
   */
  taxComponents: string[]
  /**
   * Persona satırı (docs/07 §5 p4). "Oysa ben maaşımdan %27'ye varan…" — tam cümle
   * DB'den (personas.image_line) gelir, interpolasyon yok. Boş/undefined ise p4 basılmaz.
   */
  personaLine?: string
  items: WishItem[]
  /** Hayal döngüsü sonunda cepte kalan (docs/03 §3 Zone E). 0 ise satır çizilmez. */
  remaining: number
}

/**
 * lib/tax.ts sonucunu ShareCard'ın taxComponents alanına çevirir.
 *
 * Sıra TUTARA göre, büyükten küçüğe — zincir sırasına göre değil. Telefonda bu
 * "ÖTV + KDV + TRT payı + Bakanlık fonu" verir (zincir sırası bandrol'ü öne alırdı).
 * İlke: en ağır kalem önce okunsun. 0 TL'lik kalem hiç yazılmaz.
 */
/**
 * Ekstra vergi bileşenleri: baseline (standart KDV) HARİÇ ÖTV/bandrol/fon (Fable R1).
 * Görselde "ÖTV + TRT payı + fon + bunların KDV'siydi" olarak birleşir — çünkü excessTax
 * bu yüklerin ve onların üstüne binen KDV'nin toplamı.
 */
export function taxComponentLabels(
  lines: Array<{ label: string; shortLabel?: string; amount: number; baseline?: boolean }>
): string[] {
  return lines
    .filter((line) => line.amount > 0 && !line.baseline)
    .slice()
    .sort((a, b) => b.amount - a.amount)
    .map((line) => line.shortLabel ?? line.label) // docs/07 §4: kısa ad varsa o
}

/**
 * Türkçe geçmiş zaman ek fiili "-(y)DI". Kelimenin bitişine göre:
 *   ünlüyle biter → y kaynaştırma: "fonu" → "fonuydu", "Vergisi" → "Vergisiydi"
 *   ünsüzle biter → kaynaştırma yok, sert ünsüzden sonra d→t: "fon" → "fondu", "kitap" → "kitaptı"
 * Kısaltmalar okunuşlarıyla (ünlü biter): "KDV" → "KDV'ydi", "ÖTV" → "ÖTV'ydi".
 */
export function pastCopula(word: string): string {
  const ABBREVIATIONS: Record<string, string> = { KDV: 'e', ÖTV: 'e', TRT: 'e' }
  const isAbbreviation = word in ABBREVIATIONS

  const lastVowel =
    ABBREVIATIONS[word] ??
    Array.from(word.toLowerCase()).reverse().find((c) => 'aeıioöuü'.includes(c)) ??
    'i'
  const harmony = 'aı'.includes(lastVowel)
    ? 'ı'
    : 'ei'.includes(lastVowel)
      ? 'i'
      : 'ou'.includes(lastVowel)
        ? 'u'
        : 'ü'

  const lastChar = word.trim().slice(-1).toLowerCase()
  const endsWithVowel = isAbbreviation || 'aeıioöuü'.includes(lastChar)

  const glide = endsWithVowel ? 'y' : ''
  const stop = !endsWithVowel && 'çfhkpsşt'.includes(lastChar) ? 't' : 'd' // sert ünsüz sonrası d→t
  return `${isAbbreviation ? "'" : ''}${glide}${stop}${harmony}`
}

/**
 * Format seti docs/06 §3 finali: story · post 4:5 · kare 1:1 · og.
 * Üçü de 1080 geniş → aynı fizik punto; kare ve og daha az yükseklik için ölçeklenir.
 */
export const FORMATS: Record<
  ShareCardFormat,
  { w: number; h: number; label: string; ratio: string; maxRows: number }
> = {
  // maxRows etiketli (yani en uzun) satırlarla bile taşmayacak şekilde muhafazakâr;
  // footer ayrıca minHeight:0+overflow ile korunuyor. Fazlası emoji özetine gider.
  story: { w: 1080, h: 1920, label: 'Story', ratio: '9:16', maxRows: 7 },
  post: { w: 1080, h: 1350, label: 'Post', ratio: '4:5', maxRows: 4 },
  square: { w: 1080, h: 1080, label: 'Kare', ratio: '1:1', maxRows: 2 },
  og: { w: 1200, h: 630, label: 'Link önizleme', ratio: '1.91:1', maxRows: 3 },
}

/** docs/03 §4 + CLAUDE.md kural 4: TR locale, binlik nokta, kuruşsuz, 1M üstü kısaltma YOK. */
export function formatTL(amount: number): string {
  return `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(Math.round(amount))} TL`
}

/**
 * Liste kapasitesi (docs/03 §4): fazlası son satır yerine kompakt özet (taşan kalemlerin
 * emoji'leri + "ve N şey daha"). Taşma varsa görünen satır bir eksilir — özet onun yerini alır.
 * hidden[] taşan kalemleri taşır (emoji gösterimi için).
 */
export function fitItems(items: WishItem[], format: ShareCardFormat): { visible: WishItem[]; hidden: WishItem[] } {
  const { maxRows } = FORMATS[format]
  if (items.length <= maxRows) return { visible: items, hidden: [] }
  return { visible: items.slice(0, maxRows - 1), hidden: items.slice(maxRows - 1) }
}

/** Palet — tasarım sistemi tokens/colors.css'ten LİTERAL değerler (satori var() çözemez). */
export const C = {
  bg: '#FAF3E8', // cream-100
  ink: '#1E2A4A', // navy-800
  inkSoft: '#5B6F9E', // navy-500
  muted: '#8A99BB', // navy-400
  accent: '#E85D4A', // coral-500
  accentDeep: '#CE4A38', // coral-600 — destek metni (docs/07 §5 p3 destek)
  chipBg: '#FBE0DB', // coral-100
  chipInk: '#B23D2E', // coral-700
  card: '#FFFFFF',
  positive: '#2E7D5B', // green-500
  positiveSoft: '#DCEEE4', // green-100
  positiveInk: '#1F5B41', // green-700
  hairline: '#E9D8BC', // cream-300
} as const

export const FONT_DISPLAY = 'Nunito'
export const FONT_UI = 'DM Sans'

/**
 * ShareCard'ın veri sözleşmesi, formatları ve biçimlendirme kuralları.
 * Kaynak: docs/03-visual-spec.md · Renk/font: .claude/skills/benimolabilirdi-design/tokens/
 *
 * Bu dosya da saf TypeScript — hem client (html-to-image) hem edge (@vercel/og) kullanır.
 */

export type ShareCardFormat = 'story' | 'post' | 'og'

export type WishItem = {
  emoji: string
  /** Kullanıcının kendi metni; boşsa ürün adı (docs/01 §3.1.4d). Maks 40 karakter. */
  text: string
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
  items: WishItem[]
  /** Hayal döngüsü sonunda cepte kalan (docs/03 §3 Zone E). 0 ise satır çizilmez. */
  remaining: number
}

/**
 * docs/03 §1. Post 1080×1080 — tasarım sistemi 1080×1350 (4:5) öneriyor ama
 * çelişkide docs kazanıyor (CLAUDE.md). 4:5'e geçilecekse tek sayı değişir.
 */
export const FORMATS: Record<
  ShareCardFormat,
  { w: number; h: number; label: string; maxRows: number }
> = {
  story: { w: 1080, h: 1920, label: 'Story', maxRows: 7 },
  post: { w: 1080, h: 1080, label: 'Post', maxRows: 5 },
  og: { w: 1200, h: 630, label: 'Link önizleme', maxRows: 3 },
}

/** docs/03 §4 + CLAUDE.md kural 4: TR locale, binlik nokta, kuruşsuz, 1M üstü kısaltma YOK. */
export function formatTL(amount: number): string {
  return `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(Math.round(amount))} TL`
}

/**
 * Liste kapasitesi (docs/03 §4): fazlası son satır yerine "➕ ve N şey daha…".
 * Taşma varsa görünen satır sayısı bir eksilir — özet satırı onun yerini alır.
 */
export function fitItems(items: WishItem[], format: ShareCardFormat) {
  const { maxRows } = FORMATS[format]
  if (items.length <= maxRows) return { visible: items, overflow: 0 }
  return { visible: items.slice(0, maxRows - 1), overflow: items.length - (maxRows - 1) }
}

/** Palet — tasarım sistemi tokens/colors.css'ten LİTERAL değerler (satori var() çözemez). */
export const C = {
  bg: '#FAF3E8', // cream-100
  ink: '#1E2A4A', // navy-800
  inkSoft: '#5B6F9E', // navy-500
  muted: '#8A99BB', // navy-400
  accent: '#E85D4A', // coral-500
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

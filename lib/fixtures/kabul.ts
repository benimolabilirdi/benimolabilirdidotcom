/**
 * docs/03 §7 kabul testi senaryosu — B2 GATE'inde render edilip onaya sunulur.
 *
 * Rakamlar dokümandan AYNEN alındı (iPhone 119.000 / vergi 59.400). Dikkat: lib/tax.ts
 * aynı telefon için 60.494,59 hesaplıyor — aradaki fark PRD §4.2'nin yuvarlak örnek
 * değeri kullanmasından. Bu fixture görsel kabul içindir, hesap doğruluğu için değil.
 */
import type { ShareCardData } from '@/lib/share-card'

export const KABUL_SENARYOSU: ShareCardData = {
  product: { name: 'iPhone 17', emoji: '📱' },
  retailPrice: 119000,
  totalTax: 59400,
  remaining: 340,
  items: [
    {
      emoji: '🥣',
      text: 'Anneme yeni bir mutfak robotu',
      amount: 8900,
      tag: { emoji: '🌷', name: 'Anneler Günü' },
    },
    { emoji: '📚', text: 'Bir yıllık kitaplarım', amount: 4200 },
    {
      emoji: '🎭',
      text: 'Kuzenlerle tiyatro gecesi',
      amount: 3600,
      tag: { emoji: '🎂', name: 'Doğum Günü' },
    },
    { emoji: '🎈', text: "Kapadokya'da 2 gece", amount: 15000 },
    {
      emoji: '🧸',
      text: 'Yeğenime LEGO seti',
      amount: 2700,
      tag: { emoji: '🎄', name: 'Yılbaşı' },
    },
    { emoji: '❤️', text: 'Depremzedelere bağış', amount: 5000, positive: true },
  ],
}

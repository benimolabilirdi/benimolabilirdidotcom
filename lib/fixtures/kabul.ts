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
  // Telefonun gerçek bileşenleri, tutara göre (taxComponentLabels'ın üreteceği sıra).
  // Bandrol+fon tek kalem: PRD §4.2 formülü toplamalı, ayırmak vergiyi %0.1 şişirirdi.
  taxComponents: ['ÖTV', 'KDV', 'TRT payı + Bakanlık fonu'],
  // docs/03 §7 "kalan 340 TL" diyor ama listedeki 6 kalem 39.400 TL tutuyor:
  // 59.400 − 39.400 = 20.000. Dokümanın aritmetiği kendi içinde tutarsız.
  // Doğru olanı yazdım; ayrıca telefonun vergisiz fiyatı 58.505 TL, yani ödenen
  // vergiyle ikinci bir telefon alınabiliyor — hayal döngüsü için gerçek bir senaryo.
  remaining: 20000,
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

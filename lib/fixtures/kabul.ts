/**
 * docs/03 §7 kabul testi senaryosu — B2 GATE'inde render edilip onaya sunulur.
 *
 * Rakamlar dokümandan AYNEN alındı (iPhone 119.000 / vergi 59.400). Dikkat: lib/tax.ts
 * aynı telefon için 60.494,59 hesaplıyor — aradaki fark PRD §4.2'nin yuvarlak örnek
 * değeri kullanmasından. Bu fixture görsel kabul içindir, hesap doğruluğu için değil.
 */
import type { ShareCardData } from '@/lib/share-card'

// Ortak liste — 7 satır (R2): 6 kalem 39.400 + benzin 19.660 = 59.060, kalan 340.
// Böylece döngü gerçekçi biter VE akaryakıt kategorisi GATE'te test edilmiş olur.
const ITEMS: ShareCardData['items'] = [
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
  { emoji: '🧸', text: 'Yeğenime LEGO seti', amount: 2700, tag: { emoji: '🎄', name: 'Yılbaşı' } },
  { emoji: '❤️', text: 'Depremzedelere bağış', amount: 5000, positive: true },
  { emoji: '⛽', text: '2 depo benzin', amount: 19660 },
]

const BASE: ShareCardData = {
  product: { name: 'iPhone 17', emoji: '📱' },
  retailPrice: 119000,
  totalTax: 59400,
  // Telefonun gerçek bileşenleri, tutara göre (taxComponentLabels'ın üreteceği sıra).
  // 'fon' short_label'dan gelir; bandrol+fon tek kalem (PRD §4.2 toplamalı çarpan).
  taxComponents: ['ÖTV', 'KDV', 'TRT payı + fon'],
  remaining: 340, // 59.400 − 59.060
  items: ITEMS,
}

/** GATE varyant 1: persona'lı (ucretli_27, docs/07 §3 image_line). */
export const KABUL_PERSONALI: ShareCardData = {
  ...BASE,
  personaLine: 'Oysa ben maaşımdan %27’ye varan gelir vergisini zaten ödüyorum.',
}

/** GATE varyant 2: persona'sız ("yok" seçeneği — p4 basılmaz). */
export const KABUL_PERSONASIZ: ShareCardData = BASE

// Geriye dönük ad (eski importlar için).
export const KABUL_SENARYOSU = KABUL_PERSONASIZ

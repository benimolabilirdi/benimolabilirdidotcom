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
  // Ürün adı (ana satır) + söz (altında, italik). Sözsüz kalem de var (Diş İmplantı).
  { emoji: '🥣', text: 'Bosch Mutfak Robotu', quip: 'Annemin mutfak robotu yine benim 🥣', amount: 6800, tag: { emoji: '👩', name: 'Anneme' } },
  { emoji: '📚', text: 'Hasan Âli Yücel Klasikleri', quip: 'Okuma listem kabarık · rafım sakin', amount: 2700 },
  { emoji: '🎭', text: 'Tiyatro Bileti x4', quip: 'Perde açıldı · ben dışarıdaydım 🎭', amount: 800, tag: { emoji: '👨‍👩‍👧', name: 'Aileme' } },
  { emoji: '🎈', text: 'Kapadokya Turu 4 Gün x2', quip: 'Balonlar bensiz uçuyor 🎈', amount: 12000, tag: { emoji: '💑', name: 'Eşime' } },
  { emoji: '🦷', text: 'Diş İmplantı', amount: 20000 },
  { emoji: '🧸', text: 'LEGO Seti', quip: 'Yeğen sordu · dayı sustu 🥲', amount: 1300, tag: { emoji: '👶', name: 'Yeğenime' } },
  { emoji: '❤️', text: 'Yardım Kuruluşuna Bağış', quip: 'İyilik hayali bile güzel ❤️', amount: 5000, positive: true },
]

const BASE: ShareCardData = {
  product: { name: 'iPhone 17', emoji: '📱' },
  retailPrice: 119000,
  totalTax: 59400,
  // Ekstra vergi (görselin büyük rakamı): standart KDV hariç, üstüne binen kısım (docs/01 §4.7).
  excessTax: 48000,
  // Telefonun gerçek bileşenleri, tutara göre (taxComponentLabels'ın üreteceği sıra).
  // bandrol+fon base:matrah ile ayrıldı → dört kalem, çarpan yine 1.13 (vergi şişmez).
  taxComponents: ['ÖTV', 'KDV', 'TRT payı', 'fon'],
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

/** Taşma senaryosu: otomobil (dev ekstra vergi) + 12 hayal kalemi → emoji özeti testi. */
export const KABUL_OTOMOBIL_TASMA: ShareCardData = {
  product: { name: 'Toyota Corolla', emoji: '🚗' },
  retailPrice: 2284000,
  totalTax: 1235000,
  excessTax: 1025000,
  taxComponents: ['ÖTV', 'KDV', 'TRT payı'],
  personaLine: 'Oysa ben maaşımdan %27’ye varan gelir vergisini zaten ödüyorum.',
  remaining: 34000,
  items: [
    { emoji: '📱', text: 'iPhone 17 Pro Max', quip: 'Pro’su da Max’ı da hayali de güzel 🥲', amount: 70000, tag: { emoji: '🙋', name: 'Kendime' } },
    { emoji: '🦷', text: 'Diş İmplantı', amount: 20000 },
    { emoji: '🎈', text: 'Kapadokya Turu 4 Gün x2', quip: 'Balonlar bensiz uçuyor 🎈', amount: 12000, tag: { emoji: '💑', name: 'Eşime' } },
    { emoji: '🎓', text: 'Üniversite Hazırlık Dershanesi', quip: 'Evladın hayali · babanın hesabı 🥲', amount: 70000, tag: { emoji: '🧒', name: 'Çocuğuma' } },
    { emoji: '🧊', text: 'Beko Buzdolabı', amount: 26700 },
    { emoji: '🎮', text: 'PlayStation 5 Slim Digital', quip: 'Save dosyam hazır · konsol bekliyor', amount: 36000 },
    { emoji: '📚', text: 'Sefiller (Özel Kutulu Set)', quip: 'Okudukça liste uzuyor · bütçe uzamıyor', amount: 6000 },
    { emoji: '🎭', text: 'Konser Bileti', quip: 'Konseri storylerden izledim 🥲', amount: 5000 },
    { emoji: '🧸', text: 'LEGO Seti', quip: 'Parça parça biriktirsem mi 🧱', amount: 1300, tag: { emoji: '👶', name: 'Yeğenime' } },
    { emoji: '🛂', text: '10 Yıllık Pasaportum', quip: 'Hele bunu bir alabileyim · sonra ver elini dünya 🌍', amount: 14834 },
    { emoji: '⌚', text: 'Huawei Watch GT 6', amount: 22000, tag: { emoji: '💗', name: 'Kız Arkadaşıma' } },
    { emoji: '❤️', text: 'Yardım Kuruluşuna Bağış', quip: 'Bir öğrenciye burs desteği', amount: 10000, positive: true },
  ],
}

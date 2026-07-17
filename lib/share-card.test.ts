import { describe, it, expect } from 'vitest'
import { calculateTax, type TaxFormula } from './tax'
import { fitItems, formatTL, pastCopula, taxComponentLabels, type WishItem } from './share-card'

describe('formatTL', () => {
  it('TR locale, binlik nokta, kuruşsuz (CLAUDE.md kural 4)', () => {
    expect(formatTL(59400)).toBe('59.400 TL')
    expect(formatTL(340)).toBe('340 TL')
    expect(formatTL(0)).toBe('0 TL')
  })

  it('1M üstünde kısaltma YOK — büyüklük hissi kaybolmasın (docs/03 §4)', () => {
    expect(formatTL(1240000)).toBe('1.240.000 TL')
  })

  it('kuruşu yuvarlar', () => {
    expect(formatTL(60494.59)).toBe('60.495 TL')
  })
})

describe('taxComponentLabels', () => {
  it('tutara göre büyükten küçüğe sıralar ve short_label kullanır', () => {
    // Zincir sırası bandrol → ÖTV → KDV; gösterimde ÖTV önce, bandrol short_label ile.
    const TELEFON: TaxFormula = {
      type: 'chain',
      components: [
        { key: 'bandrol', label: 'TRT Bandrolü', short_label: 'TRT payı', base: 'matrah', rate: 0.12 },
        { key: 'fon', label: 'Kültür Fonu', short_label: 'fon', base: 'matrah', rate: 0.01 },
        {
          key: 'otv',
          label: 'ÖTV',
          tiers: [
            { max_matrah: 640, rate: 0.25 },
            { max_matrah: 1500, rate: 0.4 },
            { max_matrah: null, rate: 0.5 },
          ],
        },
        { key: 'kdv', label: 'KDV', rate: 0.2 },
      ],
    }
    const result = calculateTax(119000, TELEFON)

    // Tutara göre sıralı, short_label ile (docs/07 §4): ÖTV > KDV > bandrol(0.12) > fon(0.01).
    expect(taxComponentLabels(result.lines)).toEqual(['ÖTV', 'KDV', 'TRT payı', 'fon'])
  })

  it('vergisiz üründe boş dizi döner (kitap)', () => {
    const result = calculateTax(4200, { type: 'chain', components: [] })
    expect(taxComponentLabels(result.lines)).toEqual([])
  })

  it('olmayan vergiyi listelemez — 0 TL tutan kalem yazılmaz', () => {
    // Akaryakıtta maktu ÖTV henüz 0 (E1'de dolacak). Sıfırsa gösterilmemeli,
    // yoksa olmayan vergiyi saymış oluruz (PRD §8).
    const AKARYAKIT: TaxFormula = {
      type: 'fixed_per_unit',
      unit: 'litre',
      components: [
        { key: 'otv', label: 'ÖTV', amount_per_unit: 0 },
        { key: 'kdv', label: 'KDV', rate: 0.2 },
      ],
    }
    const result = calculateTax(2400, AKARYAKIT, { quantity: 50 })
    expect(taxComponentLabels(result.lines)).toEqual(['KDV'])
  })
})

describe('pastCopula — Türkçe ünlü uyumu', () => {
  it('normal kelimede ek doğrudan yapışır', () => {
    expect(`Bakanlık fonu${pastCopula('Bakanlık fonu')}`).toBe('Bakanlık fonuydu')
    expect(`Konaklama Vergisi${pastCopula('Konaklama Vergisi')}`).toBe('Konaklama Vergisiydi')
  })

  it('kısaltmada kesme işaretiyle ve okunuşa göre', () => {
    expect(`KDV${pastCopula('KDV')}`).toBe("KDV'ydi") // "kadeve"
    expect(`ÖTV${pastCopula('ÖTV')}`).toBe("ÖTV'ydi")
  })

  it('ünsüzle biten kelimede kaynaştırma yok, sertleşme uygulanır', () => {
    expect(`fon${pastCopula('fon')}`).toBe('fondu') // n yumuşak → d
    expect(`TRT payı + fon${pastCopula('TRT payı + fon')}`).toBe('TRT payı + fondu')
    expect(`kitap${pastCopula('kitap')}`).toBe('kitaptı') // p sert → t
  })
})

describe('fitItems — liste kapasitesi (docs/03 §4)', () => {
  const items = (n: number): WishItem[] =>
    Array.from({ length: n }, (_, i) => ({ emoji: '🎁', text: `Şey ${i}`, amount: 100 }))

  it('sığıyorsa hepsi görünür, taşma yok', () => {
    expect(fitItems(items(5), 'story')).toEqual({ visible: items(5), hidden: [] })
  })

  it('taşarsa son satırı kompakt özete bırakır, taşanlar hidden[]', () => {
    // Story 7 satır alır; 12 kalemde 6 görünür + 6 gizli (emoji özeti).
    const { visible, hidden } = fitItems(items(12), 'story')
    expect(visible).toHaveLength(6)
    expect(hidden).toHaveLength(6)
    expect(visible.length + hidden.length).toBe(12)
  })

  it('OG en dar: 3 satır', () => {
    const { visible, hidden } = fitItems(items(6), 'og')
    expect(visible).toHaveLength(2)
    expect(hidden).toHaveLength(4)
  })
})

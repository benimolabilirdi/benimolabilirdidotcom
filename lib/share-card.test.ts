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
  it('tutara göre büyükten küçüğe sıralar, zincir sırasına göre değil', () => {
    // Telefonun gerçek zinciri: bandrol → ÖTV → KDV. Gösterimde ÖTV önce gelmeli.
    const TELEFON: TaxFormula = {
      type: 'chain',
      components: [
        { key: 'bandrol_fon', label: 'TRT payı + Bakanlık fonu', rate: 0.13 },
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

    expect(taxComponentLabels(result.lines)).toEqual(['ÖTV', 'KDV', 'TRT payı + Bakanlık fonu'])
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
})

describe('fitItems — liste kapasitesi (docs/03 §4)', () => {
  const items = (n: number): WishItem[] =>
    Array.from({ length: n }, (_, i) => ({ emoji: '🎁', text: `Şey ${i}`, amount: 100 }))

  it('sığıyorsa hepsi görünür, taşma yok', () => {
    expect(fitItems(items(5), 'story')).toEqual({ visible: items(5), overflow: 0 })
  })

  it('taşarsa son satırı özet satırına bırakır', () => {
    // Story 7 satır alır; 10 kalemde 6 görünür + "ve 4 şey daha".
    const { visible, overflow } = fitItems(items(10), 'story')
    expect(visible).toHaveLength(6)
    expect(overflow).toBe(4)
    expect(visible.length + overflow).toBe(10)
  })

  it('OG en dar: 3 satır', () => {
    const { visible, overflow } = fitItems(items(6), 'og')
    expect(visible).toHaveLength(2)
    expect(overflow).toBe(4)
  })
})

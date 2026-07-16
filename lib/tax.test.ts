import { describe, it, expect } from 'vitest'
import { calculateTax, assertValidFormula, type TaxFormula } from './tax'

// docs/02-data-model.md §2'deki örnek formüller.
const TELEFON: TaxFormula = {
  type: 'chain',
  components: [
    { key: 'bandrol_fon', label: 'TRT Bandrolü + Kültür Fonu', rate: 0.13 },
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

const BEYAZ_ESYA: TaxFormula = {
  type: 'chain',
  components: [
    { key: 'otv', label: 'ÖTV', rate: 0.067 },
    { key: 'kdv', label: 'KDV', rate: 0.2 },
  ],
}

const KITAP: TaxFormula = { type: 'chain', components: [] }
const BAGIS: TaxFormula = { type: 'none' }

// ÖTV maktu tutarı seed'de teyit edilecek (docs/02 §2 ⚠️); test için temsili değer.
const AKARYAKIT: TaxFormula = {
  type: 'fixed_per_unit',
  unit: 'litre',
  components: [
    { key: 'otv', label: 'ÖTV', amount_per_unit: 7.53 },
    { key: 'kdv', label: 'KDV', rate: 0.2 },
  ],
}

// Telefon zincirinin kademe çarpanları — sınır testlerinde raf fiyatı üretmek için.
// (Üst kademe 1.13 × 1.50 × 1.20 = 2.034; testlerde raf fiyatı doğrudan verildiği için sabit gerekmiyor.)
const M_TIER1 = 1.13 * 1.25 * 1.2 // 1.695
const M_TIER2 = 1.13 * 1.4 * 1.2 // 1.8984

/**
 * Her sonuç bu iki değişmezi sağlamak zorunda. Karşılaştırma KURUŞ cinsinden ve TAM:
 * garanti edilen şey "yaklaşık eşit" değil, kuruşu kuruşuna eşit. (Float toplamıyla
 * ölçmek büyük tutarlarda kendi hatasını üretir ve yanlış şeyi test eder.)
 */
function expectInvariants(result: ReturnType<typeof calculateTax>) {
  const kurus = (tl: number) => Math.round(tl * 100)

  expect(kurus(result.taxFreePrice) + kurus(result.totalTax)).toBe(kurus(result.retailPrice))

  const lineSum = result.lines.reduce((sum, line) => sum + kurus(line.amount), 0)
  expect(lineSum).toBe(kurus(result.totalTax))
}

describe('kademesiz zincir', () => {
  it('beyaz eşyada matrahı ve dökümü çözer', () => {
    const result = calculateTax(10000, BEYAZ_ESYA)

    // 10000 / (1.067 × 1.20) = 10000 / 1.2804 = 7810.06
    expect(result.taxFreePrice).toBe(7810.06)
    expect(result.breakdown.otv).toBe(523.27) // 7810.06 × 0.067
    expect(result.breakdown.kdv).toBe(1666.67) // (7810.06 + 523.27) × 0.20
    expect(result.totalTax).toBe(2189.94)
    expectInvariants(result)
  })
})

describe('kademeli ÖTV', () => {
  it('PRD §4.2 telefon örneğini doğrular (119.000 TL → ~58.500 matrah)', () => {
    const result = calculateTax(119000, TELEFON)

    expect(result.taxFreePrice).toBeCloseTo(58505.41, 1)
    expect(result.totalTax).toBeCloseTo(60494.59, 1)
    expect(result.taxRatio).toBeCloseTo(0.508, 3)
    expect(result.notes).toEqual([])
    expectInvariants(result)
  })

  it('gerçek telefonlar en üst kademede (%50) çıkar', () => {
    const result = calculateTax(119000, TELEFON)
    // ÖTV, matrah × 1.13 üzerinden %50 → matrahın ~%56.5'i.
    expect(result.breakdown.otv / result.taxFreePrice).toBeCloseTo(0.565, 3)
  })

  it('matrah tam 640 TL eşiğine denk gelince alt kademeyi (%25) seçer', () => {
    const result = calculateTax(640 * M_TIER1, TELEFON) // 1084.80

    expect(result.taxFreePrice).toBe(640)
    expect(result.breakdown.otv).toBeCloseTo(180.8, 2) // 640 × 1.13 × 0.25
    expect(result.notes).toEqual([])
    expectInvariants(result)
  })

  it('matrah tam 1500 TL eşiğine denk gelince orta kademeyi (%40) seçer', () => {
    const result = calculateTax(1500 * M_TIER2, TELEFON) // 2847.60

    expect(result.taxFreePrice).toBe(1500)
    expect(result.breakdown.otv).toBeCloseTo(678.0, 2) // 1500 × 1.13 × 0.40
    expect(result.notes).toEqual([])
    expectInvariants(result)
  })

  it('eşiğin hemen üstünde bir sonraki kademeye geçer', () => {
    const result = calculateTax(640 * M_TIER2 + 0.01, TELEFON)

    expect(result.taxFreePrice).toBeGreaterThan(640)
    expect(result.notes).toEqual([])
    expectInvariants(result)
  })

  it('geçiş bandında alt kademe oranıyla muhafazakâr çözer (640 eşiği)', () => {
    // (640×1.695, 640×1.8984] = (1084.80, 1214.98] bandında hiçbir kademe tutarlı değil.
    // Alt kademe (%25) ile düz ters hesap: 1150 / 1.695 = 678.47 — tavanı aşar, sorun değil.
    const result = calculateTax(1150, TELEFON)

    expect(result.taxFreePrice).toBe(678.47)
    expect(result.totalTax).toBe(471.53)
    expect(result.taxFreePrice).toBeGreaterThan(640) // alt kademe kullanıldı, eşiğe sabitlenmedi
    expect(result.breakdown.bandrol_fon).toBeCloseTo(88.2, 2)
    expect(result.breakdown.otv).toBeCloseTo(191.67, 1)
    expect(result.breakdown.kdv).toBeCloseTo(191.67, 1)
    expect(result.notes).toHaveLength(1)
    expect(result.notes[0]).toContain('muhafazakâr')
    expectInvariants(result)
  })

  it('geçiş bandında alt kademe oranıyla muhafazakâr çözer (1500 eşiği)', () => {
    // (1500×1.8984, 1500×2.034] = (2847.60, 3051] bandı. Alt kademe %40: 2950 / 1.8984.
    const result = calculateTax(2950, TELEFON)

    expect(result.taxFreePrice).toBe(1553.94)
    expect(result.totalTax).toBe(1396.06)
    expect(result.taxFreePrice).toBeGreaterThan(1500)
    expect(result.notes).toHaveLength(1)
    expectInvariants(result)
  })

  it('geçiş bandı çözümü vergiyi ASLA şişirmez (eşiğe sabitlemeden az)', () => {
    // Eşiğe sabitleseydik vergi (raf − eşik) olurdu. Muhafazakâr çözüm bundan küçük olmalı.
    for (const [retail, boundary] of [
      [1150, 640],
      [1200, 640],
      [2950, 1500],
      [3000, 1500],
    ]) {
      const result = calculateTax(retail, TELEFON)
      expect(result.totalTax).toBeLessThan(retail - boundary)
    }
  })

  it('geçiş bandının her iki ucunda da değişmezler korunur', () => {
    for (let retail = 1080; retail <= 1220; retail += 0.37) {
      expectInvariants(calculateTax(retail, TELEFON))
    }
  })
})

describe('otomobil ölçeği (geniş kademe eşikleri)', () => {
  // Temsili tablo — gerçek oranlar E1'de. Amaç: telefonun dar bandında çalışan mantığın
  // geniş bantta da doğru boşluğu bulduğunu görmek. Üretimde bu yolu asıl otomobil kullanır.
  const OTOMOBIL: TaxFormula = {
    type: 'chain',
    components: [
      {
        key: 'otv',
        label: 'ÖTV',
        tiers: [
          { max_matrah: 500_000, rate: 0.45 },
          { max_matrah: 1_450_000, rate: 0.5 },
          { max_matrah: null, rate: 0.8 },
        ],
      },
      { key: 'kdv', label: 'KDV', rate: 0.2 },
    ],
  }

  it('tutarlı kademede normal çözer', () => {
    const result = calculateTax(3_500_000, OTOMOBIL) // 3.5M / 2.16 = 1.62M → üst kademe
    expect(result.taxFreePrice).toBeCloseTo(1_620_370.37, 1)
    expect(result.notes).toEqual([])
    expectInvariants(result)
  })

  it('500.000 eşiğindeki geçiş bandını bulur ve alt kademeyi (%45) uygular', () => {
    // (500.000×1.74, 500.000×1.80] = (870.000, 900.000] bandı.
    const result = calculateTax(885_000, OTOMOBIL)

    expect(result.taxFreePrice).toBe(508_620.69) // 885.000 / 1.74
    expect(result.taxFreePrice).toBeGreaterThan(500_000)
    expect(result.totalTax).toBeLessThan(885_000 - 500_000) // sabitlemeden muhafazakâr
    expect(result.notes[0]).toContain('%45')
    expectInvariants(result)
  })

  it('1.450.000 eşiğindeki geçiş bandını bulur ve alt kademeyi (%50) uygular', () => {
    // (1.45M×1.80, 1.45M×2.16] = (2.61M, 3.132M] bandı.
    const result = calculateTax(2_900_000, OTOMOBIL)

    expect(result.taxFreePrice).toBe(1_611_111.11) // 2.9M / 1.80
    expect(result.taxFreePrice).toBeGreaterThan(1_450_000)
    expect(result.notes[0]).toContain('%50')
    expectInvariants(result)
  })

  it('geniş bantta değişmezler korunur', () => {
    for (let retail = 800_000; retail <= 3_200_000; retail += 7_137) {
      expectInvariants(calculateTax(retail, OTOMOBIL))
    }
  })
})

describe('vergisiz kategoriler', () => {
  it('kitapta vergisiz fiyat = raf fiyatı (boş zincir)', () => {
    const result = calculateTax(4200, KITAP)

    expect(result.taxFreePrice).toBe(4200)
    expect(result.totalTax).toBe(0)
    expect(result.taxRatio).toBe(0)
    expect(result.lines).toEqual([])
    expect(result.breakdown).toEqual({})
    expectInvariants(result)
  })

  it('bağışta vergi yok, 1:1 geçer', () => {
    const result = calculateTax(5000, BAGIS)

    expect(result.taxFreePrice).toBe(5000)
    expect(result.totalTax).toBe(0)
    expectInvariants(result)
  })
})

describe('maktu (akaryakıt)', () => {
  it('litre başına ÖTV\'yi çıkarıp KDV\'yi çözer', () => {
    // 50 lt × 48 TL/lt. Ters: 48 / 1.20 = 40 → 40 − 7.53 = 32.47 TL/lt matrah.
    const result = calculateTax(2400, AKARYAKIT, { quantity: 50 })

    expect(result.taxFreePrice).toBe(1623.5) // 32.47 × 50
    expect(result.breakdown.otv).toBe(376.5) // 7.53 × 50
    expect(result.breakdown.kdv).toBe(400) // 8.00 × 50
    expect(result.totalTax).toBe(776.5)
    expectInvariants(result)
  })

  it('quantity verilmezse hata verir', () => {
    expect(() => calculateTax(2400, AKARYAKIT)).toThrow(TypeError)
    expect(() => calculateTax(2400, AKARYAKIT, { quantity: 0 })).toThrow(RangeError)
  })

  it('maktu vergi raf fiyatını aşarsa hata verir', () => {
    // 5 TL/lt: KDV çıkınca 4.17, maktu ÖTV 7.53'ü karşılamıyor.
    expect(() => calculateTax(50, AKARYAKIT, { quantity: 10 })).toThrow(RangeError)
  })
})

describe('yuvarlama tutarlılığı', () => {
  it('kuruş kaymadan: 1 TL ile 500.000 TL arası hiçbir fiyatta değişmez bozulmaz', () => {
    const formulas: TaxFormula[] = [TELEFON, BEYAZ_ESYA, KITAP, BAGIS]
    for (const formula of formulas) {
      for (let retail = 1; retail <= 500000; retail = Math.round(retail * 1.37 * 100) / 100) {
        expectInvariants(calculateTax(retail, formula))
      }
    }
  })

  it('kuruşlu raf fiyatlarında breakdown toplamı tam tutar', () => {
    for (const cents of [0.01, 0.05, 0.33, 0.49, 0.5, 0.51, 0.99]) {
      const result = calculateTax(119000 + cents, TELEFON)
      const lineSum = result.lines.reduce((sum, line) => sum + line.amount, 0)

      // Kuruş cinsinden TAM eşitlik — toBeCloseTo değil.
      expect(Math.round(lineSum * 100)).toBe(Math.round(result.totalTax * 100))
      expect(Math.round(result.taxFreePrice * 100) + Math.round(result.totalTax * 100)).toBe(
        Math.round(result.retailPrice * 100)
      )
    }
  })

  it('döküm alanları DB şemasındaki anahtarlarla yazılır', () => {
    const result = calculateTax(119000, TELEFON)
    expect(Object.keys(result.breakdown)).toEqual(['bandrol_fon', 'otv', 'kdv'])
  })
})

describe('saçma girdiler', () => {
  it('sıfır, negatif ve sayı olmayan raf fiyatını reddeder', () => {
    expect(() => calculateTax(0, TELEFON)).toThrow(RangeError)
    expect(() => calculateTax(-100, TELEFON)).toThrow(RangeError)
    expect(() => calculateTax(NaN, TELEFON)).toThrow(TypeError)
    expect(() => calculateTax(Infinity, TELEFON)).toThrow(TypeError)
    expect(() => calculateTax('119000' as unknown as number, TELEFON)).toThrow(TypeError)
    expect(() => calculateTax(null as unknown as number, TELEFON)).toThrow(TypeError)
  })
})

describe('formül doğrulama', () => {
  it('bilinmeyen tipi reddeder', () => {
    expect(() => assertValidFormula({ type: 'kdv_yok' } as unknown as TaxFormula)).toThrow(TypeError)
  })

  it('birden fazla kademeli bileşeni reddeder', () => {
    const formula = {
      type: 'chain',
      components: [
        { key: 'otv', label: 'ÖTV', tiers: [{ max_matrah: null, rate: 0.5 }] },
        { key: 'ek', label: 'Ek', tiers: [{ max_matrah: null, rate: 0.1 }] },
      ],
    } as TaxFormula
    expect(() => assertValidFormula(formula)).toThrow(RangeError)
  })

  it('sırasız kademeleri reddeder', () => {
    const formula = {
      type: 'chain',
      components: [
        {
          key: 'otv',
          label: 'ÖTV',
          tiers: [
            { max_matrah: 1500, rate: 0.25 },
            { max_matrah: 640, rate: 0.4 },
            { max_matrah: null, rate: 0.5 },
          ],
        },
      ],
    } as TaxFormula
    expect(() => assertValidFormula(formula)).toThrow(RangeError)
  })

  it('son kademesi sınırsız olmayan tabloyu reddeder', () => {
    const formula = {
      type: 'chain',
      components: [{ key: 'otv', label: 'ÖTV', tiers: [{ max_matrah: 640, rate: 0.25 }] }],
    } as TaxFormula
    expect(() => assertValidFormula(formula)).toThrow(RangeError)
  })

  it('negatif oranı reddeder', () => {
    const formula = {
      type: 'chain',
      components: [{ key: 'kdv', label: 'KDV', rate: -0.2 }],
    } as TaxFormula
    expect(() => assertValidFormula(formula)).toThrow(RangeError)
  })
})

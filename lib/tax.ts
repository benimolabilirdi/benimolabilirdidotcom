/**
 * Vergi motoru — projenin TEK hesap yeri.
 *
 * Bu dosya framework-agnostiktir: Next/React/Supabase import'u YASAK, saf TypeScript.
 * Sebep: aynı dosya seed script'te (tsx), admin panelde (client) ve API route'ta
 * (server) çalışır.
 *
 * Algoritma: docs/02-data-model.md §2 · Metodoloji: docs/01-PRD.md §4
 */

// ---------------------------------------------------------------------------
// Tipler
// ---------------------------------------------------------------------------

/**
 * ÖTV gibi matraha göre kademelenen bileşenin tek kademesi. Son kademe: max_matrah null.
 *
 * VARSAYIM: eşik, zincirin başındaki çıplak matraha uygulanır — yani bandrol/fon HARİÇ
 * (docs/02 §2'nin literal okuması). Gerçek mevzuatta ÖTV matrahı bandrol dahil tutar
 * olabilir; E1'de teyit edilecek. Tersi çıkarsa isWithinTier'e tek çarpan eklemek yeter.
 */
export type TaxTier = {
  /** Kademenin üst sınırı (dahil). Son kademede null = sınırsız. */
  max_matrah: number | null
  rate: number
}

/**
 * base: bileşenin hangi tutar üzerinden hesaplandığı.
 *  - 'chain' (varsayılan): önceki bileşenlerin biriktiği running tutar üzerinden (çarpımsal).
 *  - 'matrah': çıplak matrah üzerinden (toplamsal). Aynı matraha binen bandrol+fon böyle:
 *    raf = matrah × (1 + bandrol + fon) × (1+ÖTV) × (1+KDV) — biri diğerinin üstüne binmez.
 * base:'matrah' bileşenler zincirde base:'chain' olanlardan ÖNCE gelmeli (doğrulanır).
 * short_label: görselde kullanılan kısa ad (docs/07 §4). Yoksa label kullanılır.
 */
export type ComponentBase = 'chain' | 'matrah'
/**
 * baseline: "bu vergi çıplak fiyatta da olurdu" işareti (KDV). Çıplak matraha da uygulanacak
 * standart vergi. comparisonPrice ve excessTax bununla türetilir (docs/01 §4.7):
 *   comparisonPrice = matrah × (1 + Σ baseline oranlar) — sadece standart vergili "adil" fiyat
 *   excessTax       = raf − comparisonPrice — ÖTV/bandrol/fon + onların üstüne binen KDV
 */
export type RateComponent = { key: string; label: string; short_label?: string; base?: ComponentBase; baseline?: boolean; rate: number }
export type TieredComponent = { key: string; label: string; short_label?: string; base?: ComponentBase; tiers: TaxTier[] }
export type FixedComponent = {
  key: string
  label: string
  short_label?: string
  amount_per_unit: number
}

export type ChainComponent = RateComponent | TieredComponent
export type FixedChainComponent = RateComponent | FixedComponent

export type TaxFormula =
  | { type: 'chain'; components: ChainComponent[] }
  | { type: 'none' }
  | { type: 'fixed_per_unit'; unit: string; components: FixedChainComponent[] }

export type TaxLine = {
  key: string
  label: string
  shortLabel?: string
  amount: number
  /** baseline bileşen (KDV) için: çıplak matraha düşen kısım (matrah × rate). */
  baseline?: boolean
  baselineAmount?: number
}

/** İç hesap satırı — assemble() öncesi ham TL tutarlarıyla. */
type RawLine = { key: string; label: string; shortLabel?: string; amount: number }

export type TaxResult = {
  /** Girilen raf fiyatı (kuruşa yuvarlanmış). */
  retailPrice: number
  /** Tüm dolaylı vergiler çıkınca kalan çıplak fiyat (= matrah). */
  taxFreePrice: number
  /** retailPrice − taxFreePrice. Her zaman breakdown toplamına eşittir. */
  totalTax: number
  /** Sıralı, etiketli vergi satırları (UI için). */
  lines: TaxLine[]
  /** DB'ye yazmak için: {"otv": 39500, "kdv": 19800, ...} (docs/02 products.tax_breakdown). */
  breakdown: Record<string, number>
  /** totalTax / retailPrice — 0..1 arası. */
  taxRatio: number
  /** matrah × (1 + Σ baseline oranlar): yalnız standart vergili (adil) fiyat. */
  comparisonPrice: number
  /** raf − comparisonPrice: ekstra vergiler + onların üstüne binen KDV. Görsel/bütçe bunu kullanır. */
  excessTax: number
  /** comparisonPrice − matrah: çıplak fiyatta da olacak vergi (baseline KDV). */
  baselineTax: number
  /** Hesabın açıklama gerektiren yanları (kademe eşiğine sabitleme vb.). Normalde boş. */
  notes: string[]
}

export type TaxOptions = {
  /** fixed_per_unit formüller için zorunlu (örn. litre). */
  quantity?: number
}

// ---------------------------------------------------------------------------
// Yardımcılar
// ---------------------------------------------------------------------------

const isTiered = (c: ChainComponent): c is TieredComponent => 'tiers' in c
const isFixedAmount = (c: FixedChainComponent): c is FixedComponent => 'amount_per_unit' in c

/** TL → kuruş (integer). Tüm yuvarlama tek noktadan geçsin diye. */
const toKurus = (tl: number): number => Math.round(tl * 100)
const toTL = (kurus: number): number => kurus / 100

function assertPositiveFinite(value: unknown, name: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} sonlu bir sayı olmalı, alınan: ${String(value)}`)
  }
  if (value <= 0) {
    throw new RangeError(`${name} sıfırdan büyük olmalı, alınan: ${value}`)
  }
}

function assertRate(value: unknown, name: string): asserts value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new TypeError(`${name} sonlu bir sayı olmalı, alınan: ${String(value)}`)
  }
  if (value < 0) {
    throw new RangeError(`${name} negatif olamaz, alınan: ${value}`)
  }
}

/**
 * Formülü doğrular. tax_formula DB'de jsonb — yani runtime'da güvenilmez veri.
 * Admin formül düzenleyicisi de bunu kullanır.
 */
export function assertValidFormula(formula: TaxFormula): void {
  if (!formula || typeof formula !== 'object') {
    throw new TypeError('tax_formula bir nesne olmalı')
  }

  if (formula.type === 'none') return

  if (formula.type === 'chain') {
    if (!Array.isArray(formula.components)) {
      throw new TypeError('chain formülünde components dizi olmalı')
    }
    const tieredCount = formula.components.filter(isTiered).length
    if (tieredCount > 1) {
      throw new RangeError(
        `Kademeli bileşen en fazla 1 olabilir (kapalı-form çözüm varsayımı), bulunan: ${tieredCount}`
      )
    }
    let seenChain = false
    for (const c of formula.components) {
      assertOptionalShortLabel(c)
      const base = c.base ?? 'chain'
      if (base !== 'chain' && base !== 'matrah') {
        throw new TypeError(`${c.key}.base 'chain' veya 'matrah' olmalı, alınan: ${String(c.base)}`)
      }
      // base:'matrah' bileşenler zincirin başında olmalı — sonra gelen chain onları tabana katamaz.
      if (base === 'matrah' && seenChain) {
        throw new RangeError(`${c.key}: base:'matrah' bileşenler base:'chain' olanlardan önce gelmeli`)
      }
      if (base === 'chain') seenChain = true
      if (isTiered(c)) assertValidTiers(c)
      else assertRate(c.rate, `${c.key}.rate`)
    }
    return
  }

  if (formula.type === 'fixed_per_unit') {
    if (!Array.isArray(formula.components)) {
      throw new TypeError('fixed_per_unit formülünde components dizi olmalı')
    }
    for (const c of formula.components) {
      assertOptionalShortLabel(c)
      if (isFixedAmount(c)) assertRate(c.amount_per_unit, `${c.key}.amount_per_unit`)
      else assertRate(c.rate, `${c.key}.rate`)
    }
    return
  }

  throw new TypeError(`Bilinmeyen tax_formula tipi: ${String((formula as { type: unknown }).type)}`)
}

function assertOptionalShortLabel(c: { key: string; short_label?: unknown }): void {
  if (c.short_label !== undefined && typeof c.short_label !== 'string') {
    throw new TypeError(`${c.key}.short_label string olmalı, alınan: ${typeof c.short_label}`)
  }
}

function assertValidTiers(component: TieredComponent): void {
  const { tiers, key } = component
  if (!Array.isArray(tiers) || tiers.length === 0) {
    throw new TypeError(`${key}.tiers boş olamaz`)
  }
  let previousMax = 0
  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i]
    assertRate(tier.rate, `${key}.tiers[${i}].rate`)
    const isLast = i === tiers.length - 1
    if (tier.max_matrah === null) {
      if (!isLast) throw new RangeError(`${key}.tiers: yalnızca son kademe max_matrah null olabilir`)
      continue
    }
    if (isLast) {
      throw new RangeError(`${key}.tiers: son kademenin max_matrah'ı null olmalı (sınırsız)`)
    }
    assertPositiveFinite(tier.max_matrah, `${key}.tiers[${i}].max_matrah`)
    if (tier.max_matrah <= previousMax) {
      throw new RangeError(`${key}.tiers artan sırada olmalı (${tier.max_matrah} <= ${previousMax})`)
    }
    previousMax = tier.max_matrah
  }
}

// ---------------------------------------------------------------------------
// Ana giriş noktası
// ---------------------------------------------------------------------------

/**
 * Raf fiyatından matrahı (vergisiz fiyat) ve vergi dökümünü ters kaskadla çözer.
 *
 * Değişmezler (her formül tipi için):
 *   taxFreePrice + totalTax === retailPrice   (kuruşu kuruşuna)
 *   sum(lines[].amount)     === totalTax      (kuruşu kuruşuna)
 */
export function calculateTax(
  retailPrice: number,
  formula: TaxFormula,
  options: TaxOptions = {}
): TaxResult {
  assertPositiveFinite(retailPrice, 'retailPrice')
  assertValidFormula(formula)

  const retailK = toKurus(retailPrice)
  const notes: string[] = []

  let matrah: number
  let rawLines: Array<RawLine>

  let baselineRates: Array<{ key: string; rate: number }> = []

  if (formula.type === 'none' || formula.components.length === 0) {
    // Kitap (%0) ve bağış: vergisiz fiyat = raf fiyatı. Dürüstlük göstergesi (PRD §4.4).
    matrah = toTL(retailK)
    rawLines = []
  } else if (formula.type === 'chain') {
    const solved = solveChain(toTL(retailK), formula.components)
    matrah = solved.matrah
    rawLines = solved.lines
    notes.push(...solved.notes)
    baselineRates = baselineRatesOf(formula.components)
  } else {
    const solved = solveFixedPerUnit(toTL(retailK), formula, options)
    matrah = solved.matrah
    rawLines = solved.lines
    baselineRates = baselineRatesOf(formula.components)
  }

  return assemble(retailK, matrah, rawLines, baselineRates, notes)
}

// ---------------------------------------------------------------------------
// chain: oransal zincir (+ kademeli ÖTV)
// ---------------------------------------------------------------------------

type ChainSolution = {
  matrah: number
  lines: Array<RawLine>
  notes: string[]
}

type TierCandidate = {
  rates: number[]
  matrah: number
  lower: number
  upper: number
}

function solveChain(retail: number, components: ChainComponent[]): ChainSolution {
  const tieredIndex = components.findIndex(isTiered)

  // Kademesiz zincir: tek çarpan, tek bölme.
  if (tieredIndex === -1) {
    const rates = components.map((c) => (c as RateComponent).rate)
    const matrah = retail / multiplierOf(components, rates)
    return { matrah, lines: forwardChain(matrah, components, rates), notes: [] }
  }

  const tiered = components[tieredIndex] as TieredComponent

  // Kapalı form: her kademe oranıyla matrahı dene, kendi aralığına düşen çözüm geçerli.
  // Kademe oranı arttıkça matrah azalır, yani en fazla bir kademe tutarlı olabilir.
  const candidates: TierCandidate[] = tiered.tiers.map((tier, i) => {
    const rates = ratesForTier(components, tieredIndex, tier.rate)
    return {
      rates,
      matrah: retail / multiplierOf(components, rates),
      lower: i === 0 ? 0 : (tiered.tiers[i - 1].max_matrah as number),
      upper: tier.max_matrah ?? Infinity,
    }
  })

  for (const candidate of candidates) {
    if (isWithinTier(candidate)) {
      return {
        matrah: candidate.matrah,
        lines: forwardChain(candidate.matrah, components, candidate.rates),
        notes: [],
      }
    }
  }

  // Hiçbir kademe tutarlı değil → kademe geçiş bandı.
  return solveGapWithLowerTier(retail, components, tiered, candidates)
}

/**
 * Kademe aralığı kontrolü kuruş cinsinden yapılır: matrah zaten kuruşa yuvarlanıp
 * saklanacağı için kademe kararı saklanan değerle tutarlı olmalı. Ayrıca float artığı
 * (640/1500 gibi tam eşiklerde 1500.0000000000002) sahte boşluk üretmesin diye.
 */
function isWithinTier({ matrah, lower, upper }: TierCandidate): boolean {
  return toKurus(matrah) > toKurus(lower) && toKurus(matrah) <= toKurus(upper)
}

/**
 * Kademe geçiş bandı: oran matrahta sıçradığı için raf fiyatı da sıçrar ve iki kademe
 * arasında hiçbir matrahın "tutarlı" üretemediği bir bant kalır. Bu bant gerçek hayatta
 * doludur — modelimiz raf = matrah × vergiler varsayıyor, gerçekte araya bayi marjı ve
 * iskonto giriyor. Özellikle otomobilde (eşikler büyük, liste fiyatları eşik civarına
 * kümelenir) bu yola sık düşülecek, yani hata fırlatmak seçenek değil.
 *
 * Çözüm: alt kademenin oranlarıyla düz ters hesap. Matrah kademe tavanını biraz aşar
 * ama aritmetik kusursuzdur (ileri zincir raf fiyatını yeniden üretir) ve vergi
 * MUHAFAZAKÂR tarafta kalır. Yön önemli: bu projede hesap didiklendiğinde "vergiyi
 * şişirmişler" denebilmemeli; "az bile göstermişler" denebilmeli.
 */
function solveGapWithLowerTier(
  retail: number,
  components: ChainComponent[],
  tiered: TieredComponent,
  candidates: TierCandidate[]
): ChainSolution {
  for (let i = 0; i < candidates.length - 1; i++) {
    const lower = candidates[i]
    const upper = candidates[i + 1]

    // Boşluk tam burada: bu kademe kendi tavanını aşıyor, sonraki ise tabanın altında kalıyor.
    const overshoots = toKurus(lower.matrah) > toKurus(lower.upper)
    const nextUndershoots = toKurus(upper.matrah) <= toKurus(lower.upper)
    if (!overshoots || !nextUndershoots) continue

    const tierRate = tiered.tiers[i].rate
    return {
      matrah: lower.matrah,
      lines: forwardChain(lower.matrah, components, lower.rates),
      notes: [
        `${tiered.label} kademe geçiş bandı: bu raf fiyatını hiçbir kademe tutarlı ` +
          `üretmiyor (oran sıçraması). Alt kademe oranı (%${(tierRate * 100).toFixed(0)}) ` +
          `uygulandı — muhafazakâr hesap, vergi olduğundan fazla gösterilmez.`,
      ],
    }
  }

  // Buraya düşmemeli: kademeler doğrulanmışsa ya bir kademe tutar ya da bir boşluk bulunur.
  throw new RangeError(
    `${tiered.key}: ${retail} TL için kademe çözümü bulunamadı (kademe tablosu tutarsız)`
  )
}

/** Kademeli bileşenin yerine verilen oranı koyarak zincirin oran listesini üretir. */
function ratesForTier(components: ChainComponent[], tieredIndex: number, tierRate: number): number[] {
  return components.map((c, i) => (i === tieredIndex ? tierRate : (c as RateComponent).rate))
}

const baseOf = (c: ChainComponent): ComponentBase => c.base ?? 'chain'

/**
 * Zincir çarpanı. base:'matrah' bileşenler tek bir (1 + Σrate) faktörüne toplanır (aynı
 * tabana biner), base:'chain' bileşenler ayrı ayrı (1+rate) ile çarpar.
 * raf = matrah × (1 + Σmatrah) × Π(1 + chain).
 */
function multiplierOf(components: ChainComponent[], rates: number[]): number {
  let matrahSum = 0
  let chainProduct = 1
  components.forEach((c, i) => {
    if (baseOf(c) === 'matrah') matrahSum += rates[i]
    else chainProduct *= 1 + rates[i]
  })
  return (1 + matrahSum) * chainProduct
}

/** Matrahtan ileri yürüyerek her bileşenin TL tutarını yazar (docs/02 §2). */
function forwardChain(
  matrah: number,
  components: ChainComponent[],
  rates: number[]
): Array<RawLine> {
  let running = matrah
  return components.map((component, i) => {
    // base:'matrah' çıplak matrah üzerinden; base:'chain' biriken running üzerinden.
    const amount = (baseOf(component) === 'matrah' ? matrah : running) * rates[i]
    running += amount
    return { key: component.key, label: component.label, shortLabel: component.short_label, amount }
  })
}

// ---------------------------------------------------------------------------
// fixed_per_unit: maktu (akaryakıt)
// ---------------------------------------------------------------------------

function solveFixedPerUnit(
  retail: number,
  formula: { type: 'fixed_per_unit'; unit: string; components: FixedChainComponent[] },
  options: TaxOptions
): { matrah: number; lines: Array<RawLine> } {
  const { quantity } = options
  assertPositiveFinite(quantity, `quantity (${formula.unit})`)

  const retailPerUnit = retail / quantity

  // Ters yön: zinciri sondan başa çöz.
  let running = retailPerUnit
  for (let i = formula.components.length - 1; i >= 0; i--) {
    const component = formula.components[i]
    running = isFixedAmount(component)
      ? running - component.amount_per_unit
      : running / (1 + component.rate)
  }

  if (running <= 0) {
    throw new RangeError(
      `Maktu vergiler raf fiyatını aşıyor: ${formula.unit} başına ${retailPerUnit.toFixed(2)} TL ` +
        `için matrah ${running.toFixed(2)} TL çıktı. Fiyat veya formül hatalı.`
    )
  }

  const matrahPerUnit = running

  // İleri yön: bileşen tutarları.
  running = matrahPerUnit
  const lines = formula.components.map((component) => {
    const amount = isFixedAmount(component)
      ? component.amount_per_unit
      : running * component.rate
    running += amount
    return {
      key: component.key,
      label: component.label,
      shortLabel: component.short_label,
      amount: amount * quantity,
    }
  })

  return { matrah: matrahPerUnit * quantity, lines }
}

// ---------------------------------------------------------------------------
// Yuvarlama ve sonuç
// ---------------------------------------------------------------------------

/**
 * Kuruş cinsinden toplar, artığı en büyük satıra vererek değişmezleri garanti eder.
 * (Float toplamı doğrudan yuvarlanırsa breakdown toplamı raf − vergisiz'den kayabilir.)
 */
/** Formülün baseline (KDV) bileşenlerinin key+rate listesi. */
function baselineRatesOf(components: Array<{ key: string; baseline?: boolean; rate?: number }>): Array<{ key: string; rate: number }> {
  return components
    .filter((c) => c.baseline && typeof c.rate === 'number')
    .map((c) => ({ key: c.key, rate: c.rate as number }))
}

function assemble(
  retailK: number,
  matrah: number,
  rawLines: Array<RawLine>,
  baselineRates: Array<{ key: string; rate: number }>,
  notes: string[]
): TaxResult {
  const taxFreeK = toKurus(matrah)
  const totalTaxK = retailK - taxFreeK

  const lineKurus = rawLines.map((line) => toKurus(line.amount))
  const roundingResidual = totalTaxK - lineKurus.reduce((sum, k) => sum + k, 0)

  if (roundingResidual !== 0 && lineKurus.length > 0) {
    // En büyük satır, kuruşluk düzeltmeyi oransal olarak en az bozan yerdir.
    let largest = 0
    for (let i = 1; i < lineKurus.length; i++) {
      if (lineKurus[i] > lineKurus[largest]) largest = i
    }
    lineKurus[largest] += roundingResidual
  }

  // baseline türetmeleri: baseline bileşenin çıplak matraha düşen kısmı = matrah × rate.
  // comparisonPrice = matrah + Σ baseline kısımlar; excessTax = raf − comparisonPrice.
  let baselineTaxK = 0
  const baselineByKey = new Map(baselineRates.map((b) => [b.key, b.rate]))

  const lines: TaxLine[] = rawLines.map((line, i) => {
    const baselineRate = baselineByKey.get(line.key)
    if (baselineRate === undefined) {
      return { key: line.key, label: line.label, shortLabel: line.shortLabel, amount: toTL(lineKurus[i]) }
    }
    // Çıplak matraha düşen kısım, satırın kendisini aşamaz (base:matrah baseline'da eşit).
    const baselineK = Math.min(toKurus(matrah * baselineRate), lineKurus[i])
    baselineTaxK += baselineK
    return {
      key: line.key,
      label: line.label,
      shortLabel: line.shortLabel,
      amount: toTL(lineKurus[i]),
      baseline: true,
      baselineAmount: toTL(baselineK),
    }
  })

  const comparisonK = taxFreeK + baselineTaxK
  const excessTaxK = retailK - comparisonK

  const breakdown: Record<string, number> = {}
  for (const line of lines) breakdown[line.key] = line.amount

  return {
    retailPrice: toTL(retailK),
    taxFreePrice: toTL(taxFreeK),
    totalTax: toTL(totalTaxK),
    lines,
    breakdown,
    taxRatio: totalTaxK / retailK,
    comparisonPrice: toTL(comparisonK),
    excessTax: toTL(excessTaxK),
    baselineTax: toTL(baselineTaxK),
    notes,
  }
}

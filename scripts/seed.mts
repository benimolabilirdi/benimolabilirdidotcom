/**
 * seed/ → Supabase (docs/05 A4).
 *
 * Akış: kategoriler + etiketler upsert → products.csv oku → lib/tax.ts ile hesapla →
 * ürünleri upsert → etiket bağlarını kur.
 *
 * Fiyat/oran verisi burada hesaplanır, DB'ye yazılır. tax_free_price ve tax_breakdown
 * ASLA elle girilmez (CLAUDE.md mimari kural 1 ve 3).
 *
 * Çalıştırma: npm run seed        (uygular)
 *             npm run seed -- --dry-run   (yalnız hesaplar, yazmaz)
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { calculateTax, assertValidFormula, type TaxFormula } from '../lib/tax'

const DRY_RUN = process.argv.includes('--dry-run')

// ---------------------------------------------------------------------------
// env
// ---------------------------------------------------------------------------

function loadEnv(path: string): Record<string, string> {
  const env: Record<string, string> = {}
  // split('\n') son satırı newline'sız dosyalarda da yakalar — read-loop'un yuttuğu yer burasıydı.
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1)
  }
  return env
}

const env = loadEnv('.env.local')
const url = env.NEXT_PUBLIC_SUPABASE_URL
const secret = env.SUPABASE_SECRET_KEY

if (!url || !secret) {
  console.error('✗ .env.local eksik: NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SECRET_KEY gerekli.')
  process.exit(1)
}

// Secret key RLS'i aşar — seed'in yazabilmesi için gerekli, başka hiçbir yerde kullanılmaz.
const supabase = createClient(url, secret, { auth: { persistSession: false } })

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

/** Tırnak içindeki virgülleri doğru ele alan minimal ayrıştırıcı (tags sütunu için şart). */
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else inQuotes = false
      } else field += char
    } else if (char === '"') inQuotes = true
    else if (char === ',') { row.push(field); field = '' }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (char !== '\r') field += char
  }
  if (field || row.length) { row.push(field); rows.push(row) }

  const [header, ...body] = rows.filter((r) => r.some((c) => c.trim()))
  return body.map((cells) =>
    Object.fromEntries(header.map((key, i) => [key.trim(), (cells[i] ?? '').trim()]))
  )
}

// ---------------------------------------------------------------------------
// Biçimlendirme
// ---------------------------------------------------------------------------

const tl = (n: number) =>
  new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(n) + ' TL'

async function die(message: string, error: unknown): Promise<never> {
  console.error(`\n✗ ${message}`)
  console.error(error)
  process.exit(1)
}

// ---------------------------------------------------------------------------
// 1) Kategoriler
// ---------------------------------------------------------------------------

type SeedCategory = {
  slug: string
  name: string
  emoji: string
  sort_order: number
  is_purchasable?: boolean
  is_spendable?: boolean
  verified: boolean
  e1_note?: string
  tax_formula: TaxFormula
}

const categories: SeedCategory[] = JSON.parse(readFileSync('seed/categories.json', 'utf8'))

console.log(`\n▸ Kategoriler (${categories.length})`)

// Formülleri DB'ye yazmadan önce doğrula — bozuk jsonb en pahalı hatadır.
for (const category of categories) {
  try {
    assertValidFormula(category.tax_formula)
  } catch (error) {
    await die(`Kategori '${category.slug}' formülü geçersiz:`, error)
  }
}

const categoryRows = categories.map((c) => ({
  slug: c.slug,
  name: c.name,
  emoji: c.emoji,
  sort_order: c.sort_order,
  is_purchasable: c.is_purchasable ?? true,
  is_spendable: c.is_spendable ?? true,
  tax_formula: c.tax_formula, // 'verified' ve 'e1_note' seed'e ait, DB'ye gitmez
}))

if (!DRY_RUN) {
  const { error } = await supabase.from('categories').upsert(categoryRows, { onConflict: 'slug' })
  if (error) await die('Kategori upsert başarısız:', error)
}
console.log(`  ${DRY_RUN ? 'atlandı (dry-run)' : 'upsert edildi'}`)

// ---------------------------------------------------------------------------
// 2) Etiketler
// ---------------------------------------------------------------------------

const tags: Array<{ slug: string; name: string; emoji: string; kind: string; sort_order: number }> =
  JSON.parse(readFileSync('seed/tags.json', 'utf8'))

console.log(`\n▸ Etiketler (${tags.length})`)
if (!DRY_RUN) {
  const { error } = await supabase.from('tags').upsert(tags, { onConflict: 'slug' })
  if (error) await die('Etiket upsert başarısız:', error)
}
console.log(`  ${DRY_RUN ? 'atlandı (dry-run)' : 'upsert edildi'}`)

// ---------------------------------------------------------------------------
// 3) Ürünler — hesapla ve yaz
// ---------------------------------------------------------------------------

const rows = parseCsv(readFileSync('seed/products.csv', 'utf8'))
const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
const tagSlugs = new Set(tags.map((t) => t.slug))

console.log(`\n▸ Ürünler (${rows.length})\n`)

type Computed = {
  row: Record<string, string>
  category: SeedCategory
  taxFreePrice: number
  totalTax: number
  breakdown: Record<string, number>
  taxRatio: number
  notes: string[]
  tags: string[]
}

const computed: Computed[] = []

for (const row of rows) {
  const category = categoryBySlug.get(row.category_slug)
  if (!category) await die(`'${row.name}': bilinmeyen kategori '${row.category_slug}'`, null)

  const retailPrice = Number(row.retail_price)
  const quantity = row.quantity ? Number(row.quantity) : undefined

  // fixed_per_unit (akaryakıt) miktar olmadan çözülemez — sessizce geçmesin.
  if (category.tax_formula.type === 'fixed_per_unit' && quantity === undefined) {
    await die(
      `'${row.name}': '${category.slug}' maktu formül kullanıyor, CSV'de quantity sütunu zorunlu.`,
      null
    )
  }

  const rowTags = row.tags ? row.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
  for (const tag of rowTags) {
    if (!tagSlugs.has(tag)) await die(`'${row.name}': bilinmeyen etiket '${tag}'`, null)
  }

  try {
    const result = calculateTax(retailPrice, category.tax_formula, { quantity })
    computed.push({
      row,
      category,
      taxFreePrice: result.taxFreePrice,
      totalTax: result.totalTax,
      breakdown: result.breakdown,
      taxRatio: result.taxRatio,
      notes: result.notes,
      tags: rowTags,
    })
  } catch (error) {
    await die(`'${row.name}' hesaplanamadı (raf: ${retailPrice}):`, error)
  }
}

// Özet tablo — seed'in ne yaptığını gözle görmek için.
const pad = (s: string, n: number) => s.padEnd(n)
const padStart = (s: string, n: number) => s.padStart(n)
console.log(
  `  ${pad('ÜRÜN', 32)}${padStart('RAF', 12)}${padStart('VERGİSİZ', 12)}${padStart('VERGİ', 12)}${padStart('%', 6)}`
)
console.log(`  ${'─'.repeat(74)}`)
for (const item of computed) {
  console.log(
    `  ${pad(item.row.name.slice(0, 31), 32)}` +
      `${padStart(tl(Number(item.row.retail_price)), 12)}` +
      `${padStart(tl(item.taxFreePrice), 12)}` +
      `${padStart(tl(item.totalTax), 12)}` +
      `${padStart((item.taxRatio * 100).toFixed(0), 6)}`
  )
  for (const note of item.notes) console.log(`    ↳ ${note}`)
}

if (DRY_RUN) {
  console.log('\n✓ dry-run: hiçbir şey yazılmadı.')
  process.exit(0)
}

// Ürünleri yaz
const productRows = computed.map((item) => ({
  category_id: null as string | null, // aşağıda doldurulur
  name: item.row.name,
  emoji: item.row.emoji || null,
  retail_price: Number(item.row.retail_price),
  tax_free_price: item.taxFreePrice,
  tax_breakdown: item.breakdown,
  default_line_text: item.row.default_line_text || null,
  price_updated_at: new Date().toISOString(),
}))

const { data: dbCategories, error: catFetchError } = await supabase
  .from('categories')
  .select('id, slug')
if (catFetchError) await die('Kategoriler okunamadı:', catFetchError)

const categoryIdBySlug = new Map(dbCategories!.map((c) => [c.slug, c.id]))
computed.forEach((item, i) => {
  productRows[i].category_id = categoryIdBySlug.get(item.category.slug)!
})

const { data: upserted, error: prodError } = await supabase
  .from('products')
  .upsert(productRows, { onConflict: 'category_id,name' })
  .select('id, name, category_id')
if (prodError) await die('Ürün upsert başarısız:', prodError)

console.log(`\n  ${upserted!.length} ürün upsert edildi`)

// ---------------------------------------------------------------------------
// 4) Etiket bağları
// ---------------------------------------------------------------------------

const { data: dbTags, error: tagFetchError } = await supabase.from('tags').select('id, slug')
if (tagFetchError) await die('Etiketler okunamadı:', tagFetchError)
const tagIdBySlug = new Map(dbTags!.map((t) => [t.slug, t.id]))

const productIdByKey = new Map(upserted!.map((p) => [`${p.category_id}|${p.name}`, p.id]))

const links: Array<{ product_id: string; tag_id: string }> = []
for (const item of computed) {
  const productId = productIdByKey.get(`${categoryIdBySlug.get(item.category.slug)}|${item.row.name}`)
  if (!productId) continue
  for (const tag of item.tags) {
    links.push({ product_id: productId, tag_id: tagIdBySlug.get(tag)! })
  }
}

// Önce bu ürünlerin mevcut bağlarını temizle: CSV'den etiket silinirse DB'de kalmasın.
const productIds = [...productIdByKey.values()]
const { error: unlinkError } = await supabase
  .from('product_tags')
  .delete()
  .in('product_id', productIds)
if (unlinkError) await die('Eski etiket bağları silinemedi:', unlinkError)

if (links.length) {
  const { error: linkError } = await supabase.from('product_tags').insert(links)
  if (linkError) await die('Etiket bağları kurulamadı:', linkError)
}
console.log(`  ${links.length} etiket bağı kuruldu`)

// ---------------------------------------------------------------------------
// 5) Uyarı özeti
// ---------------------------------------------------------------------------

const unverified = categories.filter((c) => !c.verified)
console.log(`\n⚠️  ${unverified.length}/${categories.length} kategorinin oranları TEYİT EDİLMEDİ (E1):`)
for (const category of unverified) {
  console.log(`   · ${category.slug}${category.e1_note ? ` — ${category.e1_note.split('.')[0]}.` : ''}`)
}

console.log('\n✓ Seed tamam.\n')

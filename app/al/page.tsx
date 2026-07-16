/**
 * Akış girişi (C2+). Satın alınabilir kategorileri ürünleriyle çeker, client Flow'a verir.
 * Yalnız is_purchasable + is_active kategoriler (ana akış istismar engeli, docs/01 §4.6).
 */
import Link from 'next/link'
import { Flow } from '@/components/flow/Flow'
import { createClient } from '@/lib/supabase/server'
import type { FlowCategory } from '@/lib/flow'
import type { TaxFormula } from '@/lib/tax'

export const dynamic = 'force-dynamic'

async function getCategories(): Promise<FlowCategory[]> {
  const supabase = createClient()

  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase
      .from('categories')
      .select('slug, name, emoji, tax_formula')
      .eq('is_purchasable', true)
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('products')
      .select('id, name, emoji, retail_price, default_line_text, category_id, categories!inner(slug)')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  if (!cats) return []

  // Ürünleri kategori slug'ına göre grupla.
  const bySlug = new Map<string, FlowCategory['products']>()
  for (const p of prods ?? []) {
    const slug = (p.categories as unknown as { slug: string }).slug
    if (!bySlug.has(slug)) bySlug.set(slug, [])
    bySlug.get(slug)!.push({
      id: p.id,
      name: p.name,
      emoji: p.emoji,
      retailPrice: Number(p.retail_price),
      defaultLineText: p.default_line_text,
    })
  }

  return cats.map((c) => {
    const formula = c.tax_formula as TaxFormula
    return {
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      taxFormula: formula,
      isFixedPerUnit: formula.type === 'fixed_per_unit',
      products: bySlug.get(c.slug) ?? [],
    }
  })
}

export default async function AlPage() {
  const categories = await getCategories()

  if (categories.length === 0) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>
          Kategoriler yüklenemedi.
        </p>
        <Link href="/" style={{ color: 'var(--coral-500)', fontWeight: 600 }}>← Ana sayfa</Link>
      </main>
    )
  }

  return <Flow categories={categories} />
}

/**
 * Akış girişi (C2+). Tüm aktif kategorileri ürünleriyle çeker, client Flow'a verir.
 * Picker (C2) is_purchasable olanları, hayal döngüsü (C4) is_spendable olanları kullanır.
 */
import Link from 'next/link'
import { Flow } from '@/components/flow/Flow'
import { createClient } from '@/lib/supabase/server'
import type { FlowCategory, FlowProduct, FlowTag } from '@/lib/flow'
import type { TaxFormula } from '@/lib/tax'

export const dynamic = 'force-dynamic'

async function getCategories(): Promise<FlowCategory[]> {
  const supabase = createClient()

  const [{ data: cats }, { data: prods }] = await Promise.all([
    supabase
      .from('categories')
      .select('slug, name, emoji, tax_formula, is_purchasable, is_spendable')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('products')
      .select(
        'id, name, emoji, retail_price, tax_free_price, default_line_text, sort_order, categories!inner(slug), product_tags(tags(slug, name, emoji, kind))'
      )
      .eq('is_active', true)
      .order('sort_order'),
  ])

  if (!cats) return []

  const bySlug = new Map<string, FlowProduct[]>()
  for (const p of prods ?? []) {
    const slug = (p.categories as unknown as { slug: string }).slug
    const tags: FlowTag[] = ((p.product_tags as unknown as Array<{ tags: FlowTag }>) ?? [])
      .map((pt) => pt.tags)
      .filter(Boolean)
    if (!bySlug.has(slug)) bySlug.set(slug, [])
    bySlug.get(slug)!.push({
      id: p.id,
      name: p.name,
      emoji: p.emoji,
      retailPrice: Number(p.retail_price),
      taxFreePrice: Number(p.tax_free_price),
      defaultLineText: p.default_line_text,
      tags,
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
      isPurchasable: c.is_purchasable,
      isSpendable: c.is_spendable,
      products: bySlug.get(c.slug) ?? [],
    }
  })
}

export default async function AlPage() {
  const categories = await getCategories()

  if (categories.filter((c) => c.isPurchasable).length === 0) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>Kategoriler yüklenemedi.</p>
        <Link href="/" style={{ color: 'var(--coral-500)', fontWeight: 600 }}>← Ana sayfa</Link>
      </main>
    )
  }

  return <Flow categories={categories} />
}

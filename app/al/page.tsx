/**
 * Akış girişi (C2+). Tüm aktif kategorileri ürünleriyle çeker, client Flow'a verir.
 * Picker (C2) is_purchasable olanları, hayal döngüsü (C4) is_spendable olanları kullanır.
 */
import Link from 'next/link'
import { Flow } from '@/components/flow/Flow'
import { createClient } from '@/lib/supabase/server'
import type { FlowCategory, FlowProduct, FlowTag, Quip } from '@/lib/flow'
import type { TaxFormula } from '@/lib/tax'

export const dynamic = 'force-dynamic'

async function getData(): Promise<{ categories: FlowCategory[]; quips: Quip[] }> {
  const supabase = createClient()

  const [{ data: cats }, { data: prods }, { data: quipRows }] = await Promise.all([
    supabase
      .from('categories')
      .select('slug, name, emoji, tax_formula, is_purchasable, is_spendable')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('products')
      .select(
        'id, name, emoji, retail_price, tax_free_price, comparison_price, default_line_text, sort_order, tax_formula, quantity, categories!inner(slug), product_tags(tags(slug, name, emoji, kind))'
      )
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('quips')
      .select('scope, product_match, text, hide_if_same_category, categories(slug)')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  const quips: Quip[] = (quipRows ?? []).map((q) => ({
    scope: q.scope as Quip['scope'],
    categorySlug: (q.categories as unknown as { slug: string } | null)?.slug ?? null,
    productMatch: q.product_match,
    text: q.text,
    hideIfSameCategory: q.hide_if_same_category,
  }))

  if (!cats) return { categories: [], quips }

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
      comparisonPrice: Number(p.comparison_price ?? p.tax_free_price),
      defaultLineText: p.default_line_text,
      tags,
      taxFormula: (p.tax_formula as FlowProduct['taxFormula']) ?? null,
      quantity: p.quantity != null ? Number(p.quantity) : null,
    })
  }

  const categories = (cats ?? []).map((c) => {
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

  return { categories, quips }
}

export default async function AlPage() {
  const { categories, quips } = await getData()

  if (categories.filter((c) => c.isPurchasable).length === 0) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24, textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-ui)', color: 'var(--text-muted)' }}>Kategoriler yüklenemedi.</p>
        <Link href="/" style={{ color: 'var(--coral-500)', fontWeight: 600 }}>← Ana sayfa</Link>
      </main>
    )
  }

  return <Flow categories={categories} quips={quips} />
}

'use client'

/**
 * Ürün seçici (C2, docs/01 §3.1.2). Kategori grid → ürün listesi + arama +
 * "tutarı kendim gireyim" serbest giriş. Yalnız satın alınabilir (ÖTV'li) kategoriler.
 */
import { useMemo, useState } from 'react'
import { computeSelection, type FlowCategory, type PurchaseSelection } from '@/lib/flow'
import { formatTL } from '@/lib/share-card'

type Props = {
  categories: FlowCategory[]
  onSelect: (selection: PurchaseSelection) => void
}

export function Picker({ categories, onSelect }: Props) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null)
  const active = categories.find((c) => c.slug === activeSlug) ?? null

  return active ? (
    <CategoryView category={active} onBack={() => setActiveSlug(null)} onSelect={onSelect} />
  ) : (
    <Grid categories={categories} onPick={setActiveSlug} />
  )
}

function Grid({ categories, onPick }: { categories: FlowCategory[]; onPick: (slug: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, lineHeight: 1.15, margin: 0 }}>
        Ne aldın?
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => onPick(c.slug)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minWidth: 0,
              background: 'var(--surface-card)',
              border: 'none',
              borderRadius: 'var(--r-lg)',
              padding: '20px 8px',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              aspectRatio: '1 / 1',
            }}
          >
            <span style={{ fontSize: 40, lineHeight: 1 }}>{c.emoji}</span>
            <span
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--text-body)',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              {c.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CategoryView({
  category,
  onBack,
  onSelect,
}: {
  category: FlowCategory
  onBack: () => void
  onSelect: (s: PurchaseSelection) => void
}) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr')
    // Ana alımda yalnız isPurchasable ürünler (kol vb. hariç), pahalıdan ucuza.
    const base = category.products.filter((p) => p.isPurchasable)
    const list = q ? base.filter((p) => p.name.toLocaleLowerCase('tr').includes(q)) : base
    return [...list].sort((a, b) => b.retailPrice - a.retailPrice)
  }, [category.products, query])

  function pickProduct(p: FlowCategory['products'][number]) {
    const sel = computeSelection(
      category,
      p.retailPrice,
      p.name,
      p.emoji || category.emoji,
      p.quantity ?? undefined,
      p.taxFormula
    )
    if (sel) onSelect(sel)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-ui)',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ← Kategoriler
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 32 }}>{category.emoji}</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, margin: 0 }}>
          {category.name}
        </h1>
      </div>

      {category.products.length > 0 ? (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ara…"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            padding: '12px 16px',
            borderRadius: 'var(--r-pill)',
            border: '1px solid var(--cream-300)',
            background: 'var(--surface-card)',
            color: 'var(--text-body)',
            outline: 'none',
          }}
        />
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => pickProduct(p)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: 'var(--surface-card)',
              border: 'none',
              borderRadius: 'var(--r-lg)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 30 }}>{p.emoji || category.emoji}</span>
            <span style={{ flexGrow: 1, fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600, color: 'var(--text-body)' }}>
              {p.name}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums', fontSize: 15, fontWeight: 700, color: 'var(--text-muted)' }}>
              {formatTL(p.retailPrice)}
            </span>
          </button>
        ))}
        {filtered.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-muted)', margin: '4px 0' }}>
            {category.products.length === 0 ? 'Bu kategoride ürün yok.' : 'Aramanla eşleşen ürün yok.'}
          </p>
        ) : null}
      </div>
    </div>
  )
}

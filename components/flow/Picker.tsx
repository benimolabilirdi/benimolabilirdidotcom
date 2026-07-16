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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
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
  const [freeMode, setFreeMode] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr')
    return q ? category.products.filter((p) => p.name.toLocaleLowerCase('tr').includes(q)) : category.products
  }, [category.products, query])

  function pickProduct(p: FlowCategory['products'][number]) {
    const sel = computeSelection(category, p.retailPrice, p.name, p.emoji || category.emoji)
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

      {!freeMode && category.products.length > 0 ? (
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

      {freeMode ? (
        <FreeAmount category={category} onSelect={onSelect} onCancel={() => setFreeMode(false)} />
      ) : (
        <>
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
            {category.products.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-muted)', margin: '4px 0' }}>
                Bu kategoride henüz ürün yok — tutarı kendin girebilirsin.
              </p>
            ) : filtered.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-muted)', margin: '4px 0' }}>
                Aramanla eşleşen ürün yok.
              </p>
            ) : null}
          </div>

          {!category.isFixedPerUnit ? (
            <button
              onClick={() => setFreeMode(true)}
              style={{
                background: 'none',
                border: '1px dashed var(--cream-300)',
                borderRadius: 'var(--r-lg)',
                padding: '14px 16px',
                fontFamily: 'var(--font-ui)',
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Listede yok, tutarı kendim gireyim →
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}

function FreeAmount({
  category,
  onSelect,
  onCancel,
}: {
  category: FlowCategory
  onSelect: (s: PurchaseSelection) => void
  onCancel: () => void
}) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState('')

  const amount = Number(raw.replace(/[^\d]/g, ''))
  const valid = amount > 0

  function submit() {
    const sel = computeSelection(category, amount, `${category.name} (girdiğim tutar)`, category.emoji)
    if (!sel) {
      setError('Bu tutar hesaplanamadı, kontrol eder misin?')
      return
    }
    onSelect(sel)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <label style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-muted)' }}>
        {category.name} için ödediğin tutar:
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          inputMode="numeric"
          value={raw}
          onChange={(e) => {
            setRaw(e.target.value)
            setError('')
          }}
          placeholder="Örn. 45.000"
          style={{
            flexGrow: 1,
            fontFamily: 'var(--font-ui)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: 20,
            fontWeight: 700,
            padding: '14px 16px',
            borderRadius: 'var(--r-lg)',
            border: '1px solid var(--cream-300)',
            background: 'var(--surface-card)',
            color: 'var(--text-body)',
            outline: 'none',
            minWidth: 0,
          }}
        />
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 18, fontWeight: 700, color: 'var(--text-muted)' }}>TL</span>
      </div>
      {error ? <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--coral-600)' }}>{error}</span> : null}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onCancel}
          style={{
            flexGrow: 1,
            background: 'var(--surface-card)',
            border: '1px solid var(--cream-300)',
            borderRadius: 'var(--r-pill)',
            padding: '14px',
            fontFamily: 'var(--font-ui)',
            fontSize: 15,
            fontWeight: 600,
            color: 'var(--text-body)',
            cursor: 'pointer',
          }}
        >
          Geri
        </button>
        <button
          onClick={submit}
          disabled={!valid}
          style={{
            flexGrow: 2,
            background: valid ? 'var(--coral-500)' : 'var(--cream-300)',
            border: 'none',
            borderRadius: 'var(--r-pill)',
            padding: '14px',
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
            cursor: valid ? 'pointer' : 'default',
          }}
        >
          Vergiyi göster →
        </button>
      </div>
    </div>
  )
}

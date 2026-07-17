'use client'

/**
 * Hayal döngüsü (C4, docs/01 §3.1.4). Bütçe = ödenen vergi; her eklemede ürünün
 * VERGİSİZ fiyatı düşülür (§3.1.4e). Adım 1: Kendime / Hediye / Bağış.
 * Hediye'de araya "Kime?" girer. Kalan < en ucuz vergisiz fiyat → zarif kapanış.
 */
import { useMemo, useState } from 'react'
import { formatTL } from '@/lib/share-card'
import type { DreamItem, FlowCategory, FlowProduct, PurchaseSelection } from '@/lib/flow'
import { Preview } from '@/components/flow/Preview'

type Mode = 'self' | 'gift' | 'donation'
type Step = 'root' | 'recipient' | 'category' | 'product' | 'text' | 'end'

// "Kime?" — sabit alıcı listesi (seed tags.json recipient türü ile hizalı).
const RECIPIENTS = [
  { emoji: '👩', name: 'Anneme' },
  { emoji: '👨', name: 'Babama' },
  { emoji: '💑', name: 'Eşime' },
  { emoji: '🧒', name: 'Çocuğuma' },
  { emoji: '👶', name: 'Yeğenime' },
  { emoji: '👨‍👩‍👧', name: 'Aileme' },
]

export function Dream({
  selection,
  categories,
  onBack,
}: {
  selection: PurchaseSelection
  categories: FlowCategory[]
  onBack: () => void
}) {
  const [remaining, setRemaining] = useState(selection.totalTax)
  const [items, setItems] = useState<DreamItem[]>([])
  const [step, setStep] = useState<Step>('root')
  const [mode, setMode] = useState<Mode>('self')
  const [recipient, setRecipient] = useState<(typeof RECIPIENTS)[number] | null>(null)
  const [category, setCategory] = useState<FlowCategory | null>(null)
  const [pending, setPending] = useState<FlowProduct | null>(null)

  const bagis = categories.find((c) => c.slug === 'bagis') ?? null

  // Hayal kategorileri: harcanabilir, bağış hariç (bağış ayrı kök seçenek).
  const dreamCategories = useMemo(
    () => categories.filter((c) => c.isSpendable && c.slug !== 'bagis' && c.products.length > 0),
    [categories]
  )

  // Kataloğun en ucuz vergisiz fiyatı — bitiş eşiği (docs/01 §3.1.4f).
  const cheapest = useMemo(() => {
    const prices = categories
      .filter((c) => c.isSpendable)
      .flatMap((c) => c.products.map((p) => p.taxFreePrice))
      .filter((v) => v > 0)
    return prices.length ? Math.min(...prices) : Infinity
  }, [categories])

  function addItem(product: FlowProduct, text: string) {
    const item: DreamItem = {
      emoji: product.emoji || category?.emoji || '🎁',
      text: text.trim() || product.defaultLineText || product.name,
      amount: product.taxFreePrice,
      tag: mode === 'gift' && recipient ? { emoji: recipient.emoji, name: recipient.name } : undefined,
      positive: mode === 'donation',
    }
    const next = remaining - product.taxFreePrice
    setItems((prev) => [...prev, item])
    setRemaining(next)
    // sıfırla
    setCategory(null)
    setPending(null)
    setRecipient(null)
    setStep(next < cheapest ? 'end' : 'root')
  }

  if (step === 'end') {
    return <Preview selection={selection} items={items} remaining={Math.max(0, remaining)} />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <BudgetBar remaining={remaining} total={selection.totalTax} count={items.length} />

      {step === 'root' ? (
        <Root
          hasItems={items.length > 0}
          onSelf={() => {
            setMode('self')
            setStep('category')
          }}
          onGift={() => {
            setMode('gift')
            setStep('recipient')
          }}
          onDonation={() => {
            setMode('donation')
            setCategory(bagis)
            setStep('product')
          }}
          onComplete={() => setStep('end')}
          onBack={onBack}
        />
      ) : null}

      {step === 'recipient' ? (
        <Chooser
          title="Kime?"
          onBack={() => setStep('root')}
          options={RECIPIENTS.map((r) => ({ key: r.name, emoji: r.emoji, label: r.name }))}
          onPick={(key) => {
            setRecipient(RECIPIENTS.find((r) => r.name === key) ?? null)
            setStep('category')
          }}
        />
      ) : null}

      {step === 'category' ? (
        <Chooser
          title={mode === 'gift' && recipient ? `${recipient.name} ne?` : 'Ne alırdın?'}
          onBack={() => setStep(mode === 'gift' ? 'recipient' : 'root')}
          options={dreamCategories.map((c) => ({ key: c.slug, emoji: c.emoji, label: c.name }))}
          onPick={(key) => {
            setCategory(dreamCategories.find((c) => c.slug === key) ?? null)
            setStep('product')
          }}
        />
      ) : null}

      {step === 'product' && category ? (
        <ProductList
          category={category}
          remaining={remaining}
          onBack={() => setStep(mode === 'donation' ? 'root' : 'category')}
          onPick={(p) => {
            setPending(p)
            setStep('text')
          }}
        />
      ) : null}

      {step === 'text' && pending ? (
        <TextEntry
          product={pending}
          onBack={() => setStep('product')}
          onConfirm={(text) => addItem(pending, text)}
        />
      ) : null}
    </div>
  )
}

function BudgetBar({ remaining, total, count }: { remaining: number; total: number; count: number }) {
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100))
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        background: 'var(--bg-page)',
        paddingBottom: 8,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-muted)' }}>
          Kalan bütçe{count > 0 ? ` · ${count} hayal` : ''}
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums', fontWeight: 800, fontSize: 22, color: 'var(--green-500)' }}>
          {formatTL(remaining)}
        </span>
      </div>
      <div style={{ height: 10, background: 'var(--cream-300)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--green-500)', borderRadius: 999, transition: 'width 400ms ease' }} />
      </div>
    </div>
  )
}

function Root({
  hasItems,
  onSelf,
  onGift,
  onDonation,
  onComplete,
  onBack,
}: {
  hasItems: boolean
  onSelf: () => void
  onGift: () => void
  onDonation: () => void
  onComplete: () => void
  onBack: () => void
}) {
  const opt = (emoji: string, label: string, sub: string, onClick: () => void, key: string) => (
    <button
      key={key}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'var(--surface-card)',
        border: 'none',
        borderRadius: 'var(--r-lg)',
        padding: '18px 20px',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 36 }}>{emoji}</span>
      <span style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 19, color: 'var(--text-body)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)' }}>{sub}</span>
      </span>
      <span style={{ color: 'var(--text-faint)', fontSize: 20 }}>→</span>
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, lineHeight: 1.2, margin: 0 }}>
        Bu parayı nerede harcardın?
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {opt('🙋', 'Kendime', 'Kendi hayalim', onSelf, 'self')}
        {opt('🎁', 'Hediye', 'Sevdiklerime', onGift, 'gift')}
        {opt('❤️', 'Bağış', 'İyilik için', onDonation, 'donation')}
      </div>
      {hasItems ? (
        <button
          onClick={onComplete}
          style={{ background: 'var(--green-500)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', padding: '16px', fontFamily: 'var(--font-ui)', fontSize: 17, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}
        >
          ✅ Tamamla
        </button>
      ) : (
        <button
          onClick={onBack}
          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: 0 }}
        >
          ← Şok ekranı
        </button>
      )}
    </div>
  )
}

function Chooser({
  title,
  options,
  onPick,
  onBack,
}: {
  title: string
  options: Array<{ key: string; emoji: string | null; label: string }>
  onPick: (key: string) => void
  onBack: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: 0 }}>{title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => onPick(o.key)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--surface-card)', border: 'none', borderRadius: 'var(--r-lg)', padding: '18px 6px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', aspectRatio: '1 / 1' }}
          >
            <span style={{ fontSize: 34 }}>{o.emoji}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.2, color: 'var(--text-body)' }}>{o.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductList({
  category,
  remaining,
  onPick,
  onBack,
}: {
  category: FlowCategory
  remaining: number
  onPick: (p: FlowProduct) => void
  onBack: () => void
}) {
  // Sadece kalan bütçeyle alınabilecek ürünler (vergisiz fiyat ≤ kalan).
  const affordable = category.products.filter((p) => p.taxFreePrice <= remaining && p.taxFreePrice > 0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <BackLink onClick={onBack} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, margin: 0 }}>
        {category.emoji} {category.name}
      </h2>
      {affordable.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-muted)' }}>
          Kalan bütçeyle bu kategoride bir şey alamıyorsun. Geri dönüp başka kategori dene.
        </p>
      ) : (
        affordable.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface-card)', border: 'none', borderRadius: 'var(--r-lg)', padding: '14px 16px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', textAlign: 'left' }}
          >
            <span style={{ fontSize: 28 }}>{p.emoji || category.emoji}</span>
            <span style={{ flexGrow: 1, fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: 'var(--text-body)' }}>{p.name}</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums', fontSize: 15, fontWeight: 700, color: 'var(--green-500)' }}>{formatTL(p.taxFreePrice)}</span>
          </button>
        ))
      )}
    </div>
  )
}

function TextEntry({
  product,
  onConfirm,
  onBack,
}: {
  product: FlowProduct
  onConfirm: (text: string) => void
  onBack: () => void
}) {
  const placeholder = product.defaultLineText || product.name
  const [text, setText] = useState('')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <BackLink onClick={onBack} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 32 }}>{product.emoji || '🎁'}</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 16 }}>{product.name}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums', fontSize: 14, color: 'var(--green-500)', fontWeight: 700 }}>{formatTL(product.taxFreePrice)}</span>
        </div>
      </div>
      <label style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-muted)' }}>
        Görselde ne yazsın? (istersen kendi cümlen)
      </label>
      <input
        value={text}
        maxLength={40}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        style={{ fontFamily: 'var(--font-ui)', fontSize: 16, padding: '14px 16px', borderRadius: 'var(--r-lg)', border: '1px solid var(--cream-300)', background: 'var(--surface-card)', color: 'var(--text-body)', outline: 'none' }}
      />
      <button
        onClick={() => onConfirm(text)}
        style={{ background: 'var(--coral-500)', color: '#fff', border: 'none', borderRadius: 'var(--r-pill)', padding: '15px', fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}
      >
        Listeme ekle ✨
      </button>
    </div>
  )
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: 0 }}
    >
      ← Geri
    </button>
  )
}

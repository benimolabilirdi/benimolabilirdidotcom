'use client'

/**
 * Kullanıcı akışı kabuğu (Faz C). Adım durumu client'ta (stateless, DB'ye yazım yok).
 * Şu an: picker (C2) → şok stub. C3 şok, C4 hayal döngüsü, C5 paylaşım buraya eklenecek.
 */
import { useState } from 'react'
import { Picker } from '@/components/flow/Picker'
import { Wordmark } from '@/components/Wordmark'
import { formatTL } from '@/lib/share-card'
import type { FlowCategory, PurchaseSelection } from '@/lib/flow'

type Step = 'picker' | 'shock'

export function Flow({ categories }: { categories: FlowCategory[] }) {
  const [step, setStep] = useState<Step>('picker')
  const [selection, setSelection] = useState<PurchaseSelection | null>(null)

  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 20px 32px',
        gap: 20,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Wordmark size={18} />
      </div>

      {step === 'picker' ? (
        <Picker
          categories={categories}
          onSelect={(sel) => {
            setSelection(sel)
            setStep('shock')
          }}
        />
      ) : selection ? (
        <ShockStub selection={selection} onBack={() => setStep('picker')} />
      ) : null}
    </main>
  )
}

/**
 * Şok ekranı stub'ı — C3'te count-up animasyon + tam breakdown gelecek.
 * Şimdilik lib/tax.ts'in canlı akıştaki çıktısını doğruluyor.
 */
function ShockStub({ selection, onBack }: { selection: PurchaseSelection; onBack: () => void }) {
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
        ← Baştan seç
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22 }}>
          {selection.product.emoji} {selection.product.name}
        </span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--text-muted)' }}>
          {formatTL(selection.retailPrice)} ödedin.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-muted)' }}>Bunun</span>
        <span
          style={{
            fontFamily: 'var(--font-ui)',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 800,
            fontSize: 56,
            color: 'var(--coral-500)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          {`${formatTL(selection.totalTax)}'si`}
        </span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--coral-600)' }}>
          {`${selection.taxComponents.join(' + ')} (ödediğinin %${Math.round(selection.taxRatio * 100)}'i)`}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'var(--surface-card)',
          borderRadius: 'var(--r-lg)',
          padding: 16,
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {selection.lines.map((line) => (
          <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 15 }}>
            <span style={{ color: 'var(--text-muted)' }}>{line.label}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{formatTL(line.amount)}</span>
          </div>
        ))}
        <div style={{ height: 1, background: 'var(--cream-300)', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 15 }}>
          <span style={{ color: 'var(--positive)', fontWeight: 700 }}>Vergisiz fiyat</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--positive)' }}>
            {formatTL(selection.taxFreePrice)}
          </span>
        </div>
      </div>

      {/* İtibar sigortası: şüpheci kullanıcıyı tam şüphe anında yakala (PRD §3.4). */}
      <a
        href="/hesap"
        style={{
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        Nasıl hesapladık? →
      </a>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-faint)', margin: 0 }}>
        (C3: count-up animasyon + hayal döngüsüne geçiş burada gelecek)
      </p>
    </div>
  )
}

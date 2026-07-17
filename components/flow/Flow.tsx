'use client'

/**
 * Kullanıcı akışı kabuğu (Faz C). Adım durumu client'ta (stateless, DB'ye yazım yok).
 * picker (C2) → shock (C3) → dream (C4). Şok ekranı lacivert yüzey = duygusal zirve.
 */
import { useState } from 'react'
import { Picker } from '@/components/flow/Picker'
import { CountUp } from '@/components/CountUp'
import { Wordmark } from '@/components/Wordmark'
import { formatTL } from '@/lib/share-card'
import type { FlowCategory, PurchaseSelection } from '@/lib/flow'

type Step = 'picker' | 'shock' | 'dream'

export function Flow({ categories }: { categories: FlowCategory[] }) {
  const [step, setStep] = useState<Step>('picker')
  const [selection, setSelection] = useState<PurchaseSelection | null>(null)

  const onDark = step === 'shock'

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
        background: onDark ? 'var(--surface-navy)' : 'var(--bg-page)',
        color: onDark ? 'var(--text-on-dark)' : 'var(--text-body)',
        transition: 'background 300ms ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Wordmark size={18} color={onDark ? 'var(--text-on-dark)' : 'var(--navy-800)'} />
      </div>

      {step === 'picker' ? (
        <Picker
          categories={categories}
          onSelect={(sel) => {
            setSelection(sel)
            setStep('shock')
          }}
        />
      ) : null}

      {step === 'shock' && selection ? (
        <ShockScreen
          selection={selection}
          onBack={() => setStep('picker')}
          onDream={() => setStep('dream')}
        />
      ) : null}

      {step === 'dream' && selection ? (
        <DreamStub selection={selection} onBack={() => setStep('shock')} />
      ) : null}
    </main>
  )
}

/** Şok ekranı (C3, docs/01 §3.1.3, ui_kits Shock.jsx). Count-up + breakdown + geçiş. */
function ShockScreen({
  selection,
  onBack,
  onDream,
}: {
  selection: PurchaseSelection
  onBack: () => void
  onDream: () => void
}) {
  const pct = Math.round(selection.taxRatio * 100)

  // "Bir ___ daha alabilirdin" YALNIZCA vergi ≥ vergisiz fiyatsa (birebir doğru, şişirmez).
  // Kaç tane: floor(vergi / vergisiz). Telefonda 1, pahalı ÖTV'li arabada 2+.
  const extraUnits = Math.floor(selection.totalTax / selection.taxFreePrice)
  const shockCopy =
    extraUnits >= 1
      ? `Ah be. Bu vergiyle ${extraUnits > 1 ? `${extraUnits} ` : 'bir '}${selection.unitNoun} daha alabilirdin. Ya da sen ne almak isterdin, hesaplayalım mı?`
      : 'Ah be. Bu parayla neler alabilirdin, hesaplayalım mı?'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 18 }}>
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          background: 'none',
          border: 'none',
          color: 'var(--navy-300)',
          fontFamily: 'var(--font-ui)',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ← Baştan seç
      </button>

      {/* ürün + ödenen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 34, lineHeight: 1 }}>{selection.product.emoji}</span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17 }}>
            {selection.product.name}
          </span>
          <span style={{ fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums', fontSize: 14, color: 'var(--navy-300)' }}>
            {formatTL(selection.retailPrice)} ödedin
          </span>
        </div>
      </div>

      {/* şok zirvesi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 0' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600, color: 'var(--navy-300)' }}>
          Bunun vergisi:
        </span>
        <CountUp value={selection.totalTax} fontSize={68} />
        <div style={{ display: 'flex', marginTop: 6 }}>
          <span
            style={{
              display: 'inline-flex',
              background: 'var(--coral-500)',
              color: '#fff',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: 'var(--r-pill)',
            }}
          >
            {`ödediğinin %${pct}'i`}
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, lineHeight: 1.35, color: 'var(--text-on-dark)', margin: '12px 0 0', maxWidth: 320 }}>
          {shockCopy}
        </p>
      </div>

      {/* breakdown — tam etiketli (lines[]), lacivert-soft kart */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          background: 'var(--surface-navy-soft, #2A3A61)',
          borderRadius: 'var(--r-lg)',
          padding: 16,
        }}
      >
        {selection.lines.map((line) => (
          <div key={line.label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 15 }}>
            <span style={{ color: 'var(--navy-300)' }}>{line.label}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{formatTL(line.amount)}</span>
          </div>
        ))}
        <div style={{ height: 1, background: 'rgba(250,243,232,0.16)', margin: '4px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 15 }}>
          <span style={{ color: 'var(--green-300, #8FC4AC)', fontWeight: 700 }}>Vergisiz fiyat</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: 'var(--green-300, #8FC4AC)' }}>
            {formatTL(selection.taxFreePrice)}
          </span>
        </div>
      </div>

      <a
        href="/hesap"
        style={{
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--navy-300)',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        Nasıl hesapladık? →
      </a>

      {/* geçiş CTA — hayal döngüsü */}
      <button
        onClick={onDream}
        style={{
          marginTop: 'auto',
          background: 'var(--coral-500)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--r-pill)',
          padding: '16px 24px',
          fontFamily: 'var(--font-ui)',
          fontSize: 18,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Bu parayla ne alırdım? →
      </button>
    </div>
  )
}

/** Hayal döngüsü stub — C4'te bütçe barı + kategori→etiket→ürün→metin + döngü mantığı gelecek. */
function DreamStub({ selection, onBack }: { selection: PurchaseSelection; onBack: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button
        onClick={onBack}
        style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: 0 }}
      >
        ← Şok ekranı
      </button>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, margin: 0 }}>
        Bu {formatTL(selection.totalTax)}&apos;yi nerede harcardın?
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-muted)' }}>
        (C4: bütçe barı + kategori→etiket→ürün→kişisel metin + döngü sonu burada gelecek.)
      </p>
    </div>
  )
}

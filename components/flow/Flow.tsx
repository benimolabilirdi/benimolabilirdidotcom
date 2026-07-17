'use client'

/**
 * Kullanıcı akışı kabuğu (Faz C). Adım durumu client'ta (stateless, DB'ye yazım yok).
 * picker (C2) → shock (C3) → dream (C4). Şok ekranı lacivert yüzey = duygusal zirve.
 */
import { useState } from 'react'
import { Picker } from '@/components/flow/Picker'
import { Dream } from '@/components/flow/Dream'
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
        <Dream selection={selection} categories={categories} onBack={() => setStep('shock')} />
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
  // Ekstra vergi = ÖTV/bandrol/fon + onların üstüne binen KDV (docs/01 §4.7).
  const pct = Math.round((selection.excessTax / selection.retailPrice) * 100)

  const shockCopy = selection.affordableModel
    ? `Ah be. Bu vergiyle bir de ${selection.affordableModel} alabilirdin. Ya da sen ne almak isterdin, hesaplayalım mı?`
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
          Bunun ekstra vergisi:
        </span>
        <CountUp value={selection.excessTax} fontSize={68} />
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
        {selection.lines.map((line) => {
          // baseline (KDV): iki satır — "ürünün kendisi" soluk + "üstüne binen" mercan.
          if (line.baselineAmount != null) {
            const excess = line.amount - line.baselineAmount
            return (
              <div key={line.key} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <BreakRow label={`${line.label} (ürünün kendisi)`} amount={line.baselineAmount} muted />
                {excess > 0.005 ? (
                  <BreakRow label={`${line.label} (vergilerin üzerine binen)`} amount={excess} />
                ) : null}
              </div>
            )
          }
          // ÖTV / bandrol / fon — hepsi ekstra (mercan).
          return <BreakRow key={line.key} label={line.label} amount={line.amount} />
        })}
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


/** Şok breakdown satırı. muted: baseline KDV (soluk); değilse ekstra vergi (mercan). */
function BreakRow({ label, amount, muted }: { label: string; amount: number; muted?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-ui)', fontSize: 15 }}>
      <span style={{ color: muted ? 'var(--navy-400)' : 'var(--navy-300)' }}>{label}</span>
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          fontWeight: 700,
          color: muted ? 'var(--navy-400)' : 'var(--coral-400)',
        }}
      >
        {formatTL(amount)}
      </span>
    </div>
  )
}

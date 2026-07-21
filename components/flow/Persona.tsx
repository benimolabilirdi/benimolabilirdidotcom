'use client'

/**
 * "Kimsin?" adımı (docs/07, docs/01 §3.5). ŞOK EKRANINDAN SONRA gelir — şok anını
 * bölmemek için. Lacivert yüzeyde kalır: şok zirvesinin dekreşendosu, hayale (krem)
 * geçmeden önceki buruk iç ses.
 *
 * Beyan kullanıcıya aittir, DOĞRULANMAZ ve DB'ye YAZILMAZ. Adım atlanabilir.
 * İki dokunuş: grup → (ücretli/şahıs ise) dilim.
 */
import { useMemo, useState } from 'react'
import { groupPersonas, personaTierLabel, type Persona } from '@/lib/flow'

type Props = {
  personas: Persona[]
  onBack: () => void
  /** null = beyan yok (p4 basılmaz). */
  onPick: (persona: Persona | null) => void
}

export function PersonaStep({ personas, onBack, onPick }: Props) {
  const groups = useMemo(() => groupPersonas(personas), [personas])
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const active = groups.find((g) => g.key === openGroup) ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 18 }}>
      <BackButton onClick={active ? () => setOpenGroup(null) : onBack}>
        {active ? '← Geri' : '← Şok ekranı'}
      </BackButton>

      {active ? (
        <TierView group={active} onPick={onPick} />
      ) : (
        <GroupView groups={groups} onOpen={setOpenGroup} onPick={onPick} />
      )}
    </div>
  )
}

function GroupView({
  groups,
  onOpen,
  onPick,
}: {
  groups: ReturnType<typeof groupPersonas>
  onOpen: (key: string) => void
  onPick: (p: Persona | null) => void
}) {
  // "Belirtmek istemiyorum" katalogda en sonda; gizli link değil, ayrı ve görünür bir satır.
  const skip = groups.find((g) => g.key === 'yok')
  const rest = groups.filter((g) => g.key !== 'yok')

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, lineHeight: 1.15, margin: 0 }}>
          Peki sen kimsin?
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, lineHeight: 1.45, color: 'var(--navy-300)', margin: 0 }}>
          Görsele tek bir satır ekler. İstersen atla — beyan senin, kimse doğrulamıyor.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rest.map((g) => (
          <OptionRow
            key={g.key}
            label={g.label}
            hasMore={g.options.length > 1}
            onClick={() => (g.options.length > 1 ? onOpen(g.key) : onPick(g.options[0]))}
          />
        ))}
      </div>

      {skip ? (
        <button
          onClick={() => onPick(null)}
          style={{
            marginTop: 4,
            alignSelf: 'stretch',
            background: 'none',
            border: '1px solid rgba(250,243,232,0.22)',
            borderRadius: 'var(--r-pill)',
            padding: '14px 20px',
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--navy-300)',
            cursor: 'pointer',
          }}
        >
          {skip.options[0].uiLabel}
        </button>
      ) : null}
    </>
  )
}

function TierView({
  group,
  onPick,
}: {
  group: { key: string; label: string; options: Persona[] }
  onPick: (p: Persona) => void
}) {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, lineHeight: 1.15, margin: 0 }}>
          {group.label}
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, lineHeight: 1.45, color: 'var(--navy-300)', margin: 0 }}>
          Hangi gelir vergisi dilimindesin?
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {group.options.map((p) => (
          <OptionRow key={p.key} label={personaTierLabel(p)} helper={p.uiHelper} onClick={() => onPick(p)} />
        ))}
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
        Dilimler nereden geliyor? →
      </a>
    </>
  )
}

function OptionRow({
  label,
  helper,
  hasMore,
  onClick,
}: {
  label: string
  helper?: string | null
  hasMore?: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'var(--surface-navy-soft, #2A3A61)',
        border: 'none',
        borderRadius: 'var(--r-lg)',
        padding: '16px 18px',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <span style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 17, fontWeight: 600, color: 'var(--text-on-dark)' }}>
          {label}
        </span>
        {helper ? (
          <span style={{ fontFamily: 'var(--font-ui)', fontVariantNumeric: 'tabular-nums', fontSize: 13, color: 'var(--navy-300)' }}>
            {helper}
          </span>
        ) : null}
      </span>
      {hasMore ? <span style={{ fontSize: 18, color: 'var(--navy-300)' }}>›</span> : null}
    </button>
  )
}

function BackButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
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
      {children}
    </button>
  )
}

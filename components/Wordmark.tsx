/**
 * Marka wordmark'ı — logo yok, tipografik (Nunito ExtraBold, küçük harf) + mahzun surat.
 * Surat DS'in imza markası (guidelines/brand-wordmark.html): iki nokta göz + aşağı kavisli
 * ağız = "buruk ama sıcak" tonu. Wordmark'ın geçtiği her yerde bu bileşen kullanılır.
 */
type Props = {
  size?: number
  /** Suratı gizle (çok küçük yerlerde). */
  face?: boolean
  color?: string
}

export function Wordmark({ size = 22, face = true, color = 'var(--navy-800)' }: Props) {
  const faceSize = Math.round(size * 0.85)
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: size * 0.36 }}>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: size,
          color,
          letterSpacing: '-0.02em',
          lineHeight: 1,
        }}
      >
        benim<span style={{ color: 'var(--coral-500)' }}>olabilirdi</span>
      </span>
      {face ? (
        <svg
          width={faceSize}
          height={faceSize}
          viewBox="0 0 44 44"
          fill="none"
          style={{ color: 'var(--coral-500)', flex: 'none', marginTop: '0.12em' }}
          aria-hidden
        >
          <circle cx="15.5" cy="18" r="2.8" fill="currentColor" />
          <circle cx="28.5" cy="18" r="2.8" fill="currentColor" />
          <path d="M13 31 Q22 24 31 31" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
        </svg>
      ) : null}
    </span>
  )
}

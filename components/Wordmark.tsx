/**
 * Marka wordmark'ı — logo yok, tipografik (Nunito ExtraBold, küçük harf) + mahzun surat.
 * Surat DS'in imza markası (guidelines/brand-wordmark.html): iki nokta göz + aşağı kavisli
 * ağız = "buruk ama sıcak" tonu. Wordmark'ın geçtiği her yerde bu bileşen kullanılır.
 * Varsayılan olarak ana sayfaya link; href={null} ile linksiz kullanılır.
 */
import Link from 'next/link'

type Props = {
  size?: number
  /** Suratı gizle (çok küçük yerlerde). */
  face?: boolean
  color?: string
  /** Tıklanınca gidilecek adres; null verilirse link olmaz. */
  href?: string | null
}

export function Wordmark({ size = 22, face = true, color = 'var(--navy-800)', href = '/' }: Props) {
  // Surat gövdeyle boy ölçüşecek büyüklükte; viewBox içeriğe kırpılı olduğundan net görünür.
  const faceSize = Math.round(size * 1.05)
  const content = (
    <>
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
          height={Math.round(faceSize * (20 / 22))}
          viewBox="11 14 22 20"
          fill="none"
          style={{ color: 'var(--coral-500)', flex: 'none', marginTop: '0.1em' }}
          aria-hidden
        >
          <circle cx="15.5" cy="18.5" r="3.1" fill="currentColor" />
          <circle cx="28.5" cy="18.5" r="3.1" fill="currentColor" />
          <path d="M13 31 Q22 23.5 31 31" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" />
        </svg>
      ) : null}
    </>
  )

  const flex = { display: 'inline-flex', alignItems: 'flex-start', gap: size * 0.36 } as const

  return href ? (
    <Link href={href} aria-label="benimolabilirdi.com ana sayfa" style={{ ...flex, textDecoration: 'none' }}>
      {content}
    </Link>
  ) : (
    <span style={flex}>{content}</span>
  )
}

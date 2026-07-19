/**
 * 404 (F2). Buruk-samimi tonda, tek CTA ile ana akışa döndürür.
 */
import Link from 'next/link'
import { Wordmark } from '@/components/Wordmark'

export const metadata = { title: 'Sayfa bulunamadı' }

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      <Wordmark size={22} />
      <div style={{ fontSize: 64, lineHeight: 1 }}>🧾</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, margin: 0, color: 'var(--navy-800)' }}>
        Bu sayfa da benim olabilirdi
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
        Aradığın sayfa yok ya da taşınmış. Merak etme, asıl mesele hâlâ burada duruyor.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 6,
          fontFamily: 'var(--font-ui)',
          fontSize: 16,
          fontWeight: 700,
          color: '#fff',
          background: 'var(--coral-500)',
          borderRadius: 999,
          padding: '13px 26px',
          textDecoration: 'none',
        }}
      >
        Ana sayfaya dön →
      </Link>
    </main>
  )
}

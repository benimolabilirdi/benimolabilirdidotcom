/**
 * Ürün seçici — C2'de yazılacak (kategori grid → ürün listesi → arama + serbest tutar).
 * Şimdilik stub: landing CTA'sı buraya gelir, kırık link olmasın.
 */
import Link from 'next/link'
import { Wordmark } from '@/components/Wordmark'

export default function AlPage() {
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
        gap: 16,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <Wordmark size={22} />
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, color: 'var(--text-muted)' }}>
        Ürün seçme ekranı yakında burada olacak.
      </p>
      <Link href="/" style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: 'var(--coral-500)' }}>
        ← Ana sayfa
      </Link>
    </main>
  )
}

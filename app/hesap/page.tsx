/**
 * "Nasıl hesaplıyoruz?" — itibar sigortası sayfası (PRD §3.4). İçerik E3'te (kaynak linkli:
 * vergi zinciri şeması, kategori formülleri, ÖTV Kanunu/KDV BKK atıfları, örnek hesap).
 * Şimdilik stub: şok ekranındaki link kırık olmasın.
 */
import Link from 'next/link'
import { Wordmark } from '@/components/Wordmark'

export const metadata = { title: 'Nasıl hesaplıyoruz? · benimolabilirdi.com' }

export default function HesapPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: 620,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '32px 22px 48px',
      }}
    >
      <Wordmark size={20} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, margin: 0 }}>
        Nasıl hesaplıyoruz?
      </h1>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 16, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>
        Vergi zinciri şeması, her kategorinin formülü ve resmi mevzuat kaynakları yakında burada
        olacak. Hesaplarımız ÖTV Kanunu ekli listeleri ve KDV oranlarına dayanır; yorum içermez.
      </p>
      <Link href="/" style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: 'var(--coral-500)' }}>
        ← Ana sayfa
      </Link>
    </main>
  )
}

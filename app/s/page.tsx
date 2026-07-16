/**
 * Paylaşım linki hedefi: /s?d=<base64url> (docs/01 §3.1.6, docs/03 §5).
 *
 * - Link atıldığında OG meta @vercel/og endpoint'ini gösterir → WhatsApp/X önizlemesi.
 * - Sayfayı açan kişi kartı görür + indir/paylaş + "sen de dene" CTA.
 * STATELESS: tüm veri d parametresinde, DB'ye dokunmaz.
 */
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import { ShareCard } from '@/components/ShareCard'
import { ShareActions } from '@/components/ShareActions'
import { decodeShareData } from '@/lib/share-link'
import { KABUL_PERSONALI } from '@/lib/fixtures/kabul'

type SearchParams = { d?: string }

function originFromHeaders(): string {
  const h = headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

export function generateMetadata({ searchParams }: { searchParams: SearchParams }): Metadata {
  const origin = originFromHeaders()
  const d = searchParams.d
  const ogUrl = `${origin}/api/og${d ? `?d=${encodeURIComponent(d)}` : ''}`
  const pageUrl = `${origin}/s${d ? `?d=${encodeURIComponent(d)}` : ''}`

  const title = 'benimolabilirdi.com'
  const description = 'Ödediğim verginin karşılığında neler alabilirdim?'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogUrl] },
  }
}

export default function SharePage({ searchParams }: { searchParams: SearchParams }) {
  const data = decodeShareData(searchParams.d) ?? KABUL_PERSONALI
  const origin = originFromHeaders()
  const shareUrl = `${origin}/s${searchParams.d ? `?d=${encodeURIComponent(searchParams.d)}` : ''}`

  const PREVIEW = 0.32

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        padding: '32px 20px 48px',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.02em' }}>
        benim<span style={{ color: '#E85D4A' }}>olabilirdi</span>
      </div>

      <div
        style={{
          width: 1080 * PREVIEW,
          height: 1920 * PREVIEW,
          overflow: 'hidden',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(30,42,74,0.16)',
        }}
      >
        <ShareCard format="story" data={data} scale={PREVIEW} />
      </div>

      <ShareActions data={data} format="story" shareUrl={shareUrl} />

      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 16,
          fontWeight: 600,
          color: '#2E7D5B',
          textDecoration: 'none',
          marginTop: 8,
        }}
      >
        Sen de hesapla → benimolabilirdi.com
      </Link>
    </main>
  )
}

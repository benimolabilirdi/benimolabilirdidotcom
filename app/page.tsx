/**
 * Landing (C1, docs/01 §3.1.1, docs/03, ui_kits/app/Landing.jsx).
 * Değer önerisi + "Ne aldın?" CTA + canlı vergi sayacı. Mobil öncelikli (390px).
 */
import Link from 'next/link'
import { Wordmark } from '@/components/Wordmark'
import { LiveCounter } from '@/components/LiveCounter'
import { createClient } from '@/lib/supabase/server'

// Sayaç canlı veri; sayfa her istekte tazelensin (statik prerender değil).
export const dynamic = 'force-dynamic'

async function getStats(): Promise<{ totalTax: number; totalImages: number }> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('stats')
      .select('total_tax_calculated, total_images_generated')
      .eq('id', 1)
      .single()
    return {
      totalTax: Number(data?.total_tax_calculated ?? 0),
      totalImages: Number(data?.total_images_generated ?? 0),
    }
  } catch {
    return { totalTax: 0, totalImages: 0 }
  }
}

export default async function Home() {
  const stats = await getStats()

  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: 430,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 22px 24px',
      }}
    >
      {/* üst şerit — wordmark */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark size={20} />
      </div>

      {/* orta — sayaç (yalnız gerçek kullanım varsa) + değer önerisi */}
      <div
        style={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 22,
          padding: '8px 0',
        }}
      >
        {stats.totalTax > 0 ? (
          <LiveCounter totalTax={stats.totalTax} totalImages={stats.totalImages} />
        ) : null}

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 900,
            fontSize: 40,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--navy-800)',
            margin: 0,
          }}
        >
          Ödediğin ekstra vergilerle{' '}
          <span style={{ position: 'relative', color: 'var(--coral-500)', whiteSpace: 'nowrap' }}>
            neler alabilirdin?
            <svg
              style={{ position: 'absolute', left: 0, bottom: -6, width: '100%', height: 8 }}
              viewBox="0 0 260 8"
              preserveAspectRatio="none"
            >
              <path
                d="M2 5C60 1 130 1 190 4S250 7 258 3"
                stroke="var(--coral-400)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 16,
            lineHeight: 1.5,
            color: 'var(--text-muted)',
            margin: 0,
            maxWidth: 320,
          }}
        >
          Bir ürün seç, içindeki vergiyi gör — ve o parayla neler alabileceğini hayal et. 30 saniye, hepsi bu.
        </p>
      </div>

      {/* alt — CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link
          href="/al"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--coral-500)',
            color: '#fff',
            fontFamily: 'var(--font-ui)',
            fontSize: 18,
            fontWeight: 700,
            textDecoration: 'none',
            borderRadius: 'var(--r-pill)',
            padding: '16px 24px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          Ne aldın? →
        </Link>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            textAlign: 'center',
            color: 'var(--text-faint)',
            margin: 0,
          }}
        >
          Kimlik bilgisi istenmez, hiçbir veri saklanmaz.
        </p>
      </div>
    </main>
  )
}

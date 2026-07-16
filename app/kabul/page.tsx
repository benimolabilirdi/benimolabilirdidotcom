/**
 * B2 GATE — docs/03 §7 kabul testi.
 * Sabit senaryo üç formatta + story gerçek boyutta (mobil önizleme).
 * Geçici sayfa: onaydan sonra kaldırılır ya da /admin altına taşınır.
 */
import { ShareCard } from '@/components/ShareCard'
import { KABUL_SENARYOSU } from '@/lib/fixtures/kabul'
import { FORMATS, type ShareCardFormat } from '@/lib/share-card'

const PREVIEW_SCALE: Record<ShareCardFormat, number> = { story: 0.28, post: 0.28, og: 0.28 }

function Frame({ format }: { format: ShareCardFormat }) {
  const f = FORMATS[format]
  const scale = PREVIEW_SCALE[format]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#5B6F9E' }}>
        {f.label} · {f.w}×{f.h} · ölçek %{Math.round(scale * 100)}
      </div>
      <div
        style={{
          width: f.w * scale,
          height: f.h * scale,
          overflow: 'hidden',
          borderRadius: 12,
          boxShadow: '0 6px 28px rgba(30,42,74,0.14)',
        }}
      >
        <ShareCard format={format} data={KABUL_SENARYOSU} scale={scale} />
      </div>
    </div>
  )
}

export default function KabulPage() {
  return (
    <main style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>
          Kabul testi — docs/03 §7
        </h1>
        <p style={{ color: '#5B6F9E', fontSize: 14, marginTop: 6 }}>
          iPhone 17 · 119.000 TL · vergi 59.400 TL · 6 satır · kalan 340 TL
        </p>
      </div>

      <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <Frame format="story" />
        <Frame format="post" />
        <Frame format="og" />
      </div>

      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
          Story — gerçek boyut (1080×1920, kaydırarak gezin)
        </h2>
        <div
          style={{
            width: 1080,
            height: 700,
            overflow: 'auto',
            border: '1px solid #E9D8BC',
            borderRadius: 12,
          }}
        >
          <ShareCard format="story" data={KABUL_SENARYOSU} />
        </div>
      </div>
    </main>
  )
}

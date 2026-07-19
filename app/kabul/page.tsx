/**
 * B2 GATE — docs/07 §6: 4 format × 2 varyant (persona'lı ucretli_27 + persona'sız).
 * Geçici sayfa: onaydan sonra kaldırılır ya da /admin altına taşınır.
 */
import { ShareCard } from '@/components/ShareCard'
import { KABUL_PERSONALI, KABUL_PERSONASIZ, KABUL_OTOMOBIL_TASMA, KABUL_SIMIT } from '@/lib/fixtures/kabul'
import { FORMATS, type ShareCardData, type ShareCardFormat } from '@/lib/share-card'

const ORDER: ShareCardFormat[] = ['story', 'post', 'square', 'og']
const PREVIEW_SCALE = 0.26

function Frame({ format, data }: { format: ShareCardFormat; data: ShareCardData }) {
  const f = FORMATS[format]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#5B6F9E' }}>
        {f.label} · {f.w}×{f.h} · {f.ratio}
      </div>
      <div
        style={{
          width: f.w * PREVIEW_SCALE,
          height: f.h * PREVIEW_SCALE,
          overflow: 'hidden',
          borderRadius: 10,
          boxShadow: '0 6px 28px rgba(30,42,74,0.14)',
        }}
      >
        <ShareCard format={format} data={data} scale={PREVIEW_SCALE} />
      </div>
    </div>
  )
}

function Variant({ title, data }: { title: string; data: ShareCardData }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h2>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {ORDER.map((format) => (
          <Frame key={format} format={format} data={data} />
        ))}
      </div>
    </section>
  )
}

export default function KabulPage() {
  return (
    <main style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 44 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>
          Kabul testi — GATE 🚪
        </h1>
        <p style={{ color: '#5B6F9E', fontSize: 14, marginTop: 6 }}>
          iPhone 17 · 119.000 TL · vergi 59.400 TL · 7 satır (benzinli) · kalan 340 TL
        </p>
      </div>

      <Variant title="Varyant A — persona'lı (🧾 Ücretliyim · %27 dilimi)" data={KABUL_PERSONALI} />
      <Variant title="Varyant B — persona'sız (⏳ Belirtmek istemiyorum)" data={KABUL_PERSONASIZ} />
      <Variant title="Varyant C — otomobil + taşma (emoji özeti + toplam)" data={KABUL_OTOMOBIL_TASMA} />
      <Variant title="Varyant D — simit kapanışı (Samsung A56, kalan ~8 TL)" data={KABUL_SIMIT} />

      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Story — gerçek boyut (1080×1920, kaydır)</h2>
        <div
          style={{
            width: 1080,
            maxWidth: '100%',
            height: 720,
            overflow: 'auto',
            border: '1px solid #E9D8BC',
            borderRadius: 12,
          }}
        >
          <ShareCard format="story" data={KABUL_PERSONALI} />
        </div>
      </section>
    </main>
  )
}

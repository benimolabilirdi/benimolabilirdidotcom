/**
 * OG görsel endpoint'i (docs/03 §5, docs/05 B3). /api/og?d=<base64url> → 1200×630 PNG.
 *
 * AYNI <ShareCard format="og" /> bileşenini satori ile render eder — client'takiyle
 * tek kaynak. Bileşen satori-uyumlu yazıldığı için (flexbox alt kümesi, literal renk)
 * ekstra uyarlama gerekmez. Fontlar public/fonts'tan ArrayBuffer olarak verilir.
 *
 * WhatsApp/X link atıldığında bu görseli çeker (docs/03 §5 "bedava viral kanal").
 */
import { ImageResponse } from '@vercel/og'
import { ShareCard } from '@/components/ShareCard'
import { decodeShareData } from '@/lib/share-link'
import { KABUL_PERSONALI } from '@/lib/fixtures/kabul'

export const runtime = 'edge'

async function loadFont(origin: string, path: string): Promise<ArrayBuffer> {
  const res = await fetch(`${origin}${path}`)
  if (!res.ok) throw new Error(`font yüklenemedi: ${path} (${res.status})`)
  return res.arrayBuffer()
}

export async function GET(req: Request): Promise<Response> {
  const { searchParams, origin } = new URL(req.url)

  // Veri yoksa/bozuksa kabul senaryosunu göster (link paylaşımı test edilebilsin).
  const data = decodeShareData(searchParams.get('d')) ?? KABUL_PERSONALI

  try {
    const [nunito700, nunito800, dmsans600, dmsans700] = await Promise.all([
      loadFont(origin, '/fonts/Nunito/static/Nunito-Bold.ttf'),
      loadFont(origin, '/fonts/Nunito/static/Nunito-ExtraBold.ttf'),
      loadFont(origin, '/fonts/static/DMSans-SemiBold.ttf'),
      loadFont(origin, '/fonts/static/DMSans-Bold.ttf'),
    ])

    return new ImageResponse(<ShareCard format="og" data={data} scale={1} />, {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Nunito', data: nunito700, weight: 700, style: 'normal' },
        { name: 'Nunito', data: nunito800, weight: 800, style: 'normal' },
        { name: 'DM Sans', data: dmsans600, weight: 600, style: 'normal' },
        { name: 'DM Sans', data: dmsans700, weight: 700, style: 'normal' },
      ],
      // Sosyal platformlar önizlemeyi agresif cache'ler; içerik URL'de olduğu için güvenli.
      headers: { 'Cache-Control': 'public, max-age=86400, immutable' },
    })
  } catch (err) {
    return new Response(`OG render hatası: ${err instanceof Error ? err.message : 'bilinmeyen'}`, {
      status: 500,
    })
  }
}

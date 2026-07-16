'use client'

/**
 * ShareCard'ı PNG'ye çevirip indirir / paylaşır (docs/05 B3).
 *
 * Görsel ekran DIŞINDA gerçek piksel boyutunda (scale=1) render edilir, sonra
 * html-to-image ile rasterize edilir — önizlemedeki küçültülmüş hali değil.
 * Web Share API varsa native paylaşım (mobil), yoksa indirmeye düşer.
 */
import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { ShareCard } from '@/components/ShareCard'
import { FORMATS, type ShareCardData, type ShareCardFormat } from '@/lib/share-card'

type Props = {
  data: ShareCardData
  format: ShareCardFormat
  shareUrl?: string
}

async function nodeToPng(node: HTMLElement, format: ShareCardFormat): Promise<Blob> {
  const f = FORMATS[format]
  // Fontlar yüklenmeden rasterize edilirse yedek fonta düşer; bekle.
  if (document.fonts?.ready) await document.fonts.ready
  const dataUrl = await toPng(node, {
    width: f.w,
    height: f.h,
    pixelRatio: 1, // zaten 1080px gerçek boyut; 2x gereksiz dev dosya üretir
    cacheBust: true,
  })
  const res = await fetch(dataUrl)
  return res.blob()
}

export function ShareActions({ data, format, shareUrl }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState<null | 'download' | 'share'>(null)
  const [note, setNote] = useState<string>('')

  const fileName = `benimolabilirdi-${format}.png`

  async function render(): Promise<Blob> {
    const node = stageRef.current!.firstElementChild as HTMLElement
    return nodeToPng(node, format)
  }

  async function handleDownload() {
    setBusy('download')
    setNote('')
    try {
      const blob = await render()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      setNote('Görsel oluşturulamadı, tekrar dener misin?')
    } finally {
      setBusy(null)
    }
  }

  async function handleShare() {
    setBusy('share')
    setNote('')
    try {
      const blob = await render()
      const file = new File([blob], fileName, { type: 'image/png' })
      const shareData: ShareData = {
        title: 'benimolabilirdi.com',
        text: 'Ödediğim verginin karşılığında neler alabilirdim?',
        files: [file],
        ...(shareUrl ? { url: shareUrl } : {}),
      }
      // canShare dosyayı destekliyor mu? Değilse indirmeye düş.
      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData)
      } else {
        await handleDownload()
        setNote('Paylaşım bu cihazda desteklenmiyor — görsel indirildi.')
      }
    } catch (err) {
      // Kullanıcı paylaşım sayfasını iptal ederse sessiz geç.
      if (!(err instanceof DOMException && err.name === 'AbortError')) {
        setNote('Paylaşılamadı, tekrar dener misin?')
      }
    } finally {
      setBusy(null)
    }
  }

  async function handleCopyLink() {
    if (!shareUrl) return
    try {
      await navigator.clipboard.writeText(shareUrl)
      setNote('Link kopyalandı ✓')
    } catch {
      setNote('Link kopyalanamadı.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'stretch' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={handleShare} disabled={busy !== null} style={btn('#E85D4A', '#fff')}>
          {busy === 'share' ? 'Hazırlanıyor…' : '📤 Paylaş'}
        </button>
        <button onClick={handleDownload} disabled={busy !== null} style={btn('#fff', '#1E2A4A', '#E9D8BC')}>
          {busy === 'download' ? 'Hazırlanıyor…' : '📥 İndir'}
        </button>
        {shareUrl ? (
          <button onClick={handleCopyLink} disabled={busy !== null} style={btn('#fff', '#1E2A4A', '#E9D8BC')}>
            🔗 Linki kopyala
          </button>
        ) : null}
      </div>
      {note ? <div style={{ fontSize: 13, color: '#5B6F9E' }}>{note}</div> : null}

      {/* Ekran dışı sahne: rasterize edilecek gerçek boyut kart. Görünmez ama DOM'da. */}
      <div
        ref={stageRef}
        aria-hidden
        style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none', opacity: 0 }}
      >
        <ShareCard format={format} data={data} scale={1} />
      </div>
    </div>
  )
}

function btn(bg: string, fg: string, border?: string): React.CSSProperties {
  return {
    fontFamily: 'var(--font-ui)',
    fontSize: 16,
    fontWeight: 600,
    color: fg,
    background: bg,
    border: border ? `1px solid ${border}` : 'none',
    borderRadius: 999,
    padding: '12px 22px',
    cursor: 'pointer',
  }
}

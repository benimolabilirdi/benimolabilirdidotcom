'use client'

/**
 * Önizleme + paylaşım (C5, docs/01 §3.1.5). Hayal döngüsü çıktısını ShareCard'a çevirir,
 * format seçici + indir/paylaş/kopyala. Paylaşım linki stateless (/s?d=base64).
 */
import { useMemo, useState } from 'react'
import { ShareCard } from '@/components/ShareCard'
import { ShareActions } from '@/components/ShareActions'
import { type ShareCardData, type ShareCardFormat } from '@/lib/share-card'
import { encodeShareData } from '@/lib/share-link'
import type { DreamItem, PurchaseSelection } from '@/lib/flow'

const FORMAT_TABS: { key: ShareCardFormat; label: string; previewH: number }[] = [
  { key: 'story', label: 'Story', previewH: 1920 },
  { key: 'post', label: 'Post', previewH: 1350 },
  { key: 'square', label: 'Kare', previewH: 1080 },
]

export function Preview({
  selection,
  items,
  remaining,
}: {
  selection: PurchaseSelection
  items: DreamItem[]
  remaining: number
}) {
  const [format, setFormat] = useState<ShareCardFormat>('story')

  const data: ShareCardData = useMemo(
    () => ({
      product: selection.product,
      retailPrice: selection.retailPrice,
      totalTax: selection.totalTax,
      excessTax: selection.excessTax,
      taxComponents: selection.taxComponents,
      items,
      remaining,
    }),
    [selection, items, remaining]
  )

  const shareUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    return `${origin}/s?d=${encodeShareData(data)}`
  }, [data])

  const previewWidth = 300
  const scale = previewWidth / 1080

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, margin: 0, textAlign: 'center' }}>
        İşte hayal listen ✨
      </h1>

      {/* format seçici */}
      <div style={{ display: 'flex', gap: 8, background: 'var(--cream-200)', borderRadius: 'var(--r-pill)', padding: 4 }}>
        {FORMAT_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setFormat(t.key)}
            style={{
              border: 'none',
              borderRadius: 'var(--r-pill)',
              padding: '8px 18px',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              background: format === t.key ? 'var(--surface-card)' : 'transparent',
              color: format === t.key ? 'var(--text-body)' : 'var(--text-muted)',
              boxShadow: format === t.key ? 'var(--shadow-sm)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* önizleme */}
      <div
        style={{
          width: previewWidth,
          height: FORMAT_TABS.find((t) => t.key === format)!.previewH * scale,
          overflow: 'hidden',
          borderRadius: 14,
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <ShareCard format={format} data={data} scale={scale} />
      </div>

      <ShareActions data={data} format={format} shareUrl={shareUrl} />
    </div>
  )
}

/**
 * Landing sayacı (PRD §7): "X TL vergi hesaplandı · Y hayal paylaşıldı".
 *
 * DÜRÜSTLÜK KARARI: DS şablonu sayacı "canlı" hissettirmek için rastgele artırıyordu;
 * bir farkındalık projesinde sahte artış itibar açığı (ekran görüntüsüyle çürütülür).
 * Gerçek değeri gösteririz — nabız noktası "canlı" hissini zaten verir. Sayı gerçek
 * kullanımla (increment_stats RPC) artar. Sunucudan seed'lenir, presentational.
 */
import { formatTL } from '@/lib/share-card'

type Props = { totalTax: number; totalImages: number }

export function LiveCounter({ totalTax, totalImages }: Props) {
  const people = new Intl.NumberFormat('tr-TR').format(totalImages)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface-navy)',
          color: 'var(--text-on-dark)',
          borderRadius: 'var(--r-pill)',
          padding: '9px 18px',
          boxShadow: 'var(--shadow-sm)',
          fontFamily: 'var(--font-ui)',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'var(--green-400)',
            animation: 'bo-pulse 2s ease-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-num, var(--font-ui))',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 800,
            fontSize: 18,
          }}
        >
          {formatTL(totalTax)}
        </span>
        <span style={{ fontSize: 14, color: 'var(--text-on-dark-muted)', fontWeight: 500 }}>
          ekstra vergi hesaplandı
        </span>
      </div>
      {totalImages > 0 ? (
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-muted)', paddingLeft: 4 }}>
          {people} kişi hayalini paylaştı ✨
        </span>
      ) : null}
    </div>
  )
}

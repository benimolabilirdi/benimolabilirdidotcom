/**
 * ShareCard — projenin asıl çıktısı. Tek bileşen, üç format (docs/03-visual-spec.md).
 *
 * SATORI KURALLARI (CLAUDE.md: "ShareCard satori-uyumlu yazılacak"):
 *   - CSS değişkeni YOK. Satori var() çözemez → renkler lib/share-card.ts'ten literal.
 *   - Çok çocuklu her div'de açık `display: flex`. Satori örtük blok yerleşimi yapmaz.
 *   - grid/float YOK, flexbox alt kümesi.
 *   - `flex: 1` yerine flexGrow. Kısayol özellikler güvenilmez.
 * Aynı bileşen client'ta html-to-image ile PNG'ye, sunucuda @vercel/og ile OG'ye gider.
 */
import {
  C,
  FONT_DISPLAY,
  FONT_UI,
  FORMATS,
  fitItems,
  formatTL,
  pastCopula,
  type ShareCardData,
  type ShareCardFormat,
  type WishItem,
} from '@/lib/share-card'

type Props = {
  format?: ShareCardFormat
  data: ShareCardData
  /** Tarayıcı önizlemesi için ölçek. Gerçek PNG her zaman scale=1 ile alınır. */
  scale?: number
}

/**
 * "ÖTV + KDV + TRT payı + Bakanlık fonuydu" — bileşenler VERİDEN gelir, sabit değil.
 * 'vergi' kelimesi bilinçli olarak kullanılmıyor: "vergi vermek istemiyorum" gibi
 * okunabiliyor. Kalemleri saymak hem daha dürüst hem daha güçlü (Oğuzhan, B2).
 */
function taxComponentsLine(components: string[]): string {
  if (components.length === 0) return 'hiç vergi yoktu'
  return components.join(' + ') + pastCopula(components[components.length - 1])
}

/** docs/03 §3 Zone C: 'OLABİLİRDİ' altında el çizimi dalgalı çizgi. */
function WavyUnderline({ width, color }: { width: number; color: string }) {
  const h = Math.max(6, Math.round(width * 0.022))
  return (
    <svg width={width} height={h * 2} viewBox={`0 0 ${width} ${h * 2}`} fill="none">
      <path
        d={`M0 ${h} Q ${width * 0.125} 0, ${width * 0.25} ${h} T ${width * 0.5} ${h} T ${width * 0.75} ${h} T ${width} ${h}`}
        stroke={color}
        strokeWidth={h * 0.6}
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * "iPhone 17 📱 aldım." — ürün emoji'si cümlenin İÇİNDE, hafif açılı (sticker hissi).
 *
 * docs/03 §3 Zone A emoji'yi ayrı, ortalanmış bir bölge olarak tarif ediyordu; Oğuzhan'ın
 * B2 kararıyla değişti: tek başına ortalanmış emoji 1080px tuvalde etrafındaki boşluk
 * yüzünden küçük duruyordu, cümleye girince aynı piksel boyutu iri okunuyor.
 */
function ProductLine({
  name,
  emoji,
  textSize,
  emojiSize,
}: {
  name: string
  emoji: string
  textSize: number
  emojiSize: number
}) {
  const word: React.CSSProperties = {
    display: 'flex',
    fontFamily: FONT_DISPLAY,
    fontSize: textSize,
    fontWeight: 700,
    lineHeight: 1.15,
  }
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: textSize * 0.2,
      }}
    >
      <div style={word}>{name}</div>
      <div
        style={{
          display: 'flex',
          fontSize: emojiSize,
          lineHeight: 1,
          transform: 'rotate(9deg)',
        }}
      >
        {emoji}
      </div>
      <div style={word}>aldım.</div>
    </div>
  )
}

function WishRow({ item, s }: { item: WishItem; s: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20 * s,
        background: item.positive ? C.positiveSoft : C.card,
        borderRadius: 24 * s,
        padding: `${18 * s}px ${26 * s}px`,
        boxShadow: '0 2px 12px rgba(30,42,74,0.06)',
      }}
    >
      <div style={{ display: 'flex', fontSize: 46 * s, lineHeight: 1 }}>{item.emoji}</div>

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 6 * s }}>
        <div
          style={{
            display: 'flex',
            fontSize: 34 * s,
            fontWeight: 600,
            color: item.positive ? C.positiveInk : C.ink,
            lineHeight: 1.25,
          }}
        >
          {item.text}
        </div>
        {item.tag ? (
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: 6 * s,
              background: C.chipBg,
              color: C.chipInk,
              fontSize: 22 * s,
              fontWeight: 600,
              padding: `${5 * s}px ${14 * s}px`,
              borderRadius: 999,
            }}
          >
            {`${item.tag.emoji} ${item.tag.name}`}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          fontFamily: FONT_UI,
          fontSize: 34 * s,
          fontWeight: 700,
          color: item.positive ? C.positive : C.ink,
        }}
      >
        {formatTL(item.amount)}
      </div>
    </div>
  )
}

export function ShareCard({ format = 'story', data, scale = 1 }: Props) {
  const f = FORMATS[format]
  const { visible, overflow } = fitItems(data.items, format)
  const isOg = format === 'og'

  // docs/03 §4: Liste kısa ise (3 satır) Zone B/C fontları %10 büyür — görsel boş durmasın.
  const roomy = !isOg && data.items.length <= 3
  const s = isOg ? 0.62 : format === 'post' ? 0.82 : 1 // format ölçek katsayısı
  const hero = s * (roomy ? 1.1 : 1)

  // Şok satırı tek satırda kalmalı: rakam büyüdükçe (1.240.000 gibi) taşmasın diye küçülür.
  // Kaba ama yeterli — asıl ölçüm satori'de de tarayıcıda da yapılamıyor.
  const shockText = `Bunun ${formatTL(data.totalTax)}'si`
  const shockSize = 110 * hero * Math.min(1, 18 / shockText.length)

  const shell: React.CSSProperties = {
    width: f.w,
    height: f.h,
    display: 'flex',
    flexDirection: 'column',
    background: C.bg,
    color: C.ink,
    fontFamily: FONT_UI,
    overflow: 'hidden',
    transform: scale === 1 ? undefined : `scale(${scale})`,
    transformOrigin: 'top left',
  }

  // ─── OG (1200×630): yatay. Sol = şok, sağ = liste. docs/03 §1 "kompakt versiyon".
  if (isOg) {
    return (
      <div style={{ ...shell, flexDirection: 'row', padding: 48 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: 520,
            paddingRight: 40,
          }}
        >
          <ProductLine name={data.product.name} emoji={data.product.emoji} textSize={32} emojiSize={84} />
          <div
            style={{
              display: 'flex',
              fontFamily: FONT_DISPLAY,
              fontSize: 38,
              fontWeight: 800,
              color: C.ink,
              lineHeight: 1.15,
              marginTop: 16,
            }}
          >
            {`${formatTL(data.retailPrice)} ödedim.`}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              color: C.accent,
              marginTop: 12,
              letterSpacing: '-0.025em',
              lineHeight: 1.06,
            }}
          >
            <div style={{ display: 'flex', fontSize: 60 }}>{`Bunun ${formatTL(data.totalTax)}'si`}</div>
            <div style={{ display: 'flex', fontSize: 26, lineHeight: 1.25, marginTop: 6 }}>
              {`${taxComponentsLine(data.taxComponents)} 💸`}
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 18 }}>
            <WavyUnderline width={300} color={C.accent} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: FONT_DISPLAY,
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 14,
            }}
          >
            ✨ Şunlar da benim olabilirdi:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map((item, i) => (
              <WishRow key={i} item={item} s={0.62} />
            ))}
            {overflow > 0 ? (
              <div style={{ display: 'flex', fontSize: 24, color: C.muted, paddingLeft: 12 }}>
                {`➕ ve ${overflow} şey daha…`}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 600, color: C.inkSoft, marginTop: 18 }}>
            benimolabilirdi.com
          </div>
        </div>
      </div>
    )
  }

  // ─── Story (1080×1920) / Post (1080×1080): dikey, Zone A–F (docs/03 §3)
  return (
    <div style={{ ...shell, padding: `${72 * s}px ${56 * s}px ${44 * s}px` }}>
      {/* Zone A+B — hikâye (emoji artık cümlenin içinde, ayrı bölge değil) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Crescendo: sakin giriş → tansiyon yükselir → feryat.
            Boyut ve ağırlık basamak basamak çıkar: 52 → 64 → 88. */}
        <ProductLine
          name={data.product.name}
          emoji={data.product.emoji}
          textSize={52 * hero}
          emojiSize={130 * hero}
        />
        <div
          style={{
            display: 'flex',
            fontFamily: FONT_DISPLAY,
            fontSize: 64 * hero,
            fontWeight: 800,
            color: C.ink,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
            marginTop: 30 * s,
          }}
        >
          {`${formatTL(data.retailPrice)} ödedim.`}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            color: C.accent,
            letterSpacing: '-0.025em',
            lineHeight: 1.06,
            marginTop: 24 * s,
          }}
        >
          <div style={{ display: 'flex', fontSize: shockSize }}>
            {`Bunun ${formatTL(data.totalTax)}'si`}
          </div>
          <div style={{ display: 'flex', fontSize: 44 * hero, lineHeight: 1.2, marginTop: 8 * s }}>
            {`${taxComponentsLine(data.taxComponents)} 💸`}
          </div>
        </div>
      </div>

      {/* Zone C — geçiş. "Vergimi zaten veriyorum" duruşu kasıtlı: proje vergi karşıtı
          değil, gizli yüke dikkat çekiyor (PRD §8 siyasi tarafsızlık). */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40 * s }}>
        <div style={{ display: 'flex', fontSize: 36 * hero, color: C.inkSoft, lineHeight: 1.3 }}>
          Ben zaten vergimi veriyorum.
        </div>
        <div style={{ display: 'flex', fontSize: 36 * hero, color: C.inkSoft, lineHeight: 1.3 }}>
          Bu yan vergiler olmasaydı…
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: FONT_DISPLAY,
            fontSize: 48 * hero,
            fontWeight: 800,
            marginTop: 8 * s,
            lineHeight: 1.2,
          }}
        >
          ✨ Şunlar da benim olabilirdi:
        </div>
        <div style={{ display: 'flex', marginTop: 2 * s }}>
          <WavyUnderline width={360 * s} color={C.accent} />
        </div>
      </div>

      {/* Zone D — hayal listesi */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 14 * s, marginTop: 28 * s }}>
        {visible.map((item, i) => (
          <WishRow key={i} item={item} s={s} />
        ))}
        {overflow > 0 ? (
          <div style={{ display: 'flex', fontSize: 30 * s, color: C.muted, paddingLeft: 18 * s, marginTop: 4 * s }}>
            {`➕ ve ${overflow} şey daha…`}
          </div>
        ) : null}
      </div>

      {/* Zone E — kalan */}
      {data.remaining > 0 ? (
        <div
          style={{
            display: 'flex',
            fontSize: 30 * s,
            fontStyle: 'italic',
            color: C.inkSoft,
            marginTop: 18 * s,
          }}
        >
          {`…ve cebimde hâlâ ${formatTL(data.remaining)} kalırdı 🥲`}
        </div>
      ) : null}

      {/* Zone F — footer. Dipnot PRD §8 gereği ZORUNLU, her görselde. */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 22 * s }}>
        <div style={{ display: 'flex', width: '100%', height: 1, background: C.hairline, marginBottom: 18 * s }} />
        <div style={{ display: 'flex', fontSize: 34 * s, fontWeight: 600, color: C.ink }}>
          benimolabilirdi.com
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 21 * s,
            color: C.muted,
            marginTop: 8 * s,
            textAlign: 'center',
          }}
        >
          fiyatlar temsilidir · ÖTV+KDV+fon dahil · hesap detayı sitede
        </div>
      </div>
    </div>
  )
}

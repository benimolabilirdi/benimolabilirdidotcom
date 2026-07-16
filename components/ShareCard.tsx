/**
 * ShareCard — projenin asıl çıktısı. Tek bileşen, dört format.
 * Yerleşim/tipografi: docs/07 §5 (kreşendo) · docs/06 §3 · docs/03.
 *
 * SATORI KURALLARI (CLAUDE.md: "ShareCard satori-uyumlu yazılacak"):
 *   - CSS değişkeni YOK. Renkler lib/share-card.ts'ten literal.
 *   - Çok çocuklu her div'de açık `display: flex`. Örtük blok yerleşimi yok.
 *   - grid/float YOK; `flex: 1` yerine flexGrow.
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

/** Dikey formatların punto ölçeği (üçü de 1080 geniş; kısalan yükseklik için küçülür). */
const VSCALE: Record<ShareCardFormat, number> = { story: 1, post: 0.86, square: 0.72, og: 1 }

/**
 * "ÖTV + KDV + TRT payı + fondu" — bileşenler VERİDEN gelir (docs/07 §4), sabit değil.
 * 'vergi' kelimesi ana vurguda kullanılmıyor (B2): kalemleri saymak daha dürüst ve güçlü.
 * Son kaleme Türkçe ek fiili doğru ünlü uyumuyla eklenir.
 */
function taxComponentsLine(components: string[]): string {
  if (components.length === 0) return 'hiç vergi yoktu'
  return components.join(' + ') + pastCopula(components[components.length - 1])
}

/** docs/03 §3 Zone C: vurgu kelimesinin altında el çizimi dalgalı çizgi. */
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
 * "iPhone 17 📱 aldım." — ürün emoji'si cümlenin içinde, hafif açılı (Oğuzhan, B2).
 * Tek başına ortalanmış emoji 1080px tuvalde küçük duruyordu; cümlede aynı piksel iri okunur.
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
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: textSize * 0.2 }}>
      <div style={word}>{name}</div>
      <div style={{ display: 'flex', fontSize: emojiSize, lineHeight: 1, transform: 'rotate(9deg)' }}>
        {emoji}
      </div>
      <div style={word}>aldım.</div>
    </div>
  )
}

/**
 * Kreşendo şok bloğu (docs/07 §5): "Bunun" (destek) → dev rakam (nowrap) → bileşen listesi.
 * Rakam ASLA satır kırılmaz (R3); sığmazsa punto düşer. Rakam DM Sans tabular (docs/06 §2).
 */
function ShockBlock({
  totalTax,
  components,
  s,
}: {
  totalTax: number
  components: string[]
  s: number
}) {
  const numberText = `${formatTL(totalTax)}'si`
  // nowrap rakam taşmasın diye kabaca punto düşür (metin ölçümü satori/tarayıcıda yok).
  const numberSize = 150 * s * Math.min(1, 13 / numberText.length)
  const support: React.CSSProperties = {
    display: 'flex',
    fontFamily: FONT_DISPLAY,
    fontSize: 44 * s,
    fontWeight: 700,
    color: C.accentDeep,
    lineHeight: 1.2,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22 * s }}>
      <div style={support}>Bunun</div>
      <div
        style={{
          display: 'flex',
          fontFamily: FONT_UI,
          fontVariantNumeric: 'tabular-nums',
          fontSize: numberSize,
          fontWeight: 800,
          color: C.accent,
          letterSpacing: '-0.03em',
          lineHeight: 1.02,
          whiteSpace: 'nowrap',
        }}
      >
        {numberText}
      </div>
      <div style={{ ...support, marginTop: 6 * s }}>{`${taxComponentsLine(components)} 💸`}</div>
    </div>
  )
}

/** docs/07 §5 kapanış: DS yeşil kutu. kalan < 40 TL → 🥨 (simit parası), değilse 🎈. */
function PocketBox({ remaining, s }: { remaining: number; s: number }) {
  const tiny = remaining < 40
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16 * s,
        background: C.positiveSoft,
        borderRadius: 28 * s,
        padding: `${24 * s}px ${30 * s}px`,
      }}
    >
      <div style={{ display: 'flex', fontSize: 46 * s, lineHeight: 1 }}>{tiny ? '🥨' : '🎈'}</div>
      <div
        style={{
          display: 'flex',
          fontFamily: FONT_DISPLAY,
          fontSize: 34 * s,
          fontWeight: 700,
          color: C.positiveInk,
          lineHeight: 1.25,
        }}
      >
        {`Cebimde ${formatTL(remaining)} kaldı${tiny ? ' — simit parası' : ''}`}
      </div>
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
          fontVariantNumeric: 'tabular-nums',
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

  // ─── OG (1200×630): yatay, kompakt. Sol = kreşendo, sağ = liste (docs/06 §3 D5).
  if (format === 'og') {
    return (
      <div style={{ ...shell, flexDirection: 'row', padding: 48 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: 560,
            paddingRight: 40,
          }}
        >
          <ProductLine name={data.product.name} emoji={data.product.emoji} textSize={30} emojiSize={72} />
          <div
            style={{
              display: 'flex',
              fontFamily: FONT_DISPLAY,
              fontSize: 40,
              fontWeight: 800,
              color: C.ink,
              lineHeight: 1.1,
              marginTop: 12,
            }}
          >
            {`${formatTL(data.retailPrice)} ödedim.`}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: FONT_UI,
                fontVariantNumeric: 'tabular-nums',
                fontSize: 76,
                fontWeight: 800,
                color: C.accent,
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
                whiteSpace: 'nowrap',
              }}
            >
              {`Bunun ${formatTL(data.totalTax)}'si`}
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: FONT_DISPLAY,
                fontSize: 27,
                fontWeight: 700,
                color: C.accentDeep,
                lineHeight: 1.2,
                marginTop: 4,
              }}
            >
              {`${taxComponentsLine(data.taxComponents)} 💸`}
            </div>
          </div>
          {data.personaLine ? (
            <div
              style={{
                display: 'flex',
                fontFamily: FONT_DISPLAY,
                fontSize: 24,
                fontStyle: 'italic',
                fontWeight: 600,
                color: C.inkSoft,
                lineHeight: 1.25,
                marginTop: 12,
              }}
            >
              {data.personaLine}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 800, marginBottom: 14 }}>
            ✨ Şunlar da benim olabilirdi:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {visible.map((item, i) => (
              <WishRow key={i} item={item} s={0.6} />
            ))}
            {overflow > 0 ? (
              <div style={{ display: 'flex', fontSize: 24, color: C.muted, paddingLeft: 12 }}>
                {`➕ ve ${overflow} şey daha…`}
              </div>
            ) : null}
          </div>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 600, color: C.inkSoft, marginTop: 16 }}>
            benimolabilirdi.com
          </div>
        </div>
      </div>
    )
  }

  // ─── Story / Post (4:5) / Kare (1:1): dikey kreşendo (docs/07 §5)
  const s = VSCALE[format]
  const roomy = data.items.length <= 3 ? 1.08 : 1 // kısa listede üst blok bir tık büyür
  const hero = s * roomy

  return (
    <div style={{ ...shell, padding: `${64 * s}px ${56 * s}px ${44 * s}px` }}>
      {/* p1–p3 — kreşendo: fısıltı → yükseliş → zirve (mercan) */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <ProductLine
          name={data.product.name}
          emoji={data.product.emoji}
          textSize={44 * hero}
          emojiSize={118 * hero}
        />
        <div
          style={{
            display: 'flex',
            fontFamily: FONT_DISPLAY,
            fontSize: 64 * hero,
            fontWeight: 800,
            color: C.ink,
            lineHeight: 1.12,
            letterSpacing: '-0.01em',
            marginTop: 26 * s,
          }}
        >
          {`${formatTL(data.retailPrice)} ödedim.`}
        </div>
        <ShockBlock totalTax={data.totalTax} components={data.taxComponents} s={hero} />
      </div>

      {/* p4 — persona (buruk iç ses, zirveden sonra). Yoksa hiç basılmaz (docs/07 §1). */}
      {data.personaLine ? (
        <div
          style={{
            display: 'flex',
            fontFamily: FONT_DISPLAY,
            fontSize: 40 * s,
            fontStyle: 'italic',
            fontWeight: 600,
            color: C.inkSoft,
            lineHeight: 1.3,
            marginTop: 26 * s,
          }}
        >
          {data.personaLine}
        </div>
      ) : null}

      {/* p5 — liste başlığı + dalgalı çizgi */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 32 * s }}>
        <div
          style={{
            display: 'flex',
            fontFamily: FONT_DISPLAY,
            fontSize: 48 * hero,
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          ✨ Şunlar da benim olabilirdi:
        </div>
        <div style={{ display: 'flex', marginTop: 2 * s }}>
          <WavyUnderline width={380 * s} color={C.accent} />
        </div>
      </div>

      {/* hayal listesi */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 14 * s, marginTop: 26 * s }}>
        {visible.map((item, i) => (
          <WishRow key={i} item={item} s={s} />
        ))}
        {overflow > 0 ? (
          <div style={{ display: 'flex', fontSize: 30 * s, color: C.muted, paddingLeft: 18 * s, marginTop: 4 * s }}>
            {`➕ ve ${overflow} şey daha…`}
          </div>
        ) : null}
      </div>

      {/* kalan — yeşil kutu */}
      {data.remaining > 0 ? (
        <div style={{ display: 'flex', marginTop: 18 * s }}>
          <PocketBox remaining={data.remaining} s={s} />
        </div>
      ) : null}

      {/* footer — dipnot PRD §8 gereği her görselde zorunlu */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 * s }}>
        <div style={{ display: 'flex', width: '100%', height: 1, background: C.hairline, marginBottom: 16 * s }} />
        <div style={{ display: 'flex', fontSize: 34 * s, fontWeight: 600, color: C.ink }}>
          benimolabilirdi.com
        </div>
        <div style={{ display: 'flex', fontSize: 21 * s, color: C.muted, marginTop: 8 * s, textAlign: 'center' }}>
          fiyatlar temsilidir · ÖTV+KDV+fon dahil · hesap detayı sitede
        </div>
      </div>
    </div>
  )
}

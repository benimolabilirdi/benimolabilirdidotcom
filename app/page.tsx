/**
 * Geçici ana sayfa placeholder — asıl landing Faz C1'de yazılacak (docs/01 §3.1).
 * Şimdilik markayı gösterir, kabul GATE'ine link verir.
 */
export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, letterSpacing: '-0.02em' }}>
        benim<span style={{ color: '#E85D4A' }}>olabilirdi</span>
      </div>
      <p style={{ color: '#5B6F9E', fontSize: 18, maxWidth: 420, lineHeight: 1.5 }}>
        Ödediğin verginin karşılığında neler alabilirdin?
      </p>
      <p style={{ color: '#8A99BB', fontSize: 14 }}>Yakında burada. Kâr amacı yok, sadece merak.</p>
    </main>
  )
}

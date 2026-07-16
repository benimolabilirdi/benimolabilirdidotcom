// Landing — value prop + "Ne aldın?" CTA + live tax counter.
const { Button: BOButton, LiveCounter: BOLiveCounter } = window.BenimolabilirdiDesignSystem_717d58;

function LandingScreen({ onStart }) {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "var(--bg-page)", padding: "28px 22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--navy-800)", letterSpacing: "-.02em" }}>
            benim<span style={{ color: "var(--coral-500)" }}>olabilirdi</span>
          </span>
          <svg width="18" height="18" viewBox="0 0 44 44" fill="none" style={{ color: "var(--coral-500)", flex: "none", marginTop: "0.1em" }}><circle cx="15.5" cy="18" r="2.8" fill="currentColor" /><circle cx="28.5" cy="18" r="2.8" fill="currentColor" /><path d="M13 31 Q22 24 31 31" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>
        </span>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>kâr amacı yok</span>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, padding: "8px 0" }}>
        <div style={{ alignSelf: "flex-start" }}>
          <BOLiveCounter value={48213905} />
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 40, lineHeight: 1.05, letterSpacing: "-.03em", color: "var(--navy-800)", margin: 0 }}>
          Ödediğin verginin karşılığında{" "}
          <span style={{ position: "relative", color: "var(--coral-500)", whiteSpace: "nowrap" }}>
            neler alabilirdin?
            <svg style={{ position: "absolute", left: 0, bottom: -6, width: "100%", height: 8 }} viewBox="0 0 260 8" preserveAspectRatio="none"><path d="M2 5C60 1 130 1 190 4S250 7 258 3" stroke="var(--coral-400)" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
          </span>
        </h1>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, lineHeight: 1.5, color: "var(--text-muted)", margin: 0, maxWidth: 320 }}>
          Bir ürün seç, içindeki vergiyi gör — ve o parayla neler alabileceğini hayal et. 30 saniye, hepsi bu.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <BOButton variant="primary" size="lg" fullWidth onClick={onStart}>Ne aldın? →</BOButton>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, textAlign: "center", color: "var(--text-faint)", margin: 0 }}>
          Hiçbir verini saklamıyoruz. Sadece merak. ✨
        </p>
      </div>
    </div>
  );
}
window.LandingScreen = LandingScreen;

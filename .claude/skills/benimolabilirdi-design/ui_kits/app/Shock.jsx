// Shock screen — navy surface, count-up tax figure, breakdown. Emotional peak.
const { CountUpNumber: BOCount, TaxBreakdown: BOBreak, Button: BOBtn3, Badge: BOBadge3 } = window.BenimolabilirdiDesignSystem_717d58;

function ShockScreen({ product, onDream }) {
  const tax = product.price * product.taxRate;
  const pct = Math.round(product.taxRate * 100);
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "var(--surface-navy)", color: "var(--text-on-dark)", padding: "30px 22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 30 }}>{product.emoji}</span>
        <div>
          <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 16 }}>{product.name}</div>
          <div style={{ fontFamily: "var(--font-num)", fontSize: 13, color: "var(--navy-300)" }}>{window.boFmt(product.price)} ödedin</div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6, padding: "16px 0" }}>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--navy-300)" }}>Bunun vergisi:</span>
        <BOCount value={tax} color="var(--coral-400)" size="60px" />
        <div style={{ marginTop: 8 }}><BOBadge3 tone="accent">ödediğinin %{pct}'i vergi</BOBadge3></div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, lineHeight: 1.35, color: "var(--cream-50)", margin: "14px 0 0", maxWidth: 300 }}>
          Ah be. Bu parayla neler alabilirdin, hesaplayalım mı?
        </p>
      </div>

      <div style={{ background: "var(--surface-navy-soft)", borderRadius: "var(--r-lg)", padding: 16, marginBottom: 16 }}>
        <BOBreak paid={product.price} tax={tax} />
      </div>

      <BOBtn3 variant="primary" size="lg" fullWidth onClick={() => onDream(tax)}>Bu parayla ne alırdım? →</BOBtn3>
    </div>
  );
}
window.ShockScreen = ShockScreen;

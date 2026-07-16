// ShareCard — the product's actual output. Three formats, rendered at true pixel
// size then scaled. Warm cream, big shock number, the dream list, pocket line.
// Used by the Share screen (scaled preview) and the ShareCard template.

const BO_FORMATS = {
  story:  { w: 1080, h: 1920, label: "Story", ratio: "9:16" },
  post:   { w: 1080, h: 1350, label: "Post",  ratio: "4:5" },
  square: { w: 1080, h: 1080, label: "Kare",  ratio: "1:1" },
};

function ShareCard({ format = "story", data, scale = 1 }) {
  const f = BO_FORMATS[format];
  const d = data || {};
  const chosen = d.chosen || [];
  const compact = format === "square";
  const fmt = window.boFmt || ((n) => "₺" + n);

  return (
    <div style={{
      width: f.w, height: f.h, transform: `scale(${scale})`, transformOrigin: "top left",
      background: "var(--cream-100)", position: "relative", overflow: "hidden",
      fontFamily: "var(--font-ui)", color: "var(--navy-800)",
      display: "flex", flexDirection: "column",
      padding: compact ? "70px 80px" : "96px 88px",
    }}>
      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "inline-flex", alignItems: "flex-start", gap: 14 }}>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, letterSpacing: "-.02em" }}>
            benim<span style={{ color: "var(--coral-500)" }}>olabilirdi</span>
          </span>
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none" style={{ color: "var(--coral-500)", flex: "none", marginTop: "0.08em" }}><circle cx="15.5" cy="18" r="2.8" fill="currentColor" /><circle cx="28.5" cy="18" r="2.8" fill="currentColor" /><path d="M13 31 Q22 24 31 31" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>
        </span>
        <span style={{ fontSize: 44 }}>{d.product?.emoji || "🧾"}</span>
      </div>

      {/* shock */}
      <div style={{ marginTop: compact ? 44 : 80 }}>
        <div style={{ fontSize: 34, fontWeight: 600, color: "var(--navy-500)" }}>
          {d.product?.name || "Bir ürün"} aldım, vergisi:
        </div>
        <div style={{ fontFamily: "var(--font-num)", fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: compact ? 130 : 168, lineHeight: 1, letterSpacing: "-.03em", color: "var(--coral-500)", margin: "10px 0 0" }}>
          {fmt(Math.round(d.tax || 0))}
        </div>
        <div style={{ display: "inline-block", marginTop: 20, background: "var(--accent-soft)", color: "var(--coral-700)", fontWeight: 700, fontSize: 30, padding: "12px 26px", borderRadius: 999 }}>
          ödediğimin %{d.pct ?? 0}'i
        </div>
      </div>

      {/* dream list */}
      <div style={{ marginTop: compact ? 40 : 76, flex: 1 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 40, color: "var(--navy-800)" }}>
          Bununla alabilirdim ✨
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: compact ? 14 : 22, marginTop: 28 }}>
          {chosen.slice(0, compact ? 3 : 5).map((it, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, background: "#fff", borderRadius: 28, padding: "22px 30px", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ fontSize: 54 }}>{it.product.emoji}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 40 }}>{it.product.name}{it.qty > 1 ? ` ×${it.qty}` : ""}</span>
              <span style={{ fontFamily: "var(--font-num)", fontWeight: 700, fontSize: 36, color: "var(--navy-500)" }}>{fmt(it.product.price * it.qty)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* pocket line */}
      <div style={{ marginTop: compact ? 30 : 60, background: "var(--green-100)", borderRadius: 32, padding: compact ? "28px 34px" : "40px 44px", display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontSize: 52 }}>{(d.remaining ?? 0) < 40 ? "🥨" : "🎈"}</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: compact ? 34 : 42, color: "var(--green-700)", lineHeight: 1.2 }}>
          Cebimde {fmt(Math.round(d.remaining ?? 0))} kaldı{(d.remaining ?? 0) < 40 ? " — simit parası" : ""}
        </span>
      </div>

      {/* footer */}
      <div style={{ marginTop: 40, textAlign: "center", fontSize: 28, fontWeight: 600, color: "var(--navy-400)" }}>
        benimolabilirdi.com · kâr amacı yok
      </div>
    </div>
  );
}
window.ShareCard = ShareCard;
window.BO_FORMATS = BO_FORMATS;

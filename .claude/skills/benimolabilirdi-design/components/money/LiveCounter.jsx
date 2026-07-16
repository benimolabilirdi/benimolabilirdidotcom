import React from "react";

function fmt(n) { return n.toLocaleString("tr-TR"); }

/**
 * Landing-page live ticker: "₺X vergi hesaplandı". Gently increments so the
 * counter feels alive. Navy pill with a soft pulsing dot.
 */
export function LiveCounter({ value, label = "vergi hesaplandı", tickInterval = 2500, style = {} }) {
  const [n, setN] = React.useState(value);
  React.useEffect(() => {
    const id = setInterval(() => setN((v) => v + Math.floor(Math.random() * 900 + 100)), tickInterval);
    return () => clearInterval(id);
  }, [tickInterval]);
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      background: "var(--surface-navy)", color: "var(--text-on-dark)",
      borderRadius: "var(--r-pill)", padding: "9px 18px", boxShadow: "var(--shadow-sm)",
      fontFamily: "var(--font-ui)", ...style,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green-400)", boxShadow: "0 0 0 0 rgba(78,158,122,.6)", animation: "bo-pulse 2s var(--ease-out) infinite" }} />
      <span style={{ fontFamily: "var(--font-num)", fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: "var(--text-lg)" }}>₺{fmt(n)}</span>
      <span style={{ fontSize: "var(--text-sm)", color: "var(--text-on-dark-muted)", fontWeight: 500 }}>{label}</span>
      <style>{`@keyframes bo-pulse{0%{box-shadow:0 0 0 0 rgba(78,158,122,.5)}70%{box-shadow:0 0 0 7px rgba(78,158,122,0)}100%{box-shadow:0 0 0 0 rgba(78,158,122,0)}}`}</style>
    </div>
  );
}

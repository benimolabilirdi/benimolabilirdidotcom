import React from "react";

function fmt(n) { return "₺" + n.toLocaleString("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }

/**
 * Depleting budget meter — the "spend the tax money" wallet metaphor.
 * Pinned at the top of the dream loop. Bar shrinks as `remaining` drops;
 * turns coral when nearly empty.
 */
export function BudgetMeter({ total, remaining, label = "Kalan bütçe", style = {} }) {
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100));
  const low = pct < 20;
  return (
    <div style={{
      background: "var(--surface-card)", borderRadius: "var(--r-lg)",
      padding: "14px 18px", boxShadow: "var(--shadow-md)", ...style,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
        <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-num)", fontVariantNumeric: "tabular-nums", fontWeight: 800, fontSize: "var(--text-2xl)", color: low ? "var(--coral-500)" : "var(--green-600)" }}>{fmt(remaining)}</span>
      </div>
      <div style={{ height: 12, borderRadius: "var(--r-pill)", background: "var(--surface-sunken)", overflow: "hidden", boxShadow: "var(--inset-sm)" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: low ? "var(--coral-500)" : "var(--green-500)",
          borderRadius: "var(--r-pill)",
          transition: "width var(--dur-slow) var(--ease-out), background var(--dur-base) var(--ease-out)",
        }} />
      </div>
    </div>
  );
}

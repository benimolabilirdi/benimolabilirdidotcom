import React from "react";

function fmt(n) { return "₺" + n.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

/**
 * The tax-breakdown block: paid → tax (coral) → tax-free (green), with a
 * proportional bar showing how much of the price was tax.
 */
export function TaxBreakdown({ paid, tax, style = {} }) {
  const taxFree = paid - tax;
  const taxPct = Math.round((tax / paid) * 100);
  return (
    <div style={{ fontFamily: "var(--font-ui)", ...style }}>
      <div style={{ display: "flex", height: 14, borderRadius: "var(--r-pill)", overflow: "hidden", boxShadow: "var(--inset-sm)" }}>
        <div style={{ width: `${100 - taxPct}%`, background: "var(--green-400)" }} />
        <div style={{ width: `${taxPct}%`, background: "var(--coral-500)" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 16 }}>
        <Row label="Ödediğin" value={fmt(paid)} tone="var(--text-body)" bold />
        <Row label="Bunun vergisi" value={"− " + fmt(tax)} tone="var(--coral-600)" bold badge={`%${taxPct}`} />
        <div style={{ height: 1, background: "var(--border-soft)", margin: "8px 0" }} />
        <Row label="Vergisiz olsaydı" value={fmt(taxFree)} tone="var(--green-600)" bold />
      </div>
    </div>
  );
}
function Row({ label, value, tone, bold, badge }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "var(--text-base)", color: "var(--text-muted)", fontWeight: 500 }}>
        {label}
        {badge && <span style={{ fontSize: "var(--text-2xs)", fontWeight: 700, background: "var(--accent-soft)", color: "var(--coral-700)", padding: "2px 7px", borderRadius: "var(--r-pill)" }}>{badge}</span>}
      </span>
      <span style={{ fontFamily: "var(--font-num)", fontVariantNumeric: "tabular-nums", fontSize: "var(--text-lg)", fontWeight: bold ? 700 : 500, color: tone }}>{value}</span>
    </div>
  );
}

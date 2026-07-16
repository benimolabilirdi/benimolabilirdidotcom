import React from "react";

function fmt(n) { return "₺" + n.toLocaleString("tr-TR"); }

/** A chosen dream item row: emoji + name + count stepper + price. Used in the dream list. */
export function WishItem({ emoji, name, price, qty = 1, onAdd, onRemove, style = {} }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      background: "var(--surface-card)", borderRadius: "var(--r-md)",
      padding: "10px 14px", boxShadow: "var(--shadow-sm)", ...style,
    }}>
      <span style={{ fontSize: 26 }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "var(--text-base)", color: "var(--text-body)" }}>{name}</div>
        <div style={{ fontFamily: "var(--font-num)", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{fmt(price)}{qty > 1 ? ` × ${qty}` : ""}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Stepper onClick={onRemove} label="−" />
        <span style={{ fontFamily: "var(--font-num)", fontWeight: 700, fontSize: "var(--text-base)", minWidth: 16, textAlign: "center" }}>{qty}</span>
        <Stepper onClick={onAdd} label="+" accent />
      </div>
    </div>
  );
}
function Stepper({ onClick, label, accent }) {
  return (
    <button onClick={onClick} style={{
      width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
      fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 18, lineHeight: 1,
      background: accent ? "var(--accent)" : "var(--surface-sunken)",
      color: accent ? "var(--on-accent)" : "var(--text-body)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{label}</button>
  );
}

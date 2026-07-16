import React from "react";

/** Selectable pill chip — category / tag filter. Emoji + label. */
export function Chip({ children, emoji, selected = false, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "var(--text-sm)",
      padding: "9px 15px", borderRadius: "var(--r-pill)", cursor: "pointer",
      border: selected ? "1.5px solid var(--accent)" : "1.5px solid var(--border-soft)",
      background: selected ? "var(--accent-soft)" : "var(--surface-card)",
      color: selected ? "var(--coral-700)" : "var(--text-body)",
      transition: "all var(--dur-fast) var(--ease-out)",
      ...style,
    }}>
      {emoji && <span style={{ fontSize: "1.15em" }}>{emoji}</span>}
      {children}
    </button>
  );
}

import React from "react";

/**
 * Emoji category tile for the picker grid. Big emoji + Turkish label on a
 * white paper card; lifts and rings coral when selected.
 */
export function CategoryTile({ emoji, label, selected = false, onClick, style = {} }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
        background: "var(--surface-card)", borderRadius: "var(--r-lg)", cursor: "pointer",
        padding: "18px 8px", aspectRatio: "1 / 1", width: "100%",
        border: selected ? "2px solid var(--accent)" : "2px solid transparent",
        boxShadow: hover || selected ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "all var(--dur-base) var(--ease-out)", ...style,
      }}
    >
      <span style={{ fontSize: 34, lineHeight: 1 }}>{emoji}</span>
      <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: "var(--text-sm)", color: "var(--text-body)" }}>{label}</span>
    </button>
  );
}

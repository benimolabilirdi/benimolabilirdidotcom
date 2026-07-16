import React from "react";

/** Small status label. Coral / green / gold / neutral, soft-filled pill. */
export function Badge({ children, tone = "neutral", style = {} }) {
  const tones = {
    neutral: { background: "var(--surface-sunken)", color: "var(--text-muted)" },
    accent: { background: "var(--accent-soft)", color: "var(--coral-700)" },
    positive: { background: "var(--positive-soft)", color: "var(--green-700)" },
    sparkle: { background: "var(--sparkle-soft)", color: "#8a6417" },
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "var(--text-xs)",
      letterSpacing: "var(--ls-snug)", padding: "5px 11px", borderRadius: "var(--r-pill)",
      ...tones[tone], ...style,
    }}>{children}</span>
  );
}

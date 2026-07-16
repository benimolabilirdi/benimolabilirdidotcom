import React from "react";

/**
 * Primary action. Pill-shaped, warm. Coral by default (the CTA / "tax" side),
 * green for positive confirmations, plus secondary/ghost.
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: "var(--text-sm)", minHeight: 36 },
    md: { padding: "12px 22px", fontSize: "var(--text-base)", minHeight: "var(--touch-min)" },
    lg: { padding: "16px 28px", fontSize: "var(--text-lg)", minHeight: 56 },
  };
  const variants = {
    primary: { background: "var(--accent)", color: "var(--on-accent)", boxShadow: "var(--glow-accent)" },
    positive: { background: "var(--positive)", color: "var(--on-positive)", boxShadow: "var(--glow-positive)" },
    secondary: { background: "var(--surface-card)", color: "var(--text-body)", boxShadow: "var(--shadow-sm)", border: "1.5px solid var(--border-soft)" },
    ghost: { background: "transparent", color: "var(--accent)", boxShadow: "none" },
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverBg = { primary: "var(--accent-hover)", positive: "var(--positive-hover)", secondary: "var(--cream-50)", ghost: "var(--accent-soft)" };

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontFamily: "var(--font-ui)", fontWeight: 700, lineHeight: 1,
        borderRadius: "var(--r-pill)", border: "none", cursor: disabled ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : "auto",
        transition: "transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        transform: press ? "scale(0.97)" : "scale(1)",
        opacity: disabled ? 0.45 : 1,
        ...sizes[size], ...variants[variant],
        ...(hover && !disabled ? { background: hoverBg[variant] } : {}),
        ...style,
      }}
      {...rest}
    >
      {iconLeft}{children}{iconRight}
    </button>
  );
}

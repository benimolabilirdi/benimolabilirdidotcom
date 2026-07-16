import React from "react";

/** Turkish currency format: ₺1.240,50 */
function formatTRY(n, decimals = 2) {
  return n.toLocaleString("tr-TR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/**
 * The shock mechanism. Counts up from 0 to `value` on mount (ease-out),
 * tabular-nums so it never jitters. Use big + coral for the tax figure.
 */
export function CountUpNumber({
  value, prefix = "₺", suffix = "", decimals = 2,
  duration = 1400, size = "var(--text-6xl)", color = "var(--coral-500)",
  weight = 800, animate = true, style = {},
}) {
  const [display, setDisplay] = React.useState(animate ? 0 : value);
  React.useEffect(() => {
    if (!animate) { setDisplay(value); return; }
    let raf, start;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, animate]);
  return (
    <span style={{
      fontFamily: "var(--font-num)", fontVariantNumeric: "tabular-nums",
      fontWeight: weight, fontSize: size, lineHeight: 1, letterSpacing: "var(--ls-tight)",
      color, ...style,
    }}>{prefix}{formatTRY(display, decimals)}{suffix}</span>
  );
}

/* @ds-bundle: {"format":4,"namespace":"BenimolabilirdiDesignSystem_717d58","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"SearchInput","sourcePath":"components/core/SearchInput.jsx"},{"name":"CategoryTile","sourcePath":"components/flow/CategoryTile.jsx"},{"name":"SparkleBurst","sourcePath":"components/flow/SparkleBurst.jsx"},{"name":"StepIndicator","sourcePath":"components/flow/StepIndicator.jsx"},{"name":"WishItem","sourcePath":"components/flow/WishItem.jsx"},{"name":"BudgetMeter","sourcePath":"components/money/BudgetMeter.jsx"},{"name":"CountUpNumber","sourcePath":"components/money/CountUpNumber.jsx"},{"name":"LiveCounter","sourcePath":"components/money/LiveCounter.jsx"},{"name":"TaxBreakdown","sourcePath":"components/money/TaxBreakdown.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"7f003ab2817a","components/core/Button.jsx":"aa23132f6755","components/core/Card.jsx":"31a0333727f9","components/core/Chip.jsx":"7ea6c5c1b366","components/core/SearchInput.jsx":"d8120cb77464","components/flow/CategoryTile.jsx":"2552a5288df5","components/flow/SparkleBurst.jsx":"85bb5a6aaaeb","components/flow/StepIndicator.jsx":"a087760dafb2","components/flow/WishItem.jsx":"ba8c6dd48ba1","components/money/BudgetMeter.jsx":"2e2eaaf0315b","components/money/CountUpNumber.jsx":"17fe0ff33a1f","components/money/LiveCounter.jsx":"7df8797b9e5c","components/money/TaxBreakdown.jsx":"94c6d8bad170","ui_kits/app/App.jsx":"bceadf93330e","ui_kits/app/Dream.jsx":"cb3cf8cbe942","ui_kits/app/How.jsx":"81126f335782","ui_kits/app/Landing.jsx":"2a08bfe58293","ui_kits/app/Picker.jsx":"acc6106db640","ui_kits/app/Share.jsx":"9cc568ffd9f2","ui_kits/app/Shock.jsx":"8c2e60412645","ui_kits/app/data.js":"a88528fa7843","ui_kits/sharecard/ShareCard.jsx":"c8b14e5141b3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BenimolabilirdiDesignSystem_717d58 = window.BenimolabilirdiDesignSystem_717d58 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
/** Small status label. Coral / green / gold / neutral, soft-filled pill. */
function Badge({
  children,
  tone = "neutral",
  style = {}
}) {
  const tones = {
    neutral: {
      background: "var(--surface-sunken)",
      color: "var(--text-muted)"
    },
    accent: {
      background: "var(--accent-soft)",
      color: "var(--coral-700)"
    },
    positive: {
      background: "var(--positive-soft)",
      color: "var(--green-700)"
    },
    sparkle: {
      background: "var(--sparkle-soft)",
      color: "#8a6417"
    }
  };
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: "var(--text-xs)",
      letterSpacing: "var(--ls-snug)",
      padding: "5px 11px",
      borderRadius: "var(--r-pill)",
      ...tones[tone],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Primary action. Pill-shaped, warm. Coral by default (the CTA / "tax" side),
 * green for positive confirmations, plus secondary/ghost.
 */
function Button({
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
    sm: {
      padding: "8px 16px",
      fontSize: "var(--text-sm)",
      minHeight: 36
    },
    md: {
      padding: "12px 22px",
      fontSize: "var(--text-base)",
      minHeight: "var(--touch-min)"
    },
    lg: {
      padding: "16px 28px",
      fontSize: "var(--text-lg)",
      minHeight: 56
    }
  };
  const variants = {
    primary: {
      background: "var(--accent)",
      color: "var(--on-accent)",
      boxShadow: "var(--glow-accent)"
    },
    positive: {
      background: "var(--positive)",
      color: "var(--on-positive)",
      boxShadow: "var(--glow-positive)"
    },
    secondary: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      boxShadow: "var(--shadow-sm)",
      border: "1.5px solid var(--border-soft)"
    },
    ghost: {
      background: "transparent",
      color: "var(--accent)",
      boxShadow: "none"
    }
  };
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const hoverBg = {
    primary: "var(--accent-hover)",
    positive: "var(--positive-hover)",
    secondary: "var(--cream-50)",
    ghost: "var(--accent-soft)"
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      lineHeight: 1,
      borderRadius: "var(--r-pill)",
      border: "none",
      cursor: disabled ? "not-allowed" : "pointer",
      width: fullWidth ? "100%" : "auto",
      transition: "transform var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
      transform: press ? "scale(0.97)" : "scale(1)",
      opacity: disabled ? 0.45 : 1,
      ...sizes[size],
      ...variants[variant],
      ...(hover && !disabled ? {
        background: hoverBg[variant]
      } : {}),
      ...style
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** White paper card floating on the cream ground. Soft navy-tinted shadow, no border. */
function Card({
  children,
  padding = "var(--sp-5)",
  interactive = false,
  tone = "paper",
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    paper: {
      background: "var(--surface-card)",
      color: "var(--text-body)"
    },
    sunken: {
      background: "var(--surface-sunken)",
      color: "var(--text-body)"
    },
    navy: {
      background: "var(--surface-navy)",
      color: "var(--text-on-dark)"
    }
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      borderRadius: "var(--r-lg)",
      padding,
      boxShadow: interactive && hover ? "var(--shadow-lg)" : "var(--shadow-md)",
      transform: interactive && hover ? "translateY(-2px)" : "none",
      transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
      cursor: interactive ? "pointer" : "default",
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
/** Selectable pill chip — category / tag filter. Emoji + label. */
function Chip({
  children,
  emoji,
  selected = false,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontFamily: "var(--font-ui)",
      fontWeight: 600,
      fontSize: "var(--text-sm)",
      padding: "9px 15px",
      borderRadius: "var(--r-pill)",
      cursor: "pointer",
      border: selected ? "1.5px solid var(--accent)" : "1.5px solid var(--border-soft)",
      background: selected ? "var(--accent-soft)" : "var(--surface-card)",
      color: selected ? "var(--coral-700)" : "var(--text-body)",
      transition: "all var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, emoji && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "1.15em"
    }
  }, emoji), children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/SearchInput.jsx
try { (() => {
/** Rounded search field with a leading Lucide search glyph. Warm, sunken well. */
function SearchInput({
  value,
  onChange,
  placeholder = "Ara…",
  style = {}
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "var(--surface-card)",
      borderRadius: "var(--r-pill)",
      padding: "0 18px",
      height: "var(--touch-min)",
      border: focus ? "1.5px solid var(--focus-ring)" : "1.5px solid var(--border-soft)",
      boxShadow: focus ? "0 0 0 4px rgba(240,126,110,.18)" : "var(--shadow-xs)",
      transition: "all var(--dur-fast) var(--ease-out)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "var(--text-faint)",
    strokeWidth: "2.2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m20 20-3-3"
  })), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      border: "none",
      outline: "none",
      background: "transparent",
      flex: 1,
      fontFamily: "var(--font-ui)",
      fontSize: "var(--text-base)",
      color: "var(--text-body)"
    }
  }));
}
Object.assign(__ds_scope, { SearchInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SearchInput.jsx", error: String((e && e.message) || e) }); }

// components/flow/CategoryTile.jsx
try { (() => {
/**
 * Emoji category tile for the picker grid. Big emoji + Turkish label on a
 * white paper card; lifts and rings coral when selected.
 */
function CategoryTile({
  emoji,
  label,
  selected = false,
  onClick,
  style = {}
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      background: "var(--surface-card)",
      borderRadius: "var(--r-lg)",
      cursor: "pointer",
      padding: "18px 8px",
      aspectRatio: "1 / 1",
      width: "100%",
      border: selected ? "2px solid var(--accent)" : "2px solid transparent",
      boxShadow: hover || selected ? "var(--shadow-lg)" : "var(--shadow-sm)",
      transform: hover ? "translateY(-2px)" : "none",
      transition: "all var(--dur-base) var(--ease-out)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 34,
      lineHeight: 1
    }
  }, emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 600,
      fontSize: "var(--text-sm)",
      color: "var(--text-body)"
    }
  }, label));
}
Object.assign(__ds_scope, { CategoryTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/flow/CategoryTile.jsx", error: String((e && e.message) || e) }); }

// components/flow/SparkleBurst.jsx
try { (() => {
/**
 * The restrained celebration. When `trigger` changes, a few ✨ sparkles pop
 * and float around the children (gentle scale overshoot, no confetti).
 */
function SparkleBurst({
  trigger = 0,
  children,
  style = {}
}) {
  const [burst, setBurst] = React.useState(0);
  React.useEffect(() => {
    if (trigger) setBurst(b => b + 1);
  }, [trigger]);
  const sparkles = [{
    x: "8%",
    y: "10%",
    d: 0,
    s: 18
  }, {
    x: "82%",
    y: "4%",
    d: 80,
    s: 22
  }, {
    x: "92%",
    y: "60%",
    d: 160,
    s: 15
  }, {
    x: "0%",
    y: "70%",
    d: 120,
    s: 16
  }, {
    x: "48%",
    y: "-12%",
    d: 40,
    s: 20
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-block",
      ...style
    }
  }, children, burst > 0 && sparkles.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: burst + "-" + i,
    style: {
      position: "absolute",
      left: s.x,
      top: s.y,
      fontSize: s.s,
      pointerEvents: "none",
      animation: `bo-sparkle 720ms var(--ease-spring) ${s.d}ms both`
    }
  }, "\u2728")), /*#__PURE__*/React.createElement("style", null, `@keyframes bo-sparkle{0%{opacity:0;transform:scale(.3) rotate(-15deg)}40%{opacity:1;transform:scale(1.15) rotate(5deg)}100%{opacity:0;transform:scale(.9) translateY(-10px)}}`));
}
Object.assign(__ds_scope, { SparkleBurst });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/flow/SparkleBurst.jsx", error: String((e && e.message) || e) }); }

// components/flow/StepIndicator.jsx
try { (() => {
/** Step progress for the dream loop — filled coral dots + connecting track. */
function StepIndicator({
  steps,
  current = 0,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      ...style
    }
  }, Array.from({
    length: steps
  }).map((_, i) => {
    const done = i < current,
      active = i === current;
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: active ? 26 : 9,
        height: 9,
        borderRadius: "var(--r-pill)",
        background: done || active ? "var(--accent)" : "var(--border-strong)",
        transition: "all var(--dur-base) var(--ease-spring)"
      }
    }));
  }));
}
Object.assign(__ds_scope, { StepIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/flow/StepIndicator.jsx", error: String((e && e.message) || e) }); }

// components/flow/WishItem.jsx
try { (() => {
function fmt(n) {
  return "₺" + n.toLocaleString("tr-TR");
}

/** A chosen dream item row: emoji + name + count stepper + price. Used in the dream list. */
function WishItem({
  emoji,
  name,
  price,
  qty = 1,
  onAdd,
  onRemove,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "var(--surface-card)",
      borderRadius: "var(--r-md)",
      padding: "10px 14px",
      boxShadow: "var(--shadow-sm)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26
    }
  }, emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 600,
      fontSize: "var(--text-base)",
      color: "var(--text-body)"
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-num)",
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, fmt(price), qty > 1 ? ` × ${qty}` : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Stepper, {
    onClick: onRemove,
    label: "\u2212"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-num)",
      fontWeight: 700,
      fontSize: "var(--text-base)",
      minWidth: 16,
      textAlign: "center"
    }
  }, qty), /*#__PURE__*/React.createElement(Stepper, {
    onClick: onAdd,
    label: "+",
    accent: true
  })));
}
function Stepper({
  onClick,
  label,
  accent
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1,
      background: accent ? "var(--accent)" : "var(--surface-sunken)",
      color: accent ? "var(--on-accent)" : "var(--text-body)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, label);
}
Object.assign(__ds_scope, { WishItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/flow/WishItem.jsx", error: String((e && e.message) || e) }); }

// components/money/BudgetMeter.jsx
try { (() => {
function fmt(n) {
  return "₺" + n.toLocaleString("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

/**
 * Depleting budget meter — the "spend the tax money" wallet metaphor.
 * Pinned at the top of the dream loop. Bar shrinks as `remaining` drops;
 * turns coral when nearly empty.
 */
function BudgetMeter({
  total,
  remaining,
  label = "Kalan bütçe",
  style = {}
}) {
  const pct = Math.max(0, Math.min(100, remaining / total * 100));
  const low = pct < 20;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--r-lg)",
      padding: "14px 18px",
      boxShadow: "var(--shadow-md)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 600,
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 800,
      fontSize: "var(--text-2xl)",
      color: low ? "var(--coral-500)" : "var(--green-600)"
    }
  }, fmt(remaining))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 12,
      borderRadius: "var(--r-pill)",
      background: "var(--surface-sunken)",
      overflow: "hidden",
      boxShadow: "var(--inset-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      background: low ? "var(--coral-500)" : "var(--green-500)",
      borderRadius: "var(--r-pill)",
      transition: "width var(--dur-slow) var(--ease-out), background var(--dur-base) var(--ease-out)"
    }
  })));
}
Object.assign(__ds_scope, { BudgetMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/money/BudgetMeter.jsx", error: String((e && e.message) || e) }); }

// components/money/CountUpNumber.jsx
try { (() => {
/** Turkish currency format: ₺1.240,50 */
function formatTRY(n, decimals = 2) {
  return n.toLocaleString("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * The shock mechanism. Counts up from 0 to `value` on mount (ease-out),
 * tabular-nums so it never jitters. Use big + coral for the tax figure.
 */
function CountUpNumber({
  value,
  prefix = "₺",
  suffix = "",
  decimals = 2,
  duration = 1400,
  size = "var(--text-6xl)",
  color = "var(--coral-500)",
  weight = 800,
  animate = true,
  style = {}
}) {
  const [display, setDisplay] = React.useState(animate ? 0 : value);
  React.useEffect(() => {
    if (!animate) {
      setDisplay(value);
      return;
    }
    let raf, start;
    const step = t => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, animate]);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1,
      letterSpacing: "var(--ls-tight)",
      color,
      ...style
    }
  }, prefix, formatTRY(display, decimals), suffix);
}
Object.assign(__ds_scope, { CountUpNumber });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/money/CountUpNumber.jsx", error: String((e && e.message) || e) }); }

// components/money/LiveCounter.jsx
try { (() => {
function fmt(n) {
  return n.toLocaleString("tr-TR");
}

/**
 * Landing-page live ticker: "₺X vergi hesaplandı". Gently increments so the
 * counter feels alive. Navy pill with a soft pulsing dot.
 */
function LiveCounter({
  value,
  label = "vergi hesaplandı",
  tickInterval = 2500,
  style = {}
}) {
  const [n, setN] = React.useState(value);
  React.useEffect(() => {
    const id = setInterval(() => setN(v => v + Math.floor(Math.random() * 900 + 100)), tickInterval);
    return () => clearInterval(id);
  }, [tickInterval]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      background: "var(--surface-navy)",
      color: "var(--text-on-dark)",
      borderRadius: "var(--r-pill)",
      padding: "9px 18px",
      boxShadow: "var(--shadow-sm)",
      fontFamily: "var(--font-ui)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "var(--green-400)",
      boxShadow: "0 0 0 0 rgba(78,158,122,.6)",
      animation: "bo-pulse 2s var(--ease-out) infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 800,
      fontSize: "var(--text-lg)"
    }
  }, "\u20BA", fmt(n)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-on-dark-muted)",
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("style", null, `@keyframes bo-pulse{0%{box-shadow:0 0 0 0 rgba(78,158,122,.5)}70%{box-shadow:0 0 0 7px rgba(78,158,122,0)}100%{box-shadow:0 0 0 0 rgba(78,158,122,0)}}`));
}
Object.assign(__ds_scope, { LiveCounter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/money/LiveCounter.jsx", error: String((e && e.message) || e) }); }

// components/money/TaxBreakdown.jsx
try { (() => {
function fmt(n) {
  return "₺" + n.toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * The tax-breakdown block: paid → tax (coral) → tax-free (green), with a
 * proportional bar showing how much of the price was tax.
 */
function TaxBreakdown({
  paid,
  tax,
  style = {}
}) {
  const taxFree = paid - tax;
  const taxPct = Math.round(tax / paid * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      height: 14,
      borderRadius: "var(--r-pill)",
      overflow: "hidden",
      boxShadow: "var(--inset-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${100 - taxPct}%`,
      background: "var(--green-400)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${taxPct}%`,
      background: "var(--coral-500)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement(Row, {
    label: "\xD6dedi\u011Fin",
    value: fmt(paid),
    tone: "var(--text-body)",
    bold: true
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Bunun vergisi",
    value: "− " + fmt(tax),
    tone: "var(--coral-600)",
    bold: true,
    badge: `%${taxPct}`
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "var(--border-soft)",
      margin: "8px 0"
    }
  }), /*#__PURE__*/React.createElement(Row, {
    label: "Vergisiz olsayd\u0131",
    value: fmt(taxFree),
    tone: "var(--green-600)",
    bold: true
  })));
}
function Row({
  label,
  value,
  tone,
  bold,
  badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontSize: "var(--text-base)",
      color: "var(--text-muted)",
      fontWeight: 500
    }
  }, label, badge && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-2xs)",
      fontWeight: 700,
      background: "var(--accent-soft)",
      color: "var(--coral-700)",
      padding: "2px 7px",
      borderRadius: "var(--r-pill)"
    }
  }, badge)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      fontSize: "var(--text-lg)",
      fontWeight: bold ? 700 : 500,
      color: tone
    }
  }, value));
}
Object.assign(__ds_scope, { TaxBreakdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/money/TaxBreakdown.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/App.jsx
try { (() => {
// App shell — phone frame + screen navigation for the benimolabilirdi user flow.
function BOApp() {
  const [screen, setScreen] = React.useState("landing");
  const [product, setProduct] = React.useState(null);
  const [budget, setBudget] = React.useState(0);
  const [share, setShare] = React.useState(null);
  const tax = product ? product.price * product.taxRate : 0;
  const pct = product ? Math.round(product.taxRate * 100) : 0;
  const go = s => setScreen(s);
  let view;
  if (screen === "landing") view = /*#__PURE__*/React.createElement(window.LandingScreen, {
    onStart: () => go("picker")
  });else if (screen === "picker") view = /*#__PURE__*/React.createElement(window.PickerScreen, {
    onPick: p => {
      setProduct(p);
      go("shock");
    }
  });else if (screen === "shock") view = /*#__PURE__*/React.createElement(window.ShockScreen, {
    product: product,
    onDream: t => {
      setBudget(t);
      go("dream");
    }
  });else if (screen === "dream") view = /*#__PURE__*/React.createElement(window.DreamScreen, {
    budget: budget,
    onDone: d => {
      setShare({
        ...d,
        product,
        tax,
        pct
      });
      go("share");
    }
  });else if (screen === "share") view = /*#__PURE__*/React.createElement(window.ShareScreen, {
    data: share,
    onRestart: () => {
      setProduct(null);
      setShare(null);
      go("landing");
    }
  });else if (screen === "how") view = /*#__PURE__*/React.createElement(window.HowScreen, {
    onBack: () => go("landing")
  });
  const dark = screen === "shock";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 14,
      padding: "24px 0 30px",
      background: "var(--cream-200)"
    }
  }, /*#__PURE__*/React.createElement(BOPhone, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      overflow: "auto"
    }
  }, view)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      fontFamily: "var(--font-ui)",
      fontSize: 13
    }
  }, ["landing", "picker", "shock", "dream", "share", "how"].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => {
      if (s === "shock" && !product) setProduct(window.BO_DATA.products.akaryakit[0]);
      if (s === "dream") {
        const p = product || window.BO_DATA.products.akaryakit[0];
        setProduct(p);
        setBudget(p.price * p.taxRate);
      }
      if (s === "share" && !share) {
        const p = product || window.BO_DATA.products.akaryakit[0];
        setProduct(p);
        const b = p.price * p.taxRate;
        const chosen = [{
          product: window.BO_DATA.dream.eglence[0],
          qty: 2
        }, {
          product: window.BO_DATA.dream.gida[0],
          qty: 3
        }];
        setShare({
          chosen,
          note: "",
          remaining: 35,
          budget: b,
          product: p,
          tax: p.price * p.taxRate,
          pct: Math.round(p.taxRate * 100)
        });
      }
      go(s);
    },
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontWeight: screen === s ? 800 : 500,
      color: screen === s ? "var(--coral-600)" : "var(--navy-500)",
      padding: 0,
      textDecoration: screen === s ? "underline" : "none"
    }
  }, s))));
}
function BOPhone({
  children,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 800,
      background: "var(--navy-900)",
      borderRadius: 46,
      padding: 12,
      boxShadow: "var(--shadow-xl)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      borderRadius: 34,
      overflow: "hidden",
      background: dark ? "var(--navy-800)" : "var(--bg-page)",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 34,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 26px",
      zIndex: 10,
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      fontWeight: 700,
      color: dark ? "var(--cream-50)" : "var(--navy-800)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 8,
      transform: "translateX(-50%)",
      width: 92,
      height: 24,
      background: "var(--navy-900)",
      borderRadius: 999
    }
  }), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF6 \uD83D\uDD0B")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      paddingTop: 34,
      boxSizing: "border-box"
    }
  }, children)));
}
window.BOApp = BOApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Dream.jsx
try { (() => {
// Dream loop — sticky budget meter + step indicator + category → wishlist + note.
const {
  BudgetMeter: BOMeter,
  StepIndicator: BOStep,
  CategoryTile: BOTile2,
  WishItem: BOWish,
  SparkleBurst: BOSpark,
  Button: BOBtn4
} = window.BenimolabilirdiDesignSystem_717d58;
function DreamScreen({
  budget,
  onDone
}) {
  const data = window.BO_DATA;
  const dreamCats = data.categories.filter(c => data.dream[c.id]);
  const [cat, setCat] = React.useState(dreamCats[0].id);
  const [items, setItems] = React.useState({}); // id -> {product, qty}
  const [note, setNote] = React.useState("");
  const [spark, setSpark] = React.useState(0);
  const spent = Object.values(items).reduce((s, it) => s + it.product.price * it.qty, 0);
  const remaining = budget - spent;
  const add = p => {
    if (remaining < p.price) return;
    setItems(prev => ({
      ...prev,
      [p.id]: {
        product: p,
        qty: (prev[p.id]?.qty || 0) + 1
      }
    }));
    setSpark(s => s + 1);
  };
  const remove = p => setItems(prev => {
    const cur = prev[p.id];
    if (!cur) return prev;
    const next = {
      ...prev
    };
    if (cur.qty <= 1) delete next[p.id];else next[p.id] = {
      ...cur,
      qty: cur.qty - 1
    };
    return next;
  });
  const chosen = Object.values(items);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 3,
      background: "var(--bg-page)",
      padding: "18px 22px 12px",
      boxShadow: "0 6px 12px -8px rgba(30,42,74,.2)"
    }
  }, /*#__PURE__*/React.createElement(BOMeter, {
    total: budget,
    remaining: remaining
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(BOStep, {
    steps: 4,
    current: 2
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "14px 22px 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      paddingBottom: 12
    }
  }, dreamCats.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => setCat(c.id),
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: "var(--r-pill)",
      cursor: "pointer",
      fontFamily: "var(--font-ui)",
      fontWeight: 600,
      fontSize: 14,
      border: cat === c.id ? "1.5px solid var(--accent)" : "1.5px solid var(--border-soft)",
      background: cat === c.id ? "var(--accent-soft)" : "var(--surface-card)",
      color: cat === c.id ? "var(--coral-700)" : "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("span", null, c.emoji), c.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 10,
      marginBottom: 20
    }
  }, data.dream[cat].map(p => {
    const afford = remaining >= p.price;
    return /*#__PURE__*/React.createElement("button", {
      key: p.id,
      onClick: () => add(p),
      disabled: !afford,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        background: "var(--surface-card)",
        border: "none",
        borderRadius: "var(--r-md)",
        padding: "14px 6px",
        boxShadow: "var(--shadow-sm)",
        cursor: afford ? "pointer" : "not-allowed",
        opacity: afford ? 1 : 0.4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 26
      }
    }, p.emoji), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-ui)",
        fontWeight: 600,
        fontSize: 12,
        color: "var(--text-body)"
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-num)",
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, window.boFmt(p.price)));
  })), chosen.length > 0 && /*#__PURE__*/React.createElement(SparkleWrap, {
    spark: spark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 14,
      color: "var(--text-muted)",
      marginBottom: 10
    }
  }, "Hayal sepetin \u2728"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, chosen.map(it => /*#__PURE__*/React.createElement(BOWish, {
    key: it.product.id,
    emoji: it.product.emoji,
    name: it.product.name,
    price: it.product.price,
    qty: it.qty,
    onAdd: () => add(it.product),
    onRemove: () => remove(it.product)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 14,
      color: "var(--text-muted)"
    }
  }, "Bir not d\xFC\u015F (iste\u011Fe ba\u011Fl\u0131)"), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: "Cebimde kalsayd\u0131\u2026",
    rows: 2,
    style: {
      width: "100%",
      marginTop: 8,
      boxSizing: "border-box",
      border: "1.5px solid var(--border-soft)",
      borderRadius: "var(--r-md)",
      padding: "12px 14px",
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      color: "var(--text-body)",
      background: "var(--surface-card)",
      resize: "none",
      outline: "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 22px 20px",
      background: "var(--bg-page)",
      borderTop: "1px solid var(--border-soft)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      textAlign: "center",
      color: "var(--text-body)",
      margin: "0 0 10px"
    }
  }, "Cebinde ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--green-600)"
    }
  }, window.boFmt(remaining)), " kald\u0131", remaining < 40 ? " — simit parası 🥨" : " 🎈"), /*#__PURE__*/React.createElement(BOBtn4, {
    variant: "positive",
    size: "lg",
    fullWidth: true,
    onClick: () => onDone({
      chosen,
      note,
      remaining,
      budget
    })
  }, "Kart\u0131 olu\u015Ftur \u2192")));
}
function SparkleWrap({
  spark,
  children
}) {
  return /*#__PURE__*/React.createElement(BOSpark, {
    trigger: spark,
    style: {
      display: "block",
      width: "100%"
    }
  }, children);
}
window.DreamScreen = DreamScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Dream.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/How.jsx
try { (() => {
// "Nasıl hesaplıyoruz?" — the tax-chain diagram. Trustworthy, readable.
const {
  Card: BOCard6,
  Button: BOBtn6
} = window.BenimolabilirdiDesignSystem_717d58;
function HowScreen({
  onBack
}) {
  const chain = [{
    emoji: "🏭",
    title: "Üretici fiyatı",
    desc: "Vergisiz taban maliyet.",
    tone: "var(--green-500)"
  }, {
    emoji: "🧾",
    title: "ÖTV",
    desc: "Özel Tüketim Vergisi — bazı ürünlerde yakıt, elektronik, alkol.",
    tone: "var(--coral-500)"
  }, {
    emoji: "➕",
    title: "KDV",
    desc: "Katma Değer Vergisi (%1–20), ÖTV dahil tutarın üzerine.",
    tone: "var(--coral-500)"
  }, {
    emoji: "🛒",
    title: "Ödediğin fiyat",
    desc: "Rafta gördüğün, kasada ödediğin tutar.",
    tone: "var(--navy-800)"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)",
      padding: "22px 22px 24px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      alignSelf: "flex-start",
      background: "none",
      border: "none",
      color: "var(--text-muted)",
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      marginBottom: 8
    }
  }, "\u2190 geri"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 26,
      color: "var(--navy-800)",
      margin: "0 0 6px"
    }
  }, "Nas\u0131l hesapl\u0131yoruz?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 15,
      lineHeight: 1.5,
      color: "var(--text-muted)",
      margin: "0 0 20px"
    }
  }, "Bir \xFCr\xFCn\xFCn fiyat\u0131 birka\xE7 vergi katman\u0131ndan ge\xE7er. Biz bu zinciri tersten \xE7\xF6z\xFCp i\xE7indeki toplam vergiyi buluyoruz."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 0
    }
  }, chain.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 46,
      flex: "none",
      borderRadius: "50%",
      background: "var(--surface-card)",
      boxShadow: "var(--shadow-sm)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 24
    }
  }, s.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 17,
      color: s.tone
    }
  }, s.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      lineHeight: 1.45,
      color: "var(--text-muted)",
      marginTop: 2
    }
  }, s.desc))), i < chain.length - 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      height: 22,
      background: "var(--border-strong)",
      marginLeft: 22
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(BOCard6, {
    tone: "sunken"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--text-body)"
    }
  }, /*#__PURE__*/React.createElement("b", null, "\xD6rnek:"), " \u20BA2.400 benzinin ~\u20BA1.250'si \xD6TV + KDV. Yani her depo, yar\u0131s\u0131 vergi. \u26FD"))));
}
window.HowScreen = HowScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/How.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Landing.jsx
try { (() => {
// Landing — value prop + "Ne aldın?" CTA + live tax counter.
const {
  Button: BOButton,
  LiveCounter: BOLiveCounter
} = window.BenimolabilirdiDesignSystem_717d58;
function LandingScreen({
  onStart
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)",
      padding: "28px 22px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "flex-start",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 20,
      color: "var(--navy-800)",
      letterSpacing: "-.02em"
    }
  }, "benim", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--coral-500)"
    }
  }, "olabilirdi")), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 44 44",
    fill: "none",
    style: {
      color: "var(--coral-500)",
      flex: "none",
      marginTop: "0.1em"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "15.5",
    cy: "18",
    r: "2.8",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "28.5",
    cy: "18",
    r: "2.8",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 31 Q22 24 31 31",
    stroke: "currentColor",
    strokeWidth: "3.4",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--text-muted)"
    }
  }, "k\xE2r amac\u0131 yok")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: 20,
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: "flex-start"
    }
  }, /*#__PURE__*/React.createElement(BOLiveCounter, {
    value: 48213905
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 900,
      fontSize: 40,
      lineHeight: 1.05,
      letterSpacing: "-.03em",
      color: "var(--navy-800)",
      margin: 0
    }
  }, "\xD6dedi\u011Fin verginin kar\u015F\u0131l\u0131\u011F\u0131nda", " ", /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      color: "var(--coral-500)",
      whiteSpace: "nowrap"
    }
  }, "neler alabilirdin?", /*#__PURE__*/React.createElement("svg", {
    style: {
      position: "absolute",
      left: 0,
      bottom: -6,
      width: "100%",
      height: 8
    },
    viewBox: "0 0 260 8",
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 5C60 1 130 1 190 4S250 7 258 3",
    stroke: "var(--coral-400)",
    strokeWidth: "3",
    fill: "none",
    strokeLinecap: "round"
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 16,
      lineHeight: 1.5,
      color: "var(--text-muted)",
      margin: 0,
      maxWidth: 320
    }
  }, "Bir \xFCr\xFCn se\xE7, i\xE7indeki vergiyi g\xF6r \u2014 ve o parayla neler alabilece\u011Fini hayal et. 30 saniye, hepsi bu.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(BOButton, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: onStart
  }, "Ne ald\u0131n? \u2192"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 12,
      textAlign: "center",
      color: "var(--text-faint)",
      margin: 0
    }
  }, "Hi\xE7bir verini saklam\u0131yoruz. Sadece merak. \u2728")));
}
window.LandingScreen = LandingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Landing.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Picker.jsx
try { (() => {
// Product picker — category grid → product list + search + "tutarı ben gireyim".
const {
  CategoryTile: BOCategoryTile,
  SearchInput: BOSearchInput,
  Button: BOBtn2
} = window.BenimolabilirdiDesignSystem_717d58;
function PickerScreen({
  onPick
}) {
  const [cat, setCat] = React.useState(null);
  const [q, setQ] = React.useState("");
  const data = window.BO_DATA;
  const products = cat ? data.products[cat] || [] : [];
  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 22px 12px",
      position: "sticky",
      top: 0,
      background: "var(--bg-page)",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 24,
      color: "var(--navy-800)",
      margin: "0 0 4px"
    }
  }, cat ? "Hangi ürün?" : "Ne aldın?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      color: "var(--text-muted)",
      margin: "0 0 14px"
    }
  }, cat ? "Listeden seç ya da tutarı kendin gir." : "Bir kategoriyle başla."), cat && /*#__PURE__*/React.createElement(BOSearchInput, {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "\xDCr\xFCn ara\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "6px 22px 22px"
    }
  }, !cat && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12
    }
  }, data.categories.map(c => /*#__PURE__*/React.createElement(BOCategoryTile, {
    key: c.id,
    emoji: c.emoji,
    label: c.label,
    onClick: () => setCat(c.id)
  }))), cat && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setCat(null);
      setQ("");
    },
    style: {
      alignSelf: "flex-start",
      background: "none",
      border: "none",
      color: "var(--text-muted)",
      fontFamily: "var(--font-ui)",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      padding: "2px 0",
      marginBottom: 2
    }
  }, "\u2190 kategoriler"), filtered.map(p => /*#__PURE__*/React.createElement("button", {
    key: p.id,
    onClick: () => onPick(p),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      background: "var(--surface-card)",
      border: "none",
      borderRadius: "var(--r-md)",
      padding: "14px 16px",
      boxShadow: "var(--shadow-sm)",
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, p.emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: "var(--font-ui)",
      fontWeight: 600,
      fontSize: 16,
      color: "var(--text-body)"
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 700,
      fontSize: 15,
      color: "var(--text-muted)"
    }
  }, window.boFmt(p.price)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      background: "var(--surface-sunken)",
      borderRadius: "var(--r-md)",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      color: "var(--text-body)"
    }
  }, "Listede yok mu? ", /*#__PURE__*/React.createElement("b", null, "Tutar\u0131 ben gireyim.")), /*#__PURE__*/React.createElement(BOBtn2, {
    variant: "secondary",
    size: "sm",
    onClick: () => onPick({
      id: "custom",
      emoji: "🧾",
      name: "Kendi ürünüm",
      price: 500,
      taxRate: 0.2
    })
  }, "Gir")))));
}
window.PickerScreen = PickerScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Picker.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Share.jsx
try { (() => {
// Preview + share — format switcher + scaled ShareCard + action buttons.
const {
  Button: BOBtn5,
  Chip: BOChip5
} = window.BenimolabilirdiDesignSystem_717d58;
function ShareScreen({
  data,
  onRestart
}) {
  const [format, setFormat] = React.useState("story");
  const f = window.BO_FORMATS[format];
  // fit card into a ~300px-wide preview box
  const boxW = 300;
  const scale = boxW / f.w;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)",
      padding: "22px 22px 24px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 24,
      color: "var(--navy-800)",
      margin: "0 0 4px"
    }
  }, "\u0130\u015Fte kart\u0131n"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 14,
      color: "var(--text-muted)",
      margin: "0 0 16px"
    }
  }, "Format\u0131 se\xE7, indir ya da payla\u015F."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 18
    }
  }, Object.entries(window.BO_FORMATS).map(([k, v]) => /*#__PURE__*/React.createElement(BOChip5, {
    key: k,
    selected: format === k,
    onClick: () => setFormat(k)
  }, v.label, " \xB7 ", v.ratio))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: boxW,
      height: f.h * scale,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "var(--shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement(window.ShareCard, {
    format: format,
    data: data,
    scale: scale
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(BOBtn5, {
    variant: "primary",
    size: "md"
  }, "\u2B07 \u0130ndir"), /*#__PURE__*/React.createElement(BOBtn5, {
    variant: "positive",
    size: "md"
  }, "\u2197 Payla\u015F"), /*#__PURE__*/React.createElement(BOBtn5, {
    variant: "secondary",
    size: "md"
  }, "\uD83D\uDD17 Linki kopyala"), /*#__PURE__*/React.createElement(BOBtn5, {
    variant: "ghost",
    size: "md",
    onClick: onRestart
  }, "\u21BA Ba\u015Ftan")));
}
window.ShareScreen = ShareScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Share.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/Shock.jsx
try { (() => {
// Shock screen — navy surface, count-up tax figure, breakdown. Emotional peak.
const {
  CountUpNumber: BOCount,
  TaxBreakdown: BOBreak,
  Button: BOBtn3,
  Badge: BOBadge3
} = window.BenimolabilirdiDesignSystem_717d58;
function ShockScreen({
  product,
  onDream
}) {
  const tax = product.price * product.taxRate;
  const pct = Math.round(product.taxRate * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100%",
      display: "flex",
      flexDirection: "column",
      background: "var(--surface-navy)",
      color: "var(--text-on-dark)",
      padding: "30px 22px 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 30
    }
  }, product.emoji), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-ui)",
      fontWeight: 700,
      fontSize: 16
    }
  }, product.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-num)",
      fontSize: 13,
      color: "var(--navy-300)"
    }
  }, window.boFmt(product.price), " \xF6dedin"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      gap: 6,
      padding: "16px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-ui)",
      fontSize: 16,
      fontWeight: 600,
      color: "var(--navy-300)"
    }
  }, "Bunun vergisi:"), /*#__PURE__*/React.createElement(BOCount, {
    value: tax,
    color: "var(--coral-400)",
    size: "60px"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement(BOBadge3, {
    tone: "accent"
  }, "\xF6dedi\u011Finin %", pct, "'i vergi")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: 18,
      lineHeight: 1.35,
      color: "var(--cream-50)",
      margin: "14px 0 0",
      maxWidth: 300
    }
  }, "Ah be. Bu parayla neler alabilirdin, hesaplayal\u0131m m\u0131?")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-navy-soft)",
      borderRadius: "var(--r-lg)",
      padding: 16,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(BOBreak, {
    paid: product.price,
    tax: tax
  })), /*#__PURE__*/React.createElement(BOBtn3, {
    variant: "primary",
    size: "lg",
    fullWidth: true,
    onClick: () => onDream(tax)
  }, "Bu parayla ne al\u0131rd\u0131m? \u2192"));
}
window.ShockScreen = ShockScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/Shock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// Fake product + category data for the benimolabilirdi app UI kit.
window.BO_DATA = {
  categories: [{
    id: "gida",
    emoji: "🍞",
    label: "Gıda"
  }, {
    id: "akaryakit",
    emoji: "⛽",
    label: "Akaryakıt"
  }, {
    id: "giyim",
    emoji: "👟",
    label: "Giyim"
  }, {
    id: "elektronik",
    emoji: "📱",
    label: "Elektronik"
  }, {
    id: "kahve",
    emoji: "☕",
    label: "Kahve"
  }, {
    id: "eglence",
    emoji: "🎬",
    label: "Eğlence"
  }, {
    id: "ulasim",
    emoji: "🚌",
    label: "Ulaşım"
  }, {
    id: "ev",
    emoji: "🏠",
    label: "Ev"
  }, {
    id: "saglik",
    emoji: "💊",
    label: "Sağlık"
  }],
  // products keyed by category — price is what the user paid, taxRate is total embedded tax
  products: {
    gida: [{
      id: "simit",
      emoji: "🥖",
      name: "Simit",
      price: 15,
      taxRate: 0.01
    }, {
      id: "ekmek",
      emoji: "🍞",
      name: "Ekmek",
      price: 12,
      taxRate: 0.01
    }, {
      id: "peynir",
      emoji: "🧀",
      name: "Beyaz peynir (kg)",
      price: 320,
      taxRate: 0.10
    }, {
      id: "cikolata",
      emoji: "🍫",
      name: "Çikolata",
      price: 55,
      taxRate: 0.20
    }],
    akaryakit: [{
      id: "benzin",
      emoji: "⛽",
      name: "Benzin (depo)",
      price: 2400,
      taxRate: 0.52
    }, {
      id: "motorin",
      emoji: "🛢️",
      name: "Motorin (depo)",
      price: 2600,
      taxRate: 0.49
    }],
    giyim: [{
      id: "ayakkabi",
      emoji: "👟",
      name: "Spor ayakkabı",
      price: 2800,
      taxRate: 0.20
    }, {
      id: "tisort",
      emoji: "👕",
      name: "Tişört",
      price: 450,
      taxRate: 0.20
    }],
    elektronik: [{
      id: "telefon",
      emoji: "📱",
      name: "Akıllı telefon",
      price: 42000,
      taxRate: 0.48
    }, {
      id: "kulaklik",
      emoji: "🎧",
      name: "Kablosuz kulaklık",
      price: 3500,
      taxRate: 0.40
    }],
    kahve: [{
      id: "latte",
      emoji: "☕",
      name: "Latte",
      price: 145,
      taxRate: 0.20
    }],
    eglence: [{
      id: "sinema",
      emoji: "🎬",
      name: "Sinema bileti",
      price: 320,
      taxRate: 0.18
    }],
    ulasim: [{
      id: "otobus",
      emoji: "🚌",
      name: "Otobüs bileti",
      price: 27,
      taxRate: 0.18
    }],
    ev: [{
      id: "deterjan",
      emoji: "🧴",
      name: "Deterjan",
      price: 240,
      taxRate: 0.20
    }],
    saglik: [{
      id: "vitamin",
      emoji: "💊",
      name: "Vitamin",
      price: 380,
      taxRate: 0.10
    }]
  },
  // things you could buy with the tax money (dream loop)
  dream: {
    gida: [{
      id: "simit",
      emoji: "🥖",
      name: "Simit",
      price: 15
    }, {
      id: "cay",
      emoji: "🫖",
      name: "Çay",
      price: 20
    }, {
      id: "doner",
      emoji: "🥙",
      name: "Döner",
      price: 180
    }],
    kahve: [{
      id: "turk",
      emoji: "☕",
      name: "Türk kahvesi",
      price: 90
    }, {
      id: "latte",
      emoji: "🥤",
      name: "Latte",
      price: 145
    }],
    eglence: [{
      id: "sinema",
      emoji: "🎬",
      name: "Sinema bileti",
      price: 320
    }, {
      id: "kitap",
      emoji: "📚",
      name: "Kitap",
      price: 210
    }],
    ulasim: [{
      id: "otobus",
      emoji: "🚌",
      name: "Otobüs bileti",
      price: 27
    }, {
      id: "taksi",
      emoji: "🚕",
      name: "Kısa taksi",
      price: 250
    }]
  }
};
window.boFmt = (n, dec = 0) => "₺" + Number(n).toLocaleString("tr-TR", {
  minimumFractionDigits: dec,
  maximumFractionDigits: dec
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/sharecard/ShareCard.jsx
try { (() => {
// ShareCard — the product's actual output. Three formats, rendered at true pixel
// size then scaled. Warm cream, big shock number, the dream list, pocket line.
// Used by the Share screen (scaled preview) and the ShareCard template.

const BO_FORMATS = {
  story: {
    w: 1080,
    h: 1920,
    label: "Story",
    ratio: "9:16"
  },
  post: {
    w: 1080,
    h: 1350,
    label: "Post",
    ratio: "4:5"
  },
  square: {
    w: 1080,
    h: 1080,
    label: "Kare",
    ratio: "1:1"
  }
};
function ShareCard({
  format = "story",
  data,
  scale = 1
}) {
  const f = BO_FORMATS[format];
  const d = data || {};
  const chosen = d.chosen || [];
  const compact = format === "square";
  const fmt = window.boFmt || (n => "₺" + n);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: f.w,
      height: f.h,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      background: "var(--cream-100)",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-ui)",
      color: "var(--navy-800)",
      display: "flex",
      flexDirection: "column",
      padding: compact ? "70px 80px" : "96px 88px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "flex-start",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 40,
      letterSpacing: "-.02em"
    }
  }, "benim", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--coral-500)"
    }
  }, "olabilirdi")), /*#__PURE__*/React.createElement("svg", {
    width: "36",
    height: "36",
    viewBox: "0 0 44 44",
    fill: "none",
    style: {
      color: "var(--coral-500)",
      flex: "none",
      marginTop: "0.08em"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "15.5",
    cy: "18",
    r: "2.8",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "28.5",
    cy: "18",
    r: "2.8",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 31 Q22 24 31 31",
    stroke: "currentColor",
    strokeWidth: "3.4",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 44
    }
  }, d.product?.emoji || "🧾")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: compact ? 44 : 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      fontWeight: 600,
      color: "var(--navy-500)"
    }
  }, d.product?.name || "Bir ürün", " ald\u0131m, vergisi:"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-num)",
      fontVariantNumeric: "tabular-nums",
      fontWeight: 800,
      fontSize: compact ? 130 : 168,
      lineHeight: 1,
      letterSpacing: "-.03em",
      color: "var(--coral-500)",
      margin: "10px 0 0"
    }
  }, fmt(Math.round(d.tax || 0))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      marginTop: 20,
      background: "var(--accent-soft)",
      color: "var(--coral-700)",
      fontWeight: 700,
      fontSize: 30,
      padding: "12px 26px",
      borderRadius: 999
    }
  }, "\xF6dedi\u011Fimin %", d.pct ?? 0, "'i")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: compact ? 40 : 76,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: 40,
      color: "var(--navy-800)"
    }
  }, "Bununla alabilirdim \u2728"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: compact ? 14 : 22,
      marginTop: 28
    }
  }, chosen.slice(0, compact ? 3 : 5).map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 22,
      background: "#fff",
      borderRadius: 28,
      padding: "22px 30px",
      boxShadow: "var(--shadow-sm)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 54
    }
  }, it.product.emoji), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontWeight: 700,
      fontSize: 40
    }
  }, it.product.name, it.qty > 1 ? ` ×${it.qty}` : ""), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-num)",
      fontWeight: 700,
      fontSize: 36,
      color: "var(--navy-500)"
    }
  }, fmt(it.product.price * it.qty)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: compact ? 30 : 60,
      background: "var(--green-100)",
      borderRadius: 32,
      padding: compact ? "28px 34px" : "40px 44px",
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 52
    }
  }, (d.remaining ?? 0) < 40 ? "🥨" : "🎈"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontWeight: 800,
      fontSize: compact ? 34 : 42,
      color: "var(--green-700)",
      lineHeight: 1.2
    }
  }, "Cebimde ", fmt(Math.round(d.remaining ?? 0)), " kald\u0131", (d.remaining ?? 0) < 40 ? " — simit parası" : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      textAlign: "center",
      fontSize: 28,
      fontWeight: 600,
      color: "var(--navy-400)"
    }
  }, "benimolabilirdi.com \xB7 k\xE2r amac\u0131 yok"));
}
window.ShareCard = ShareCard;
window.BO_FORMATS = BO_FORMATS;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/sharecard/ShareCard.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.SearchInput = __ds_scope.SearchInput;

__ds_ns.CategoryTile = __ds_scope.CategoryTile;

__ds_ns.SparkleBurst = __ds_scope.SparkleBurst;

__ds_ns.StepIndicator = __ds_scope.StepIndicator;

__ds_ns.WishItem = __ds_scope.WishItem;

__ds_ns.BudgetMeter = __ds_scope.BudgetMeter;

__ds_ns.CountUpNumber = __ds_scope.CountUpNumber;

__ds_ns.LiveCounter = __ds_scope.LiveCounter;

__ds_ns.TaxBreakdown = __ds_scope.TaxBreakdown;

})();

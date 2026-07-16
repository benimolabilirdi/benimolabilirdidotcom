import React from "react";

/**
 * The restrained celebration. When `trigger` changes, a few ✨ sparkles pop
 * and float around the children (gentle scale overshoot, no confetti).
 */
export function SparkleBurst({ trigger = 0, children, style = {} }) {
  const [burst, setBurst] = React.useState(0);
  React.useEffect(() => { if (trigger) setBurst((b) => b + 1); }, [trigger]);
  const sparkles = [
    { x: "8%", y: "10%", d: 0, s: 18 }, { x: "82%", y: "4%", d: 80, s: 22 },
    { x: "92%", y: "60%", d: 160, s: 15 }, { x: "0%", y: "70%", d: 120, s: 16 },
    { x: "48%", y: "-12%", d: 40, s: 20 },
  ];
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      {children}
      {burst > 0 && sparkles.map((s, i) => (
        <span key={burst + "-" + i} style={{
          position: "absolute", left: s.x, top: s.y, fontSize: s.s, pointerEvents: "none",
          animation: `bo-sparkle 720ms var(--ease-spring) ${s.d}ms both`,
        }}>✨</span>
      ))}
      <style>{`@keyframes bo-sparkle{0%{opacity:0;transform:scale(.3) rotate(-15deg)}40%{opacity:1;transform:scale(1.15) rotate(5deg)}100%{opacity:0;transform:scale(.9) translateY(-10px)}}`}</style>
    </div>
  );
}

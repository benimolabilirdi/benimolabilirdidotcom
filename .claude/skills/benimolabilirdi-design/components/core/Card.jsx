import React from "react";

/** White paper card floating on the cream ground. Soft navy-tinted shadow, no border. */
export function Card({ children, padding = "var(--sp-5)", interactive = false, tone = "paper", style = {}, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    paper: { background: "var(--surface-card)", color: "var(--text-body)" },
    sunken: { background: "var(--surface-sunken)", color: "var(--text-body)" },
    navy: { background: "var(--surface-navy)", color: "var(--text-on-dark)" },
  };
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "var(--r-lg)", padding,
        boxShadow: interactive && hover ? "var(--shadow-lg)" : "var(--shadow-md)",
        transform: interactive && hover ? "translateY(-2px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        cursor: interactive ? "pointer" : "default",
        ...tones[tone], ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

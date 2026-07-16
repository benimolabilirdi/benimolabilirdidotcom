import React from "react";

/** Rounded search field with a leading Lucide search glyph. Warm, sunken well. */
export function SearchInput({ value, onChange, placeholder = "Ara…", style = {} }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "var(--surface-card)", borderRadius: "var(--r-pill)",
      padding: "0 18px", height: "var(--touch-min)",
      border: focus ? "1.5px solid var(--focus-ring)" : "1.5px solid var(--border-soft)",
      boxShadow: focus ? "0 0 0 4px rgba(240,126,110,.18)" : "var(--shadow-xs)",
      transition: "all var(--dur-fast) var(--ease-out)", ...style,
    }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>
      <input
        value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          border: "none", outline: "none", background: "transparent", flex: 1,
          fontFamily: "var(--font-ui)", fontSize: "var(--text-base)", color: "var(--text-body)",
        }}
      />
    </div>
  );
}

import React from "react";

/** Step progress for the dream loop — filled coral dots + connecting track. */
export function StepIndicator({ steps, current = 0, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, ...style }}>
      {Array.from({ length: steps }).map((_, i) => {
        const done = i < current, active = i === current;
        return (
          <React.Fragment key={i}>
            <div style={{
              width: active ? 26 : 9, height: 9, borderRadius: "var(--r-pill)",
              background: done || active ? "var(--accent)" : "var(--border-strong)",
              transition: "all var(--dur-base) var(--ease-spring)",
            }} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

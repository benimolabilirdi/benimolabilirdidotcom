// Dream loop — sticky budget meter + step indicator + category → wishlist + note.
const { BudgetMeter: BOMeter, StepIndicator: BOStep, CategoryTile: BOTile2, WishItem: BOWish, SparkleBurst: BOSpark, Button: BOBtn4 } = window.BenimolabilirdiDesignSystem_717d58;

function DreamScreen({ budget, onDone }) {
  const data = window.BO_DATA;
  const dreamCats = data.categories.filter((c) => data.dream[c.id]);
  const [cat, setCat] = React.useState(dreamCats[0].id);
  const [items, setItems] = React.useState({}); // id -> {product, qty}
  const [note, setNote] = React.useState("");
  const [spark, setSpark] = React.useState(0);

  const spent = Object.values(items).reduce((s, it) => s + it.product.price * it.qty, 0);
  const remaining = budget - spent;

  const add = (p) => {
    if (remaining < p.price) return;
    setItems((prev) => ({ ...prev, [p.id]: { product: p, qty: (prev[p.id]?.qty || 0) + 1 } }));
    setSpark((s) => s + 1);
  };
  const remove = (p) => setItems((prev) => {
    const cur = prev[p.id]; if (!cur) return prev;
    const next = { ...prev };
    if (cur.qty <= 1) delete next[p.id]; else next[p.id] = { ...cur, qty: cur.qty - 1 };
    return next;
  });

  const chosen = Object.values(items);
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 3, background: "var(--bg-page)", padding: "18px 22px 12px", boxShadow: "0 6px 12px -8px rgba(30,42,74,.2)" }}>
        <BOMeter total={budget} remaining={remaining} />
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}><BOStep steps={4} current={2} /></div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "14px 22px 22px" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12 }}>
          {dreamCats.map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: "var(--r-pill)", cursor: "pointer", fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 14, border: cat === c.id ? "1.5px solid var(--accent)" : "1.5px solid var(--border-soft)", background: cat === c.id ? "var(--accent-soft)" : "var(--surface-card)", color: cat === c.id ? "var(--coral-700)" : "var(--text-body)" }}>
              <span>{c.emoji}</span>{c.label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
          {data.dream[cat].map((p) => {
            const afford = remaining >= p.price;
            return (
              <button key={p.id} onClick={() => add(p)} disabled={!afford} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "var(--surface-card)", border: "none", borderRadius: "var(--r-md)", padding: "14px 6px", boxShadow: "var(--shadow-sm)", cursor: afford ? "pointer" : "not-allowed", opacity: afford ? 1 : 0.4 }}>
                <span style={{ fontSize: 26 }}>{p.emoji}</span>
                <span style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 12, color: "var(--text-body)" }}>{p.name}</span>
                <span style={{ fontFamily: "var(--font-num)", fontSize: 12, color: "var(--text-muted)" }}>{window.boFmt(p.price)}</span>
              </button>
            );
          })}
        </div>

        {chosen.length > 0 && (
          <SparkleWrap spark={spark}>
            <div style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--text-muted)", marginBottom: 10 }}>Hayal sepetin ✨</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {chosen.map((it) => (
                <BOWish key={it.product.id} emoji={it.product.emoji} name={it.product.name} price={it.product.price} qty={it.qty} onAdd={() => add(it.product)} onRemove={() => remove(it.product)} />
              ))}
            </div>
          </SparkleWrap>
        )}

        <div style={{ marginTop: 20 }}>
          <label style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 14, color: "var(--text-muted)" }}>Bir not düş (isteğe bağlı)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Cebimde kalsaydı…" rows={2} style={{ width: "100%", marginTop: 8, boxSizing: "border-box", border: "1.5px solid var(--border-soft)", borderRadius: "var(--r-md)", padding: "12px 14px", fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-body)", background: "var(--surface-card)", resize: "none", outline: "none" }} />
        </div>
      </div>

      <div style={{ padding: "12px 22px 20px", background: "var(--bg-page)", borderTop: "1px solid var(--border-soft)" }}>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, textAlign: "center", color: "var(--text-body)", margin: "0 0 10px" }}>
          Cebinde <b style={{ color: "var(--green-600)" }}>{window.boFmt(remaining)}</b> kaldı{remaining < 40 ? " — simit parası 🥨" : " 🎈"}
        </p>
        <BOBtn4 variant="positive" size="lg" fullWidth onClick={() => onDone({ chosen, note, remaining, budget })}>Kartı oluştur →</BOBtn4>
      </div>
    </div>
  );
}

function SparkleWrap({ spark, children }) {
  return <BOSpark trigger={spark} style={{ display: "block", width: "100%" }}>{children}</BOSpark>;
}
window.DreamScreen = DreamScreen;

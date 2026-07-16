// Product picker — category grid → product list + search + "tutarı ben gireyim".
const { CategoryTile: BOCategoryTile, SearchInput: BOSearchInput, Button: BOBtn2 } = window.BenimolabilirdiDesignSystem_717d58;

function PickerScreen({ onPick }) {
  const [cat, setCat] = React.useState(null);
  const [q, setQ] = React.useState("");
  const data = window.BO_DATA;
  const products = cat ? data.products[cat] || [] : [];
  const filtered = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "var(--bg-page)" }}>
      <div style={{ padding: "22px 22px 12px", position: "sticky", top: 0, background: "var(--bg-page)", zIndex: 2 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--navy-800)", margin: "0 0 4px" }}>
          {cat ? "Hangi ürün?" : "Ne aldın?"}
        </h2>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "0 0 14px" }}>
          {cat ? "Listeden seç ya da tutarı kendin gir." : "Bir kategoriyle başla."}
        </p>
        {cat && <BOSearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ürün ara…" />}
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: "6px 22px 22px" }}>
        {!cat && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {data.categories.map((c) => (
              <BOCategoryTile key={c.id} emoji={c.emoji} label={c.label} onClick={() => setCat(c.id)} />
            ))}
          </div>
        )}
        {cat && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={() => { setCat(null); setQ(""); }} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: "2px 0", marginBottom: 2 }}>← kategoriler</button>
            {filtered.map((p) => (
              <button key={p.id} onClick={() => onPick(p)} style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--surface-card)", border: "none", borderRadius: "var(--r-md)", padding: "14px 16px", boxShadow: "var(--shadow-sm)", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: 28 }}>{p.emoji}</span>
                <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 16, color: "var(--text-body)" }}>{p.name}</span>
                <span style={{ fontFamily: "var(--font-num)", fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 15, color: "var(--text-muted)" }}>{window.boFmt(p.price)}</span>
              </button>
            ))}
            <div style={{ marginTop: 8, background: "var(--surface-sunken)", borderRadius: "var(--r-md)", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-body)" }}>Listede yok mu? <b>Tutarı ben gireyim.</b></span>
              <BOBtn2 variant="secondary" size="sm" onClick={() => onPick({ id: "custom", emoji: "🧾", name: "Kendi ürünüm", price: 500, taxRate: 0.2 })}>Gir</BOBtn2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
window.PickerScreen = PickerScreen;

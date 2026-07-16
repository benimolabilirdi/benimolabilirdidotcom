// App shell — phone frame + screen navigation for the benimolabilirdi user flow.
function BOApp() {
  const [screen, setScreen] = React.useState("landing");
  const [product, setProduct] = React.useState(null);
  const [budget, setBudget] = React.useState(0);
  const [share, setShare] = React.useState(null);

  const tax = product ? product.price * product.taxRate : 0;
  const pct = product ? Math.round(product.taxRate * 100) : 0;

  const go = (s) => setScreen(s);

  let view;
  if (screen === "landing") view = <window.LandingScreen onStart={() => go("picker")} />;
  else if (screen === "picker") view = <window.PickerScreen onPick={(p) => { setProduct(p); go("shock"); }} />;
  else if (screen === "shock") view = <window.ShockScreen product={product} onDream={(t) => { setBudget(t); go("dream"); }} />;
  else if (screen === "dream") view = <window.DreamScreen budget={budget} onDone={(d) => { setShare({ ...d, product, tax, pct }); go("share"); }} />;
  else if (screen === "share") view = <window.ShareScreen data={share} onRestart={() => { setProduct(null); setShare(null); go("landing"); }} />;
  else if (screen === "how") view = <window.HowScreen onBack={() => go("landing")} />;

  const dark = screen === "shock";
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 14, padding: "24px 0 30px", background: "var(--cream-200)" }}>
      <BOPhone dark={dark}>
        <div style={{ height: "100%", overflow: "auto" }}>{view}</div>
      </BOPhone>
      <div style={{ display: "flex", gap: 16, fontFamily: "var(--font-ui)", fontSize: 13 }}>
        {["landing", "picker", "shock", "dream", "share", "how"].map((s) => (
          <button key={s} onClick={() => {
            if (s === "shock" && !product) setProduct(window.BO_DATA.products.akaryakit[0]);
            if (s === "dream") { const p = product || window.BO_DATA.products.akaryakit[0]; setProduct(p); setBudget(p.price * p.taxRate); }
            if (s === "share" && !share) { const p = product || window.BO_DATA.products.akaryakit[0]; setProduct(p); const b = p.price * p.taxRate; const chosen = [{ product: window.BO_DATA.dream.eglence[0], qty: 2 }, { product: window.BO_DATA.dream.gida[0], qty: 3 }]; setShare({ chosen, note: "", remaining: 35, budget: b, product: p, tax: p.price * p.taxRate, pct: Math.round(p.taxRate * 100) }); }
            go(s);
          }} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: screen === s ? 800 : 500, color: screen === s ? "var(--coral-600)" : "var(--navy-500)", padding: 0, textDecoration: screen === s ? "underline" : "none" }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

function BOPhone({ children, dark }) {
  return (
    <div style={{ width: 390, height: 800, background: "var(--navy-900)", borderRadius: 46, padding: 12, boxShadow: "var(--shadow-xl)", position: "relative" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", background: dark ? "var(--navy-800)" : "var(--bg-page)", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 34, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", zIndex: 10, fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 700, color: dark ? "var(--cream-50)" : "var(--navy-800)", pointerEvents: "none" }}>
          <span>9:41</span>
          <span style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 92, height: 24, background: "var(--navy-900)", borderRadius: 999 }} />
          <span>📶 🔋</span>
        </div>
        <div style={{ height: "100%", paddingTop: 34, boxSizing: "border-box" }}>{children}</div>
      </div>
    </div>
  );
}
window.BOApp = BOApp;

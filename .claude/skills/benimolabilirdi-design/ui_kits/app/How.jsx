// "Nasıl hesaplıyoruz?" — the tax-chain diagram. Trustworthy, readable.
const { Card: BOCard6, Button: BOBtn6 } = window.BenimolabilirdiDesignSystem_717d58;

function HowScreen({ onBack }) {
  const chain = [
    { emoji: "🏭", title: "Üretici fiyatı", desc: "Vergisiz taban maliyet.", tone: "var(--green-500)" },
    { emoji: "🧾", title: "ÖTV", desc: "Özel Tüketim Vergisi — bazı ürünlerde yakıt, elektronik, alkol.", tone: "var(--coral-500)" },
    { emoji: "➕", title: "KDV", desc: "Katma Değer Vergisi (%1–20), ÖTV dahil tutarın üzerine.", tone: "var(--coral-500)" },
    { emoji: "🛒", title: "Ödediğin fiyat", desc: "Rafta gördüğün, kasada ödediğin tutar.", tone: "var(--navy-800)" },
  ];
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "var(--bg-page)", padding: "22px 22px 24px" }}>
      <button onClick={onBack} style={{ alignSelf: "flex-start", background: "none", border: "none", color: "var(--text-muted)", fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 8 }}>← geri</button>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--navy-800)", margin: "0 0 6px" }}>Nasıl hesaplıyoruz?</h2>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, lineHeight: 1.5, color: "var(--text-muted)", margin: "0 0 20px" }}>
        Bir ürünün fiyatı birkaç vergi katmanından geçer. Biz bu zinciri tersten çözüp içindeki toplam vergiyi buluyoruz.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {chain.map((s, i) => (
          <div key={i}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 46, height: 46, flex: "none", borderRadius: "50%", background: "var(--surface-card)", boxShadow: "var(--shadow-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{s.emoji}</div>
              <div style={{ paddingTop: 2 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: s.tone }}>{s.title}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.45, color: "var(--text-muted)", marginTop: 2 }}>{s.desc}</div>
              </div>
            </div>
            {i < chain.length - 1 && <div style={{ width: 2, height: 22, background: "var(--border-strong)", marginLeft: 22 }} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22 }}>
        <BOCard6 tone="sunken">
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, lineHeight: 1.5, color: "var(--text-body)" }}>
            <b>Örnek:</b> ₺2.400 benzinin ~₺1.250'si ÖTV + KDV. Yani her depo, yarısı vergi. ⛽
          </div>
        </BOCard6>
      </div>
    </div>
  );
}
window.HowScreen = HowScreen;

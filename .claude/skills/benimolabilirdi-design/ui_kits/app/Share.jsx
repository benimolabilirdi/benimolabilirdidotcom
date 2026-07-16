// Preview + share — format switcher + scaled ShareCard + action buttons.
const { Button: BOBtn5, Chip: BOChip5 } = window.BenimolabilirdiDesignSystem_717d58;

function ShareScreen({ data, onRestart }) {
  const [format, setFormat] = React.useState("story");
  const f = window.BO_FORMATS[format];
  // fit card into a ~300px-wide preview box
  const boxW = 300;
  const scale = boxW / f.w;

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", background: "var(--bg-page)", padding: "22px 22px 24px" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: "var(--navy-800)", margin: "0 0 4px" }}>İşte kartın</h2>
      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "0 0 16px" }}>Formatı seç, indir ya da paylaş.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {Object.entries(window.BO_FORMATS).map(([k, v]) => (
          <BOChip5 key={k} selected={format === k} onClick={() => setFormat(k)}>{v.label} · {v.ratio}</BOChip5>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{ width: boxW, height: f.h * scale, borderRadius: 18, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
          <window.ShareCard format={format} data={data} scale={scale} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
        <BOBtn5 variant="primary" size="md">⬇ İndir</BOBtn5>
        <BOBtn5 variant="positive" size="md">↗ Paylaş</BOBtn5>
        <BOBtn5 variant="secondary" size="md">🔗 Linki kopyala</BOBtn5>
        <BOBtn5 variant="ghost" size="md" onClick={onRestart}>↺ Baştan</BOBtn5>
      </div>
    </div>
  );
}
window.ShareScreen = ShareScreen;

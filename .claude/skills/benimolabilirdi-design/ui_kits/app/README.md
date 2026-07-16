# App UI kit — benimolabilirdi user flow

Mobile-first, interactive click-through of the six core user screens.

**Entry:** `index.html` — mounts `BOApp` inside a phone frame with a screen-jump nav row.

**Flow:** Landing → Product picker → Shock → Dream loop → Preview/Share. "How we calculate" is reachable via the nav row.

**Files**
- `data.js` — fake categories, products (price + embedded `taxRate`), dream items; `window.boFmt` Turkish currency helper.
- `Landing.jsx` — value prop, live tax counter, "Ne aldın?" CTA.
- `Picker.jsx` — emoji category grid → product list + search + "tutarı ben gireyim".
- `Shock.jsx` — navy surface, count-up tax figure, `TaxBreakdown`. The emotional peak.
- `Dream.jsx` — sticky `BudgetMeter` + `StepIndicator`, dream category picker, `WishItem` list with `SparkleBurst` on each add, personal note.
- `Share.jsx` — format switcher + scaled `ShareCard` preview + İndir / Paylaş / Kopyala / Baştan.
- `How.jsx` — the tax-chain diagram (üretici → ÖTV → KDV → ödediğin).
- `App.jsx` — navigation shell + `BOPhone` device frame.

All screens compose primitives from `components/` via `window.BenimolabilirdiDesignSystem_717d58`. Renders once `_ds_bundle.js` is compiled.

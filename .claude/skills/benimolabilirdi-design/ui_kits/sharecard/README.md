# ShareCard — the product's real output

The shareable image users generate at the end of the flow. **This is the actual product**; it gets the most iteration.

**`ShareCard.jsx`** exports `window.ShareCard({ format, data, scale })` and `window.BO_FORMATS`.

**Formats** (rendered at true pixel size, then scaled):
- `story` — 1080×1920 (9:16)
- `post` — 1080×1350 (4:5)
- `square` — 1080×1080 (1:1, compact layout: fewer dream rows)

**`data` shape**
```js
{ product: {name, emoji}, tax: Number, pct: Number,
  chosen: [{ product: {emoji, name, price}, qty }], remaining: Number }
```

**Layout:** wordmark header → count-up shock number (coral) + "%X'i vergi" badge → "Bununla alabilirdim ✨" dream list (white rows) → green pocket line ("Cebimde ₺X kaldı — simit parası 🥨") → footer url.

**`index.html`** shows all three formats side by side (the ShareCard card).

To export a real PNG, render at `scale={1}` off-screen and rasterize.

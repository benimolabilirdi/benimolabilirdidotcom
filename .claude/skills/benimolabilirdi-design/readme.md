# benimolabilirdi — Design System

> _"Bu parayla neler alabilirdim?"_ — A non-profit awareness site for **benimolabilirdi.com** that turns the taxes buried inside Turkish product prices into a shareable "wishlist of what you could have had."

This is the brand + UI design system: design tokens, foundation specimens, reusable React components, mobile UI-kit screens, and the ShareCard image templates that are the product's actual output.

---

## 1. Product context

**One sentence:** A non-profit awareness site that reveals the taxes inside product prices in Turkey, converts that tax amount into a personal "what I could have bought instead" wishlist, and generates a shareable social image.

**The core user flow (mobile-first, ~80% of traffic):**
1. **Landing** — value proposition + "Ne aldın?" (What did you buy?) CTA + a live counter (`₺X vergi hesaplandı` — X in tax calculated so far).
2. **Product picker** — emoji category grid → product list + search + a "not listed, I'll type the amount" escape hatch.
3. **Shock screen** — paid / tax breakdown / tax-free price, numbers animate up (count-up). The emotional peak, coral, big.
4. **Dream loop** — a remaining-budget meter pinned at top (a depleting bar / wallet), category → product picks, a personal note field. One flow with a step indicator. Each add fires a small ✨ sparkle (never confetti).
5. **Preview + share** — format switch (story / post), Download / Share / Copy link / Restart.
6. **"How we calculate"** — the tax-chain diagram. Trustworthy, readable.

**The ShareCard** (three formats: story, post, square) is the project's real deliverable and gets the most iteration — see `ui_kits/sharecard/`.

**Admin side** (low priority, plain functional — shadcn defaults, no brand): product table, product form with live tax preview, bulk price-hike screen. Not built in this system unless requested.

### Brand personality
- **Bittersweet but warm** ("buruk ama sıcak") — not anger, a rueful smile. The "ah be" feeling.
- **Citizen's voice** — institutional rigor underneath, but the output reads like a friend's story.
- **Honest & transparent** — the numbers are serious; the presentation is intimate.
- Reference feel: _the seriousness of a budgeting app × the warmth of a gift-card app._

### Hard prohibitions (do not violate)
- **No political-party color compositions** — no flag-style red-and-white layouts, no dominant orange, no arrow/party-symbol motifs. (This is why coral is paired with green and always sits on warm cream — never a red block on white.)
- **No anger iconography** — no fists, megaphones, protest imagery.
- **No corporate coldness** — no grey-blue fintech template, no stock photography.
- **No real product photos or brand logos** — illustration / emoji language is mandatory.

---

## 2. Sources given

- **Fonts** (user-uploaded, full families in `uploads/`): **Nunito**, **DM Sans**, **Figtree** — all with Turkish glyph coverage.
  - This system uses **Nunito** (display/headings, warm) + **DM Sans** (UI, body, numbers). Figtree is available in `uploads/` as an alternate but is not wired in.
- No codebase, Figma file, or logo was provided. **There is no logo mark** — the brand name is set in type (Nunito ExtraBold, lowercase) wherever a mark would go. See `assets/`. Do not invent a logo.
- Palette core specified in the brief: cream `#FAF3E8`, navy `#1E2A4A`, coral `#E85D4A`, green `#2E7D5B` — expanded into full scales in `tokens/colors.css`.

---

## 3. CONTENT FUNDAMENTALS — how copy is written

**Language:** Turkish, always. Turkish glyphs (ı İ ş ğ ç ö ü) must render — fonts are chosen for this.

**Voice:** a friend talking, not an institution. Second person, informal **"sen"** ("ne aldın?", "cebinde kaldı"). Never the formal "siz", never corporate "kullanıcı".

**Tone:** rueful warmth. The joke and the ache sit in the same sentence. It never lectures, never rages, never blames the reader. The target is the situation, softened by humor.

**Casing:** Headlines and UI in **sentence case** or lowercase — never ALL CAPS for emotional copy (caps only for tiny eyebrow labels, tracked out). The wordmark "benimolabilirdi" is always lowercase.

**Numbers:** Turkish formatting — `₺` symbol, `.` as thousands separator, `,` as decimal (`₺1.240,50`). Numbers are the serious anchor; they are set in DM Sans with `tabular-nums` so count-ups don't jitter.

**Emoji:** first-class design element. Category and product identity are carried by emoji (🥖 simit, ⛽ benzin, 👟 ayakkabı). Used deliberately, one per concept — not scattered decoration.

**Signature copy examples (tone reference):**
- Hero: _"Ödediğin verginin karşılığında neler alabilirdin?"_
- CTA: _"Ne aldın?"_
- Shock: _"Bunun ₺340'ı vergiydi."_
- Dream close: _"Cebinde 340 TL kaldı — simit parası 🥨"_
- Reassurance: _"Kâr amacı yok. Sadece merak."_

**Rule of thumb:** if a line sounds like a bank or a ministry wrote it, rewrite it as a text a friend would send.

---

## 4. VISUAL FOUNDATIONS

**Overall vibe:** warm paper. Everything sits on a cream ground (`--bg-page` `#FAF3E8`) like a note left on a kitchen table. White cards float on the cream with soft, navy-tinted shadows. The mood is analog and hand-touched, never glassy or techy.

**Color:**
- Cream is the ground; **white** is reserved for cards/sheets that lift off it.
- **Navy** (`#1E2A4A`) is the ink — all body text, and the "serious surface" (used full-bleed for the shock/breakdown moment so numbers feel weighty).
- **Coral** (`#E85D4A`) = the tax / shock / "what you lost" side. Warm, never a pure flag-red. Used for the primary CTA and the big shock number.
- **Green** (`#2E7D5B`) = the positive / "what you kept / dream" side. Budget meter, confirmations.
- **Gold** (`#E8A33D`) = sparkle & celebration accents only.
- Max 1–2 background colors per screen (cream, or navy for the shock). Coral + green never form a flag composition because they always live on cream and are separated by neutral space.

**Typography:** Nunito (rounded, warm terminals) for headings and emotional copy; DM Sans for body, labels, and all figures. Display sizes go big and tight (`--ls-tight`); body stays generous (`--lh-normal` 1.45+) for Turkish readability. Shock number uses `--text-6xl` (68px+).

**Spacing:** 4px base rhythm. Mobile container `430px`, `20px` gutters. Touch targets ≥ 44px. Generous vertical air between sections — the design breathes, it's not dense (except admin).

**Backgrounds:** flat warm cream. No stock photos, no gradients-as-decoration. Subtle warm texture is allowed (paper grain) but optional. Category tiles and the ShareCard use large emoji + solid warm fills, not imagery.

**Hand-drawn touches:** wavy underlines under key words, small star/sparkle (✨) marks, slightly irregular accents — the "a human touched this" feel. These are the signature. Use sparingly for emphasis on emotional words.

**Corner radii:** soft throughout. Cards `--r-lg` (20px), sheets `--r-xl` (28px), buttons & chips are **pills** (`--r-pill`). Nothing sharp.

**Cards:** white fill, `--r-lg` corners, `--shadow-md` (soft navy-tinted, never grey), no border by default (a hairline `--border-soft` only when on white-on-white). No colored-left-border accent cards.

**Shadows:** warm, navy-tinted, low alpha — paper on a table. Colored glows (`--glow-accent`, `--glow-positive`, `--glow-sparkle`) only on emphasis (primary CTA, sparkle moment).

**Borders:** rare. Hairline `--border-soft` (cream-300) for dividers; `--border-strong` only on inputs. On the navy surface, `--border-on-dark` (translucent cream).

**Motion:**
- **Count-up** on all key figures (`--dur-count` 1400ms, ease-out). This is the shock mechanism.
- **Gentle sparkle pop** (`--ease-spring`, small scale overshoot) when a dream item is added. Restrained — ✨ not 🎉, no confetti.
- **Depleting budget bar** animates smoothly as items are added.
- Transitions are fades + soft slides (`--dur-base`, `--ease-out`). Springs only for "pop" moments.

**Hover:** buttons darken (coral → `--coral-600`); cards lift shadow (`--shadow-md` → `--shadow-lg`) and translate up 2px. No opacity-dimming.

**Press:** scale down ~0.97 + darker shade (`--accent-press`). Tactile.

**Transparency & blur:** minimal. Sticky headers over cream get a subtle cream blur veil; otherwise solid. The budget meter header is pinned/solid.

**Layout rules:** budget meter is `position: sticky` at top of the dream loop; step indicator below it. Primary CTA pinned to bottom on mobile flows. ShareCard is fixed-dimension per format.

**Imagery color vibe:** warm, illustrative, emoji-forward. No photography. If illustration is ever added, warm palette, flat, friendly.

---

## 5. ICONOGRAPHY

- **Emoji is the primary icon language** — this is a deliberate brand decision, not a fallback. Categories and products are identified by emoji (🥖 ⛽ 👟 📱 ☕ 🚗). Emoji are rendered at the system level (native emoji font) and sized generously in category tiles / ShareCards.
- **UI glyphs** (chevrons, close, search, share, download, back) use **Lucide** (`lucide.dev`) via CDN — a rounded, friendly, 2px-stroke set that matches the warm, rounded brand. Linked from CDN in cards/kits; documented here as the chosen substitute since no icon set was provided in sources. **Flagged substitution:** Lucide is our choice, not a supplied asset — swap if the team standardizes on another rounded set.
- **No custom-drawn brand illustrations or logo SVGs** exist — none were provided and none are invented. Where a logo would go, the wordmark is set in Nunito ExtraBold lowercase.
- **Hand-drawn accents** (wavy underline, sparkle star) are rendered as small inline SVG strokes or the ✨ emoji, kept in components — not a full icon set.

---

## 6. Index / manifest

**Root**
- `styles.css` — the single entry point consumers link; `@import`s every token + font file.
- `readme.md` — this file.
- `SKILL.md` — Agent Skills wrapper.
- `thumbnail.html` — homepage tile.

**`tokens/`** — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `shadow.css`, `motion.css`.

**`assets/fonts/`** — Nunito (400/600/700/800/900) + DM Sans (400/500/600/700) `.ttf`.

**`guidelines/`** — foundation specimen cards (Type, Colors, Spacing, Brand groups).

**`components/`** — reusable React primitives (namespace `window.BenimolabilirdiDesignSystem_717d58`; see the Components cards):
- `core/` — **Button**, **Card**, **Badge**, **Chip**, **SearchInput**
- `money/` — **CountUpNumber** (the shock count-up), **TaxBreakdown**, **BudgetMeter** (depleting wallet), **LiveCounter** (landing ticker)
- `flow/` — **CategoryTile**, **StepIndicator**, **WishItem**, **SparkleBurst** (the ✨ celebration)

**`ui_kits/`** — full mobile screens + the ShareCard templates:
- `app/` — the six core user screens as an interactive click-through (`index.html` → `BOApp`). Landing · Product picker · Shock · Dream loop · Preview/Share · How-we-calculate. See `ui_kits/app/README.md`.
- `sharecard/` — **the product's real output**: `ShareCard.jsx` in three formats (story 9:16 · post 4:5 · square 1:1). See `ui_kits/sharecard/README.md`.

**`templates/`** — copy-ready starting artifacts for consuming projects: `share-card/` (the ShareCard as an editable Design Component).

_(Component & UI-kit lists are filled in as each is authored — see the Design System tab for the live card grid.)_

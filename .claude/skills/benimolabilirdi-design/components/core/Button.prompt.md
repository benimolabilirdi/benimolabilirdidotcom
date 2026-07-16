Pill action button — the primary CTA of every screen. Coral by default; green for positive confirmations.

```jsx
<Button variant="primary" size="lg" fullWidth onClick={next}>Ne aldın?</Button>
<Button variant="secondary">Baştan</Button>
<Button variant="ghost" size="sm">Linki kopyala</Button>
```

Variants: `primary` (coral, glow), `positive` (green), `secondary` (white/bordered), `ghost`. Sizes `sm|md|lg`. Hover darkens; press scales to 0.97. Supports `iconLeft`/`iconRight`, `fullWidth`, `disabled`.

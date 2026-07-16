# 06 — Design System Entegrasyonu v1.0

> Claude Design çıktısı (benimolabilirdi___Design_System.zip) incelendi ve ONAYLANDI.
> Bu doküman: (a) zip'in repoya yerleşimi, (b) 03-visual-spec §2'deki geçici değerlerin
> yerine geçen FİNAL token'lar, (c) DS'teki ShareCard şablonuna uygulanacak zorunlu
> düzeltmeler. Çelişkide sıra: PRD > bu doküman > DS readme > DS şablon kodu.

## 1. Repo yerleşimi

```
repo/
├── CLAUDE.md
├── docs/                          ← 01-05 dokümanları + bu dosya
├── .claude/skills/benimolabilirdi-design/   ← ZIP İÇERİĞİ AYNEN BURAYA
│   ├── SKILL.md                   (Claude Code bunu skill olarak otomatik görür)
│   ├── tokens/  components/  ui_kits/  guidelines/  assets/
└── public/fonts/                  ← assets/fonts/*.ttf kopyalanır (web + satori için)
```

- `tokens/*.css` → `app/globals.css`'e import edilir; Tailwind config'te CSS var referanslı
  tema kurulur (örn. `colors: { accent: 'var(--accent)' }`).
- `ui_kits/app/*.jsx` ve `components/**` **prototip referansıdır** (window globals,
  prototype JSX) — production'a kopyala-yapıştır DEĞİL, birebir görsel referans olarak
  yeniden yazılır. Yerleşim/spacing/renk kararları AYNEN korunur.
- DS'in copy kuralları (readme §3: "sen" dili, sentence case, ₺ + tr-TR format,
  "kâr amacı yok. sadece merak.") tüm site copy'sinde bağlayıcıdır.

## 2. Final token'lar (03-visual-spec §2'yi geçersiz kılar)

Kaynak: `tokens/colors.css` — tam skala orada; çekirdek:

| Semantik | Token | Hex |
|---|---|---|
| Zemin | --cream-100 | #FAF3E8 |
| Kart | --surface-card | #FFFFFF |
| Metin | --navy-800 | #1E2A4A |
| Soluk metin | --navy-500 | #5B6F9E |
| Vurgu/vergi | --coral-500 | #E85D4A |
| Vurgu soft | --coral-100 | #FBE0DB |
| Pozitif/kalan | --green-500 / --green-100 | #2E7D5B / #DCEEE4 |
| Parıltı | --gold-500 | #E8A33D |

Tipografi: Nunito (display, 800/900 ağırlık) + DM Sans (UI ve TÜM rakamlar,
`font-variant-numeric: tabular-nums`). Radius: kart 20px, sheet 28px, buton/chip pill.
Gölge: lacivert tonlu (`rgba(30,42,74,…)`), asla gri. Motion: count-up 1400ms ease-out,
✨ spring pop (konfeti yasak). Sayı formatı: **`59.400 TL` (TL sonda, ₺ sembolü
kullanılmaz)** — R6 revizyonu (B2, kabul görseli üzerinde karar). Gerekçe: "X lira
verdim" halk dili; ₺ önde yazım fintech soğukluğu verir, kimse story'sinde öyle yazmaz.
Bu, DS readme'nin "₺ önde" kuralını ve bu dokümanın v1.0'daki "₺59.400" yazımını
geçersiz kılar. UI dahil her yerde tutarlı: `lib/share-card.ts` formatTL tek kaynak.

Büyük harf kuralı: duygusal copy ALL CAPS olmaz → 03 §3'teki "ŞUNLAR DA BENİM
OLABİLİRDİ" → **"Şunlar da benim olabilirdi ✨"** (dalgalı alt çizgi 'olabilirdi'
altında kalır).

## 3. ShareCard zorunlu düzeltmeleri (DS şablonu → production)

DS `ui_kits/sharecard/ShareCard.jsx` görsel dil olarak temel alınır, şu deltalar uygulanır:

- [ ] **D1 — Kişisel metin:** liste satırında `it.product.name` yerine kullanıcının
      girdiği `line_text` (yoksa `default_line_text`, o da yoksa ürün adı).
- [ ] **D2 — Etiket chip'i:** satırda metnin altına `🏷️ {seçilen etiket}` chip'i
      (bg --coral-100 benzeri sıcak hap, occasion > recipient önceliği; etiketsiz üründe yok).
- [ ] **D3 — Başlık ifadesi:** "Bununla alabilirdim ✨" → **"Şunlar da benim olabilirdi ✨"**
      + üstüne bir satır bağlam: "{ürün} aldım · ₺{raf} ödedim" ve mevcut büyük vergi
      rakamı korunur ("Bunun ₺X'i vergiydi" hissi; DS'in %badge'i de kalır — iyi fikir).
- [ ] **D4 — Dipnot:** footer'a "· fiyatlar temsilidir · ÖTV+KDV+fon dahil" eklenir
      ("kâr amacı yok" DS satırı kalır).
- [ ] **D5 — OG formatı:** BO_FORMATS'a `og: {w:1200, h:630}` eklenir; kompakt kural:
      1 satır bağlam + büyük vergi rakamı + 3 hayal satırı + "+N şey daha".
- [ ] **D6 — Satori uyumu:** production `<ShareCard/>`'da CSS variable KULLANILMAZ
      (satori desteklemez) — token değerleri `lib/design-tokens.ts`'ten literal import
      edilir; tek kaynak orası, hem Tailwind hem ShareCard oradan beslenir.
      Fontlar `public/fonts`'tan satori'ye ArrayBuffer olarak verilir
      (Nunito 800, DM Sans 400/700 yeterli — bundle küçük kalsın).
- [ ] **D7 — Bağış satırı:** bağış kategorisindeki satırlar --green tonlu vurgulanır
      (03 §3'teki kural; DS şablonunda yok).

Format seti finali: **story 1080×1920 · post 1080×1350 (4:5) · square 1080×1080 · og 1200×630.**
(DS'in 4:5 eklemesi kabul — IG feed'de 1:1'den iyi performans.)

## 4. Kabul testi güncellemesi

03 §7'deki sabit senaryo, D1–D7 uygulanmış ShareCard ile 4 formatta render edilir →
Oğuzhan onayı (GATE 🚪). DS şablonunun ham hali onaya SUNULMAZ (chip'siz/kişisel
metinsiz hali hayal edilenin eksik versiyonudur).

## 5. Görev listesi etkisi (05'e ek)

- Faz B1 artık "sıfırdan yaz" değil "DS şablonunu D1–D7 ile production'a taşı" —
  süre kısalır.
- Faz C ekranları `ui_kits/app/*.jsx` referansıyla yazılır (Landing/Picker/Shock/
  Dream/Share/How hepsi mevcut) — Opus'a talimat: "görsel kararları ui_kits'ten al,
  state/veri katmanını PRD'ye göre kur."
- CLAUDE.md'ye ek satır: "Tasarım kaynağı: .claude/skills/benimolabilirdi-design/
  (SKILL.md + readme). Renk/font/spacing kararı ASLA uydurma — token yoksa sor."

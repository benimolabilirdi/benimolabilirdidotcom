# benimolabilirdi.com — Görsel Çıktı Spesifikasyonu v1.0

> Tek React şablon (`<ShareCard />`), üç boyutta render edilir. Renk/font token'ları
> Claude Design fazından sonra güncellenir; buradaki değerler geçici (provisional) ama çalışan varsayılanlardır.

## 1. Formatlar

| Format | Boyut | Kullanım | Render |
|---|---|---|---|
| Story | 1080×1920 | IG/WA story | client, html-to-image |
| Post | 1080×1080 | IG post, X | client, html-to-image |
| OG | 1200×630 | Link önizleme | @vercel/og (satori), sunucu |

Aynı bileşen, `format` prop'u ile yerleşim değiştirir. OG kompakt versiyondur (maks. 3 satır + "+N şey daha").

## 2. Geçici renk paleti

```
--bg:        #FAF3E8   (sıcak krem — story'de soğuk beyaz yasak)
--ink:       #1E2A4A   (koyu lacivert — ana metin)
--accent:    #E85D4A   (mercan — vergi tutarı, vurgu)
--card:      #FFFFFF   (liste kartı zemini)
--chip-bg:   #FDE8D7   (etiket chip zemini)
--chip-ink:  #B4552F   (etiket chip metni)
--muted:     #8A8577   (dipnot, footer)
--positive:  #2E7D5B   (kalan para / bağış satırı)
```
Yasak: parti çağrışımlı baskın kompozisyonlar (kırmızı-beyaz bayrak düzeni, turuncu ağırlık, altı ok benzeri grafik).

## 3. Story (1080×1920) yerleşim — bölge bölge

```
┌──────────────────────────────┐
│  [64px üst boşluk]           │
│  ZONE A — Ürün emoji  📱     │  160px, ortalı
│  ZONE B — Hikâye             │
│   "iPhone 17 aldım."         │  64px bold, --ink
│   "119.000 TL ödedim."       │  64px bold, --ink
│   "Bunun 59.400 TL'si        │  76px extrabold, --accent
│    vergiydi. 💸"             │  (rakam bir tık daha büyük)
│                              │
│  ZONE C — Geçiş              │
│   "Bu para vergiye           │  40px, --ink, normal
│    gitmeseydi..."            │
│   "✨ ŞUNLAR DA BENİM        │  56px extrabold, --ink,
│    OLABİLİRDİ:"              │  'OLABİLİRDİ' altında el çizimi
│                              │  dalgalı çizgi (SVG, --accent)
│  ZONE D — Hayal listesi      │
│  ┌─ kart ──────────────────┐ │  --card zemin, 24px radius,
│  │ 🥣 Anneme mutfak robotu │ │  yumuşak gölge, satır 96px
│  │    🏷️ Anneler Günü      │ │  chip: 26px, --chip-bg hap
│  │              8.900 TL ─→│ │  tutar sağa yaslı, 40px bold
│  ├─────────────────────────┤ │
│  │ 📚 Bir yıllık kitaplarım│ │
│  │              4.200 TL   │ │  (kitapta chip yoksa boş)
│  ├─────────────────────────┤ │
│  │ 🎭 Kuzenlerle tiyatro   │ │
│  │    🏷️ Doğum Günü        │ │
│  │              3.600 TL   │ │
│  │ ...                     │ │
│  │ ❤️ Depremzedelere bağış │ │  bağış satırı --positive tonlu
│  │              5.000 TL   │ │
│  └─────────────────────────┘ │
│  ZONE E — Kalan (varsa)      │
│   "…ve cebimde hâlâ          │  32px, --muted, italik
│    340 TL kalırdı 🥲"        │
│  ZONE F — Footer             │
│   ── ince çizgi ──           │
│   benimolabilirdi.com        │  36px semibold, --ink, ortalı
│   *fiyatlar temsilidir ·     │  22px, --muted
│    ÖTV+KDV+fon dahil ·       │
│    hesap detayı sitede       │
└──────────────────────────────┘
```

## 4. Dinamik kurallar

- **Liste kapasitesi:** Story 3–7 satır, Post 3–5, OG 3. Fazlası: son satır yerine "➕ ve 3 şey daha…" (--muted).
- **Metin taşması:** Kullanıcı metni maks. 40 karakter (input'ta sınırla); tek satıra sığmazsa 2 satıra sar, satır yüksekliği esner.
- **Sayı formatı:** TR locale, binlik nokta, kuruş yok: `59.400 TL`. 1M üzeri: `1.240.000 TL` (kısaltma yok — büyüklük hissi kaybolmasın).
- **Chip:** Ürünün etiketlerinden akışta **seçilen** etiket gösterilir (occasion > recipient önceliği). Etiket seçilmeden gelinen üründe chip yok.
- **Emoji:** Ürünün emoji'si yoksa kategorininki kullanılır. Sistem emoji fontu (Noto Color Emoji satori tarafında embed).
- **Dikey denge:** Liste kısa ise (3 satır) Zone B/C fontları %10 büyür — görsel hiç "boş" durmamalı.

## 5. Paylaşım linki + OG

Görsel üretiminde seçimler URL-safe şekilde encode edilir: `/s?d=<base64(json)>` (DB'ye yazım YOK — stateless, KVKK-temiz). `/s` sayfası OG meta'da `@vercel/og` endpoint'ini gösterir; endpoint aynı `<ShareCard format="og" />`'u render eder. WhatsApp/X'te link atıldığında görsel otomatik görünür → bedava viral kanal.

## 6. Ton kalibrasyonu — yazılacak/yazılmayacak

✅ "şunlar da benim olabilirdi" · "cebimde kalırdı" · 💸 🥲 ✨ 🎁
❌ "soygun" · "hırsızlık" · "devlet" öznesi · parti/lider imaları · 😡 🤬 · ünlem yığını

Duygu hedefi: **buruk gülümseme.** Kullanıcı görseli paylaşırken kendini öfkeli bir eylemci gibi değil, hikâyesini anlatan bir insan gibi hissetmeli.

## 7. Kabul testi (hayal-gerçek örtüşme kontrolü)

İlk implementasyonda şu sabit senaryo render edilip Oğuzhan'a gösterilir, onaydan sonra devam edilir:
- iPhone 17 · 119.000 TL · vergi 59.400 TL
- 6 satır: robot(anneler günü) / kitap / tiyatro(doğum günü) / Kapadokya / LEGO(yılbaşı) / bağış
- Kalan: 340 TL
Üç formatta çıktı + mobil ekranda gerçek boyut önizleme.

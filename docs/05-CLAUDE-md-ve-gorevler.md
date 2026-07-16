# CLAUDE.md (repo köküne kopyala) + Görev Listesi

---

## BÖLÜM A — CLAUDE.md içeriği (repoya `CLAUDE.md` olarak koy)

```markdown
# benimolabilirdi.com

Kâr amaçsız farkındalık projesi: ürün fiyatlarındaki vergileri (ÖTV+KDV+bandrol/fon)
hesaplayıp "bu parayla neler alabilirdim" hayal listesi görseli üretir.
Referans dokümanlar: docs/ altında PRD, data-model, visual-spec. ÇELİŞKİDE PRD KAZANIR.

## Stack
- Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui
- Supabase: DB + Auth (sadece admin) — şema docs/02-data-model.md'de, AYNEN uygula
- Vercel deploy. Git author: "Oguzhan Sadikoglu" (Vercel blocked deployment önlemi)
- Görsel üretimi: tek React bileşeni <ShareCard format="story|post|og" />
  - client indirme: html-to-image → PNG
  - OG: @vercel/og (satori) — AYNI bileşen, ayrı bundle kısıtlarına dikkat
    (satori: flexbox subset, no grid; ShareCard satori-uyumlu yazılacak)

## Mimari kurallar
1. Vergi hesabı TEK dosyada: lib/tax.ts (ters kaskad + kademeli ÖTV çözümü,
   docs/02 §2'deki algoritma). Admin önizleme, seed script, serbest giriş — hepsi bunu kullanır.
   Bu dosyaya unit test ZORUNLU (vitest): telefon kademeleri, kitap (%0), maktu akaryakıt.
2. Kullanıcı akışı stateless: seçimler client state (zustand/context) + paylaşım linki
   /s?d=base64(json). Kullanıcı verisi DB'ye YAZILMAZ. Tek yazma: increment_stats RPC.
3. Fiyat/oran verisi asla hardcode edilmez — her şey DB'den.
4. Sayı formatı: Intl.NumberFormat('tr-TR'), kuruşsuz. "59.400 TL".
5. Copy dili: buruk-samimi, docs/03 §6'daki yasak kelime listesine uy.
   Siyasi içerik KESİNLİKLE yok.
6. Mobil öncelikli. ShareCard dışında her ekran önce 390px'e tasarlanır.
7. Emoji/vektör dışında ürün görseli YOK (telif).

## Komutlar
- dev: npm run dev · test: npm run test · seed: npm run seed (seed/products.csv → Supabase)

## Yapılmayacaklar
- Kullanıcı hesabı, çerez tabanlı takip, scraping, i18n, alkol/tütün kategorisi
```

---

## BÖLÜM B — Fazlı görev listesi

> Model önerisi kolonuyla. İlke: **mimari/riskli işler ilk oturumda ve tek seferde**, rutin CRUD ve UI kalanı Opus 4.8'e.

### Faz A — İskelet (Opus 4.8, ~1 oturum)
- [ ] A1. Next.js 14 + TS + Tailwind + shadcn kurulum, repo, Vercel bağlama
- [ ] A2. Supabase projesi + docs/02 şemasını migration olarak uygula + RLS
- [ ] A3. `lib/tax.ts` + vitest testleri ← **en kritik iş; ilk PR bu olsun**
- [ ] A4. Seed script (`csv → hesapla → upsert`) + 10 ürünlük deneme CSV

### Faz B — ShareCard (Opus 4.8; takılırsa Fable'a dön, ~1 oturum)
- [ ] B1. `<ShareCard />` satori-uyumlu, üç format, docs/03 yerleşimi
- [ ] B2. Kabul testi senaryosunu render et (docs/03 §7) → **Oğuzhan onayı — GATE 🚪**
- [ ] B3. html-to-image indirme + Web Share API + @vercel/og endpoint + /s sayfası

### Faz C — Kullanıcı akışı (Opus 4.8, ~1-2 oturum)
- [ ] C1. Landing + sayaç (stats select + RPC)
- [ ] C2. Ürün seçici (kategori grid → ürün listesi → arama) + serbest tutar girişi
- [ ] C3. Şok ekranı (count-up animasyon + breakdown)
- [ ] C4. Hayal döngüsü: bütçe barı, kategori→etiket→ürün→metin, döngü sonu mantığı
- [ ] C5. Önizleme + paylaşım ekranı (B3 entegrasyonu)

### Faz D — Admin (Opus 4.8, ~1 oturum)
- [ ] D1. Auth + /admin layout
- [ ] D2. Ürün CRUD + canlı vergi önizleme
- [ ] D3. Toplu zam + price_history
- [ ] D4. Etiket CRUD + formül düzenleyici

### Faz E — İçerik ve doğrulama (Fable 5 web search — tek yoğun oturum)
- [ ] E1. ⚠️ Güncel vergi oranlarının teyidi (ÖTV kademeleri, KDV, bandrol %, konaklama vergisi, akaryakıt maktu ÖTV) → tax_formula JSON'ları finalize
- [ ] E2. 14 kategori × 8-10 ürün gerçekçi fiyatlarla tam seed CSV
- [ ] E3. "Nasıl hesaplıyoruz?" sayfası içeriği (kaynak linkli)
- [ ] E4. Tüm site copy'sinin ton denetimi

### Faz F — Cila + lansman (Opus 4.8)
- [ ] F1. Vercel Analytics + basit event'ler (indir/paylaş)
- [ ] F2. SEO/meta, favicon, 404, Lighthouse
- [ ] F3. Mobil gerçek cihaz testi (özellikle story indirme iOS Safari!)
- [ ] F4. Domain bağlama, yayın

### Token stratejisi özeti
| İş | Model | Neden |
|---|---|---|
| Bu dokümanlar (bitti ✅) | Fable 5 | Mimari yoğunluk |
| Design system/wireframe | Claude Design | Ayrı kota |
| A3 tax.ts gözden geçirme | Fable 5 (kısa) | Tek riskli algoritma |
| B2 kabul görseli değerlendirme | Fable 5 (kısa) | Hayal-gerçek kalibrasyonu |
| E1-E2 oran teyidi + seed | Fable 5 | Web search + doğruluk kritik |
| Diğer her şey | Opus 4.8 | Rutin implementasyon |

Kestirim: Fable 5'e kalan ihtiyaç ~%15-20 kota; mevcut %60 rahat yeter, pay da kalır.
```

# benimolabilirdi.com

Kâr amaçsız farkındalık projesi: ürün fiyatlarındaki vergileri (ÖTV+KDV+bandrol/fon)
hesaplayıp "bu parayla neler alabilirdim" hayal listesi görseli üretir.
Referans dokümanlar: docs/ altında PRD, data-model, visual-spec. ÇELİŞKİDE PRD KAZANIR.

## Stack
- Next.js 14 App Router + TypeScript + Tailwind + shadcn/ui
- Supabase: DB + Auth (sadece admin) — şema docs/02-data-model.md'de, AYNEN uygula
- Vercel deploy. Git author: "Oguzhan Sadikoglu" <oguz426@gmail.com>
  ⚠️ E-POSTA KRİTİK: repo `benimolabilirdi` GitHub hesabında ama Vercel `oguz426@gmail.com`
  hesabına bağlı. Commit e-postası benimolabilirdi@gmail.com ise Vercel "blocked deployment —
  commit email could not be matched to a Git account" der ve build hiç başlamaz.
  Vercel yalnızca HEAD'in author'ına bakar; geçmiş commit'ler önemsiz.
- Deploy ELLE yapılır: `npx --yes vercel@50 --prod` (GitHub entegrasyonu iki hesap
  yüzünden bağlanamadı, push deploy TETİKLEMEZ). Sürüm sabitlemesi zorunlu:
  vercel@56 bu makinede npm "Invalid Version" ile kurulmuyor (Node 26 + npm 11).
  Build ~2-4 dk sürer; CLI beklerken yerelde %0 CPU görünür, bu normaldir.
- Görsel üretimi: tek React bileşeni <ShareCard format="story|post|og" />
  - client indirme: html-to-image → PNG
  - OG: @vercel/og (satori) — AYNI bileşen, ayrı bundle kısıtlarına dikkat
    (satori: flexbox subset, no grid; ShareCard satori-uyumlu yazılacak)

## Mimari kurallar
1. Vergi hesabı TEK dosyada: lib/tax.ts (ters kaskad + kademeli ÖTV çözümü,
   docs/02 §2'deki algoritma). Admin önizleme, seed script, serbest giriş — hepsi bunu kullanır.
   Bu dosyaya unit test ZORUNLU (vitest): telefon kademeleri, kitap (%0), maktu akaryakıt.
   lib/tax.ts framework-agnostik kalır: Next/React/Supabase import'u YASAK, sadece saf
   TypeScript. (Sebep: aynı dosya seed script'te tsx ile, admin panelde client'ta,
   API route'ta server'da çalışacak.)
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

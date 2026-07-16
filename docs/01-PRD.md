# benimolabilirdi.com — PRD v1.0

> Bu doküman projenin tek referans kaynağıdır (single source of truth).
> Tasarım kararları için: 04-design-brief.md · Veri modeli için: 02-data-model.md · Görsel çıktı için: 03-visual-spec.md

---

## 1. Vizyon

Türkiye'de tüketicinin ürün fiyatları içinde ödediği vergilerin (ÖTV, KDV, bandrol, fonlar) büyüklüğünü **soyut oranlar yerine somut, kişisel ve duygusal alternatiflerle** gösteren; kullanıcının kendi hikâyesini içeren, sosyal medyada paylaşılabilir görseller üreten bir web sitesi.

**Ana mesaj:** "Bu para vergiye gitmeseydi, şunlar da benim olabilirdi."

**Ton:** Buruk, insani, samimi. Öfkeli değil, suçlayıcı değil, partizan değil. "Vatandaş paylaşımı" hissi; kurumsal altyapı ama kurumsal olmayan dil.

## 2. Proje türü ve kısıtlar

- Ticari değil; sosyal sorumluluk / farkındalık projesi.
- Gelir modeli yok, reklam yok, üyelik yok.
- **Sıfır kişisel veri:** kayıt yok, e-posta yok, çerez minimumu. Sadece anonim toplam sayaç.
- Maliyet hedefi: Vercel free/hobby + Supabase free tier içinde kalmak.

## 3. Kullanıcı akışları

### 3.1 Ana akış: "Aldım" sihirbazı (P0)

1. **Landing:** Tek cümlelik değer önerisi + "Ne aldın?" CTA + site geneli sayaç.
2. **Ürün seçimi:** Kategori → ürün seçimi (arama destekli). Alternatif: **serbest giriş** (kategori + ödenen tutar; sistem o kategorinin vergi formülünü uygular).
3. **Şok ekranı:** "iPhone 17'ye **119.000 TL** ödedin. Bunun **59.400 TL'si** vergiydi." + mini breakdown (ÖTV / KDV / bandrol+fon ayrı satırlar). CTA: "Bu parayla neler olabilirdi? →"
4. **Hayal döngüsü (loop):**
   a. "Bu **59.400 TL**'yi nerede harcamak isterdin?" → kategori seçimi
   b. Kategori içinde alt bağlam sorusu (etiket bazlı): örn. Hediye → "Kime/ne için?" → Anneler Günü / Doğum günü / Yılbaşı...
   c. Etikete uyan ürünler **vergisiz fiyatlarıyla** listelenir.
   d. Kullanıcı ürün seçer → **kişisel metin** girer (placeholder önerili: "Canım anneme anneler günü hediyesi"). Boş bırakılırsa ürün adı kullanılır.
   e. Kalan bütçe güncellenir: `kalan -= ürünün vergisiz fiyatı`
   f. Kalan ≥ (kataloğdaki en ucuz vergisiz fiyat) ise a'ya dön. Kullanıcı her adımda "✅ Tamamla" diyebilir.
   g. Kalan < en ucuz ürün ise: "Cebinde **340 TL** kaldı, onu da simit parası yapalım 🥨" gibi sıcak bir kapanış.
5. **Önizleme + üretim:** Görselin canlı önizlemesi (story/post format seçici) + "📥 İndir" "📤 Paylaş" "🔗 Linki kopyala" "🔄 Baştan".
6. Paylaş linki dinamik OG görseli taşır (bkz. 03-visual-spec.md §5).

### 3.2 "Almayı düşünüyorum" modu (P1)

Aynı sihirbaz, farklı copy: "iPhone 17 **alacağım**. 119.000 TL **ödeyeceğim**... şunlar da benim **olabilirdi**." Görsel şablonu aynı, fiil çekimleri değişir. v1.1'de eklenir.

### 3.3 Admin paneli (P0)

- Supabase Auth ile tek admin girişi (`/admin`).
- CRUD: kategoriler, ürünler, etiketler, vergi formülleri.
- Ürün girişinde admin **sadece raf fiyatını** girer; vergisiz fiyat ve breakdown, kategorinin vergi formülünden **otomatik hesaplanır** (önizlemeli).
- Toplu fiyat güncelleme: kategori bazında % zam uygula (enflasyon güncellemesi) + tek tek düzeltme.
- "Son fiyat güncellemesi" tarihi ürün bazında tutulur, sitede "Fiyatlar temsilidir, son güncelleme: Temmuz 2026" olarak gösterilir.

### 3.4 "Nasıl hesaplıyoruz?" sayfası (P0 — itibar sigortası)

Statik sayfa: vergi zinciri şeması (matrah → bandrol/fon → ÖTV → KDV), her kategorinin formülü, kaynaklar (ÖTV Kanunu ekli listeler, KDV oranları BKK), örnek hesap. **Site viral olursa ilk saldırı "yanlış hesaplıyorsunuz" olur; bu sayfa o saldırının panzehiridir.**

## 4. Hesaplama metodolojisi

### 4.1 İlke

"Vergisiz fiyat" = üründeki **tüm dolaylı vergiler ve vergi benzeri yükler** (ÖTV, KDV, TRT bandrolü, kültür fonu vb.) çıkarıldığında kalan çıplak fiyat. Verginin vergisi (ÖTV üzerinden KDV) kaskad olarak doğru sırayla çözülür.

### 4.2 Ters hesap (raf fiyatından matraha)

Vergi zinciri kategoriye göre JSON formülle tanımlanır (bkz. 02-data-model.md). Genel form:

```
raf = matrah × (1 + bandrol + fon) × (1 + ÖTV) × (1 + KDV)
matrah = raf / [(1 + bandrol + fon) × (1 + ÖTV) × (1 + KDV)]
vergisiz_fiyat = matrah
toplam_vergi = raf − matrah
```

Örnek — telefon (bandrol %12 + fon %1, ÖTV %50, KDV %20):
`çarpan = 1.13 × 1.50 × 1.20 = 2.034` → 119.000 TL'lik telefonun vergisiz fiyatı ≈ **58.500 TL**, vergi ≈ **60.500 TL** (fiyatın ~%51'i).

### 4.3 Kademeli ÖTV (telefon, otomobil)

ÖTV oranı **matraha** göre belirlenir. Ters hesapta her kademe oranıyla matrah denenir, matrahın o kademenin aralığına düştüğü çözüm geçerlidir (kapalı-form, iterasyon gerekmez; kod tarafında 3-5 satır). Pratikte tüm akıllı telefonlar en üst kademede (%50) — eşikler güncellenmediği için.

### 4.4 Kategori formülleri (SEED AŞAMASINDA DOĞRULANACAK ⚠️)

Aşağıdaki oranlar Ocak 2026 bilgisiyle yazılmıştır; **seed data girilirken güncel mevzuattan teyit edilecek** (görev listesinde F-2). Oranlar DB'de tutulduğu için mevzuat değişince kod değişmez.

| Kategori | ÖTV | KDV | Ek yükler | Not |
|---|---|---|---|---|
| Cep telefonu | %25/40/50 kademeli (fiilen %50) | %20 | TRT bandrol %12 + kültür fonu %1 | |
| Otomobil | %45–%220+ (motor+matrah kademeli) | %20 | — | Kademe tablosu ayrı tutulur |
| Beyaz eşya | %6,7 | %20 | — | |
| TV | %6,7 (panel boyutuna göre değişebilir) | %20 | TRT bandrol | |
| Oyun konsolu | %20 | %20 | TRT bandrol olabilir | |
| Kozmetik/parfüm | %20 | %20 | — | |
| Akaryakıt | Maktu (TL/litre) | %20 | — | Formül tipi farklı: maktu |
| Kitap (basılı) | — | %0 | — | Vergisiz fiyat = raf fiyatı (dürüstlük göstergesi) |
| Tiyatro/konser | — | %10 veya %20 | — | |
| Tatil (konaklama) | — | %10 | Konaklama vergisi %2 | |
| Sağlık (özel) | — | %10 | — | |
| Eğitim (özel kurs) | — | %10/%20 | — | |
| Oyuncak | — | %20 | — | |
| Bağış | — | — | — | Vergi yok; 1:1 geçer |

### 4.5 Görselde ifade

- Ana satır: "Bunun **X TL'si vergiydi**" (tüm vergiler toplamı).
- İfade: **"Eğer vergiler olmasaydı"** (ÖTV değil — çünkü hepsi dahil).
- Dipnot: "*ÖTV + KDV + bandrol/fon dahil · hesap detayı: benimolabilirdi.com/hesap*"

## 5. Kategoriler (v1)

Beyaz eşya · Otomobil · Elektronik (telefon/TV/bilgisayar/konsol ayrı alt gruplar) · Akaryakıt · Eğitim · Kültür-Sanat · Sağlık · Tatil · Kitap · Oyuncak · Hediye* · Bağış · Evcil hayvan · Spor

*Hediye gerçek bir kategori değil, **etiket kümesi**dir: "anneler günü", "babalar günü", "doğum günü", "yılbaşı", "sevgililer günü", "bayram" etiketli ürünler her kategoriden gelebilir. UI'da kategori gibi görünür, arkada tag sorgusudur.

## 6. Etiket sistemi

- Ürün ↔ etiket çoktan-çoğa.
- Etiket türleri: `occasion` (anneler günü, yılbaşı...), `recipient` (anne, çocuk, yeğen, kendim...), `context` (kış tatili, okul dönemi...).
- Görselde satır sonunda chip olarak görünür: 🏷️ *Anneler Günü Hediyesi* — duygusal bağlamı taşır.

## 7. Site geneli sayaç

`stats` tablosunda tek satır. Her görsel üretiminde `toplam_vergi` ve `görsel_sayısı` atomik artar. Landing'de: "Bu sitede şimdiye kadar **₺X** vergi hesaplandı · **Y** kişi hayalini paylaştı." Kişisel veri yok.

## 8. Hukuki / etik çerçeve

- **Marka adları:** "iPhone 17" gibi adların tanımlayıcı (nominative) kullanımı; logo yok, ürün fotoğrafı yok, emoji/vektör illüstrasyon. Marka ile iltisak izlenimi verilmez ("Apple onaylı" vb. asla).
- **Fiyatlar temsilidir** ibaresi her görselde ve sitede.
- **Siyasi tarafsızlık:** Parti adı, lider adı, seçim, hükümet/muhalefet kelimeleri sitede ve görsellerde geçmez. Vergi verisi resmi mevzuata dayanır, yorum içermez. Bu, projenin hem etik duruşu hem hukuki zırhıdır.
- Alkol/tütün kategorisi bilinçli olarak **yok** (ton ve hedef kitle gereği).
- Künye/hakkında sayfasında amaç şeffafça yazılır: "vergi bilinci ve mali şeffaflık farkındalığı."

## 9. Non-goals (v1'de YOK)

- Kullanıcı hesabı, geçmiş kaydetme
- Gerçek zamanlı fiyat scraping
- Mobil uygulama
- Çoklu dil (yalnız TR)
- Yorum/sosyal özellikler

## 10. Başarı metrikleri

- Üretilen görsel sayısı (sayaç)
- Paylaş/İndir tıklama oranı (basit, çerezsiz event — Vercel Analytics)
- OG linki üzerinden dönen trafik oranı

## 11. Teknik özet

Next.js 14 (App Router) · Supabase (DB + Auth sadece admin) · Vercel · görsel üretimi: tek React şablon → client'ta `html-to-image` ile PNG + `@vercel/og`/satori ile OG · Tailwind. Detay: 05-CLAUDE.md.

# 08 — E1 Teyit Raporu + Kesin Formül Seti (18 Temmuz 2026)

> E1 oturumu KAPANDI. Tüm oranlar bugünkü mevzuat taramasıyla teyitlidir.
> Tek açık kalem: akaryakıt Temmuz maktu tutarının Resmî Gazete kesinleşmesi (§4).

## 1. Teyit edilen oranlar ve kaynaklar

| Kalem | Değer | Kaynak/Dayanak |
|---|---|---|
| Otomobil ÖTV (içten yanmalı) | Aşağıdaki kademe tabloları | 10115 sayılı CB Kararı, RG 24.07.2025 |
| Otomobil ÖTV (elektrik/HEV) | Aşağıda | Aynı karar |
| TRT bandrol — telefon %12, TV %16, bilgisayar/tablet %4, akıllı saat %14, kara taşıtı %0,8, uydu/set-üstü %12 | 2022/5610 sayılı CB Kararı (RG 26.05.2022), hâlen yürürlükte | |
| Kültür fonu (telefon) | %1 | Kültür Bakanlığı kesintisi |
| Telefon ÖTV | %25/40/50 (matrah 640/1500 TL eşikleri) — fiilen tümü %50 | ÖTV IV liste |
| Beyaz eşya / küçük ev aletleri / TV ÖTV | %6,7 | ÖTV IV liste |
| Oyun konsolu ÖTV | %20 · bandrol YOK (yayın alıcısı değil) | ÖTV IV liste |
| Kozmetik/parfüm ÖTV | %20 · elektrikli kişisel bakım cihazları %6,7 | ÖTV IV liste |
| Akaryakıt maktu ÖTV | Benzin 17,48 TL/lt · Motorin 16,74 TL/lt (bkz. §4 ⚠️) | Ocak 10799 sayılı Karar (14,82/13,90) + Temmuz güncellemesi |
| KDV | Tüm bu ürünlerde %20 (baseline) | |
| ÖTV eski araç oranları (%45-60) | GEÇERSİZ — 24.07.2025'te kaldırıldı, taban %70 | |

## 2. Otomobil kademe tabloları (variant → formül)

Zincir (hepsi): bandrol %0,8 [base:matrah] → ÖTV [kademeli] → KDV %20.
ÖTV matrahı bandrolü içerir (Ozan Bingöl örneğiyle teyitli).

**icten_0_1400** (≤1400 cm³; benzin/dizel/LPG/hafif hibrit):
≤650.000 → %70 · 650-900B → %75 · 900B-1,1M → %80 · >1,1M → %90

**icten_1400_1600:** ≤850B → %75 · 850B-1,1M → %80 · 1,1-1,65M → %90 · >1,65M → %100
**icten_1600_2000:** ≤1,65M → %150 · >1,65M → %170
**icten_2000_plus:** tek oran %220
**hev_50kw_1800** (e-motor >50 kW, hacim ≤1800 — Corolla/Yaris Hibrit):
≤1,25M → %70 · >1,25M → %80
**ev_lte160** (elektrik ≤160 kW): ≤1,65M → %25 · >1,65M → %55
**ev_gt160:** ≤1,65M → %65 · >1,65M → %75 (listede araç yok, hazır dursun)

Listedeki tüm elektrikliler ≤160 kW varsayıldı (Megane E-Tech ve Togg V1 RWD tam
160 kW — "geçmeyen" sınıfında). CSV'deki kh sütunu batarya kWh'ıydı, motor kW değil;
eşleştirme model bilgisinden yapıldı.

## 3. Kategori formülleri (baseline-KDV modeliyle, JSON)

Ortak: `{"key":"kdv","label":"KDV","short_label":"KDV","rate":0.20,"baseline":true}`
her zincirin SONUNDA. comparisonPrice = matrah × (1+baseline'lar);
excessTax = raf − comparisonPrice. Bandrol/fon base:"matrah".

```jsonc
telefon: [bandrol .12 "TRT Bandrolü"/"TRT payı" base:matrah,
          fon .01 "Kültür Fonu"/"fon" base:matrah,
          otv tiers[640:.25, 1500:.40, null:.50], kdv-baseline]
televizyon: [bandrol .16 base:matrah, otv .067, kdv-baseline]
bilgisayar-tablet: [bandrol .04 base:matrah, kdv-baseline]
akilli-saat: [bandrol .14 base:matrah, kdv-baseline]
oyun-konsolu: [otv .20, kdv-baseline]
beyaz-esya: [otv .067, kdv-baseline]
kozmetik: [otv .20, kdv-baseline]           // variant otv67: [otv .067, kdv-baseline]
otomobil: variant tabloları (§2) + [bandrol .008 base:matrah, kdv-baseline]
akaryakit: fixed_per_unit litre
  benzin_lt: [otv 17.48 TL/lt, kdv-baseline] · motorin_lt: [otv 16.74 TL/lt, kdv-baseline]
kitap: [] (KDV %0 — comparison = raf)
kultur-sanat / tatil / saglik / egitim / oyuncak: [kdv-baseline .10 veya .20] → excess=0
bagis: type none
// variant kdv_only (terazi): [kdv-baseline] → excess=0
```

Excess=0 kategoriler "Ne aldın?"da görünmez (is_purchasable=false); hayal tarafında
comparison = GERÇEK raf fiyatı olur — model tam da bunu vaat ediyor.

**is_purchasable=true:** otomobil, telefon, televizyon, bilgisayar-tablet,
oyun-konsolu, akilli-saat, akaryakit, beyaz-esya (Oğuzhan onayı).
Kozmetik purchasable DEĞİL (Oğuzhan kararı: rakamlar küçük). Hepsi is_spendable=true.

## 4. Açık kalem ⚠️ + /hesap sayfası dürüstlük notları

1. **Akaryakıt maktu tutarı:** Ocak kesinleşmiş (14,82/13,90), Temmuz artışı
   (+2,66/+2,84) haber kaynaklı beklenti — F fazında Resmî Gazete'den kesinleştir,
   admin'den düzelt. Ayrıca **eşel mobil** notu /hesap'a: fiilen tahsil edilen ÖTV
   dönemsel olarak tarife tutarından sapabilir; hesapta tarife esas alınır.
2. **Bandrol matrah yaklaşımı:** bandrol yasal olarak ithalat/imalat bedeli
   üzerinden alınır; model matrah üzerinden oranlar. /hesap'a tek cümle:
   "bandrol tutarı yaklaşık hesaplanır ve ticari marj nedeniyle olduğundan
   YÜKSEK görünebilir; toplam sapma küçüktür." (Telefonda ±1-2 puan.)
3. **EV kW varsayımı** (§2 sonu) /hesap'ta "elektrikli araçlarda motor gücü sınıfı
   üretici verisinden alınmıştır" notuyla.
4. Fiyat kaynağı ibaresi: "Fiyatlar Temmuz 2026'da marka siteleri ve yaygın
   e-ticaret platformlarından derlenmiş temsili fiyatlardır."

## 5. Örnek doğrulamalar (kabul testine girecek)

| Ürün | Raf | Vergisiz (matrah) | Comparison (KDV'li) | Excess | Excess % |
|---|---|---|---|---|---|
| Yeni Clio 1.83M (%75 kademesi) | 1.830.000 | ~864.000 | ~1.037.000 | ~793.000 | %43 |
| Corolla 1.5 (%80 kademesi) | 2.284.000 | ~1.049.000 | ~1.259.000 | ~1.025.000 | %45 |
| Togg V1 (%25 EV) | 1.909.048 | ~1.263.000 | ~1.515.000 | ~394.000 | %21 |
| iPhone 17 PM 256 (%50) | 122.000 | ~59.980 | ~71.980 | ~50.020 | %41 |
| Samsung 109 TV | 34.000 | ~22.900 | ~27.480 | ~6.520 | %19 |
| 40 lt benzin | 2.640 | ~1.501 | ~1.801 | ~839 | %32 |

(Kademe çözücü kontrolleri elle yapıldı: Clio %75'te, Corolla %80'de, Yaris Hibrit
%70'te, Corolla Hibrit %80'de tutarlı çözülüyor; EV'lerin hepsi %25'te, EV3 matrahı
1,643M ile 1,65M eşiğinin hemen altında — kademe boşluğu testine iyi vaka.)

## 6. Opus'a teslim talimatı

1. `seed/products.csv` yeni formatta (variant + quantity + tags sütunları) —
   seed script'i güncelle: variant → formül override eşlemesi §2-3'ten,
   tags → tags/product_tags upsert (noktalı virgül ayraçlı), quantity →
   fixed_per_unit hesabına geçer.
2. Kategori tax_formula'larını §3 ile değiştir; baseline/base:"matrah"
   desteği daha önce kararlaştırılan A seçeneğiyle lib/tax.ts'te.
3. Etiket master listesi: occasion(anneler-gunu 🌷, babalar-gunu 👔,
   dogum-gunu 🎂, yilbasi 🎄, sevgililer-gunu ❤️, bayram 🌙) ·
   recipient(anne, baba, es, cocuk, yegen, aile, kendim) · context(ev, okul).
4. Admin ayarları: pompa fiyatları (benzin/motorin TL/lt) + akaryakıt maktu
   ÖTV (TL/lt) — akaryakıt ürün fiyatları pompa fiyatından türetilir.
5. §5 tablosu tax.ts testlerine fixture olarak eklenir (±%1 tolerans).

# Claude Design Brief — benimolabilirdi.com

> Bu brief'i Claude Design'a olduğu gibi ver. Çıktılar: design system (token'lar), wireframe seti, hi-fi prototype.

## Proje tek cümlede
Türkiye'de ürün fiyatlarının içindeki vergileri, kullanıcının "bu parayla neler alabilirdim" hayal listesine çevirip paylaşılabilir görsel üreten, kâr amaçsız bir farkındalık sitesi.

## Marka kişiliği
- **Buruk ama sıcak.** Öfke değil, hüzünlü gülümseme. "Ah be" hissi.
- **Vatandaş sesi.** Kurumsal altyapı, ama bir arkadaşın story'si gibi duran çıktı.
- **Dürüst ve şeffaf.** Rakamlar ciddi, sunum samimi.
- Referans his: bir bütçe uygulamasının ciddiyeti × bir kart/hediye uygulamasının sıcaklığı.

## Kesin yasaklar
- Siyasi parti çağrışımı yapan renk kompozisyonları (bayrak düzeni kırmızı-beyaz, baskın turuncu, altı ok benzeri motifler)
- Öfke ikonografisi (yumruk, megafon, protesto görselleri)
- Kurumsal soğukluk (gri-mavi fintech şablonu, stok fotoğraf)
- Gerçek ürün fotoğrafları ve marka logoları — illüstrasyon/emoji dili zorunlu

## Görsel dil yönü
- Palet çekirdeği (geliştirilebilir): sıcak krem zemin `#FAF3E8`, koyu lacivert metin `#1E2A4A`, mercan vurgu `#E85D4A`, yeşil pozitif `#2E7D5B`
- Tipografi: yuvarlak hatlı, sıcak, yüksek okunabilirlikli sans (Nunito / DM Sans / Figtree yönünde; Türkçe karakter desteği şart)
- El çizimi dokunuşlar: dalgalı alt çizgi, yıldız/parıltı işaretleri — "insan eli değmiş" hissi
- Emoji birinci sınıf tasarım öğesidir; kategori ve ürün kimliği emojiyle taşınır

## Tasarlanacak ekranlar (öncelik sırasıyla)

**Kullanıcı tarafı — mobil öncelikli (trafiğin ~%80'i mobil beklenir):**
1. Landing: değer önerisi + "Ne aldın?" CTA + canlı sayaç ("₺X vergi hesaplandı")
2. Ürün seçici: kategori grid'i (emoji + ad) → ürün listesi + arama + "listede yok, tutarı ben gireyim" yolu
3. Şok ekranı: ödenen / vergi breakdown / vergisiz fiyat — sayı animasyonlu, duygusal tepe noktası
4. Hayal döngüsü: kalan bütçe göstergesi (üstte sabit, azalan bar) + kategori seçimi + etiket sorusu + ürün seçimi + kişisel metin girişi (tek akış, adım göstergeli)
5. Önizleme + paylaşım: format seçici (story/post), İndir / Paylaş / Linki kopyala / Baştan
6. "Nasıl hesaplıyoruz?" sayfası: vergi zinciri şeması — güven veren, okunabilir

**Görsel şablonun kendisi (ShareCard):** 03-visual-spec.md'deki yerleşimi hi-fi'a çevir — üç format. Bu, projenin asıl "ürünü"dür; en çok iterasyon buraya.

**Admin tarafı — düşük öncelik, düz fonksiyonel:** ürün tablosu, ürün formu (canlı vergi önizlemeli), toplu zam ekranı. Shadcn/ui varsayılanları yeterli, marka gerektirmez.

## Kilit UX anları
1. **Şok anı:** vergi tutarı ekrana sayarak gelmeli (count-up), mercan renk, büyük.
2. **Hayal anı:** her ürün eklenişinde liste büyürken minik bir kutlama mikro-animasyonu (konfeti değil — abartısız parıltı ✨).
3. **Kalan bütçe:** azalan bar/cüzdan metaforu — oyunlaştırma hissi, "parayı harcamak" keyifli olmalı.
4. **Bitiş:** "cebinde 340 TL kaldı, simit parası 🥨" — sıcak kapanış copy'si tasarımda yer bulmalı.

## Teslimat formatı
- Design token'ları (renk, tip ölçeği, spacing, radius, gölge) → Tailwind config'e çevrilebilir yapıda
- Wireframe: yukarıdaki 6 kullanıcı ekranı, mobil
- Hi-fi prototype: Landing + Hayal döngüsü + ShareCard (üç format) minimum

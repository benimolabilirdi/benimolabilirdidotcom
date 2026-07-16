# 07 — Persona Modülü v1.1 ("Kimsin?" adımı)

> DEĞİŞİKLİK GEÇMİŞİ — v1.1: (a) copy kalıbı "— yine de üstüne:" → "Oysa ben..."
> (dekreşendo); (b) persona satırının yeri vergi bloğunun ÖNÜNDEN ARKASINA alındı
> (kreşendo kurgusu, aşağıda §5); (c) bileşen kısaltmaları kod-içi haritadan
> formül JSON'undaki `short_label` alanına taşındı; (d) "Bakanlık fonu" → "fon".
> Çelişkide sıra: PRD > bu doküman > 03/06 (tipografi ölçüsünde bu doküman §5 geçerli).

## 1. Kavram ve kreşendo kurgusu

Görselin üst bloğu artan tonla okunur (kullanıcı isteği: crescendo), persona
zirveden SONRA buruk iç ses olarak gelir:

```
p1  iPhone 17 aldım.                                  (fısıltı)
p2  119.000 TL ödedim.                                (yükseliş)
p3  Bunun 59.400 TL'si ÖTV + KDV + TRT payı + fondu.  (ZİRVE — mercan)
p4  Oysa ben maaşımdan %27'ye varan gelir vergisini   (dekreşendo — persona)
    zaten ödüyorum.
p5  ✨ Şunlar da benim olabilirdi:                     (ikinci küçük tepe → liste)
```

- Persona seçilmediyse p4 atlanır; p3'ten p5'e geçilir, kreşendo bozulmaz.
- p4 ile p5 arasına köprü cümle GEREKMEZ; gerekirse tek nötr seçenek:
  "Bunları ödemeseydim..." — "yan vergiler" tabiri KULLANILMAZ (mevzuatta yok).

## 2. UX kuralları (değişmedi)

- Adım opsiyonel; "Belirtmek istemiyorum" → p4 hiç basılmaz.
- Ücretli / şahıs seçiminde ikinci tek-dokunuş: dilim (%15/20/27/35/40),
  yanında 2026 eşik yardımcı metni (görsele girmez).
- Beyan kullanıcıya aittir, doğrulanmaz. Seçim client state'te; DB'ye yazılmaz.

## 3. Copy kataloğu v1.1 (DB'ye seed edilecek TAM cümleler)

Ton: özne "devlet" YASAK; mekanik bordro dili yok; "…'e varan" kalıbı marjinal
sistemi anlatır; hepsi "Oysa" ile zirveye itiraz eder.

| key | UI etiketi | image_line |
|---|---|---|
| ogrenci | 🎓 Öğrenciyim | Oysa ben öğrenciyim — kazanmaya başlamadım bile. |
| asgari | 💼 Asgari ücretliyim | Oysa ben asgari ücretliyim — gelir vergisinden muafım. |
| ucretli_15 | 🧾 Ücretliyim · %15 dilimi | Oysa ben maaşımdan %15'e varan gelir vergisini zaten ödüyorum. |
| ucretli_20 | 🧾 Ücretliyim · %20 dilimi | Oysa ben maaşımdan %20'ye varan gelir vergisini zaten ödüyorum. |
| ucretli_27 | 🧾 Ücretliyim · %27 dilimi | Oysa ben maaşımdan %27'ye varan gelir vergisini zaten ödüyorum. |
| ucretli_35 | 🧾 Ücretliyim · %35 dilimi | Oysa ben maaşımdan %35'e varan gelir vergisini zaten ödüyorum. |
| ucretli_40 | 🧾 Ücretliyim · %40 dilimi | Oysa ben maaşımdan %40'a varan gelir vergisini zaten ödüyorum. |
| sahis_15..40 | 🏪 Şahıs işletmem var · %X | Oysa ben kazancımdan %X'e varan gelir vergisini zaten ödüyorum. |
| sirket | 🏢 Şirket sahibiyim | Oysa şirketim %25 kurumlar vergisini zaten ödüyor. |
| emekli | 👴 Emekliyim | Oysa ben emekliyim — bir ömür çalıştım. |
| yok | ⏳ Belirtmek istemiyorum | (p4 basılmaz) |

Not (E fazı ton denetimi): "%40'a varan" en üst dilimde de teknik olarak doğru;
tutarlılık için kalıp korunur, E'de son okuma yapılır.

2026 eşik yardımcı metinleri (UI, görsele girmez):
Ücretli %15 ≤190B · %20 190–400B · %27 400B–1,5M · %35 1,5–5,3M · %40 5,3M+ ·
Şahısta %27 eşiği 1M. Kaynak: GVK md.103, 332 Seri No'lu Tebliğ → /hesap.

## 4. Veri modeli ekleri

personas tablosu v1.0'daki gibi (key, group_key, ui_label, ui_helper,
image_line NULL→basılmaz, sort_order, is_active, valid_year). Ek karar:

**Bileşen kısa etiketleri DB'de:** kategorilerin tax_formula JSON'undaki her
bileşene opsiyonel `short_label` eklenir:
```jsonc
{ "key": "bandrol_fon", "label": "TRT Bandrolü + Kültür Fonu",
  "short_label": "TRT payı + fon", "rate": 0.13 }
```
Görsel p3 bileşen listesi: lines[] üzerinden `short_label ?? label` ile kurulur.
Kod-içi kısaltma haritası KULLANILMAZ (admin label'ı değiştirince kırılır).
assertValidFormula'ya short_label için tip kontrolü eklenir (opsiyonel string).

## 5. ShareCard — D8 revize (kreşendo tipografi ölçüsü, story 1080 kanvas)

03 §3 Zone B ölçülerini geçersiz kılar; post/kare/OG'de oranlar korunarak küçülür.

| Satır | Boyut | Font | Renk |
|---|---|---|---|
| p1 aldım | 44px | Nunito 700 | navy-800 |
| p2 ödedim | 64px | Nunito 800 | navy-800 |
| p3 rakam | ~150px (nowrap; sığmazsa punto düşer, ASLA satır kırılmaz) | DM Sans 800 tabular | coral-500 |
| p3 destek ("Bunun" + bileşen listesi) | 44px | Nunito 700 | coral-600 |
| p4 persona | 40px | Nunito 600 italik | navy-500 |
| p5 başlık | 52px | Nunito 800 + dalgalı çizgi | navy-800 |

- p3 bileşen listesi fiilen breakdown'da olan kalemlerden kurulur (§4);
  kitap/bağış gibi vergisiz üründe p3 hiç oluşmaz (o senaryo zaten akışta yok).
- Kapanış satırı DS yeşil kutu stilinde; kalan < 40 TL → 🥨, değilse 🎈.

## 6. Görev listesi etkisi

- Faz B: D8 bu revizyonla işlenir; kabul testi = 4 format × 2 varyant
  (ucretli_27 + persona'sız), R2–R6 uygulanmış halde → GATE.
- Faz C: C2.5 persona adımı · Faz D: D5 persona CRUD + formül düzenleyiciye
  short_label alanı · Faz E: copy son okuma + eşik metin teyidi.

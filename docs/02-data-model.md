# benimolabilirdi.com — Veri Modeli v1.0 (Supabase)

## 1. Şema

```sql
-- ============ KATEGORİLER ============
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- 'telefon', 'beyaz-esya'
  name text not null,                     -- 'Cep Telefonu'
  emoji text not null,                    -- '📱'
  sort_order int default 0,
  is_active boolean default true,
  is_purchasable boolean default true,    -- ana akışta "bunu aldım" diye seçilebilir mi
  is_spendable boolean default true,      -- hayal döngüsünde harcanabilir mi (örn. otomobil ikisinde de true)
  tax_formula jsonb not null,             -- bkz. §2
  created_at timestamptz default now()
);

-- ============ ÜRÜNLER ============
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,                     -- 'iPhone 17 256GB'
  emoji text,                             -- kategori emojisini override edebilir
  retail_price numeric(12,2) not null,    -- admin SADECE bunu girer
  tax_free_price numeric(12,2) not null,  -- otomatik hesaplanır (trigger/app-level)
  tax_breakdown jsonb not null,           -- {"otv": 39500, "kdv": 19800, "bandrol_fon": 6100}
  default_line_text text,                 -- görsel satırı için öneri: 'Anneme yeni bir mutfak robotu'
  price_updated_at timestamptz default now(),
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);
create index on products (category_id) where is_active;

-- ============ ETİKETLER ============
create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- 'anneler-gunu'
  name text not null,                     -- 'Anneler Günü Hediyesi'
  emoji text,                             -- '🌷'
  kind text not null check (kind in ('occasion','recipient','context')),
  is_active boolean default true,
  sort_order int default 0
);

create table product_tags (
  product_id uuid references products(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (product_id, tag_id)
);

-- ============ SAYAÇ ============
create table stats (
  id int primary key default 1 check (id = 1),   -- tek satır
  total_tax_calculated numeric(16,2) default 0,
  total_images_generated bigint default 0,
  updated_at timestamptz default now()
);
insert into stats (id) values (1);

-- Atomik artış için RPC:
create or replace function increment_stats(tax_amount numeric)
returns void language sql security definer as $$
  update stats set
    total_tax_calculated = total_tax_calculated + tax_amount,
    total_images_generated = total_images_generated + 1,
    updated_at = now()
  where id = 1;
$$;

-- ============ FİYAT GEÇMİŞİ (audit, opsiyonel ama ucuz) ============
create table price_history (
  id bigint generated always as identity primary key,
  product_id uuid references products(id) on delete cascade,
  old_price numeric(12,2),
  new_price numeric(12,2),
  changed_at timestamptz default now()
);
```

## 2. Vergi formülü JSON şeması

Kategori bazında `tax_formula`. İki tip: `chain` (oransal zincir) ve `fixed` (maktu, akaryakıt).

```jsonc
// Telefon örneği — sıra önemli, kaskad bu sırayla çözülür
{
  "type": "chain",
  "components": [
    { "key": "bandrol_fon", "label": "TRT Bandrolü + Kültür Fonu", "rate": 0.13 },
    { "key": "otv", "label": "ÖTV", "tiers": [
        { "max_matrah": 640,  "rate": 0.25 },
        { "max_matrah": 1500, "rate": 0.40 },
        { "max_matrah": null, "rate": 0.50 }
      ]},
    { "key": "kdv", "label": "KDV", "rate": 0.20 }
  ]
}

// Beyaz eşya
{ "type": "chain", "components": [
    { "key": "otv", "label": "ÖTV", "rate": 0.067 },
    { "key": "kdv", "label": "KDV", "rate": 0.20 } ] }

// Kitap
{ "type": "chain", "components": [] }   // vergisiz fiyat = raf fiyatı

// Bağış
{ "type": "none" }

// Akaryakıt (litre bazlı maktu)
{ "type": "fixed_per_unit", "unit": "litre",
  "components": [
    { "key": "otv", "label": "ÖTV", "amount_per_unit": 0.0 },  // seed'de doldurulacak ⚠️
    { "key": "kdv", "label": "KDV", "rate": 0.20 } ] }
```

### Ters hesap algoritması (chain)

```
çarpan = ∏(1 + component_rate)          // kademesiz bileşenler
Kademeli ÖTV için: her tier oranıyla matrah = raf / çarpan(tier) hesapla;
matrah tier aralığına düşüyorsa o çözüm geçerli. (Kapalı form, iterasyon yok.)
tax_free_price = matrah
breakdown: zincir ileri yönde tekrar yürütülerek her bileşenin TL tutarı yazılır.
```

Bu fonksiyon **tek yerde** yaşar: `lib/tax.ts`. Hem admin panel önizlemesi, hem seed script, hem serbest tutar girişi aynı fonksiyonu kullanır.

## 3. RLS politikası

- `categories`, `products`, `tags`, `product_tags`, `stats`: herkese **select**; yazma sadece authenticated admin.
- `increment_stats` RPC: anon çağırabilir (security definer) — tek yazma kapısı bu.
- `price_history`: sadece admin.

## 4. Seed data formatı (CSV)

`seed/products.csv`:
```
category_slug,name,emoji,retail_price,default_line_text,tags
telefon,iPhone 17 256GB,📱,119000,,
beyaz-esya,Mutfak Robotu (orta segment),🥣,8900,Anneme yeni bir mutfak robotu,"anneler-gunu,anne"
kitap,1 Yıllık Kitap Aboneliği,📚,4200,Bir yıllık kitaplarım,"kendim"
kultur-sanat,Tiyatro Bileti x4,🎭,3600,Kuzenlerle tiyatro gecesi,"dogum-gunu,aile"
tatil,Kapadokya 2 Gece 2 Kişi,🎈,15000,Kapadokya'da 2 gece,"sevgililer-gunu,es"
oyuncak,LEGO Classic Büyük Set,🧸,2700,Yeğenime LEGO seti,"dogum-gunu,cocuk,yilbasi"
bagis,Depremzede Ailelere Katkı,❤️,5000,Depremzedelere bağış,
```
`tax_free_price` CSV'de YOK — seed script `lib/tax.ts` ile hesaplar. Hedef: 14 kategori × 8-10 ürün ≈ **120-140 satır**.

## 5. Admin panel ekranları

1. **Giriş** (Supabase Auth, magic link veya e-posta+şifre, tek kullanıcı)
2. **Ürün listesi:** kategori filtreli tablo; satırda raf fiyatı, vergisiz fiyat, vergi %, son güncelleme; inline fiyat düzenleme
3. **Ürün formu:** ad, kategori, emoji, raf fiyatı, default metin, etiket çoklu seçim → canlı vergi önizlemesi ("Vergisiz: 58.500 TL · ÖTV: 39.500 · KDV: 19.800 · Bandrol+Fon: 6.100")
4. **Toplu güncelleme:** kategori seç → "%X zam uygula" → önizleme → onay (price_history'ye yazar)
5. **Etiket yönetimi:** CRUD
6. **Formül düzenleyici:** kategori JSON'unu formla düzenleme (rate alanları), değişince "bu kategorideki N ürünün vergisiz fiyatı yeniden hesaplanacak" onayı

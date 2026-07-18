-- docs/08 final içerik paketi.
-- 1) Hayal döngüsü artık comparison_price (adil fiyat, standart KDV'li) ile filtreler/harcar.
alter table products add column if not exists comparison_price numeric(12,2);

-- 2) Hazır söz havuzu (quips). Serbest metin kalktı; kullanıcı önerilen sözlerden seçer.
create table if not exists quips (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('universal','kategori','urun')),
  category_id uuid references categories(id) on delete cascade,  -- kategori scope'u için
  product_match text,                                            -- urun scope'u: ad substring eşleşmesi
  text text not null,
  hide_if_same_category boolean default false,                   -- alınan ürün = hayal ürünü kategorisi ise gizle
  is_active boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table quips enable row level security;
create policy quips_read on quips for select to anon, authenticated using (true);
create policy quips_admin_write on quips for all to authenticated using (true) with check (true);

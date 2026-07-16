-- benimolabilirdi.com — ilk şema
-- Kaynak: docs/02-data-model.md §1 (tablolar) ve §3 (RLS). Şema AYNEN uygulanır.
--
-- Güvenlik modeli (docs/01-PRD.md §2 "sıfır kişisel veri"):
--   - Herkes okur (anon + authenticated).
--   - Yazma yalnızca authenticated. Sitede kayıt yok, tek authenticated kullanıcı admin.
--     ⚠️ Supabase panelinde signup KAPALI olmalı, yoksa "authenticated = admin" varsayımı çöker.
--   - Kullanıcı verisi hiç yazılmaz. Tek anon yazma kapısı: increment_stats RPC.

create extension if not exists pgcrypto;

-- ============ KATEGORİLER ============
create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,              -- 'telefon', 'beyaz-esya'
  name text not null,                     -- 'Cep Telefonu'
  emoji text not null,                    -- '📱'
  sort_order int default 0,
  is_active boolean default true,
  is_purchasable boolean default true,    -- ana akışta "bunu aldım" diye seçilebilir mi
  is_spendable boolean default true,      -- hayal döngüsünde harcanabilir mi
  tax_formula jsonb not null,             -- bkz. docs/02 §2 · doğrulama: lib/tax.ts assertValidFormula
  created_at timestamptz default now()
);

-- ============ ÜRÜNLER ============
create table products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete cascade,
  name text not null,                     -- 'iPhone 17 256GB'
  emoji text,                             -- kategori emojisini override edebilir
  retail_price numeric(12,2) not null,    -- admin SADECE bunu girer
  tax_free_price numeric(12,2) not null,  -- lib/tax.ts hesaplar (app-level)
  tax_breakdown jsonb not null,           -- {"otv": 39500, "kdv": 19800, "bandrol_fon": 6100}
  default_line_text text,                 -- görsel satırı önerisi
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

-- Atomik artış için RPC. security definer: RLS'i aşar, anon'un tek yazma kapısı budur.
create or replace function increment_stats(tax_amount numeric)
returns void
language sql
security definer
set search_path = public
as $$
  update stats set
    total_tax_calculated = total_tax_calculated + tax_amount,
    total_images_generated = total_images_generated + 1,
    updated_at = now()
  where id = 1;
$$;

revoke execute on function increment_stats(numeric) from public;
grant execute on function increment_stats(numeric) to anon, authenticated;

-- ============ FİYAT GEÇMİŞİ ============
create table price_history (
  id bigint generated always as identity primary key,
  product_id uuid references products(id) on delete cascade,
  old_price numeric(12,2),
  new_price numeric(12,2),
  changed_at timestamptz default now()
);

-- ============ RLS (docs/02 §3) ============
alter table categories    enable row level security;
alter table products      enable row level security;
alter table tags          enable row level security;
alter table product_tags  enable row level security;
alter table stats         enable row level security;
alter table price_history enable row level security;

-- Herkese select
create policy categories_read   on categories   for select to anon, authenticated using (true);
create policy products_read     on products     for select to anon, authenticated using (true);
create policy tags_read         on tags         for select to anon, authenticated using (true);
create policy product_tags_read on product_tags for select to anon, authenticated using (true);
create policy stats_read        on stats        for select to anon, authenticated using (true);

-- Yazma yalnızca admin (authenticated)
create policy categories_admin_write   on categories   for all to authenticated using (true) with check (true);
create policy products_admin_write     on products     for all to authenticated using (true) with check (true);
create policy tags_admin_write         on tags         for all to authenticated using (true) with check (true);
create policy product_tags_admin_write on product_tags for all to authenticated using (true) with check (true);
create policy stats_admin_write        on stats        for all to authenticated using (true) with check (true);

-- price_history: sadece admin, okuma dahil (anon policy yok = anon göremez)
create policy price_history_admin on price_history for all to authenticated using (true) with check (true);

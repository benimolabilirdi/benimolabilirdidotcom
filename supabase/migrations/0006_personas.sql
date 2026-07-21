-- Persona modülü (docs/07-persona-modulu.md §4). "Kimsin?" adımı — ŞOK EKRANINDAN SONRA
-- (docs/01 §3.5: şok anını bölmemek için), hayal döngüsünden önce.
--
-- Beyan KULLANICIYA aittir, doğrulanmaz, DB'ye YAZILMAZ (CLAUDE.md kural 2).
-- Bu tablo sadece KATALOG tutar — hangi seçenekler var ve her birinin görsele
-- basılacak cümlesi ne. Kullanıcının seçimi client state + paylaşım linkinde kalır.
--
-- image_line NULL → görselde p4 satırı hiç basılmaz (docs/07 §1).

create table personas (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,               -- 'ucretli_27'
  group_key text not null,                -- 'ucretli' — iki adımlı seçimde ilk dokunuş
  ui_label text not null,                 -- '🧾 Ücretliyim · %27 dilimi'
  ui_helper text,                         -- '400B–1,5M' — SADECE UI, görsele girmez
  image_line text,                        -- NULL → p4 basılmaz
  sort_order int default 0,
  is_active boolean default true,
  valid_year int not null default 2026,   -- dilim eşikleri yıla bağlı
  created_at timestamptz default now()
);
create index on personas (group_key) where is_active;

alter table personas enable row level security;
create policy personas_read        on personas for select to anon, authenticated using (true);
create policy personas_admin_write on personas for all    to authenticated using (true) with check (true);

-- ============ KATALOG (docs/07 §3 — cümleler AYNEN, parafraz YASAK) ============
-- Eşik yardımcı metinleri: GVK md.103, 332 Seri No'lu Tebliğ (docs/07 §3).
-- ⚠️ Şahıs (sahis_*) ui_helper'ları NULL: docs/07 yalnızca "%27 eşiği 1M" diyor,
--    diğer dört eşiği vermiyor. E1'de teyit edilip UPDATE ile doldurulacak.

insert into personas (key, group_key, ui_label, ui_helper, image_line, sort_order) values
  ('ogrenci', 'ogrenci', '🎓 Öğrenciyim', null,
   'Oysa ben öğrenciyim — kazanmaya başlamadım bile.', 10),

  ('asgari', 'asgari', '💼 Asgari ücretliyim', null,
   'Oysa ben asgari ücretliyim — gelir vergisinden muafım.', 20),

  ('ucretli_15', 'ucretli', '🧾 Ücretliyim · %15 dilimi', '≤190B',
   'Oysa ben maaşımdan %15’e varan gelir vergisini zaten ödüyorum.', 30),
  ('ucretli_20', 'ucretli', '🧾 Ücretliyim · %20 dilimi', '190B–400B',
   'Oysa ben maaşımdan %20’ye varan gelir vergisini zaten ödüyorum.', 31),
  ('ucretli_27', 'ucretli', '🧾 Ücretliyim · %27 dilimi', '400B–1,5M',
   'Oysa ben maaşımdan %27’ye varan gelir vergisini zaten ödüyorum.', 32),
  ('ucretli_35', 'ucretli', '🧾 Ücretliyim · %35 dilimi', '1,5M–5,3M',
   'Oysa ben maaşımdan %35’e varan gelir vergisini zaten ödüyorum.', 33),
  ('ucretli_40', 'ucretli', '🧾 Ücretliyim · %40 dilimi', '5,3M+',
   'Oysa ben maaşımdan %40’a varan gelir vergisini zaten ödüyorum.', 34),

  ('sahis_15', 'sahis', '🏪 Şahıs işletmem var · %15', null,
   'Oysa ben kazancımdan %15’e varan gelir vergisini zaten ödüyorum.', 40),
  ('sahis_20', 'sahis', '🏪 Şahıs işletmem var · %20', null,
   'Oysa ben kazancımdan %20’ye varan gelir vergisini zaten ödüyorum.', 41),
  ('sahis_27', 'sahis', '🏪 Şahıs işletmem var · %27', '400B–1M',
   'Oysa ben kazancımdan %27’ye varan gelir vergisini zaten ödüyorum.', 42),
  ('sahis_35', 'sahis', '🏪 Şahıs işletmem var · %35', null,
   'Oysa ben kazancımdan %35’e varan gelir vergisini zaten ödüyorum.', 43),
  ('sahis_40', 'sahis', '🏪 Şahıs işletmem var · %40', null,
   'Oysa ben kazancımdan %40’a varan gelir vergisini zaten ödüyorum.', 44),

  ('sirket', 'sirket', '🏢 Şirket sahibiyim', null,
   'Oysa şirketim %25 kurumlar vergisini zaten ödüyor.', 50),

  ('emekli', 'emekli', '👴 Emekliyim', null,
   'Oysa ben emekliyim — bir ömür çalıştım.', 60),

  -- image_line NULL → p4 hiç basılmaz, kreşendo p3'ten p5'e atlar (docs/07 §1)
  ('yok', 'yok', '⏳ Belirtmek istemiyorum', null, null, 70);

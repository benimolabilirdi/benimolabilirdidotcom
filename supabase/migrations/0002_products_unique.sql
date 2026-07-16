-- Seed idempotan olsun diye: docs/05 A4 "csv → hesapla → upsert" diyor, upsert'in
-- çakışma hedefi (conflict target) lazım. docs/02 §1'de yoktu; şemaya EK.
-- Aynı kategoride aynı isimde iki ürün zaten anlamsız — seed tekrar çalıştığında
-- yeni satır üretmek yerine mevcut satırı güncellemeli.
alter table products
  add constraint products_category_name_key unique (category_id, name);

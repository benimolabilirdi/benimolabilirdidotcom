-- docs/08 E1: ürün bazında formül override (variant). Otomobil ÖTV kademe tabloları,
-- kozmetik otv67, akaryakıt benzin/motorin maktu, terazi kdv_only — hepsi kategori
-- default'undan farklı. Seed variant'ı çözüp tax_formula'yı ürüne yazar; flow
-- product.tax_formula ?? category.tax_formula kullanır.
alter table products add column if not exists variant text;
alter table products add column if not exists tax_formula jsonb;

-- fixed_per_unit (akaryakıt) miktar hesabı için: litre.
alter table products add column if not exists quantity numeric(12,2);

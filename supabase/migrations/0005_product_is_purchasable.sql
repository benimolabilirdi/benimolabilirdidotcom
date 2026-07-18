-- Ürün bazında "aldım" akışında görünürlük. Bazı ürünler (ör. oyun kolu — aksesuar)
-- ana alımda seçilmesin ama hayal listesinde görünsün. Kategori is_purchasable'ın
-- üstüne ürün seviyesi ince ayar (docs kullanıcı isteği).
alter table products add column if not exists is_purchasable boolean default true;

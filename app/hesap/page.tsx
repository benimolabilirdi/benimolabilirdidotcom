/**
 * "Nasıl hesaplıyoruz?" — itibar sigortası sayfası (PRD §3.4, E3).
 * Vergi zinciri + örnek hesap + kategori formülleri + resmi mevzuat kaynakları +
 * docs/08 §4 dürüstlük notları. Yorum/siyaset yok; sadece yöntem ve kaynak.
 */
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { Wordmark } from '@/components/Wordmark'

export const metadata = {
  title: 'Nasıl hesaplıyoruz?',
  description:
    'Rakamları nasıl bulduğumuz: vergi zinciri, örnek hesap, kategori formülleri ve dayandığımız resmi mevzuat kaynakları.',
}

const h2: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontWeight: 800,
  fontSize: 20,
  margin: '8px 0 0',
  color: 'var(--navy-800)',
}
const p: CSSProperties = {
  fontFamily: 'var(--font-ui)',
  fontSize: 16,
  lineHeight: 1.65,
  color: 'var(--text-body)',
  margin: 0,
}
const muted: CSSProperties = { ...p, color: 'var(--text-muted)', fontSize: 15 }
const card: CSSProperties = {
  background: 'var(--surface-card)',
  border: '1px solid var(--cream-300)',
  borderRadius: 'var(--r-lg)',
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: strong ? 'var(--navy-800)' : 'var(--text-muted)', fontWeight: strong ? 700 : 500 }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-ui)',
          fontVariantNumeric: 'tabular-nums',
          fontSize: strong ? 17 : 15,
          fontWeight: strong ? 800 : 600,
          color: strong ? 'var(--coral-600)' : 'var(--text-body)',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </div>
  )
}

export default function HesapPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        maxWidth: 620,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        padding: '32px 22px 56px',
      }}
    >
      <Wordmark size={20} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 30, margin: 0, color: 'var(--navy-800)' }}>
        Nasıl hesaplıyoruz?
      </h1>
      <p style={{ ...p, fontSize: 17 }}>
        Kısaca: bir ürünün raf fiyatının içinden, satılabilmesi için ödenen vergileri geri çıkarıyoruz.
        Rakamlar resmi mevzuata dayanır, yorum içermez. Aşağıda yöntemi ve kaynakları açıkça bulacaksın.
      </p>

      <h2 style={h2}>Vergi zinciri</h2>
      <p style={p}>
        Bir ürünün vergisi tek kalem değildir; katman katman eklenir. Sıra genelde şöyledir:
      </p>
      <ol style={{ ...p, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <li><b>Matrah</b> — ürünün vergisiz, çıplak değeri.</li>
        <li><b>TRT payı / bandrol ve fon</b> — bazı ürünlerde (telefon, TV, bilgisayar…) matrah üzerinden eklenir.</li>
        <li><b>ÖTV</b> — Özel Tüketim Vergisi; matrah (bandrol dahil) üzerinden oran ya da litre başına maktu tutar.</li>
        <li><b>KDV</b> — en sonda, bütün bu tutarların toplamı üzerinden %20.</li>
      </ol>
      <p style={p}>
        Biz “ekstra vergi” derken, herkesin her üründe ödediği <b>standart KDV’yi çıkarıp</b> geriye kalanı
        kastediyoruz: yani o üründe fazladan biriken ÖTV, TRT payı, fon ve bunların KDV’si. Karşılaştırma
        noktamız, ürünün sadece normal KDV’li hâlidir.
      </p>

      <h2 style={h2}>Örnek: iPhone 17 Pro Max 256 GB</h2>
      <div style={card}>
        <Row label="Raf fiyatı" value="122.000 TL" />
        <Row label="Vergisiz değer (matrah)" value="≈ 59.980 TL" />
        <Row label="Sadece KDV’li olsaydı" value="≈ 71.980 TL" />
        <div style={{ height: 1, background: 'var(--cream-300)', margin: '2px 0' }} />
        <Row label="Ekstra vergi (ÖTV + TRT payı + fon + KDV’si)" value="≈ 50.020 TL" strong />
      </div>
      <p style={muted}>
        Yani 122.000 TL’lik telefonun yaklaşık 50 bin lirası, standart KDV’nin üstüne binen ekstra vergidir.
        Telefonda zincir: TRT payı %12, kültür fonu %1, ÖTV %50, üstüne KDV %20.
      </p>

      <h2 style={h2}>Kategori formülleri</h2>
      <p style={muted}>Ana akıştaki kategorilerin vergi bileşenleri (KDV her zaman %20 ve en sonda):</p>
      <div style={{ ...card, gap: 6 }}>
        <Row label="Telefon" value="TRT %12 + fon %1 + ÖTV %25–50" />
        <Row label="Televizyon" value="TRT %16 + ÖTV %6,7" />
        <Row label="Bilgisayar / tablet" value="TRT %4" />
        <Row label="Akıllı saat" value="TRT %14" />
        <Row label="Oyun konsolu" value="ÖTV %20" />
        <Row label="Beyaz eşya" value="ÖTV %6,7" />
        <Row label="Kozmetik / parfüm" value="ÖTV %20" />
        <Row label="Otomobil" value="TRT %0,8 + ÖTV %70–220 (motor/fiyat kademesi)" />
        <Row label="Akaryakıt" value="Litre başına maktu ÖTV (benzin/motorin)" />
      </div>
      <p style={muted}>
        Otomobil ÖTV’si motor hacmine ve fiyat dilimine göre değişen kademeli bir tablodan hesaplanır;
        elektrikli araçlarda motor gücü sınıfı üretici verisinden alınır.
      </p>

      <h2 style={h2}>Kaynaklar</h2>
      <ul style={{ ...muted, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <li>Otomobil ÖTV kademeleri — 10115 sayılı Cumhurbaşkanı Kararı (Resmî Gazete, 24.07.2025).</li>
        <li>TRT bandrol oranları — 2022/5610 sayılı Cumhurbaşkanı Kararı (RG 26.05.2022), yürürlükte.</li>
        <li>ÖTV oranları — 4760 sayılı ÖTV Kanunu’na ekli (IV) sayılı liste.</li>
        <li>KDV %20 — 3065 sayılı KDV Kanunu ve ilgili Bakanlar Kurulu/CB kararları.</li>
        <li>Akaryakıt maktu ÖTV — ilgili ÖTV tutar kararları (dönemsel güncellenir).</li>
      </ul>

      <h2 style={h2}>Dürüstlük notları</h2>
      <ul style={{ ...muted, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <li>
          <b>Fiyatlar temsilidir.</b> Temmuz 2026’da marka siteleri ve yaygın e-ticaret platformlarından
          derlenmiştir; senin ödediğin tam fiyat farklı olabilir.
        </li>
        <li>
          <b>Bandrol yaklaşıktır.</b> Bandrol yasal olarak ithalat/imalat bedeli üzerinden alınır; biz
          matrah üzerinden hesaplarız. Ticari marj nedeniyle olduğundan yüksek görünebilir; toplam sapma
          küçüktür (telefonda ±1-2 puan).
        </li>
        <li>
          <b>Akaryakıtta eşel mobil.</b> Fiilen tahsil edilen ÖTV dönemsel olarak tarife tutarından
          sapabilir; hesapta güncel tarife esas alınır.
        </li>
        <li>
          <b>Amaç farkındalık.</b> Bu bir vergi danışmanlığı değil; siyasi bir iddia hiç değil. Sadece
          zaten ödediğin rakamı görünür kılıyoruz.
        </li>
      </ul>

      <h2 style={h2}>Verilerin</h2>
      <p style={muted}>
        Hiçbir seçimin, hiçbir kişisel verin kaydedilmez. Sonuç sayfan tamamen tarayıcında oluşur;
        paylaştığın görsel de linkin içindeki koddan üretilir.
      </p>

      <Link
        href="/al"
        style={{
          marginTop: 8,
          alignSelf: 'flex-start',
          fontFamily: 'var(--font-ui)',
          fontSize: 16,
          fontWeight: 700,
          color: '#fff',
          background: 'var(--coral-500)',
          borderRadius: 999,
          padding: '13px 26px',
          textDecoration: 'none',
        }}
      >
        Kendi hesabımı gör →
      </Link>
      <Link href="/" style={{ fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 600, color: 'var(--text-muted)' }}>
        ← Ana sayfa
      </Link>
    </main>
  )
}

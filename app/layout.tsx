import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

// Canlı domain bağlanınca (F4) NEXT_PUBLIC_SITE_URL güncellenir; şimdilik Vercel URL'i.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://benimolabilirdidotcom.vercel.app'
const TITLE = 'benimolabilirdi.com — ödediğin verginin karşılığı'
const DESCRIPTION =
  'Aldığın üründe gizlenen ÖTV, TRT payı, fon ve KDV’yi hesaplar; o ekstra vergiyle neler alabileceğini gösterir. Kâr amaçsız farkındalık projesi.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s · benimolabilirdi.com',
  },
  description: DESCRIPTION,
  applicationName: 'benimolabilirdi.com',
  keywords: ['ÖTV', 'KDV', 'vergi hesaplama', 'ÖTV hesaplama', 'TRT payı', 'akaryakıt vergisi', 'otomobil ÖTV', 'farkındalık'],
  authors: [{ name: 'benimolabilirdi.com' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: SITE_URL,
    siteName: 'benimolabilirdi.com',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/api/og', width: 1200, height: 630, alt: 'benimolabilirdi.com' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/api/og'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#FBF4E6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

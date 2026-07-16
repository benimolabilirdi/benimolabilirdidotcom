/**
 * Paylaşım linki codec'i: /s?d=<base64url(json)> (docs/01 §3.1.6, docs/03 §5).
 *
 * STATELESS — kullanıcı seçimleri DB'ye YAZILMAZ (CLAUDE.md kural 2, KVKK-temiz).
 * Tüm görsel verisi URL'de taşınır. Bu dosya saf TS: client (indirme), /s sayfası ve
 * @vercel/og endpoint'i (edge) aynı codec'i kullanır — üçünde de çalışmalı.
 *
 * Base64URL + UTF-8: Türkçe karakterler (ş ğ ç ö ü ı) için btoa doğrudan yetmez,
 * önce TextEncoder ile UTF-8 bayta çevrilir. btoa/atob hem tarayıcıda hem edge'de var.
 */
import type { ShareCardData } from '@/lib/share-card'

const VERSION = 1

type Envelope = { v: number; d: ShareCardData }

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  // Spread yerine döngü: büyük dizilerde String.fromCharCode(...) yığın taşırır.
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(input: string): Uint8Array {
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function encodeShareData(data: ShareCardData): string {
  const envelope: Envelope = { v: VERSION, d: data }
  const json = JSON.stringify(envelope)
  return bytesToBase64Url(new TextEncoder().encode(json))
}

/**
 * Güvenli çözme: URL'den gelen veri GÜVENİLMEZ. Bozuk/uyumsuz girdide null döner,
 * çağıran taraf hata sayfası gösterir — asla exception fırlatıp sayfayı düşürmez.
 */
export function decodeShareData(param: string | null | undefined): ShareCardData | null {
  if (!param) return null
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(param))
    const parsed = JSON.parse(json) as Partial<Envelope>
    if (parsed.v !== VERSION || !parsed.d) return null
    return isShareCardData(parsed.d) ? parsed.d : null
  } catch {
    return null
  }
}

/** Minimal şekil doğrulaması — render'ın patlamayacağı kadar. */
function isShareCardData(d: unknown): d is ShareCardData {
  if (!d || typeof d !== 'object') return false
  const x = d as Record<string, unknown>
  return (
    typeof x.product === 'object' &&
    x.product !== null &&
    typeof (x.product as Record<string, unknown>).name === 'string' &&
    typeof x.retailPrice === 'number' &&
    typeof x.totalTax === 'number' &&
    typeof x.remaining === 'number' &&
    Array.isArray(x.taxComponents) &&
    Array.isArray(x.items)
  )
}

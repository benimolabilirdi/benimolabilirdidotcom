import { describe, it, expect } from 'vitest'
import { encodeShareData, decodeShareData } from './share-link'
import type { ShareCardData } from './share-card'

const SAMPLE: ShareCardData = {
  product: { name: 'iPhone 17', emoji: '📱' },
  retailPrice: 119000,
  totalTax: 59400,
  taxComponents: ['ÖTV', 'KDV', 'TRT payı + fon'],
  personaLine: 'Oysa ben maaşımdan %27’ye varan gelir vergisini zaten ödüyorum.',
  remaining: 340,
  items: [
    { emoji: '🥣', text: 'Anneme mutfak robotu', amount: 8900, tag: { emoji: '🌷', name: 'Anneler Günü' } },
    { emoji: '❤️', text: 'Depremzedelere bağış', amount: 5000, positive: true },
  ],
}

describe('share-link codec', () => {
  it('roundtrip: encode → decode aynı veriyi verir', () => {
    expect(decodeShareData(encodeShareData(SAMPLE))).toEqual(SAMPLE)
  })

  it('Türkçe karakterler ve emoji bozulmadan taşınır', () => {
    const decoded = decodeShareData(encodeShareData(SAMPLE))
    expect(decoded?.taxComponents).toEqual(['ÖTV', 'KDV', 'TRT payı + fon'])
    expect(decoded?.personaLine).toContain('%27’ye')
    expect(decoded?.items[0].emoji).toBe('🥣')
    expect(decoded?.items[0].tag?.name).toBe('Anneler Günü')
  })

  it('base64url URL-güvenli: +, /, = içermez', () => {
    const encoded = encodeShareData(SAMPLE)
    expect(encoded).not.toMatch(/[+/=]/)
  })

  it('boş/null/bozuk girdide null döner, patlamaz', () => {
    expect(decodeShareData(null)).toBeNull()
    expect(decodeShareData('')).toBeNull()
    expect(decodeShareData('bu-gecerli-base64-degil!!!')).toBeNull()
    expect(decodeShareData('YWJj')).toBeNull() // geçerli base64 ama "abc", zarf değil
  })

  // btoa Türkçe karakterle patlar (test tarafı), o yüzden bu iki testte ASCII veri kullan.
  const b64url = (obj: unknown) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  it('sürüm uyuşmazlığında null döner', () => {
    const ascii = {
      product: { name: 'Phone', emoji: 'x' },
      retailPrice: 100,
      totalTax: 50,
      taxComponents: ['OTV'],
      remaining: 0,
      items: [],
    }
    expect(decodeShareData(b64url({ v: 99, d: ascii }))).toBeNull()
  })

  it('eksik zorunlu alan varsa null döner (render patlamasın)', () => {
    expect(decodeShareData(b64url({ v: 1, d: { product: { name: 'X' } } }))).toBeNull()
  })
})

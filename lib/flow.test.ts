import { describe, it, expect } from 'vitest'
import { applicableQuips, type Quip } from './flow'

const Q = (p: Partial<Quip>): Quip => ({
  scope: 'universal',
  categorySlug: null,
  productMatch: null,
  text: '',
  hideIfSameCategory: false,
  ...p,
})

describe('applicableQuips', () => {
  const quips: Quip[] = [
    Q({ scope: 'universal', text: 'evrensel' }),
    Q({ scope: 'kategori', categorySlug: 'telefon', text: 'telefon-kategori' }),
    Q({ scope: 'kategori', categorySlug: 'telefon', text: 'gizli-ayni', hideIfSameCategory: true }),
    Q({ scope: 'kategori', categorySlug: 'otomobil', text: 'otomobil-kategori' }),
    Q({ scope: 'urun', productMatch: 'iPhone 17 Pro Max', text: 'urun-pro-max' }),
  ]

  it('öncelik: ürün > kategori > evrensel', () => {
    const r = applicableQuips(quips, { name: 'iPhone 17 Pro Max 256 GB', categorySlug: 'telefon' }, 'kitap')
    expect(r.map((q) => q.text)).toEqual(['urun-pro-max', 'telefon-kategori', 'gizli-ayni', 'evrensel'])
  })

  it('kategori eşleşmezse o kategori sözü gelmez', () => {
    const r = applicableQuips(quips, { name: 'Roman', categorySlug: 'kitap' }, 'telefon')
    expect(r.map((q) => q.text)).toEqual(['evrensel'])
  })

  it('hide_if_same_category: alınan = hayal kategorisiyse elenir', () => {
    // Telefon aldı, telefon hayal ediyor → 'gizli-ayni' gizlenir.
    const r = applicableQuips(quips, { name: 'Samsung Galaxy', categorySlug: 'telefon' }, 'telefon')
    expect(r.map((q) => q.text)).toContain('telefon-kategori')
    expect(r.map((q) => q.text)).not.toContain('gizli-ayni')
  })

  it('ürün substring eşleşmesi ada göre', () => {
    const notMatch = applicableQuips(quips, { name: 'iPhone 15', categorySlug: 'telefon' }, 'kitap')
    expect(notMatch.map((q) => q.text)).not.toContain('urun-pro-max')
  })
})

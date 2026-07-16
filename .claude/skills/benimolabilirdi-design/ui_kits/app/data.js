// Fake product + category data for the benimolabilirdi app UI kit.
window.BO_DATA = {
  categories: [
    { id: "gida", emoji: "🍞", label: "Gıda" },
    { id: "akaryakit", emoji: "⛽", label: "Akaryakıt" },
    { id: "giyim", emoji: "👟", label: "Giyim" },
    { id: "elektronik", emoji: "📱", label: "Elektronik" },
    { id: "kahve", emoji: "☕", label: "Kahve" },
    { id: "eglence", emoji: "🎬", label: "Eğlence" },
    { id: "ulasim", emoji: "🚌", label: "Ulaşım" },
    { id: "ev", emoji: "🏠", label: "Ev" },
    { id: "saglik", emoji: "💊", label: "Sağlık" },
  ],
  // products keyed by category — price is what the user paid, taxRate is total embedded tax
  products: {
    gida: [
      { id: "simit", emoji: "🥖", name: "Simit", price: 15, taxRate: 0.01 },
      { id: "ekmek", emoji: "🍞", name: "Ekmek", price: 12, taxRate: 0.01 },
      { id: "peynir", emoji: "🧀", name: "Beyaz peynir (kg)", price: 320, taxRate: 0.10 },
      { id: "cikolata", emoji: "🍫", name: "Çikolata", price: 55, taxRate: 0.20 },
    ],
    akaryakit: [
      { id: "benzin", emoji: "⛽", name: "Benzin (depo)", price: 2400, taxRate: 0.52 },
      { id: "motorin", emoji: "🛢️", name: "Motorin (depo)", price: 2600, taxRate: 0.49 },
    ],
    giyim: [
      { id: "ayakkabi", emoji: "👟", name: "Spor ayakkabı", price: 2800, taxRate: 0.20 },
      { id: "tisort", emoji: "👕", name: "Tişört", price: 450, taxRate: 0.20 },
    ],
    elektronik: [
      { id: "telefon", emoji: "📱", name: "Akıllı telefon", price: 42000, taxRate: 0.48 },
      { id: "kulaklik", emoji: "🎧", name: "Kablosuz kulaklık", price: 3500, taxRate: 0.40 },
    ],
    kahve: [{ id: "latte", emoji: "☕", name: "Latte", price: 145, taxRate: 0.20 }],
    eglence: [{ id: "sinema", emoji: "🎬", name: "Sinema bileti", price: 320, taxRate: 0.18 }],
    ulasim: [{ id: "otobus", emoji: "🚌", name: "Otobüs bileti", price: 27, taxRate: 0.18 }],
    ev: [{ id: "deterjan", emoji: "🧴", name: "Deterjan", price: 240, taxRate: 0.20 }],
    saglik: [{ id: "vitamin", emoji: "💊", name: "Vitamin", price: 380, taxRate: 0.10 }],
  },
  // things you could buy with the tax money (dream loop)
  dream: {
    gida: [
      { id: "simit", emoji: "🥖", name: "Simit", price: 15 },
      { id: "cay", emoji: "🫖", name: "Çay", price: 20 },
      { id: "doner", emoji: "🥙", name: "Döner", price: 180 },
    ],
    kahve: [
      { id: "turk", emoji: "☕", name: "Türk kahvesi", price: 90 },
      { id: "latte", emoji: "🥤", name: "Latte", price: 145 },
    ],
    eglence: [
      { id: "sinema", emoji: "🎬", name: "Sinema bileti", price: 320 },
      { id: "kitap", emoji: "📚", name: "Kitap", price: 210 },
    ],
    ulasim: [
      { id: "otobus", emoji: "🚌", name: "Otobüs bileti", price: 27 },
      { id: "taksi", emoji: "🚕", name: "Kısa taksi", price: 250 },
    ],
  },
};

window.boFmt = (n, dec = 0) => "₺" + Number(n).toLocaleString("tr-TR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

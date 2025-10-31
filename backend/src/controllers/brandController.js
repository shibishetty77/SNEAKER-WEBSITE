import Product from '../models/Product.js'
const catalogs = {
  nike: [
    { name: 'Nike Air Force 1 Low', model: 'Air Force 1', colorway: 'Triple White', description: 'The legendary basketball shoe turned streetwear icon. Premium leather with Nike Air cushioning.', price: 110, brand: 'nike', stock: 30, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-01-15'), images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'] },
    { name: 'Nike Dunk Low', model: 'Dunk Low', colorway: 'Panda', description: 'Classic basketball silhouette reimagined for the streets. Black and white leather with vintage styling.', price: 110, brand: 'nike', stock: 25, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-02-01'), images: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1200&auto=format&fit=crop'], sizes: ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'Air Max 90', model: 'Air Max 90', colorway: 'Infrared', description: 'Iconic runner with visible Max Air unit and waffle outsole. The definition of sneaker culture.', price: 130, brand: 'nike', stock: 20, condition: 'new', category: 'running', releaseDate: new Date('2024-03-01'), images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','11.5','12'] },
    { name: 'Nike Blazer Mid 77', model: 'Blazer Mid', colorway: 'Vintage White', description: 'Classic basketball sneaker with a vintage aesthetic. Premium suede and exposed foam tongue.', price: 100, brand: 'nike', stock: 18, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-02-20'), images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] }
  ],
  adidas: [
    { name: 'Adidas Ultraboost 22', model: 'Ultraboost 22', colorway: 'Core Black', description: 'Revolutionary energy return with Boost cushioning. Primeknit upper for adaptive fit.', price: 190, brand: 'adidas', stock: 22, condition: 'new', category: 'running', releaseDate: new Date('2024-02-15'), images: ['https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'Adidas Samba OG', model: 'Samba', colorway: 'Black White', description: 'Timeless terrace shoe with premium suede and iconic gum sole. A streetwear essential.', price: 100, brand: 'adidas', stock: 30, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-01-10'), images: ['https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1200&auto=format&fit=crop'], sizes: ['6','6.5','7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'Adidas Gazelle', model: 'Gazelle', colorway: 'Navy Gold', description: 'Vintage training shoe turned lifestyle icon. Premium suede with gold accents.', price: 90, brand: 'adidas', stock: 25, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-01-25'), images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] }
  ],
  puma: [
    { name: 'Puma Suede Classic', model: 'Suede Classic', colorway: 'Peacoat', description: 'The OG sneaker that defined street culture. Premium suede with iconic formstrip.', price: 75, brand: 'puma', stock: 28, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-01-20'), images: ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'Puma RS-X', model: 'RS-X', colorway: 'Reinvention Pack', description: 'Bold retro-future design with running system technology. Chunky silhouette meets innovation.', price: 110, brand: 'puma', stock: 20, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-02-05'), images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'Puma Speedcat', model: 'Speedcat', colorway: 'Black Red', description: 'Racing-inspired silhouette with motorsport DNA. Low-profile design with premium materials.', price: 100, brand: 'puma', stock: 15, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-03-10'), images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11'] }
  ],
  newbalance: [
    { name: 'New Balance 550', model: '550', colorway: 'White Green', description: '90s basketball heritage with premium leather. Clean retro design meets modern comfort.', price: 120, brand: 'newbalance', stock: 18, condition: 'new', category: 'lifestyle', releaseDate: new Date('2024-01-25'), images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'New Balance 2002R', model: '2002R', colorway: 'Protection Pack', description: 'Y2K runner with ABZORB cushioning and N-ergy technology. Premium suede and mesh construction.', price: 150, brand: 'newbalance', stock: 22, condition: 'new', category: 'running', releaseDate: new Date('2024-02-10'), images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11'] },
    { name: 'New Balance 990v6', model: '990v6', colorway: 'Grey', description: 'Made in USA premium runner. ENCAP midsole technology with pigskin and mesh upper.', price: 185, brand: 'newbalance', stock: 14, condition: 'new', category: 'running', releaseDate: new Date('2024-03-15'), images: ['https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] }
  ],
  underarmour: [
    { name: 'Under Armour Curry 11', model: 'Curry 11', colorway: 'Championship Gold', description: 'Steph Curry signature shoe with UA Flow cushioning. Lightweight performance for the court.', price: 160, brand: 'underarmour', stock: 16, condition: 'new', category: 'basketball', releaseDate: new Date('2024-02-01'), images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'UA HOVR Phantom 3', model: 'HOVR Phantom 3', colorway: 'Black White', description: 'Zero-gravity feel with UA HOVR cushioning. Compression mesh Energy Web for responsive ride.', price: 140, brand: 'underarmour', stock: 20, condition: 'new', category: 'running', releaseDate: new Date('2024-01-20'), images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11','12'] },
    { name: 'UA SlipSpeed', model: 'SlipSpeed', colorway: 'Mod Gray', description: 'Revolutionary slip-on training shoe. Breathable warp knit upper with Micro G foam.', price: 130, brand: 'underarmour', stock: 18, condition: 'new', category: 'training', releaseDate: new Date('2024-03-05'), images: ['https://images.unsplash.com/photo-1579338559194-a162d19bf842?q=80&w=1200&auto=format&fit=crop'], sizes: ['7','7.5','8','8.5','9','9.5','10','10.5','11'] }
  ]
}

export const listByBrand = async (req, res) => {
  const b = String(req.params.brand || '').toLowerCase()
  if (!catalogs[b]) return res.status(404).json({ message: 'Brand not supported' })
  res.json({ items: catalogs[b] })
}

export const importBrand = async (req, res) => {
  const b = String(req.params.brand || '').toLowerCase()
  if (!catalogs[b]) return res.status(404).json({ message: 'Brand not supported' })
  const created = await Product.insertMany(catalogs[b])
  res.json({ inserted: created.length })
}

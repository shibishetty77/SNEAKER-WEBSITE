import Product from '../models/Product.js';
import Review from '../models/Review.js';

export const getProducts = async (req, res) => {
  const {
    minPrice,
    maxPrice,
    brand,
    search,
    minRating,
    sort = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 24
  } = req.query;

  const q = {};
  if (minPrice || maxPrice) {
    q.price = {};
    if (minPrice) q.price.$gte = Number(minPrice);
    if (maxPrice) q.price.$lte = Number(maxPrice);
  }
  if (brand) {
    const brands = String(brand)
      .split(',')
      .map((b) => b.trim().toLowerCase())
      .filter(Boolean);
    if (brands.length) q.brand = { $in: brands };
  }
  if (search) {
    q.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  let items = await Product.find(q)
    .sort({ [sort]: order === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  if (minRating) {
    const minRatingNum = Number(minRating);
    const itemsWithRating = await Promise.all(
      items.map(async (product) => {
        const summary = await Review.aggregate([
          { $match: { productId: product._id } },
          { $group: { _id: '$productId', avgRating: { $avg: '$rating' } } }
        ]);
        const avgRating = summary[0]?.avgRating || 0;
        return { ...product, avgRating };
      })
    );
    items = itemsWithRating.filter((p) => p.avgRating >= minRatingNum);
  }

  const total = await Product.countDocuments(q);
  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const summary = await Review.aggregate([
    { $match: { productId: product._id } },
    { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
  ]);
  const meta = summary[0] || { avgRating: 0, reviewCount: 0 };
  res.json({ ...product, avgRating: Number(meta.avgRating || 0).toFixed(1), reviewCount: meta.reviewCount || 0 });
};

export const seedProducts = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Seeding disabled in production' });
  }
  const sample = [
    {
      name: 'Nike Air Force 1 Low',
      model: 'Air Force 1',
      colorway: 'Triple White',
      description: 'The legendary basketball shoe turned streetwear icon. Premium leather with Nike Air cushioning.',
      price: 110,
      brand: 'nike',
      stock: 30,
      condition: 'new',
      category: 'lifestyle',
      releaseDate: new Date('2024-01-15'),
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12']
    },
    {
      name: 'Adidas Ultraboost 22',
      model: 'Ultraboost 22',
      colorway: 'Core Black',
      description: 'Revolutionary energy return with Boost cushioning. Primeknit upper for adaptive fit.',
      price: 190,
      brand: 'adidas',
      stock: 22,
      condition: 'new',
      category: 'running',
      releaseDate: new Date('2024-02-15'),
      images: [
        'https://images.unsplash.com/photo-1562183241-b937e95585b6?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12']
    },
    {
      name: 'Puma Suede Classic',
      model: 'Suede Classic',
      colorway: 'Peacoat',
      description: 'The OG sneaker that defined street culture. Premium suede with iconic formstrip.',
      price: 75,
      brand: 'puma',
      stock: 28,
      condition: 'new',
      category: 'lifestyle',
      releaseDate: new Date('2024-01-20'),
      images: [
        'https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12']
    },
    {
      name: 'New Balance 550',
      model: '550',
      colorway: 'White Green',
      description: '90s basketball heritage with premium leather. Clean retro design meets modern comfort.',
      price: 120,
      brand: 'newbalance',
      stock: 18,
      condition: 'new',
      category: 'lifestyle',
      releaseDate: new Date('2024-01-25'),
      images: [
        'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12']
    },
    {
      name: 'Under Armour Curry 11',
      model: 'Curry 11',
      colorway: 'Championship Gold',
      description: 'Steph Curry signature shoe with UA Flow cushioning. Lightweight performance for the court.',
      price: 160,
      brand: 'underarmour',
      stock: 16,
      condition: 'new',
      category: 'basketball',
      releaseDate: new Date('2024-02-01'),
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop'
      ],
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12']
    }
  ];
  await Product.deleteMany({});
  const created = await Product.insertMany(sample);
  res.json({ inserted: created.length });
};

export const createProduct = async (req, res) => {
  const body = req.body || {};
  const doc = await Product.create({ ...body, owner: req.user?.id || null });
  res.status(201).json(doc);
};

export const deleteProduct = async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: 'Product not found' });
  if (!prod.owner || String(prod.owner) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Not allowed to delete this product' });
  }
  await prod.deleteOne();
  res.json({ ok: true });
};

export const purchaseProduct = async (req, res) => {
  const { quantity = 1 } = req.body || {};
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: 'Product not found' });
  if (prod.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });
  prod.stock -= Number(quantity);
  await prod.save();
  res.json({ ok: true, remaining: prod.stock });
};

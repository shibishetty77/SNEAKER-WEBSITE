import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { connectDB } from './config/db.js';

dotenv.config();

const sampleProducts = [
  {
    name: 'Air Jordan 1 Retro High',
    model: 'AJ1',
    colorway: 'Chicago',
    description: 'The iconic Air Jordan 1 in the legendary Chicago colorway. A timeless classic that never goes out of style.',
    price: 170,
    brand: 'nike',
    stock: 25,
    condition: 'new',
    releaseDate: new Date('2015-05-30'),
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    category: 'lifestyle'
  },
  {
    name: 'Ultraboost 22',
    model: 'UB22',
    colorway: 'Triple White',
    description: 'Experience maximum energy return with the revolutionary Ultraboost technology. Perfect for running and everyday wear.',
    price: 190,
    brand: 'adidas',
    stock: 30,
    condition: 'new',
    releaseDate: new Date('2022-01-15'),
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    category: 'running'
  },
  {
    name: 'Nike Dunk Low',
    model: 'Dunk Low',
    colorway: 'Panda',
    description: 'The beloved Nike Dunk Low in the popular Panda colorway. A versatile sneaker that pairs with any outfit.',
    price: 110,
    brand: 'nike',
    stock: 40,
    condition: 'new',
    releaseDate: new Date('2021-03-10'),
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    category: 'lifestyle'
  },
  {
    name: 'Yeezy Boost 350 V2',
    model: '350 V2',
    colorway: 'Slate',
    description: 'The revolutionary Yeezy design with Primeknit upper and Boost cushioning for ultimate comfort.',
    price: 230,
    brand: 'adidas',
    stock: 15,
    condition: 'new',
    releaseDate: new Date('2022-06-01'),
    images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    category: 'lifestyle'
  },
  {
    name: 'Puma Suede Classic',
    model: 'Suede',
    colorway: 'Black/White',
    description: 'A street style icon since 1968. Premium suede upper with classic PUMA formstrip.',
    price: 75,
    brand: 'puma',
    stock: 50,
    condition: 'new',
    releaseDate: new Date('1968-01-01'),
    images: ['https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=500'],
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13'],
    category: 'lifestyle'
  },
  {
    name: 'New Balance 574',
    model: '574',
    colorway: 'Grey',
    description: 'The quintessential New Balance sneaker. Comfortable, durable, and effortlessly cool.',
    price: 85,
    brand: 'newbalance',
    stock: 35,
    condition: 'new',
    releaseDate: new Date('1988-01-01'),
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    category: 'lifestyle'
  },
  {
    name: 'Air Force 1 Low',
    model: 'AF1',
    colorway: 'Triple White',
    description: 'The legendary Air Force 1 in all white. A cultural icon and wardrobe staple since 1982.',
    price: 110,
    brand: 'nike',
    stock: 60,
    condition: 'new',
    releaseDate: new Date('1982-01-01'),
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'],
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13', '14'],
    category: 'lifestyle'
  },
  {
    name: 'Nike Blazer Mid 77',
    model: 'Blazer',
    colorway: 'Vintage White',
    description: 'Retro basketball style meets modern comfort. Featuring vintage details and premium materials.',
    price: 100,
    brand: 'nike',
    stock: 28,
    condition: 'new',
    releaseDate: new Date('1977-01-01'),
    images: ['https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    category: 'lifestyle'
  },
  {
    name: 'Adidas Samba OG',
    model: 'Samba',
    colorway: 'Core Black',
    description: 'The classic soccer-inspired sneaker. Timeless design with premium leather upper.',
    price: 100,
    brand: 'adidas',
    stock: 45,
    condition: 'new',
    releaseDate: new Date('1950-01-01'),
    images: ['https://images.unsplash.com/photo-1552346154-21d32810aba3?w=500'],
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    category: 'lifestyle'
  },
  {
    name: 'Under Armour HOVR Phantom 3',
    model: 'HOVR Phantom 3',
    colorway: 'Black/White',
    description: 'Premium running shoe with UA HOVR cushioning for zero gravity feel and energy return.',
    price: 140,
    brand: 'underarmour',
    stock: 20,
    condition: 'new',
    releaseDate: new Date('2023-02-01'),
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    category: 'running'
  },
  {
    name: 'Nike Air Max 90',
    model: 'AM90',
    colorway: 'Infrared',
    description: 'The iconic Air Max 90 with visible Max Air unit and legendary Infrared colorway.',
    price: 130,
    brand: 'nike',
    stock: 32,
    condition: 'new',
    releaseDate: new Date('1990-01-01'),
    images: ['https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    category: 'lifestyle'
  },
  {
    name: 'Puma RS-X',
    model: 'RS-X',
    colorway: 'Multi',
    description: 'Bold, chunky sneaker with retro futuristic design. Perfect for making a statement.',
    price: 110,
    brand: 'puma',
    stock: 25,
    condition: 'new',
    releaseDate: new Date('2019-01-01'),
    images: ['https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=500'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    category: 'lifestyle'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...');
    
    // Connect to database
    await connectDB(process.env.MONGO_URI);
    
    // Clear existing products
    console.log('🗑️  Clearing existing products...');
    await Product.deleteMany({});
    
    // Insert sample products
    console.log('📦 Adding sample products...');
    const created = await Product.insertMany(sampleProducts);
    
    console.log(`✅ Successfully added ${created.length} products!`);
    console.log('');
    console.log('Sample products:');
    created.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price} (${product.brand})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

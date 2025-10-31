import User from '../models/User.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.product');
  res.json(user.cart || []);
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  const user = await User.findById(req.user.id);
  const idx = user.cart.findIndex((i) => i.product.toString() === productId);
  if (idx > -1) {
    user.cart[idx].quantity += quantity;
  } else {
    user.cart.push({ product: productId, quantity, price: product.price });
  }
  await user.save();
  res.status(201).json(user.cart);
};

export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.user.id);
  const item = user.cart.find((i) => i.product.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Item not in cart' });
  item.quantity = quantity;
  await user.save();
  res.json(user.cart);
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user.id);
  user.cart = user.cart.filter((i) => i.product.toString() !== productId);
  await user.save();
  res.json(user.cart);
};

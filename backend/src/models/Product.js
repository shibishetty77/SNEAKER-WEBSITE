import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    colorway: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    brand: { type: String, enum: ['nike', 'adidas', 'puma', 'newbalance', 'underarmour'], required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    stock: { type: Number, default: 0, min: 0 },
    condition: { type: String, enum: ['new', 'used-like-new', 'used-good', 'used-fair'], default: 'new' },
    releaseDate: { type: Date },
    images: [{ type: String }],
    sizes: [{ type: String }],
    category: { type: String, enum: ['running', 'basketball', 'lifestyle', 'skateboarding', 'training'], default: 'lifestyle' }
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

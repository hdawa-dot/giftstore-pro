import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'usdt' | 'giftcard';
  brand?: string;
  imageUrl: string;
  denominations: {
    value: number;
    currency: string;
    priceEGP: number;
    originalPriceEGP: number;
    discount: number;
    inStock: boolean;
    stockCount: number;
    codes: string[];
  }[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DenominationSchema = new Schema({
  value: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  priceEGP: { type: Number, required: true },
  originalPriceEGP: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  codes: { type: [String], default: [] },
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    nameAr: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    descriptionAr: { type: String, default: '' },
    category: { type: String, enum: ['usdt', 'giftcard'], required: true },
    brand: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    denominations: { type: [DenominationSchema], default: [] },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ featured: -1, createdAt: -1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

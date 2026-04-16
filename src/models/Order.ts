import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: mongoose.Types.ObjectId;
  productName: string;
  productNameAr: string;
  denominationValue: number;
  denominationCurrency: string;
  totalPriceEGP: number;
  paymentMethod: 'vodafone_cash' | 'bank_transfer' | 'crypto';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  deliveryCode?: string;
  couponCode?: string;
  discountAmount: number;
  paymentProofUrl?: string;
  notes?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productNameAr: { type: String, required: true },
    denominationValue: { type: Number, required: true },
    denominationCurrency: { type: String, required: true },
    totalPriceEGP: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['vodafone_cash', 'bank_transfer', 'crypto'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled', 'refunded'],
      default: 'pending',
    },
    deliveryCode: { type: String },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    paymentProofUrl: { type: String },
    notes: { type: String },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, paymentStatus: 1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;

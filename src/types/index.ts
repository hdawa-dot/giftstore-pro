export interface Product {
  _id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  category: 'usdt' | 'giftcard';
  brand?: string;
  imageUrl: string;
  denominations: Denomination[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Denomination {
  value: number;
  currency: string;
  priceEGP: number;
  originalPriceEGP: number;
  discount: number;
  inStock: boolean;
  stockCount?: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productId: string;
  product?: Product;
  denominationValue: number;
  denominationCurrency: string;
  totalPriceEGP: number;
  paymentMethod: 'vodafone_cash' | 'bank_transfer' | 'crypto';
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  deliveryCode?: string;
  couponCode?: string;
  discountAmount: number;
  paymentProof?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
}

export type Language = 'ar' | 'en';

export interface Translation {
  nav: {
    home: string;
    products: string;
    orders: string;
    about: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  product: {
    buyNow: string;
    addToCart: string;
    inStock: string;
    outOfStock: string;
    selectValue: string;
    instantDelivery: string;
    rating: string;
    reviews: string;
    availability: string;
    warning: string;
  };
  checkout: {
    title: string;
    name: string;
    email: string;
    phone: string;
    paymentMethod: string;
    vodafoneCash: string;
    bankTransfer: string;
    crypto: string;
    coupon: string;
    apply: string;
    total: string;
    submit: string;
    uploadProof: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    search: string;
    filter: string;
    all: string;
    currency: string;
  };
}

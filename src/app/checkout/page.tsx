'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLang } from '@/components/LangProvider';
import { Product } from '@/types';
import { formatEGP } from '@/lib/utils';

const DEMO_PRODUCTS: Record<string, Product> = {
  'demo-1': {
    _id: 'demo-1', name: 'USDT Tether', nameAr: 'USDT تيثر',
    description: '', descriptionAr: '', category: 'usdt',
    imageUrl: 'https://placehold.co/100x60/1a1a1a/f59e0b?text=USDT',
    denominations: [
      { value: 10, currency: 'USDT', priceEGP: 490, originalPriceEGP: 510, discount: 4, inStock: true },
      { value: 50, currency: 'USDT', priceEGP: 2400, originalPriceEGP: 2550, discount: 6, inStock: true },
      { value: 100, currency: 'USDT', priceEGP: 4750, originalPriceEGP: 5100, discount: 7, inStock: true },
    ],
    isActive: true, rating: 4.9, reviewCount: 312, tags: [], featured: true, createdAt: '', updatedAt: '',
  },
  'demo-2': {
    _id: 'demo-2', name: 'Binance Gift Card', nameAr: 'بطاقة هدايا بينانس',
    description: '', descriptionAr: '', category: 'giftcard', brand: 'Binance',
    imageUrl: 'https://placehold.co/100x60/1a1a1a/f0b90b?text=Binance',
    denominations: [
      { value: 5,  currency: 'USD', priceEGP: 260, originalPriceEGP: 275, discount: 5, inStock: true },
      { value: 10, currency: 'USD', priceEGP: 510, originalPriceEGP: 550, discount: 7, inStock: true },
      { value: 25, currency: 'USD', priceEGP: 1250, originalPriceEGP: 1375, discount: 9, inStock: true },
      { value: 50, currency: 'USD', priceEGP: 2450, originalPriceEGP: 2750, discount: 11, inStock: true },
      { value: 100, currency: 'USD', priceEGP: 4800, originalPriceEGP: 5500, discount: 13, inStock: true },
    ],
    isActive: true, rating: 4.8, reviewCount: 528, tags: [], featured: true, createdAt: '', updatedAt: '',
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { lang } = useLang();
  const productId = searchParams.get('product') || 'demo-2';
  const denomIndex = parseInt(searchParams.get('denom') || '0');

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId.startsWith('demo-')) {
      setProduct(DEMO_PRODUCTS[productId] || null);
      setLoading(false);
      return;
    }
    fetch(`/api/products/${productId}`)
      .then(r => r.json())
      .then(d => setProduct(d.success ? d.data : null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="grid md:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">😕</div>
        <p className="text-white text-xl mb-4">{lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</p>
        <Link href="/" className="text-gold-400 hover:underline text-sm">{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</Link>
      </div>
    );
  }

  const denom = product.denominations[denomIndex] || product.denominations[0];
  const name = lang === 'ar' ? product.nameAr : product.name;

  return (
    <div className="grid md:grid-cols-[1fr_420px] gap-8 items-start">
      {/* Order Summary Sidebar */}
      <div className="md:sticky md:top-24">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 mb-6">
          <h2 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
            {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
          </h2>
          <div className="flex items-center gap-3 pb-4 border-b border-dark-700">
            <div className="w-16 h-10 rounded-lg overflow-hidden bg-dark-700 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl} alt={name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{name}</p>
              <p className="text-dark-400 text-xs">${denom.value} {denom.currency}</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 text-sm">
            <div className="flex justify-between text-dark-400">
              <span>{lang === 'ar' ? 'السعر الأصلي' : 'Original Price'}</span>
              <span>{formatEGP(denom.originalPriceEGP)}</span>
            </div>
            {denom.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>{lang === 'ar' ? `خصم ${denom.discount}%` : `${denom.discount}% Discount`}</span>
                <span>-{formatEGP(denom.originalPriceEGP - denom.priceEGP)}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-dark-700">
              <span>{lang === 'ar' ? 'الإجمالي' : 'Total'}</span>
              <span className="text-gold-400">{formatEGP(denom.priceEGP)}</span>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="flex flex-wrap gap-2">
          {['🔒 SSL Secured', '⚡ Instant Delivery', '✅ Trusted Platform'].map(b => (
            <span key={b} className="text-xs text-dark-500 bg-dark-800 border border-dark-700 px-3 py-1.5 rounded-full">{b}</span>
          ))}
        </div>
      </div>

      {/* Checkout Form */}
      <div>
        <CheckoutForm
          productId={product._id}
          productName={name}
          denominationValue={denom.value}
          priceEGP={denom.priceEGP}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { lang } = useLang();
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-display font-black text-white mb-8">
            {lang === 'ar' ? 'إتمام الطلب' : 'Complete Your Order'}
          </h1>
          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <CheckoutContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}

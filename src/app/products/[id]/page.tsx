'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { StarRating } from '@/components/ui/StarRating';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useLang } from '@/components/LangProvider';
import { Product } from '@/types';
import { formatEGP } from '@/lib/utils';

// Demo data fallback
const DEMO_PRODUCTS: Record<string, Product> = {
  'demo-1': {
    _id: 'demo-1', name: 'USDT Tether', nameAr: 'USDT تيثر',
    description: 'Buy USDT directly at the best EGP rate. Instant delivery to your wallet.',
    descriptionAr: 'اشترِ USDT بأفضل سعر بالجنيه المصري. تسليم فوري لمحفظتك.',
    category: 'usdt', imageUrl: 'https://placehold.co/600x300/1a1a1a/f59e0b?text=USDT',
    denominations: [
      { value: 10,  currency: 'USDT', priceEGP: 490,  originalPriceEGP: 510,  discount: 4,  inStock: true },
      { value: 50,  currency: 'USDT', priceEGP: 2400, originalPriceEGP: 2550, discount: 6,  inStock: true },
      { value: 100, currency: 'USDT', priceEGP: 4750, originalPriceEGP: 5100, discount: 7,  inStock: true },
      { value: 200, currency: 'USDT', priceEGP: 9400, originalPriceEGP: 10200,discount: 8,  inStock: true },
    ],
    isActive: true, rating: 4.9, reviewCount: 312, tags: ['crypto', 'usdt'], featured: true,
    createdAt: '', updatedAt: '',
  },
  'demo-2': {
    _id: 'demo-2', name: 'Binance Gift Card', nameAr: 'بطاقة هدايا بينانس',
    description: 'Official Binance Gift Card. Can be used for crypto trading, buying crypto, or gifting.',
    descriptionAr: 'بطاقة هدايا بينانس الرسمية. يمكن استخدامها للتداول أو شراء العملات الرقمية أو الإهداء.',
    category: 'giftcard', brand: 'Binance',
    imageUrl: 'https://placehold.co/600x300/1a1a1a/f0b90b?text=Binance+Gift+Card',
    denominations: [
      { value: 5,   currency: 'USD', priceEGP: 260,  originalPriceEGP: 275,  discount: 5,  inStock: true },
      { value: 10,  currency: 'USD', priceEGP: 510,  originalPriceEGP: 550,  discount: 7,  inStock: true },
      { value: 25,  currency: 'USD', priceEGP: 1250, originalPriceEGP: 1375, discount: 9,  inStock: true },
      { value: 50,  currency: 'USD', priceEGP: 2450, originalPriceEGP: 2750, discount: 11, inStock: true },
      { value: 100, currency: 'USD', priceEGP: 4800, originalPriceEGP: 5500, discount: 13, inStock: true },
    ],
    isActive: true, rating: 4.8, reviewCount: 528, tags: ['binance', 'giftcard'], featured: true,
    createdAt: '', updatedAt: '',
  },
};

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { lang } = useLang();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (id?.startsWith('demo-')) {
      setProduct(DEMO_PRODUCTS[id] || null);
      setLoading(false);
      return;
    }
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(d => setProduct(d.success ? d.data : null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-dark-950 pt-24 pb-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10">
              <Skeleton className="h-72 rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <div className="flex gap-2">{[1,2,3,4].map(i=><Skeleton key={i} className="h-10 w-20 rounded-full"/>)}</div>
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-dark-950 pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😕</div>
            <h1 className="text-white text-2xl font-bold mb-2">{lang === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}</h1>
            <Link href="/" className="text-gold-400 hover:underline text-sm">{lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</Link>
          </div>
        </main>
      </>
    );
  }

  const name = lang === 'ar' ? product.nameAr : product.name;
  const description = lang === 'ar' ? product.descriptionAr : product.description;
  const denom = product.denominations[selectedIndex];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-dark-500 mb-8">
            <Link href="/" className="hover:text-gold-400">{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
            <span>/</span>
            <Link href="/#products" className="hover:text-gold-400">{lang === 'ar' ? 'المنتجات' : 'Products'}</Link>
            <span>/</span>
            <span className="text-dark-300">{name}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left: Image */}
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden bg-dark-800 border border-dark-700 aspect-video">
                <Image
                  src={product.imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
                {denom?.discount > 0 && (
                  <div className="absolute top-3 start-3">
                    <Badge variant="red">-{denom.discount}%</Badge>
                  </div>
                )}
                <div className="absolute top-3 end-3">
                  <Badge variant="green">⚡ {lang === 'ar' ? 'تسليم فوري' : 'Instant'}</Badge>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.tags.map(tag => (
                  <span key={tag} className="text-xs text-dark-400 bg-dark-800 border border-dark-700 px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">{name}</h1>
              <StarRating rating={product.rating} count={product.reviewCount} size="md" />
              <p className="text-dark-400 text-sm mt-3 leading-relaxed">{description}</p>

              {/* Warning */}
              <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-xs text-yellow-300">
                {lang === 'ar'
                  ? '⚠️ تأكد من التوافق مع منطقتك قبل الشراء. بعض البطاقات قد تكون مقيدة في مصر.'
                  : '⚠️ Verify regional compatibility before purchase. Some cards may be restricted in Egypt.'}
              </div>

              {/* Denomination selector */}
              <div className="mt-6">
                <label className="block text-dark-300 text-xs uppercase tracking-wider mb-3">
                  {lang === 'ar' ? 'اختر القيمة' : 'Select Value'}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {product.denominations.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => d.inStock && setSelectedIndex(i)}
                      disabled={!d.inStock}
                      className={`relative p-3 rounded-xl border text-center transition-all duration-200 ${
                        selectedIndex === i
                          ? 'border-gold-500 bg-gold-500/10 shadow-gold'
                          : d.inStock
                            ? 'border-dark-700 hover:border-gold-500/40 bg-dark-800'
                            : 'border-dark-800 bg-dark-900 opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-white font-bold text-sm">${d.value}</div>
                      <div className="text-dark-400 text-xs mt-0.5">{d.currency}</div>
                      {d.discount > 0 && (
                        <span className="absolute -top-1.5 -end-1.5 bg-red-500 text-white text-[9px] font-bold px-1 rounded-full">
                          -{d.discount}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price display */}
              {denom && (
                <div className="mt-6 bg-dark-800 border border-dark-700 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-display font-black text-gold-400">{formatEGP(denom.priceEGP)}</div>
                      {denom.originalPriceEGP > denom.priceEGP && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-dark-500 text-sm line-through">{formatEGP(denom.originalPriceEGP)}</span>
                          <span className="text-green-400 text-xs font-bold">
                            {lang === 'ar' ? `وفر ${formatEGP(denom.originalPriceEGP - denom.priceEGP)}` : `Save ${formatEGP(denom.originalPriceEGP - denom.priceEGP)}`}
                          </span>
                        </div>
                      )}
                    </div>
                    <Badge variant={denom.inStock ? 'green' : 'red'}>
                      {denom.inStock
                        ? (lang === 'ar' ? '✓ متوفر' : '✓ In Stock')
                        : (lang === 'ar' ? '✗ غير متوفر' : '✗ Out of Stock')}
                    </Badge>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="mt-4 flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={!denom?.inStock}
                  onClick={() => router.push(`/checkout?product=${product._id}&denom=${selectedIndex}`)}
                >
                  {lang === 'ar' ? 'اشترِ الآن ⚡' : 'Buy Now ⚡'}
                </Button>
              </div>

              {/* Features */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: '⚡', ar: 'تسليم فوري', en: 'Instant Delivery' },
                  { icon: '🔒', ar: 'دفع آمن',    en: 'Secure Payment' },
                  { icon: '💬', ar: 'دعم 24/7',   en: '24/7 Support' },
                  { icon: '🔄', ar: 'ضمان الاسترجاع', en: 'Refund Guarantee' },
                ].map(f => (
                  <div key={f.en} className="flex items-center gap-2 text-dark-400 text-xs">
                    <span>{f.icon}</span>
                    <span>{lang === 'ar' ? f.ar : f.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

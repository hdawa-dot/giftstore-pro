'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ProductsSection from '@/components/home/ProductsSection';
import { Product } from '@/types';

// ── Demo / seed products shown while DB is empty ──────────────────────────────
const DEMO_PRODUCTS: Product[] = [
  {
    _id: 'demo-1',
    name: 'USDT Tether',
    nameAr: 'USDT تيثر',
    description: 'Buy USDT directly at the best EGP rate',
    descriptionAr: 'اشترِ USDT بأفضل سعر بالجنيه المصري',
    category: 'usdt',
    imageUrl: 'https://placehold.co/400x200/1a1a1a/f59e0b?text=USDT',
    denominations: [
      { value: 10,  currency: 'USDT', priceEGP: 490,  originalPriceEGP: 510,  discount: 4,  inStock: true },
      { value: 50,  currency: 'USDT', priceEGP: 2400, originalPriceEGP: 2550, discount: 6,  inStock: true },
      { value: 100, currency: 'USDT', priceEGP: 4750, originalPriceEGP: 5100, discount: 7,  inStock: true },
      { value: 200, currency: 'USDT', priceEGP: 9400, originalPriceEGP: 10200,discount: 8,  inStock: true },
    ],
    isActive: true, rating: 4.9, reviewCount: 312, tags: ['crypto', 'usdt'], featured: true,
    createdAt: '', updatedAt: '',
  },
  {
    _id: 'demo-2',
    name: 'Binance Gift Card',
    nameAr: 'بطاقة هدايا بينانس',
    description: 'Official Binance Gift Card — instant delivery',
    descriptionAr: 'بطاقة هدايا بينانس الرسمية — تسليم فوري',
    category: 'giftcard',
    brand: 'Binance',
    imageUrl: 'https://placehold.co/400x200/1a1a1a/f0b90b?text=Binance+Gift+Card',
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
  {
    _id: 'demo-3',
    name: 'Steam Gift Card',
    nameAr: 'بطاقة هدايا ستيم',
    description: 'Steam Wallet Gift Card for games',
    descriptionAr: 'بطاقة ستيم للألعاب الإلكترونية',
    category: 'giftcard',
    brand: 'Steam',
    imageUrl: 'https://placehold.co/400x200/1b2838/66c0f4?text=Steam+Gift+Card',
    denominations: [
      { value: 5,  currency: 'USD', priceEGP: 265,  originalPriceEGP: 280,  discount: 5,  inStock: true },
      { value: 10, currency: 'USD', priceEGP: 520,  originalPriceEGP: 560,  discount: 7,  inStock: true },
      { value: 20, currency: 'USD', priceEGP: 1020, originalPriceEGP: 1120, discount: 9,  inStock: true },
      { value: 50, currency: 'USD', priceEGP: 2500, originalPriceEGP: 2800, discount: 11, inStock: true },
    ],
    isActive: true, rating: 4.7, reviewCount: 215, tags: ['steam', 'games', 'giftcard'], featured: false,
    createdAt: '', updatedAt: '',
  },
  {
    _id: 'demo-4',
    name: 'iTunes Gift Card',
    nameAr: 'بطاقة هدايا آيتيونز',
    description: 'Apple iTunes & App Store Gift Card',
    descriptionAr: 'بطاقة هدايا أبل للتطبيقات والمحتوى',
    category: 'giftcard',
    brand: 'Apple',
    imageUrl: 'https://placehold.co/400x200/1a1a1a/ffffff?text=iTunes+Gift+Card',
    denominations: [
      { value: 15, currency: 'USD', priceEGP: 770,  originalPriceEGP: 825,  discount: 7,  inStock: true },
      { value: 25, currency: 'USD', priceEGP: 1270, originalPriceEGP: 1375, discount: 8,  inStock: true },
      { value: 50, currency: 'USD', priceEGP: 2500, originalPriceEGP: 2750, discount: 9,  inStock: true },
    ],
    isActive: true, rating: 4.6, reviewCount: 189, tags: ['apple', 'itunes', 'giftcard'], featured: false,
    createdAt: '', updatedAt: '',
  },
  {
    _id: 'demo-5',
    name: 'Google Play Gift Card',
    nameAr: 'بطاقة هدايا جوجل بلاي',
    description: 'Google Play Store Gift Card',
    descriptionAr: 'بطاقة هدايا متجر جوجل بلاي',
    category: 'giftcard',
    brand: 'Google',
    imageUrl: 'https://placehold.co/400x200/1a1a1a/4CAF50?text=Google+Play',
    denominations: [
      { value: 10, currency: 'USD', priceEGP: 520,  originalPriceEGP: 550,  discount: 5,  inStock: true },
      { value: 25, currency: 'USD', priceEGP: 1270, originalPriceEGP: 1375, discount: 7,  inStock: true },
      { value: 50, currency: 'USD', priceEGP: 2500, originalPriceEGP: 2750, discount: 9,  inStock: false },
    ],
    isActive: true, rating: 4.5, reviewCount: 143, tags: ['google', 'android', 'giftcard'], featured: false,
    createdAt: '', updatedAt: '',
  },
  {
    _id: 'demo-6',
    name: 'PlayStation Store Gift Card',
    nameAr: 'بطاقة هدايا بلايستيشن',
    description: 'PlayStation Network PSN Gift Card',
    descriptionAr: 'بطاقة شبكة بلايستيشن PSN',
    category: 'giftcard',
    brand: 'PlayStation',
    imageUrl: 'https://placehold.co/400x200/003087/ffffff?text=PlayStation',
    denominations: [
      { value: 10, currency: 'USD', priceEGP: 530,  originalPriceEGP: 560,  discount: 5,  inStock: true },
      { value: 20, currency: 'USD', priceEGP: 1040, originalPriceEGP: 1120, discount: 7,  inStock: true },
      { value: 50, currency: 'USD', priceEGP: 2550, originalPriceEGP: 2800, discount: 9,  inStock: true },
    ],
    isActive: true, rating: 4.7, reviewCount: 267, tags: ['playstation', 'psn', 'games', 'giftcard'], featured: false,
    createdAt: '', updatedAt: '',
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [usdtPrice, setUsdtPrice] = useState(48.5);

  useEffect(() => {
    // Fetch USDT price
    fetch('/api/price/usdt')
      .then(r => r.json())
      .then(d => { if (d.price) setUsdtPrice(d.price); })
      .catch(() => {});

    // Fetch products from DB (if available)
    setLoading(true);
    fetch('/api/products')
      .then(r => r.json())
      .then(d => { if (d.success && d.data.length > 0) setProducts(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero usdtPrice={usdtPrice} />
        <ProductsSection products={products} loading={loading} />

        {/* Stats Section */}
        <section className="py-16 bg-dark-900 border-y border-dark-800">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { num: '10,000+', ar: 'عميل سعيد',   en: 'Happy Customers' },
                { num: '50,000+', ar: 'طلب مكتمل',   en: 'Completed Orders' },
                { num: '99.9%',   ar: 'نسبة النجاح',  en: 'Success Rate' },
                { num: '24/7',    ar: 'دعم مستمر',    en: 'Support' },
              ].map(stat => (
                <div key={stat.num}>
                  <div className="text-3xl font-display font-black text-gold-400 mb-1">{stat.num}</div>
                  <div className="text-dark-400 text-sm">{stat.ar} / {stat.en}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-dark-950">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-display font-black text-white mb-12">
              كيف يعمل؟ / <span className="text-gold-400">How It Works?</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', ar: 'اختر المنتج',   en: 'Choose Product',  icon: '🎁', desc: { ar: 'تصفح واختر القيمة المناسبة', en: 'Browse and select your value' } },
                { step: '02', ar: 'ادفع بأمان',    en: 'Pay Securely',    icon: '💳', desc: { ar: 'فودافون كاش أو تحويل بنكي', en: 'Vodafone Cash or Bank Transfer' } },
                { step: '03', ar: 'استلم فوراً',   en: 'Receive Instantly', icon: '⚡', desc: { ar: 'كودك يصلك بعد تأكيد الدفع', en: 'Code delivered after payment confirmed' } },
              ].map(step => (
                <div key={step.step} className="relative">
                  <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 hover:border-gold-500/30 transition-colors">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="text-gold-400 font-display font-black text-xs mb-2">{step.step}</div>
                    <h3 className="text-white font-bold mb-2">{step.ar} / {step.en}</h3>
                    <p className="text-dark-400 text-sm">{step.desc.ar}</p>
                  </div>
                  {step.step !== '03' && (
                    <div className="hidden md:block absolute top-1/2 -end-4 text-dark-600 text-2xl z-10">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

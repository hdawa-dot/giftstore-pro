'use client';
import { useState } from 'react';
import { Product } from '@/types';
import { useLang } from '../LangProvider';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';

interface ProductsSectionProps {
  products: Product[];
  loading?: boolean;
}

const FILTERS = [
  { value: 'all', en: 'All',       ar: 'الكل'         },
  { value: 'usdt',     en: 'USDT',  ar: 'USDT'         },
  { value: 'giftcard', en: 'Gift Cards', ar: 'بطاقات الهدايا' },
];

export default function ProductsSection({ products, loading }: ProductsSectionProps) {
  const { lang, t } = useLang();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => {
    const matchCat = filter === 'all' || p.category === filter;
    const name = lang === 'ar' ? p.nameAr : p.name;
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="products" className="py-20 bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mb-3">
            {lang === 'ar' ? 'منتجاتنا' : 'Our Products'}
          </h2>
          <p className="text-dark-400 text-base">
            {lang === 'ar' ? 'اختر من مجموعة واسعة من USDT وبطاقات الهدايا' : 'Choose from a wide range of USDT & Gift Cards'}
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('common.search') + '...'}
              className="w-full bg-dark-800 border border-dark-700 text-white placeholder-dark-500 ps-10 pe-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-gold-gradient text-dark-900 font-bold shadow-gold'
                    : 'bg-dark-800 border border-dark-700 text-dark-300 hover:border-gold-500/50'
                }`}
              >
                {lang === 'ar' ? f.ar : f.en}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : filtered.length > 0
              ? filtered.map(p => <ProductCard key={p._id} product={p} />)
              : (
                <div className="col-span-full text-center py-16 text-dark-400">
                  <div className="text-4xl mb-3">🔍</div>
                  <p>{lang === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>
                </div>
              )}
        </div>
      </div>
    </section>
  );
}

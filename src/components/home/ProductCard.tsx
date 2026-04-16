'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/types';
import { useLang } from '../LangProvider';
import { StarRating } from '../ui/StarRating';
import { Badge } from '../ui/Badge';
import { formatEGP } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang } = useLang();
  const [selectedDenom, setSelectedDenom] = useState(0);
  const denom = product.denominations[selectedDenom];
  const name = lang === 'ar' ? product.nameAr : product.name;

  return (
    <Link href={`/products/${product._id}`} className="block group">
      <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 hover:border-gold-500/50 transition-all duration-300 hover:shadow-gold hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 bg-dark-700 overflow-hidden">
          <Image
            src={product.imageUrl || 'https://placehold.co/400x200/1a1a1a/f59e0b?text=Gift+Card'}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Badges */}
          <div className="absolute top-2 start-2 flex flex-col gap-1">
            {product.featured && (
              <Badge variant="gold">⭐ Featured</Badge>
            )}
            {denom?.discount > 0 && (
              <Badge variant="red">-{denom.discount}%</Badge>
            )}
          </div>
          <div className="absolute top-2 end-2">
            <Badge variant="green">⚡ Instant</Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-white text-sm mb-1 truncate">{name}</h3>
          <StarRating rating={product.rating} count={product.reviewCount} />

          {/* Denomination pills */}
          {product.denominations.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.denominations.slice(0, 4).map((d, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); setSelectedDenom(i); }}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all duration-150 ${
                    selectedDenom === i
                      ? 'bg-gold-500 border-gold-500 text-dark-900 font-bold'
                      : 'border-dark-600 text-dark-300 hover:border-gold-500/50'
                  } ${!d.inStock ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  ${d.value}
                </button>
              ))}
              {product.denominations.length > 4 && (
                <span className="text-xs px-2.5 py-1 text-dark-500">+{product.denominations.length - 4}</span>
              )}
            </div>
          )}

          {/* Price */}
          {denom && (
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-gold-400 font-bold text-base">{formatEGP(denom.priceEGP)}</span>
                {denom.originalPriceEGP > denom.priceEGP && (
                  <span className="text-dark-500 text-xs line-through ms-2">{formatEGP(denom.originalPriceEGP)}</span>
                )}
              </div>
              <span className={`text-xs ${denom.inStock ? 'text-green-400' : 'text-red-400'}`}>
                {denom.inStock ? '✓' : '✗'}
              </span>
            </div>
          )}

          {/* CTA */}
          <div className="mt-3 w-full text-center bg-gold-gradient text-dark-900 text-sm font-bold py-2.5 rounded-xl group-hover:shadow-gold transition-all duration-200">
            {lang === 'ar' ? 'اشترِ الآن' : 'Buy Now'}
          </div>
        </div>
      </div>
    </Link>
  );
}

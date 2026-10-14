'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { AmazonBuyButton } from './AmazonBuyButton';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
      
      {/* Featured Badge */}
      {product.featured && (
        <div className="absolute top-3 left-3 z-10 pointer-events-none">
          <span className="pointer-events-auto bg-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            Top Pick
          </span>
        </div>
      )}

      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="relative w-full pt-[65%] bg-slate-50 overflow-hidden block"
      >
        <Image
          src={product.image_reference}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-amber-700">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.editorial_rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">/ 5.0</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 text-base leading-snug mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          {!compact && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Pricing notice & Actions */}
        <div className="pt-3 border-t border-slate-100 mt-2 space-y-3">
          <div className="text-[11px] text-slate-400 font-medium">
            Pricing: <span className="text-slate-600 font-semibold">Check live price on Amazon</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/product/${product.slug}`}
              className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors gap-1"
            >
              <span>Review & Specs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <AmazonBuyButton product={product} size="sm" showMarketplaceLabel={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
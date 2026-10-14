'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck, Globe, Star, Sparkles } from 'lucide-react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Category } from '@/types';

interface HeroSectionProps {
  categories: Category[];
}

export function HeroSection({ categories }: HeroSectionProps) {
  const router = useRouter();
  const { currentMarketplace } = useMarketplace();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/5 via-slate-50 to-white pt-12 pb-20 border-b border-slate-200">
      
      {/* Background subtle mesh glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-amber-200/20 via-orange-100/30 to-amber-100/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span>Serving Amazon Shoppers in {currentMarketplace.name} ({currentMarketplace.flag}) & Worldwide</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Discover the Best Products for Your Everyday Life
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Explore expert buying guides, product comparisons, and recommendations to make informed shopping decisions. Verified specifications, neutral pros/cons, and direct links to Amazon.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearch}
            className="max-w-xl mx-auto flex items-center bg-white p-2 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search by product name, brand, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/25 transition-all"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
           
          </div>

          {/* Featured Category Pills */}
          <div className="pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Popular Categories:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-amber-400 hover:text-amber-700 text-xs font-medium text-slate-700 shadow-sm transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Award,
} from 'lucide-react';
import { repository } from '@/lib/data/repository';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductCard } from '@/components/products/ProductCard';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { AdPlacement } from '@/components/ads/AdPlacement';

export const revalidate = 60; // ISR cache revalidation

export default async function HomePage() {
  const [categories, featuredProducts, recentPosts] = await Promise.all([
    repository.getCategories(),
    repository.getProducts({ featured: true, limit: 6 }),
    repository.getBlogPosts({ limit: 3 }),
  ]);

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero Section */}
      <HeroSection categories={categories} />

      {/* Ad: Below Hero */}
      <AdPlacement placement="homepage_below_hero" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* 2. Featured Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-700 font-bold uppercase tracking-wider text-xs">
              Explore By Domain
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-600 transition-colors"
          >
            <span>View All Categories & Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 text-white p-5 aspect-[4/3] flex flex-col justify-end shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Background category image with dark gradient overlay */}
              <div className="absolute inset-0 -z-10">
                <Image
                  src={cat.image_reference || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              </div>

              <div className="relative z-10">
                <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  {cat.product_count} Curated Items
                </span>
                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-700 font-bold uppercase tracking-wider text-xs mb-1">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Editorially Approved</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Products on Amazon
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-600 transition-colors"
          >
            <span>Browse Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Ad: Between product sections */}
      <AdPlacement placement="homepage_between_sections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* 4. Popular Buying Guides & Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-4">
          <div>
            <span className="text-amber-700 font-bold uppercase tracking-wider text-xs">
              Editorial Guides
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Popular Buying Guides & Reviews
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-600 transition-colors"
          >
            <span>Read All Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-300 transition-all overflow-hidden flex flex-col"
            >
              <Link href={`/blog/${post.slug}`} className="relative w-full pt-[55%] block bg-slate-100">
                <Image
                  src={post.featured_image_reference}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </Link>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                    <span className="font-semibold text-amber-700 uppercase tracking-wider">
                      {post.category_name}
                    </span>
                    <span>•</span>
                    <span>{post.reading_time_minutes} min read</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-slate-900 hover:text-amber-600 transition-colors text-base line-clamp-2 leading-snug mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{post.author_name}</span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-bold text-amber-700 hover:text-amber-600 inline-flex items-center gap-1"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Newsletter Subscription */}
      <NewsletterSection />

    </div>
  );
}
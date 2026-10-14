import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { repository } from '@/lib/data/repository';
import { ProductCard } from '@/components/products/ProductCard';
import { ArrowLeft, Layers } from 'lucide-react';
import type { Metadata } from 'next';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await repository.getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category Not Found | GlobalCart' };

  return {
    title: category.seo_title || `${category.name} | GlobalCart Amazon Recommendations`,
    description: category.seo_description || category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await repository.getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const products = await repository.getProducts({
    categorySlug: params.slug,
    status: 'published',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-amber-600">Categories</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">{category.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-amber-700 font-bold uppercase tracking-wider text-xs">
            Curated Category
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {category.name}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {category.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span>Compare Items</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Categories</span>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-sm">No products currently published in this category.</p>
        </div>
      )}
    </div>
  );
}

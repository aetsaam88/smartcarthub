import React from 'react';
import Link from 'next/link';
import { repository } from '@/lib/data/repository';
import { ProductCard } from '@/components/products/ProductCard';
import { AdPlacement } from '@/components/ads/AdPlacement';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

interface ProductsPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    q?: string;
    sort?: string;
  };
}

export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [allCategories, allProducts] = await Promise.all([
    repository.getCategories(),
    repository.getProducts({
      categorySlug: searchParams.category,
      brand: searchParams.brand,
      search: searchParams.q,
      status: 'published',
    }),
  ]);

  // Extract available brands
  const brands = Array.from(new Set(allProducts.map((p) => p.brand))).filter(Boolean);

  // Sorting
  let sortedProducts = [...allProducts];
  if (searchParams.sort === 'name-asc') {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (searchParams.sort === 'rating-desc') {
    sortedProducts.sort((a, b) => b.editorial_rating - a.editorial_rating);
  }

  const selectedCategoryObj = allCategories.find((c) => c.slug === searchParams.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Products</span>
          {selectedCategoryObj && (
            <>
              <span>/</span>
              <span className="text-amber-600 font-semibold">{selectedCategoryObj.name}</span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {selectedCategoryObj ? selectedCategoryObj.name : 'All Curated Products'}
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          {selectedCategoryObj
            ? selectedCategoryObj.description
            : 'Browse verified hardware, consumer electronics, and productivity peripherals with international Amazon links.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Link
            href="/products"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              !searchParams.category
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </Link>
          {allCategories.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}${searchParams.q ? `&q=${encodeURIComponent(searchParams.q)}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                searchParams.category === c.slug
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {/* Sort & active filters reset */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Showing <strong className="text-slate-900">{sortedProducts.length}</strong> items
          </div>
          
          {(searchParams.category || searchParams.brand || searchParams.q) && (
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear filters</span>
            </Link>
          )}
        </div>

      </div>

      {/* Grid or Empty State */}
      {sortedProducts.length > 0 ? (
        <div className="space-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product, index) => (
              <React.Fragment key={product.id}>
                <ProductCard product={product} />
                {/* Insert ad between every 6th product (after index 5, 11, 17 …) */}
                {(index + 1) % 6 === 0 && index < sortedProducts.length - 1 && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                    <AdPlacement placement="products_between_cards" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center font-bold">
            0
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search query, clearing filters, or browse another category.
          </p>
          <div>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}

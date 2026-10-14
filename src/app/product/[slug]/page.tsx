import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Globe,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { repository } from '@/lib/data/repository';
import { AmazonBuyButton } from '@/components/products/AmazonBuyButton';
import { ProductCard } from '@/components/products/ProductCard';
import { AdPlacement } from '@/components/ads/AdPlacement';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await repository.getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found | GlobalCart' };

  return {
    title: product.seo_title || `${product.name} Review & Amazon Availability | GlobalCart`,
    description: product.seo_description || product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [{ url: product.image_reference }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await repository.getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  // Related products in the same category
  const relatedProducts = (
    await repository.getProducts({
      categorySlug: product.category?.slug,
      status: 'published',
      limit: 3,
    })
  ).filter((p) => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/products" className="hover:text-amber-600">Products</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-amber-600">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Showcase Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        
        {/* Product Media Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
            <Image
              src={product.image_reference}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Product Specifications</span>
            </div>
            <Link href="/compare" className="font-semibold text-amber-700 hover:text-amber-600 inline-flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Compare</span>
            </Link>
          </div>
        </div>

        {/* Product Information Column */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            
            {/* Category & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1 rounded-full text-amber-700 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>Editorial Score: {product.editorial_rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {product.short_description}
            </p>

            {/* Key Features List */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Highlighted Features:
                </h4>
                <ul className="grid grid-cols-1 gap-2 text-xs text-slate-700">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* Pricing Disclaimer & Primary Amazon Call to Action */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Real-time Amazon Marketplace Pricing</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Amazon prices fluctuate frequently. Click below to verify stock, current deals, coupons, and expedited Prime delivery in your territory.
                </p>
              </div>

              <AmazonBuyButton product={product} size="lg" className="w-full sm:w-auto shrink-0" />
            </div>

            {/* Compliance note */}
            <p className="text-[11px] text-slate-400 text-center sm:text-left">
              * As an Amazon Associate, GlobalCart earns from qualifying purchases. Links open securely on Amazon with sponsored attribution.
            </p>
          </div>

        </div>

      </div>

      {/* Pros & Cons Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3>Key Advantages (Pros)</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {product.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
            <XCircle className="w-5 h-5 text-rose-600" />
            <h3>Considerations & Trade-offs (Cons)</h3>
          </div>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            {product.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Editorial In-Depth Review & Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Editorial Review Body */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Editorial Review & Hands-On Assessment
          </h2>
          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4 text-slate-700">
            <p>{product.description}</p>
            <p>
              When evaluating hardware within the {product.category?.name || 'hardware'} sector, build quality, reliability over extended testing cycles, and vendor software overhead remain paramount criteria.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <strong className="text-slate-900 font-bold">Why trust our evaluation?</strong>
              <p className="text-slate-600">
                Our reviews synthesize verified laboratory measurements, real-world ergonomic feedback, and cross-marketplace customer sentiment without algorithmic sponsorship or artificial scoring.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h3 className="text-base font-bold text-slate-900">
            Technical Specifications
          </h3>
          <div className="divide-y divide-slate-100 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="py-2.5 flex justify-between gap-4">
                <span className="text-slate-500 font-medium">{key}</span>
                <span className="text-slate-900 font-semibold text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Ad: Below product information */}
      <AdPlacement placement="product_detail_below_info" />

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Related Products to Consider
            </h3>
            <Link
              href={`/category/${product.category?.slug}`}
              className="text-xs font-bold text-amber-700 hover:text-amber-600 inline-flex items-center gap-1"
            >
              <span>Explore category</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Ad: Below related products */}
      <AdPlacement placement="product_detail_below_related" />

    </div>
  );
}


'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  X,
  Trash2,
  Plus,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';
import { AmazonBuyButton } from '@/components/products/AmazonBuyButton';

export default function ComparePage() {
  const { comparedProducts, removeFromCompare, clearCompare } = useComparison();

  // Aggregate all unique specification keys across all compared products
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap((p) => (p.specifications ? Object.keys(p.specifications) : []))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Product Comparison</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Side-by-Side Product Comparison Matrix
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Compare technical specifications, editorial scores, pros and cons, and live Amazon links.
          </p>
        </div>

        {comparedProducts.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Clear All</span>
            </button>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add More Products</span>
            </Link>
          </div>
        )}
      </div>

      {comparedProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No products selected for comparison</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Browse our catalog and click the &quot;Compare&quot; button on any product card to analyze up to 4 items side-by-side.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-6 w-48 text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Product Overview
                </th>
                {comparedProducts.map((p) => (
                  <th key={p.id} className="p-6 align-top min-w-[260px] max-w-[300px]">
                    <div className="relative space-y-3">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-400 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <Image
                          src={p.image_reference}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <span className="text-[11px] font-bold uppercase text-amber-700 block">
                        {p.brand}
                      </span>

                      <Link href={`/product/${p.slug}`}>
                        <h4 className="font-bold text-sm text-slate-900 hover:text-amber-600 transition-colors line-clamp-2">
                          {p.name}
                        </h4>
                      </Link>

                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{p.editorial_rating.toFixed(1)} / 5.0</span>
                      </div>

                      <AmazonBuyButton product={p} size="sm" className="w-full mt-2" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 text-xs">
              {/* Pricing row */}
              <tr className="bg-amber-50/20">
                <td className="p-4 font-bold text-slate-800">Live Amazon Pricing</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-600">
                    <span className="font-semibold text-slate-900">Check current price</span> on Amazon
                  </td>
                ))}
              </tr>

              {/* Key Features row */}
              <tr>
                <td className="p-4 font-bold text-slate-800 align-top">Highlighted Features</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 align-top">
                    <ul className="space-y-1.5 text-slate-600">
                      {p.features?.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Pros row */}
              <tr>
                <td className="p-4 font-bold text-slate-800 align-top">Major Advantages</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 align-top">
                    <ul className="space-y-1 text-slate-600">
                      {p.pros?.slice(0, 3).map((pro, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Cons row */}
              <tr>
                <td className="p-4 font-bold text-slate-800 align-top">Trade-offs</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 align-top">
                    <ul className="space-y-1 text-slate-600">
                      {p.cons?.slice(0, 2).map((con, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {/* Dynamic specs rows */}
              {allSpecKeys.map((specKey) => (
                <tr key={specKey}>
                  <td className="p-4 font-semibold text-slate-700">{specKey}</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-slate-800">
                      {p.specifications?.[specKey] || (
                        <span className="text-slate-400 italic">Not specified</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Action row at bottom */}
              <tr className="bg-slate-50">
                <td className="p-4 font-bold text-slate-800">Amazon Marketplace Action</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    <AmazonBuyButton product={p} size="sm" className="w-full" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

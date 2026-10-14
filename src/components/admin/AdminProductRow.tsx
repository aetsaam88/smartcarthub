'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Edit, Trash2, ExternalLink, Loader2, Star } from 'lucide-react';

export function AdminProductRow({ product }: { product: Product }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${product.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete product.');
      }
    } catch {
      alert('Error deleting product.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="p-4 pl-6">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <Image
              src={product.image_reference}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="font-bold text-slate-900 hover:text-amber-600 transition-colors line-clamp-1 max-w-xs"
            >
              {product.name}
            </Link>
            <div className="text-[10px] text-slate-400 font-mono">slug: {product.slug}</div>
          </div>
        </div>
      </td>

      <td className="p-4 font-semibold text-slate-700">{product.brand}</td>

      <td className="p-4 text-slate-600">
        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium">
          {product.category?.name || product.category_id}
        </span>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-1">
          {product.marketplaces?.map((m) => (
            <span
              key={m.marketplace_code}
              className="px-1.5 py-0.5 rounded bg-amber-50 text-[10px] font-bold text-amber-800 border border-amber-200"
              title={m.amazon_product_url}
            >
              {m.marketplace_code}
            </span>
          ))}
          {(!product.marketplaces || product.marketplaces.length === 0) && (
            <span className="text-slate-400 text-[11px] italic">None configured</span>
          )}
        </div>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-1 font-bold text-amber-600">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{product.editorial_rating.toFixed(1)}</span>
        </div>
      </td>

      <td className="p-4">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            product.status === 'published'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {product.status}
        </span>
      </td>

      <td className="p-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/product/${product.slug}`}
            target="_blank"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            title="Preview on Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/admin/products/${product.id}/edit`}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-600"
            title="Edit Product"
          >
            <Edit className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-400 transition-colors disabled:opacity-50"
            title="Delete Product"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

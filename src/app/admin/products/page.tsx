import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';
import { AdminProductRow } from '@/components/admin/AdminProductRow';

export const dynamic = 'force-dynamic';

interface AdminProductsPageProps {
  searchParams: {
    category?: string;
    q?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const [categories, products] = await Promise.all([
    repository.getCategories(),
    repository.getProducts({
      categorySlug: searchParams.category,
      search: searchParams.q,
      status: 'all',
    }),
  ]);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Amazon Products ({products.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage product specifications, pros/cons, editorial scores, and international Amazon URLs.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form className="relative w-full sm:w-80">
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q || ''}
            placeholder="Search by name, brand..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Link
            href="/admin/products"
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              !searchParams.category
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/admin/products?category=${c.slug}`}
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Marketplaces</th>
                <th className="p-4">Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <AdminProductRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

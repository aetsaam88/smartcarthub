import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { CategoryManager } from '@/components/admin/CategoryManager';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const categories = await repository.getCategories();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          Taxonomy & Organization
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Categories ({categories.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage product categories, descriptions, and SEO metadata. Safe deletion prevents orphan products.
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}

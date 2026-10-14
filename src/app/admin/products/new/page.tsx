import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { ProductForm } from '@/components/admin/ProductForm';

export default async function NewProductPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const categories = await repository.getCategories();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          Product Catalog
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Product
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Add a verified product with technical specifications, pros/cons, and Amazon international links.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}

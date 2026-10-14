import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { ProductForm } from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const [product, categories] = await Promise.all([
    repository.getProductById(params.id),
    repository.getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          Product Catalog
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Product: {product.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Modify technical specifications, review scores, and marketplace affiliate links.
        </p>
      </div>

      <ProductForm initialProduct={product} categories={categories} />
    </div>
  );
}

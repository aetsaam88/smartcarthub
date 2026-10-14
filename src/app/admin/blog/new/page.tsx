import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export default async function NewBlogPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const categories = await repository.getCategories();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          Editorial CMS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Buying Guide
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Draft a research-backed product guide or technical breakdown with SEO metadata.
        </p>
      </div>

      <BlogPostForm categories={categories} />
    </div>
  );
}

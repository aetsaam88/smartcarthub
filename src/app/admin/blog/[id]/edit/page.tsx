import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

interface EditBlogPageProps {
  params: {
    id: string;
  };
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const [post, categories] = await Promise.all([
    repository.getBlogPostById(params.id),
    repository.getCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          Editorial CMS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Guide: {post.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Update markdown body, SEO title/description, or publishing status.
        </p>
      </div>

      <BlogPostForm initialPost={post} categories={categories} />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { Plus, Edit, Trash2, ExternalLink, FileText, Calendar, Clock } from 'lucide-react';
import { AdminBlogRow } from '@/components/admin/AdminBlogRow';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const posts = await repository.getBlogPosts({ status: 'all' });

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
            Editorial CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Buying Guides & Articles ({posts.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author, edit, publish, or preview SEO buying guides and hardware assessments.
          </p>
        </div>

        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Buying Guide</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="p-4 pl-6">Article</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Read Time</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map((post) => (
                <AdminBlogRow key={post.id} post={post} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

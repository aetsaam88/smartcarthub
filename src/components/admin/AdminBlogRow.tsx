'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BlogPost } from '@/types';
import { Edit, Trash2, ExternalLink, Loader2 } from 'lucide-react';

export function AdminBlogRow({ post }: { post: BlogPost }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog?id=${post.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to delete post.');
      }
    } catch {
      alert('Error deleting post.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr className="hover:bg-slate-50/80 transition-colors">
      <td className="p-4 pl-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
            <Image
              src={post.featured_image_reference}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <Link
              href={`/admin/blog/${post.id}/edit`}
              className="font-bold text-slate-900 hover:text-amber-600 transition-colors line-clamp-1 max-w-sm"
            >
              {post.title}
            </Link>
            <span className="text-[10px] text-slate-400 font-mono">slug: {post.slug}</span>
          </div>
        </div>
      </td>

      <td className="p-4 text-slate-600">
        <span className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium">
          {post.category_name}
        </span>
      </td>

      <td className="p-4 text-slate-700 font-medium">{post.author_name}</td>

      <td className="p-4 text-slate-500">{post.reading_time_minutes} min</td>

      <td className="p-4">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            post.status === 'published'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {post.status}
        </span>
      </td>

      <td className="p-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/blog/${post.slug}`}
            target="_blank"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            title="Preview Public Article"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/admin/blog/${post.id}/edit`}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-600"
            title="Edit Article"
          >
            <Edit className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-400 disabled:opacity-50"
            title="Delete Article"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </td>
    </tr>
  );
}

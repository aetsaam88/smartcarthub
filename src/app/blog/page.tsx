import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { repository } from '@/lib/data/repository';
import { formatDate } from '@/lib/utils';
import { BookOpen, ArrowRight, Clock, User } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buying Guides & Product Reviews | GlobalCart',
  description: 'Expert research, in-depth breakdowns, and verified buying guides for consumers shopping on Amazon.',
};

export default async function BlogPage() {
  const posts = await repository.getBlogPosts({ status: 'published' });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-1.5 text-amber-700 font-bold uppercase tracking-wider text-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Editorial Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Buying Guides & In-Depth Technical Reviews
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Unbiased, research-driven buying guides written to cut through marketing claims. We evaluate ergonomics, durability, and practical everyday performance.
        </p>
      </div>

      {/* Featured / Hero Article if available */}
      {posts[0] && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 hover:shadow-lg transition-all">
          <Link href={`/blog/${posts[0].slug}`} className="lg:col-span-7 relative min-h-[300px] lg:min-h-full block bg-slate-100">
            <Image
              src={posts[0].featured_image_reference}
              alt={posts[0].title}
              fill
              className="object-cover"
            />
          </Link>
          <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-bold text-amber-700 uppercase tracking-wider">
                  {posts[0].category_name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {posts[0].reading_time_minutes} min read
                </span>
              </div>
              <Link href={`/blog/${posts[0].slug}`}>
                <h2 className="text-2xl font-extrabold text-slate-900 hover:text-amber-600 transition-colors leading-snug">
                  {posts[0].title}
                </h2>
              </Link>
              <p className="text-sm text-slate-600 leading-relaxed">
                {posts[0].excerpt}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                  {posts[0].author_name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-900">{posts[0].author_name}</div>
                  <div className="text-[10px] text-slate-400">{posts[0].author_role}</div>
                </div>
              </div>
              <Link
                href={`/blog/${posts[0].slug}`}
                className="font-bold text-amber-700 hover:text-amber-600 inline-flex items-center gap-1"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Other Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(1).map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
          >
            <Link href={`/blog/${post.slug}`} className="relative w-full pt-[55%] block bg-slate-100">
              <Image
                src={post.featured_image_reference}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </Link>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-amber-700 uppercase tracking-wider">
                    {post.category_name}
                  </span>
                  <span>•</span>
                  <span>{post.reading_time_minutes} min read</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-bold text-slate-900 hover:text-amber-600 transition-colors text-base line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-700">{post.author_name}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-amber-700 hover:text-amber-600 inline-flex items-center gap-1"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
}

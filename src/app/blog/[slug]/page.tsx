import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { repository } from '@/lib/data/repository';
import { formatDate } from '@/lib/utils';
import {
  Clock,
  User,
  Calendar,
  Share2,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await repository.getBlogPostBySlug(params.slug);
  if (!post) return { title: 'Article Not Found | GlobalCart' };

  return {
    title: post.seo_title || `${post.title} | GlobalCart Buying Guide`,
    description: post.seo_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featured_image_reference }],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await repository.getBlogPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = (
    await repository.getBlogPosts({
      categorySlug: post.category_slug,
      status: 'published',
      limit: 3,
    })
  ).filter((p) => p.id !== post.id);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-amber-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <Link href="/blog" className="hover:text-amber-600">Guides</Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-900 font-semibold truncate">{post.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
          {post.category_name}
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Author & Meta bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-slate-200 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              {post.author_name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900">{post.author_name}</div>
              <div className="text-[11px] text-slate-500">{post.author_role}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.reading_time_minutes} min read</span>
            </span>
          </div>
        </div>
      </div>

      {/* Featured Banner Image */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
        <Image
          src={post.featured_image_reference}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Amazon Associates Compliance Box */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 font-bold">Affiliate Disclosure:</strong>
          <p className="leading-relaxed">
            As an Amazon Associate, GlobalCart earns from qualifying purchases. Products mentioned in this guide are chosen independently based on research, verified user feedback, and market availability.
          </p>
        </div>
      </div>

      {/* Main Markdown / Content Body */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm">
        <div className="prose prose-slate max-w-none text-slate-800 text-base leading-relaxed space-y-6">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return <h2 key={index} className="text-2xl font-extrabold text-slate-900 tracking-tight pt-4">{paragraph.replace('# ', '')}</h2>;
            }
            if (paragraph.startsWith('## ')) {
              return <h3 key={index} className="text-xl font-bold text-slate-900 pt-3">{paragraph.replace('## ', '')}</h3>;
            }
            if (paragraph.startsWith('### ')) {
              return <h4 key={index} className="text-lg font-bold text-slate-900">{paragraph.replace('### ', '')}</h4>;
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </div>

      {/* Related Guides */}
      {relatedPosts.length > 0 && (
        <div className="pt-8 space-y-6 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">
            More Related Guides in {post.category_name}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map((r) => (
              <Link
                key={r.id}
                href={`/blog/${r.slug}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all space-y-2 block"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  {r.reading_time_minutes} min read
                </span>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {r.title}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {r.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to Guides link */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all buying guides</span>
        </Link>
      </div>

    </article>
  );
}

import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import {
  Package,
  FolderTree,
  FileText,
  MousePointerClick,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const [products, categories, blogPosts, clicks, activityLogs] = await Promise.all([
    repository.getProducts({ status: 'all' }),
    repository.getCategories(),
    repository.getBlogPosts({ status: 'all' }),
    repository.getAffiliateClicks(),
    repository.getActivityLogs(),
  ]);

  const publishedProducts = products.filter((p) => p.status === 'published').length;
  const draftProducts = products.filter((p) => p.status === 'draft').length;
  const publishedPosts = blogPosts.filter((p) => p.status === 'published').length;

  // Compute most-clicked products
  const clickCountMap: Record<string, { count: number; name: string }> = {};
  clicks.forEach((c) => {
    if (!clickCountMap[c.product_id]) {
      clickCountMap[c.product_id] = { count: 0, name: c.product_name || c.product_id };
    }
    clickCountMap[c.product_id].count += 1;
  });

  const topClickedProducts = Object.entries(clickCountMap)
    .map(([id, info]) => ({ id, ...info }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
            Administration Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back, <strong>{admin.name}</strong>. Real-time affiliate metrics and catalog management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Guide</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Products</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {products.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">{publishedProducts} published</span>
            <span>•</span>
            <span className="text-slate-400">{draftProducts} drafts</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Categories</span>
            <FolderTree className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {categories.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Active editorial departments
          </div>
        </div>

        {/* Blog Posts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Guides & Posts</span>
            <FileText className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {blogPosts.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span className="text-emerald-600 font-bold">{publishedPosts} live articles</span>
          </div>
        </div>

        {/* Affiliate Clicks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Amazon Clicks</span>
            <MousePointerClick className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {clicks.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Outbound tracking referrals
          </div>
        </div>

      </div>

      {/* Main Grid: Top-Clicked Products & Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Most Clicked Products */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                Most-Clicked Products (Outbound to Amazon)
              </h2>
              <p className="text-xs text-slate-500">
                Products driving the highest customer interest across international storefronts.
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {topClickedProducts.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {topClickedProducts.map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-5 font-bold text-slate-400">{idx + 1}.</span>
                    <div>
                      <span className="font-bold text-slate-900 line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded text-amber-800 border border-amber-200">
                      {p.count} clicks
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              No affiliate click events logged yet. Clicks will populate when visitors use Amazon buttons.
            </div>
          )}
        </div>

        {/* Recent Admin Activity Log */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Audit & Activity Log
            </h2>
            <p className="text-xs text-slate-500">
              Verified administrative changes and editorial actions.
            </p>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between text-slate-500 text-[10px]">
                  <span className="font-bold text-slate-700">{log.action}</span>
                  <span>{new Date(log.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-800 font-medium text-[11px]">{log.details}</p>
                <div className="text-[10px] text-slate-400">{log.admin_name}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

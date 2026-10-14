import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { verifyAdminSession, destroyAdminSession } from '@/lib/auth/session';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ExternalLink,
  Globe,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ShoppingBag,
  ShieldAlert,
  MonitorPlay,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await verifyAdminSession();

  // If unauthenticated, children handles login page, else layout protects dashboard
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {admin && (
        <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
          {/* Admin Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white">GlobalCart</span>
                <span className="block text-[10px] text-amber-400 font-semibold uppercase tracking-wider">
                  Admin CMS
                </span>
              </div>
            </Link>
          </div>

          {/* Admin Nav */}
          <nav className="p-3 space-y-1 flex-1 text-xs">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Overview Dashboard</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Product Catalog</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FolderTree className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Categories</span>
            </Link>

            <Link
              href="/admin/marketplaces"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Marketplaces & Links</span>
            </Link>

            <Link
              href="/admin/blog"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Blog & Guides CMS</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Click Analytics</span>
            </Link>

            <Link
              href="/admin/advertisements"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <MonitorPlay className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Advertisements / AdSense</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Site Settings</span>
            </Link>
          </nav>

          {/* User profile & logout */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">{admin.name}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{admin.email}</div>
              </div>
              <form
                action={async () => {
                  'use server';
                  await destroyAdminSession();
                  redirect('/admin/login');
                }}
              >
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </form>
            </div>

            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-xl transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

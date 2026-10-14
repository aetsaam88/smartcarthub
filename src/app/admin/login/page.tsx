import React from 'react';
import { redirect } from 'next/navigation';
import {
  verifyAdminSession,
  authenticateAdmin,
} from '@/lib/auth/session';

import {
  ShoppingBag,
  Lock,
  Mail,
  ArrowRight,
} from 'lucide-react';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await verifyAdminSession();
  const params = await searchParams;

  if (session) {
    redirect('/admin/dashboard');
  }

  async function handleLogin(formData: FormData) {
    'use server';

    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    const success = await authenticateAdmin(email, password);

    if (success) {
      redirect('/admin/dashboard');
    }

    redirect(
      '/admin/login?error=Invalid+credentials.+Please+check+your+email+and+password.'
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">

        {/* Logo & Headline */}
        <div className="text-center space-y-2">

          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-lg">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              SmartCartHub Admin Portal
          </h1>

          <p className="text-xs text-slate-500">
            Sign in with authorized administrative credentials
            to manage products, categories, affiliate links,
            and blog posts.
          </p>

        </div>

        {/* Error Message */}
        {params.error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {params.error}
          </div>
        )}

        {/* Login Form */}
        <form action={handleLogin} className="space-y-4">

          {/* Email */}
          <div className="space-y-1.5">

            <label className="text-xs font-bold text-slate-700">
              Admin Email Address
            </label>

            <div className="relative">

              <input
                type="email"
                name="email"
                required
                placeholder="Enter admin email"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />

              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">

            <label className="text-xs font-bold text-slate-700">
              Admin Password
            </label>

            <div className="relative">

              <input
                type="password"
                name="password"
                required
                placeholder="Enter admin password"
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />

              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Authenticate Securely</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

        </form>

      </div>
    </div>
  );
}
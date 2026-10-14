import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const settings = await repository.getSettings();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          Configuration & Policies
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Website & Compliance Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure default Amazon marketplace preferences, contact information, and mandatory affiliate disclosure notices.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}

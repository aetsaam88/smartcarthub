import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { AdSenseManager } from '@/components/admin/AdSenseManager';
import { MonitorPlay } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAdSensePage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const adSenseSettings = await repository.getAdSenseSettings();

  return (
    <div className="p-6 sm:p-10 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-amber-600 font-bold uppercase tracking-wider text-xs mb-2">
          <MonitorPlay className="w-3.5 h-3.5" />
          <span>Monetisation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Advertisements / AdSense
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Configure Google AdSense globally, toggle ad placements across the site, and manage
          individual ad units — all without touching any code.
        </p>
      </div>

      {/* Manager component (client) */}
      <AdSenseManager initialSettings={adSenseSettings} />
    </div>
  );
}

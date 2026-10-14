import React from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { AnalyticsCharts } from '@/components/admin/AnalyticsCharts';
import { MousePointerClick, ShieldCheck, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const clicks = await repository.getAffiliateClicks();

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          Privacy-Conscious Telemetry
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Affiliate Link Click Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor outbound Amazon clicks by country and product. No personal user data or full IP addresses are stored.
        </p>
      </div>

      {/* Compliance Note */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-slate-900 font-bold">Amazon Associates Analytics Clarification:</strong>
          <p className="leading-relaxed">
            These statistics track visitor clicks from GlobalCart buttons heading towards Amazon. Final customer conversion rates, qualified commissions, returned orders, and earnings reports are compiled exclusively within the authorized Amazon Associates Central portal.
          </p>
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts clicks={clicks} />

      {/* Recent Clicks Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">
          Recent Outbound Affiliate Clicks
        </h3>

        {clicks.length > 0 ? (
          <div className="divide-y divide-slate-100 text-xs">
            {clicks.slice(0, 15).map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{c.product_name}</div>
                  <div className="text-[10px] text-slate-400">
                    Referrer: {c.referrer_page || 'Direct page button'}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700 text-[11px]">
                    {c.marketplace_code}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(c.clicked_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            No affiliate clicks logged yet.
          </div>
        )}
      </div>
    </div>
  );
}

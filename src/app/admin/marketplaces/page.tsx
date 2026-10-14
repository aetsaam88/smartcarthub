import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import { MARKETPLACE_LIST } from '@/lib/marketplaces';
import {
  Globe,
  ExternalLink,
  MousePointerClick,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminMarketplacesPage() {
  const admin = await verifyAdminSession();
  if (!admin) {
    redirect('/admin/login');
  }

  const [products, clicks] = await Promise.all([
    repository.getProducts({ status: 'all' }),
    repository.getAffiliateClicks(),
  ]);

  // Aggregate click stats by marketplace
  const marketplaceStats: Record<string, { totalLinks: number; clicks: number }> = {};
  MARKETPLACE_LIST.forEach((m) => {
    marketplaceStats[m.code] = { totalLinks: 0, clicks: 0 };
  });

  products.forEach((p) => {
    p.marketplaces?.forEach((m) => {
      if (marketplaceStats[m.marketplace_code]) {
        marketplaceStats[m.marketplace_code].totalLinks += 1;
      }
    });
  });

  clicks.forEach((c) => {
    if (marketplaceStats[c.marketplace_code]) {
      marketplaceStats[c.marketplace_code].clicks += 1;
    }
  });

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-7xl mx-auto">
      <div>
        <span className="text-amber-600 font-bold uppercase tracking-wider text-xs">
          International Affiliate Engine
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Marketplaces & Affiliate Link Health
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor international Amazon storefronts (US, UK, CA, DE, FR, IT), link coverage, and outbound referral clicks.
        </p>
      </div>

      {/* Marketplaces Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MARKETPLACE_LIST.map((m) => {
          const stats = marketplaceStats[m.code] || { totalLinks: 0, clicks: 0 };
          const coveragePercent = Math.round((stats.totalLinks / (products.length || 1)) * 100);

          return (
            <div
              key={m.code}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl leading-none">{m.flag}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{m.name}</h3>
                      <span className="text-[10px] text-slate-400 font-mono">{m.domain}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {m.currency} ({m.currencySymbol})
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Default Tag:</span>
                    <span className="font-mono text-slate-800 font-semibold">{m.defaultAssociateTag}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Active Product Links:</span>
                    <span className="font-bold text-slate-900">{stats.totalLinks} / {products.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Total Clicks Logged:</span>
                    <span className="font-bold text-amber-700">{stats.clicks}</span>
                  </div>
                </div>

                {/* Coverage progress */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Catalog Coverage:</span>
                    <span className="font-bold text-slate-900">{coveragePercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.min(coveragePercent, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Program Active</span>
                </span>
                <Link
                  href={`https://www.${m.domain}`}
                  target="_blank"
                  className="font-bold text-slate-700 hover:text-amber-600 inline-flex items-center gap-1 text-[11px]"
                >
                  <span>Visit Store</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product-to-Marketplace Mapping Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Product-to-Marketplace Link Coverage
            </h2>
            <p className="text-xs text-slate-500">
              Overview of international link configurations per catalog product.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
          >
            <span>Edit Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3 pl-4">Product Name</th>
                {MARKETPLACE_LIST.map((m) => (
                  <th key={m.code} className="p-3 text-center">
                    {m.flag} {m.code}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="p-3 pl-4 font-bold text-slate-800 line-clamp-1 max-w-xs">
                    <Link href={`/admin/products/${p.id}/edit`} className="hover:text-amber-600">
                      {p.name}
                    </Link>
                  </td>
                  {MARKETPLACE_LIST.map((m) => {
                    const link = p.marketplaces?.find((mp) => mp.marketplace_code === m.code);
                    return (
                      <td key={m.code} className="p-3 text-center">
                        {link ? (
                          <a
                            href={link.affiliate_url || link.amazon_product_url}
                            target="_blank"
                            rel="sponsored noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition-colors"
                            title={link.amazon_product_url}
                          >
                            <span>Configured</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ) : (
                          <span className="text-slate-300 text-[10px] italic">Missing</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

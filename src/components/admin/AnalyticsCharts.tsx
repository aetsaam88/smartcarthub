'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { AffiliateClick } from '@/types';
import { MARKETPLACE_LIST } from '@/lib/marketplaces';

interface AnalyticsChartsProps {
  clicks: AffiliateClick[];
}

export function AnalyticsCharts({ clicks }: AnalyticsChartsProps) {
  // Aggregate clicks by marketplace
  const marketData = MARKETPLACE_LIST.map((m) => {
    const count = clicks.filter((c) => c.marketplace_code === m.code).length;
    return {
      name: `${m.flag} ${m.code}`,
      country: m.name,
      clicks: count,
    };
  });

  // Aggregate clicks by product
  const productCountMap: Record<string, { name: string; clicks: number }> = {};
  clicks.forEach((c) => {
    const key = c.product_id;
    if (!productCountMap[key]) {
      productCountMap[key] = {
        name: c.product_name ? c.product_name.slice(0, 22) + '...' : key,
        clicks: 0,
      };
    }
    productCountMap[key].clicks += 1;
  });

  const productData = Object.values(productCountMap)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 6);

  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899', '#6366f1'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Chart 1: By Marketplace */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Outbound Amazon Clicks by Marketplace
          </h3>
          <p className="text-xs text-slate-500">
            Regional distribution of visitor affiliate button interactions.
          </p>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={marketData}>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="clicks" fill="#f59e0b" radius={[6, 6, 0, 0]}>
                {marketData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Top Products */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            Top Clicked Products (Outbound Referral)
          </h3>
          <p className="text-xs text-slate-500">
            Products generating the highest intent towards Amazon product pages.
          </p>
        </div>

        <div className="h-64 w-full pt-4">
          {productData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical">
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={130} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="clicks" fill="#3b82f6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No product clicks recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { ShieldCheck, Info, CheckCircle2 } from 'lucide-react';
import { MARKETPLACE_LIST } from '@/lib/marketplaces';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Amazon Affiliate Disclosure & Program Compliance | SmartCartHub',
  description:
    'Read SmartCartHub’s Amazon affiliate disclosure, editorial independence statement, and affiliate link policies.',
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold border border-amber-500/20">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>Compliance & Transparency</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Amazon Associates Affiliate Disclosure
        </h1>

        <p className="text-sm text-slate-500">
          Last updated: October 2026
        </p>
      </div>

      {/* Amazon Disclosure Card */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-600" />
          <span>Affiliate Disclosure</span>
        </h2>

        <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
          As an Amazon Associate, SmartCartHub earns from qualifying purchases.
        </p>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          SmartCartHub participates in affiliate advertising programs. We may
          earn commissions when visitors click our affiliate links and make
          qualifying purchases, at no additional cost to the customer.
          Amazon and its affiliated marketplaces operate independently of
          SmartCartHub.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">

        <h3 className="text-xl font-bold text-slate-900">
          How Our Affiliate Links Work
        </h3>

        <p>
          SmartCartHub helps visitors discover products, explore product
          features, and compare available options. Our website may contain
          affiliate links labeled with text such as “Buy on Amazon” or
          “Check Price on Amazon.” When you click these links, you may be
          redirected to an Amazon marketplace through a tracked affiliate link.
        </p>

        <ul className="space-y-3 pt-2">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>No Additional Cost:</strong> Using our affiliate links
              does not increase the price you pay. SmartCartHub may receive
              a commission on qualifying purchases.
            </span>
          </li>

          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Affiliate Link Identification:</strong> We aim to
              clearly identify affiliate links and use appropriate link
              attributes, including rel="sponsored", where applicable.
            </span>
          </li>

          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Purchases and Returns:</strong> SmartCartHub does not
              process Amazon orders or payments. Product purchases, shipping,
              returns, and refunds are handled by the relevant retailer
              according to its policies.
            </span>
          </li>
        </ul>

        {/* Marketplaces */}
        <h3 className="text-xl font-bold text-slate-900 pt-4">
          Supported Amazon Marketplaces
        </h3>

        <p>
          SmartCartHub may provide affiliate links to supported Amazon
          marketplaces. The available marketplaces depend on our current
          affiliate participation and the products we feature.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          {MARKETPLACE_LIST.map((m) => (
            <div
              key={m.code}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
            >
              <span className="text-base mr-1.5">{m.flag}</span>
              <span className="font-bold text-slate-900">{m.name}</span>
              <div className="text-[11px] text-slate-500">
                {m.domain}
              </div>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <h3 className="text-xl font-bold text-slate-900 pt-4">
          Pricing and Availability
        </h3>

        <p>
          Product prices, ratings, and availability may change at any time.
          Unless current information is obtained through an authorized source,
          visitors should check the retailer’s website for the latest price,
          product details, shipping costs, and availability.
        </p>

        {/* Editorial Independence */}
        <h3 className="text-xl font-bold text-slate-900 pt-4">
          Editorial Independence
        </h3>

        <p>
          SmartCartHub aims to provide useful product information and
          comparisons to help visitors make informed shopping decisions.
          Affiliate commissions may influence which products we choose to
          feature, but they should not be presented as a guarantee that a
          product is best for every visitor. Product claims and recommendations
          should be based on available information and clearly disclosed
          criteria.
        </p>

        {/* Contact */}
        <h3 className="text-xl font-bold text-slate-900 pt-4">
          Contact Us
        </h3>

        <p>
          If you have questions about this Affiliate Disclosure, please visit
          our Contact page.
        </p>

        <p>
          <a
            href="/contact"
            className="font-semibold text-amber-600 hover:text-amber-700 underline"
          >
            Contact SmartCartHub
          </a>
        </p>

      </div>
    </div>
  );
}

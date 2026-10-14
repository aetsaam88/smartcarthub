import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Globe, ShieldCheck, Award, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About GlobalCart | International Amazon Product Discovery',
  description: 'Learn about GlobalCart mission: delivering transparent, research-backed product reviews and guides for international Amazon shoppers.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold">
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Empowering International Shoppers with Clear, Honest Research
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          The internet is saturated with unverified reviews, deceptive discounts, and AI-generated product rankings. GlobalCart was founded to bring clarity, verified specifications, and genuine editorial curation to consumers shopping on Amazon worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Multi-Marketplace First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We actively support visitors from the United States, United Kingdom, Canada, Germany, France, and Italy, matching product recommendations to native regional stores.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Complete Transparency</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We adhere strictly to Amazon Associates Program Policies and FTC guidelines. We disclose affiliate partnerships on every page and never inflate editorial scores for profit.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Verified Specifications</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every technical specification in our database is verified against official engineering documents. We highlight both pros and cons for every single product.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to discover your next setup upgrade?</h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Explore our product database or dive into our in-depth buying guides to find the perfect gear.
        </p>
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

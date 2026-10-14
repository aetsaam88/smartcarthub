import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editorial Policy & Testing Standards | GlobalCart',
  description: 'Our review methodology, research standards, rating criteria, and commitment to independent product evaluation.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Integrity & Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Editorial Policy & Review Methodology
        </h1>
        <p className="text-sm text-slate-500">
          How GlobalCart evaluates consumer electronics and workspace technology.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">Our Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Verifiable Claims Only</h3>
            <p className="text-xs text-slate-600">
              We never claim a product has undergone independent laboratory benchmarking unless documented test cycles have been executed. Specifications are verified against original manufacturer technical sheets.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">2. Objective Trade-Offs</h3>
            <p className="text-xs text-slate-600">
              Every hardware product involves design compromises—whether that is weight, battery capacity, acoustics, or price. Every product listed on GlobalCart includes both Pros and Cons.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">3. No Paid Editorial Placements</h3>
            <p className="text-xs text-slate-600">
              We do not accept monetary compensation in exchange for positive reviews or preferential ranking in our comparison tables. Editorial decisions are strictly separated from advertising partnerships.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">4. Continuous Updating</h3>
            <p className="text-xs text-slate-600">
              When a manufacturer discontinues a model or releases an updated revision, our editorial team archives obsolete guides and updates links to the current iteration.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 pt-4">How Editorial Ratings Are Determined</h2>
        <p>
          Our 1.0 to 5.0 score represents a composite evaluation across four dimensions:
        </p>
        <ul className="space-y-2 text-xs">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Build Quality & Ergonomics (30%):</strong> Materials, tactile switch feel, and posture support over long sessions.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Real-world Performance (30%):</strong> Battery longevity, wireless connection stability, and noise dampening effectiveness.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Software Overhead (20%):</strong> Ease of configuration, firmware update reliability, and absence of unwanted companion bloatware.</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Long-term Value (20%):</strong> Durability, warranty coverage, and repairability.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | GlobalCart',
  description: 'Terms of service and usage conditions for the GlobalCart affiliate marketing platform.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2025</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">1. Nature of Service</h2>
        <p>
          GlobalCart provides product discovery, editorial reviews, comparison tables, and buying guides. GlobalCart is an independent affiliate platform and not an authorized seller or distributor of the items featured. All purchases, payments, shipping, warranties, and returns are fulfilled strictly by Amazon and its respective merchants.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">2. Accuracy of Information</h2>
        <p>
          While we strive to ensure technical specifications, product features, and editorial assessments are accurate at publication time, manufacturer specifications and Amazon product availability change without notice. Visitors are encouraged to verify exact specifications on Amazon before finalizing orders.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">3. Intellectual Property</h2>
        <p>
          Amazon, the Amazon logo, and Amazon-related trademarks are the property of Amazon.com, Inc. or its affiliates. All editorial reviews, buying guide text, and original comparison layouts are copyright of GlobalCart.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">4. Limitation of Liability</h2>
        <p>
          GlobalCart shall not be held liable for any damages resulting from product purchases made on Amazon, product defects, or shipping delays caused by third-party retailers.
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | GlobalCart',
  description: 'How GlobalCart collects, respects, and protects visitor data in accordance with privacy regulations.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">Effective Date: January 1, 2025</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          GlobalCart prioritizes privacy. We do NOT track individual user identities across external websites, nor do we store credit cards, bank accounts, or sensitive personal data.
        </p>
        <p>
          When you subscribe to our optional newsletter, we store your email address with your explicit consent timestamp solely for sending product updates. You may unsubscribe at any time via the link provided in every newsletter.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">2. Outbound Affiliate Clicks</h2>
        <p>
          When you click an Amazon affiliate button, we log an anonymized aggregation record containing the product ID, the marketplace code (e.g., US, UK), and the timestamp. We do NOT store full IP addresses or personally identifiable information for click telemetry.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">3. Cookies and Local Storage</h2>
        <p>
          We use browser local storage to persist your selected Amazon marketplace country preference (e.g., US or UK) and your temporary product comparison list so that your choices remain active across sessions.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">4. Third-Party Links</h2>
        <p>
          When clicking links directing to Amazon.com or international Amazon domains, your interactions are governed by Amazon&apos;s Privacy Notice.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-2">5. Contact Us</h2>
        <p>
          For privacy inquiries or data removal requests, please contact our privacy compliance officer at <code>privacy@globalcart.example</code>.
        </p>
      </div>
    </div>
  );
}

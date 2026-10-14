'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setStatus({ type: 'error', message: 'You must check the consent box to subscribe.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: data.message || 'Successfully subscribed! Welcome aboard.' });
        setEmail('');
        setConsent(false);
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to subscribe. Please try again.' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
          <Mail className="w-6 h-6" />
        </div>
        
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
          Never Miss an In-Depth Buying Guide
        </h2>
        
        <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
          Get weekly curated product roundups, price drop alerts, and tech buyer guides straight to your inbox. No spam, ever. Unsubscribe at any time with one click.
        </p>

        {status && (
          <div
            className={`max-w-md mx-auto p-4 rounded-xl text-xs flex items-center gap-3 text-left ${
              status.type === 'success'
                ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-800'
                : 'bg-rose-950/80 text-rose-200 border border-rose-800'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            )}
            <p>{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Subscribe</span>
            </button>
          </div>

          <div className="flex items-start gap-2.5 text-left text-xs text-slate-400">
            <input
              type="checkbox"
              id="newsletter-consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-800"
            />
            <label htmlFor="newsletter-consent" className="cursor-pointer leading-tight">
              I agree to receive editorial newsletters and product updates from GlobalCart. Read our{' '}
              <a href="/privacy-policy" className="underline text-amber-400 hover:text-amber-300">
                Privacy Policy
              </a>.
            </label>
          </div>
        </form>
      </div>
    </section>
  );
}

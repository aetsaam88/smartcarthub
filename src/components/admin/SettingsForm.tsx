'use client';

import React, { useState } from 'react';
import { SiteSettings, MarketplaceCode } from '@/types';
import { MARKETPLACE_LIST } from '@/lib/marketplaces';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    setError(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl text-xs">
      
      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Brand & Identity */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold uppercase tracking-wider text-slate-400">
          Brand & Identity
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Platform Name</label>
            <input
              type="text"
              value={settings.site_name}
              onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Logo Text</label>
            <input
              type="text"
              value={settings.logo_text}
              onChange={(e) => setSettings({ ...settings, logo_text: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700">Tagline / Motto</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Official Contact Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Default Target Marketplace</label>
            <select
              value={settings.default_marketplace}
              onChange={(e) =>
                setSettings({ ...settings, default_marketplace: e.target.value as MarketplaceCode })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              {MARKETPLACE_LIST.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.flag} {m.name} ({m.domain})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Compliance Disclosures */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold uppercase tracking-wider text-slate-400">
          Amazon Associates Disclosures
        </h2>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Short Statutory Statement</label>
            <input
              type="text"
              value={settings.affiliate_disclosure_short}
              onChange={(e) =>
                setSettings({ ...settings, affiliate_disclosure_short: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Full Legal Policy Statement</label>
            <textarea
              rows={4}
              value={settings.affiliate_disclosure_full}
              onChange={(e) =>
                setSettings({ ...settings, affiliate_disclosure_full: e.target.value })
              }
              className="w-full px-3 py-2 rounded-xl border border-slate-200 leading-relaxed"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save System Settings</span>
        </button>
      </div>

    </form>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import { Save, Plus, Trash2, Pencil, ToggleLeft, ToggleRight, MonitorPlay, AlertCircle, CheckCircle2, X } from 'lucide-react';
import type { AdSenseSettings, AdUnit, AdPlacementKey, AdFormat } from '@/types/adsense';
import { PLACEMENT_LABELS, FORMAT_LABELS } from '@/types/adsense';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 ${
        checked ? 'bg-amber-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ─── Ad Unit Form Modal ───────────────────────────────────────────────────────

interface AdUnitFormProps {
  initial?: AdUnit;
  onSave: (data: Omit<AdUnit, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const PLACEMENT_KEYS = Object.keys(PLACEMENT_LABELS) as AdPlacementKey[];
const FORMAT_KEYS = Object.keys(FORMAT_LABELS) as AdFormat[];

function AdUnitForm({ initial, onSave, onCancel }: AdUnitFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    ad_slot_id: initial?.ad_slot_id || '',
    ad_format: (initial?.ad_format || 'auto') as AdFormat,
    placement: (initial?.placement || PLACEMENT_KEYS[0]) as AdPlacementKey,
    enabled: initial?.enabled !== false,
  });
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Ad Unit Name is required.'); return; }
    if (!form.ad_slot_id.trim()) { setError('Ad Slot ID is required.'); return; }
    if (!/^\d+$/.test(form.ad_slot_id.trim())) { setError('Ad Slot ID must be numeric (e.g. 1234567890).'); return; }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {initial ? 'Edit Ad Unit' : 'New Ad Unit'}
          </h3>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ad Unit Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Homepage Hero Banner"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Slot ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ad Slot ID *</label>
            <input
              type="text"
              value={form.ad_slot_id}
              onChange={(e) => setForm({ ...form, ad_slot_id: e.target.value.trim() })}
              placeholder="e.g. 1234567890"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">Numeric ID from your AdSense account › Ad units.</p>
          </div>

          {/* Placement */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Placement Location *</label>
            <select
              value={form.placement}
              onChange={(e) => setForm({ ...form, placement: e.target.value as AdPlacementKey })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {PLACEMENT_KEYS.map((key) => (
                <option key={key} value={key}>{PLACEMENT_LABELS[key]}</option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Ad Format</label>
            <select
              value={form.ad_format}
              onChange={(e) => setForm({ ...form, ad_format: e.target.value as AdFormat })}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {FORMAT_KEYS.map((key) => (
                <option key={key} value={key}>{FORMAT_LABELS[key]}</option>
              ))}
            </select>
          </div>

          {/* Enabled */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Enabled</span>
            <Toggle checked={form.enabled} onChange={(v) => setForm({ ...form, enabled: v })} label="Enable this ad unit" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
            >
              {initial ? 'Save Changes' : 'Create Ad Unit'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main AdSense Manager Component ──────────────────────────────────────────

interface AdSenseManagerProps {
  initialSettings: AdSenseSettings;
}

export function AdSenseManager({ initialSettings }: AdSenseManagerProps) {
  const [settings, setSettings] = useState<AdSenseSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [editingUnit, setEditingUnit] = useState<AdUnit | null>(null);
  const [showNewUnitForm, setShowNewUnitForm] = useState(false);

  // ─── Persist helpers ─────────────────────────────────────────────────────

  const showStatus = (status: 'success' | 'error') => {
    setSaveStatus(status);
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const saveGlobalSettings = useCallback(async (patch: Partial<AdSenseSettings>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/adsense', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed');
      const { settings: saved } = await res.json();
      setSettings(saved);
      showStatus('success');
    } catch {
      showStatus('error');
    } finally {
      setSaving(false);
    }
  }, []);

  // ─── Toggle helpers ───────────────────────────────────────────────────────

  const toggleGlobal = () => {
    const next = { ...settings, enabled: !settings.enabled };
    setSettings(next);
    saveGlobalSettings({ enabled: next.enabled });
  };

  const toggleAutoAds = () => {
    const next = { ...settings, auto_ads_enabled: !settings.auto_ads_enabled };
    setSettings(next);
    saveGlobalSettings({ auto_ads_enabled: next.auto_ads_enabled });
  };

  const toggleAdLabel = () => {
    const next = { ...settings, show_ad_label: !settings.show_ad_label };
    setSettings(next);
    saveGlobalSettings({ show_ad_label: next.show_ad_label });
  };

  const togglePlacement = (key: AdPlacementKey) => {
    const next = {
      ...settings,
      placements: { ...settings.placements, [key]: !settings.placements[key] },
    };
    setSettings(next);
    saveGlobalSettings({ placements: next.placements });
  };

  // ─── Publisher ID save ────────────────────────────────────────────────────

  const [publisherId, setPublisherId] = useState(settings.publisher_id);

  const savePublisherId = async () => {
    if (!publisherId.trim()) return;
    await saveGlobalSettings({ publisher_id: publisherId.trim() });
  };

  // ─── Ad Unit CRUD ─────────────────────────────────────────────────────────

  const createAdUnit = async (data: Omit<AdUnit, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/adsense/ad-units', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Create failed');
      const { ad_unit } = await res.json();
      setSettings((prev) => ({ ...prev, ad_units: [...prev.ad_units, ad_unit] }));
      setShowNewUnitForm(false);
      showStatus('success');
    } catch {
      showStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const updateAdUnit = async (id: string, data: Omit<AdUnit, 'id' | 'created_at' | 'updated_at'>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/adsense/ad-units/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Update failed');
      const { ad_unit } = await res.json();
      setSettings((prev) => ({
        ...prev,
        ad_units: prev.ad_units.map((u) => (u.id === id ? ad_unit : u)),
      }));
      setEditingUnit(null);
      showStatus('success');
    } catch {
      showStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const deleteAdUnit = async (id: string) => {
    if (!confirm('Delete this ad unit? This cannot be undone.')) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/adsense/ad-units/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error || 'Delete failed');
      setSettings((prev) => ({ ...prev, ad_units: prev.ad_units.filter((u) => u.id !== id) }));
      showStatus('success');
    } catch {
      showStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const toggleUnitEnabled = async (unit: AdUnit) => {
    await updateAdUnit(unit.id, { ...unit, enabled: !unit.enabled });
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const placementKeys = Object.keys(PLACEMENT_LABELS) as AdPlacementKey[];
  const hasValidConfig = Boolean(settings.publisher_id?.trim());

  return (
    <div className="space-y-8">

      {/* Modals */}
      {showNewUnitForm && (
        <AdUnitForm onSave={createAdUnit} onCancel={() => setShowNewUnitForm(false)} />
      )}
      {editingUnit && (
        <AdUnitForm
          initial={editingUnit}
          onSave={(data) => updateAdUnit(editingUnit.id, data)}
          onCancel={() => setEditingUnit(null)}
        />
      )}

      {/* Save Status Toast */}
      {saveStatus !== 'idle' && (
        <div
          className={`fixed top-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${
            saveStatus === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {saveStatus === 'success' ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{saveStatus === 'success' ? 'Settings saved!' : 'Save failed. Please try again.'}</span>
        </div>
      )}

      {/* ── Section 1: Global Controls ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <MonitorPlay className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-bold text-slate-900">Global AdSense Controls</h2>
        </div>

        <div className="p-5 space-y-5">

          {/* Master enable */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Enable Google AdSense</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Master switch. When off, no ads are loaded anywhere on the site.
              </p>
            </div>
            <Toggle checked={settings.enabled} onChange={toggleGlobal} label="Enable AdSense globally" />
          </div>

          {/* Auto Ads */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <div>
              <p className="text-sm font-semibold text-slate-800">Google Auto Ads</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Let Google automatically place additional ads. Works alongside manual placements.
              </p>
            </div>
            <Toggle checked={settings.auto_ads_enabled} onChange={toggleAutoAds} label="Enable Auto Ads" />
          </div>

          {/* Ad Label */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <div>
              <p className="text-sm font-semibold text-slate-800">Show "Advertisement" Label</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Display a small label above each ad container for transparency.
              </p>
            </div>
            <Toggle checked={settings.show_ad_label} onChange={toggleAdLabel} label="Show ad label" />
          </div>

          {/* Publisher ID */}
          <div className="border-t border-slate-100 pt-5 space-y-2">
            <label className="block text-sm font-semibold text-slate-800">
              Publisher ID <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-500">
              Found in your AdSense account › Account › Account information. Format:{' '}
              <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-xs">ca-pub-XXXXXXXXXXXXXXXX</code>
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={publisherId}
                onChange={(e) => setPublisherId(e.target.value)}
                placeholder="ca-pub-1234567890123456"
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={savePublisherId}
                disabled={saving || !publisherId.trim()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
            {!hasValidConfig && (
              <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  No ads will be displayed until a valid Publisher ID is saved and AdSense is enabled.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 2: Placement Toggles ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900">Placement Locations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Control which page sections are eligible to display ads.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {placementKeys.map((key) => (
            <div key={key} className="px-5 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-800">{PLACEMENT_LABELS[key]}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Slot key: <code className="font-mono">{key}</code>
                </p>
              </div>
              <Toggle
                checked={Boolean(settings.placements[key])}
                onChange={() => togglePlacement(key)}
                label={`Toggle ${PLACEMENT_LABELS[key]}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: Ad Units ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Ad Units</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure individual ad units. Each unit maps to a placement slot.
            </p>
          </div>
          <button
            onClick={() => setShowNewUnitForm(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Ad Unit</span>
          </button>
        </div>

        {settings.ad_units.length === 0 ? (
          <div className="p-10 text-center text-slate-400 space-y-2">
            <MonitorPlay className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-medium">No ad units configured yet.</p>
            <p className="text-xs">
              Add an ad unit above to map a slot ID to a specific placement location.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {settings.ad_units.map((unit) => (
              <div key={unit.id} className="px-5 py-4 flex items-center gap-4">
                {/* Status dot */}
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${unit.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">{unit.name}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    Slot: <code className="font-mono">{unit.ad_slot_id}</code>
                    {' · '}
                    {PLACEMENT_LABELS[unit.placement]}
                    {' · '}
                    {FORMAT_LABELS[unit.ad_format]}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Toggle
                    checked={unit.enabled}
                    onChange={() => toggleUnitEnabled(unit)}
                    label={`Toggle ${unit.name}`}
                  />
                  <button
                    onClick={() => setEditingUnit(unit)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAdUnit(unit.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 4: Compliance Notice ───────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-xs text-slate-700 space-y-2">
        <p className="font-bold text-slate-900">Google AdSense Policy Reminder</p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
          <li>Never click your own ads or encourage others to do so.</li>
          <li>Do not place ads on pages without original content.</li>
          <li>Ensure your Privacy Policy discloses the use of Google AdSense and cookies.</li>
          <li>If serving EU visitors, obtain valid cookie consent before loading ads.</li>
          <li>
            Ads will only load after your AdSense account is approved and the ad unit is active.
          </li>
        </ul>
        <a
          href="https://support.google.com/adsense/answer/48182"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-amber-700 font-semibold underline hover:text-amber-600 mt-1"
        >
          Read the full AdSense Program Policies →
        </a>
      </div>

    </div>
  );
}

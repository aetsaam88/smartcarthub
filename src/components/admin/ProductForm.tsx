'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category, MarketplaceCode, ProductMarketplace } from '@/types';
import { MARKETPLACE_LIST } from '@/lib/marketplaces';
import { slugify } from '@/lib/utils';
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Globe,
} from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  initialProduct?: Product | null;
  categories: Category[];
}

export function ProductForm({ initialProduct, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState(initialProduct?.name || '');
  const [slug, setSlug] = useState(initialProduct?.slug || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || '');
  const [shortDesc, setShortDesc] = useState(initialProduct?.short_description || '');
  const [desc, setDesc] = useState(initialProduct?.description || '');
  const [rating, setRating] = useState(initialProduct?.editorial_rating || 4.5);
  const [featured, setFeatured] = useState(initialProduct?.featured || false);
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>(
    initialProduct?.status || 'published'
  );
  const [imageUrl, setImageUrl] = useState(
    initialProduct?.image_reference || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
  );
  const [seoTitle, setSeoTitle] = useState(initialProduct?.seo_title || '');
  const [seoDesc, setSeoDesc] = useState(initialProduct?.seo_description || '');

  // Dynamic arrays
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features?.length ? initialProduct.features : ['High performance build']
  );
  const [pros, setPros] = useState<string[]>(
    initialProduct?.pros?.length ? initialProduct.pros : ['Excellent durability']
  );
  const [cons, setCons] = useState<string[]>(
    initialProduct?.cons?.length ? initialProduct.cons : ['Higher price point']
  );

  // Specifications key-value pairs
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(
    initialProduct?.specifications
      ? Object.entries(initialProduct.specifications).map(([key, value]) => ({ key, value }))
      : [{ key: 'Connectivity', value: 'Bluetooth 5.2' }]
  );

  // Marketplace URLs
  const [marketplaces, setMarketplaces] = useState<Record<MarketplaceCode, string>>(() => {
    const map: Record<MarketplaceCode, string> = {
      US: '',
      UK: '',
      CA: '',
      DE: '',
      FR: '',
      IT: '',
    };
    initialProduct?.marketplaces?.forEach((m) => {
      map[m.marketplace_code] = m.amazon_product_url;
    });
    return map;
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!initialProduct) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format specifications record
      const specRecord: Record<string, string> = {};
      specs.forEach((s) => {
        if (s.key.trim() && s.value.trim()) {
          specRecord[s.key.trim()] = s.value.trim();
        }
      });

      // Format marketplaces array
      const marketplaceEntries: ProductMarketplace[] = Object.entries(marketplaces)
        .filter(([_, url]) => url.trim().length > 0)
        .map(([code, url]) => ({
          id: `pm-${Date.now()}-${code}`,
          product_id: initialProduct?.id || '',
          marketplace_code: code as MarketplaceCode,
          amazon_product_url: url.trim(),
          affiliate_url: `${url.trim()}${url.includes('?') ? '&' : '?'}tag=globalcart-${code.toLowerCase()}-20`,
          currency_code: code === 'UK' ? 'GBP' : code === 'CA' ? 'CAD' : code === 'US' ? 'USD' : 'EUR',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));

      const payload: Partial<Product> = {
        id: initialProduct?.id,
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        brand: brand.trim(),
        category_id: categoryId,
        short_description: shortDesc.trim(),
        description: desc.trim(),
        editorial_rating: Number(rating),
        featured,
        status,
        image_reference: imageUrl.trim(),
        features: features.filter((f) => f.trim().length > 0),
        pros: pros.filter((p) => p.trim().length > 0),
        cons: cons.filter((c) => c.trim().length > 0),
        specifications: specRecord,
        marketplaces: marketplaceEntries,
        seo_title: seoTitle.trim(),
        seo_description: seoDesc.trim(),
      };

      const res = await fetch('/api/admin/products', {
        method: initialProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl">
      
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{initialProduct ? 'Update Product' : 'Publish Product'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Core Identification */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Core Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">URL Slug *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Brand / Manufacturer *</label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Sony"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Category *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500 bg-white"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Editorial Rating (1.0 to 5.0) *</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="5"
              required
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Permitted Product Image URL *</label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Short Summary (Listing Card) *</label>
            <textarea
              rows={2}
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-slate-700">Full Editorial Review & Breakdown *</label>
            <textarea
              rows={5}
              required
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-amber-500"
            />
            <span>Set as Featured Product on Homepage</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Amazon Marketplace Links */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              International Amazon Marketplace Links
            </h2>
            <p className="text-xs text-slate-500">
              Enter verified Amazon product URLs for each country. System attaches your affiliate tags automatically.
            </p>
          </div>
          <Globe className="w-5 h-5 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MARKETPLACE_LIST.map((m) => (
            <div key={m.code} className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>{m.flag}</span>
                <span>{m.name} ({m.domain})</span>
              </label>
              <input
                type="url"
                value={marketplaces[m.code as MarketplaceCode]}
                onChange={(e) =>
                  setMarketplaces({
                    ...marketplaces,
                    [m.code as MarketplaceCode]: e.target.value,
                  })
                }
                placeholder={`https://www.${m.domain}/dp/...`}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. Features, Pros, Cons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Features */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Features</h3>
            <button
              type="button"
              onClick={() => setFeatures([...features, ''])}
              className="text-amber-600 hover:text-amber-700 p-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat}
                  onChange={(e) => {
                    const copy = [...features];
                    copy[idx] = e.target.value;
                    setFeatures(copy);
                  }}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pros */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pros</h3>
            <button
              type="button"
              onClick={() => setPros([...pros, ''])}
              className="text-emerald-600 hover:text-emerald-700 p-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {pros.map((pro, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => {
                    const copy = [...pros];
                    copy[idx] = e.target.value;
                    setPros(copy);
                  }}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setPros(pros.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700">Cons</h3>
            <button
              type="button"
              onClick={() => setCons([...cons, ''])}
              className="text-rose-600 hover:text-rose-700 p-1"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {cons.map((con, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => {
                    const copy = [...cons];
                    copy[idx] = e.target.value;
                    setCons(copy);
                  }}
                  className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setCons(cons.filter((_, i) => i !== idx))}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Specifications */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Technical Specifications (Key & Value)
          </h2>
          <button
            type="button"
            onClick={() => setSpecs([...specs, { key: '', value: '' }])}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Spec</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {specs.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Spec Key (e.g. Battery Life)"
                value={item.key}
                onChange={(e) => {
                  const copy = [...specs];
                  copy[idx].key = e.target.value;
                  setSpecs(copy);
                }}
                className="w-1/3 px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <input
                type="text"
                placeholder="Value (e.g. Up to 30 hours)"
                value={item.value}
                onChange={(e) => {
                  const copy = [...specs];
                  copy[idx].value = e.target.value;
                  setSpecs(copy);
                }}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-rose-500 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </form>
  );
}

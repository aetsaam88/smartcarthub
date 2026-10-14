'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ArrowRight, Layers, Trash2 } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';

export function ComparisonBar() {
  const { comparedProducts, removeFromCompare, clearCompare } = useComparison();

  if (comparedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-3 sm:p-4 animate-in slide-in-from-bottom-6 duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Info & Items */}
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto py-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 shrink-0">
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Compare ({comparedProducts.length}/4):</span>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.map((p) => (
              <div
                key={p.id}
                className="relative flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 shrink-0 max-w-[180px]"
              >
                <div className="relative w-6 h-6 rounded bg-slate-700 overflow-hidden shrink-0">
                  <Image
                    src={p.image_reference}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-medium truncate text-slate-200">
                  {p.name}
                </span>
                <button
                  onClick={() => removeFromCompare(p.id)}
                  className="text-slate-400 hover:text-white p-0.5"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-xs text-slate-400 hover:text-white px-2 py-1.5 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          <Link
            href="/compare"
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <span>Compare Now ({comparedProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}

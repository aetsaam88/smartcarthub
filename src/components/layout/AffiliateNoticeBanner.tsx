'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export function AffiliateNoticeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-hidden">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="truncate">
            <span className="font-semibold text-slate-200">Editorial Transparency:</span> As an Amazon Associate, GlobalCart earns from qualifying purchases. Product recommendations are research-backed and completely independent.{' '}
            <Link href="/affiliate-disclosure" className="underline text-amber-400 hover:text-amber-300 ml-1">
              Read Disclosure
            </Link>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white shrink-0 p-1 rounded transition-colors"
          aria-label="Dismiss notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

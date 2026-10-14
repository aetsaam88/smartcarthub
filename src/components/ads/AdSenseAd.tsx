'use client';

import React, { useEffect, useRef } from 'react';
import type { AdUnit } from '@/types/adsense';

interface AdSenseAdProps {
  /** The fully configured ad unit to render */
  adUnit: AdUnit;
  /** Publisher ID, e.g. "ca-pub-1234567890123456" */
  publisherId: string;
  /** Show the "Advertisement" label above the container */
  showLabel?: boolean;
  /** Extra CSS classes for the wrapper element */
  className?: string;
}

/**
 * AdSenseAd — renders a single Google AdSense ad unit.
 *
 * The component calls adsbygoogle.push() after mount so the ad fills its
 * container. It is intentionally a leaf component — all visibility logic
 * lives in <AdPlacement>.
 *
 * ⚠️  This component renders REAL ads only when a valid publisher_id and
 * ad_slot_id are provided.  No fake content or placeholder revenue is inserted.
 */
export function AdSenseAd({
  adUnit,
  publisherId,
  showLabel = true,
  className = '',
}: AdSenseAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Guard: do not push twice (React StrictMode double-invoke)
    if (pushed.current) return;
    pushed.current = true;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet or blocked — silently fail
    }
  }, []);

  // Format-specific sizing classes
  const sizeClasses: Record<string, string> = {
    auto: 'w-full',
    rectangle: 'w-full max-w-[336px] mx-auto',
    horizontal: 'w-full max-w-[728px] mx-auto',
    vertical: 'w-full max-w-[160px] mx-auto',
  };

  return (
    <div className={`adsense-container ${className}`} aria-label="Advertisement">
      {showLabel && (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 text-center mb-1 select-none">
          Advertisement
        </p>
      )}
      <div className={sizeClasses[adUnit.ad_format] || 'w-full'}>
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={publisherId}
          data-ad-slot={adUnit.ad_slot_id}
          data-ad-format={adUnit.ad_format === 'auto' ? 'auto' : undefined}
          data-full-width-responsive={adUnit.ad_format === 'auto' ? 'true' : undefined}
        />
      </div>
    </div>
  );
}

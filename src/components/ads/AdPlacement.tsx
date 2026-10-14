'use client';

import React from 'react';
import type { AdPlacementKey } from '@/types/adsense';
import { useAdSense } from '@/context/AdSenseContext';
import { AdSenseAd } from './AdSenseAd';

interface AdPlacementProps {
  /** Which named placement slot this component represents */
  placement: AdPlacementKey;
  /** Extra CSS classes for the outer wrapper */
  className?: string;
}

/**
 * AdPlacement — smart wrapper that decides whether to render an ad.
 *
 * Render this component wherever you want a potential ad to appear.
 * It will:
 *   1. Return null while the AdSense config is loading (no layout shift).
 *   2. Return null if AdSense is globally disabled.
 *   3. Return null if the specific placement is toggled off.
 *   4. Return null if no enabled ad unit is configured for this placement.
 *   5. Otherwise render the <AdSenseAd> for the matched ad unit.
 *
 * The outer wrapper uses `my-6` vertical spacing so ads breathe between
 * content sections without disrupting the existing layout grid.
 */
export function AdPlacement({ placement, className = '' }: AdPlacementProps) {
  const { isLoading, config, getAdUnitForPlacement } = useAdSense();

  // 1. Still fetching config — render nothing (prevents CLS)
  if (isLoading) return null;

  // 2. AdSense not active (disabled or no publisher_id)
  if (!config.enabled || !config.publisher_id?.trim()) return null;

  // 3. Specific placement disabled
  if (!config.placements[placement]) return null;

  // 4. No configured unit for this placement
  const adUnit = getAdUnitForPlacement(placement);
  if (!adUnit) return null;

  return (
    <div
      className={`ad-placement my-6 overflow-hidden ${className}`}
      data-placement={placement}
    >
      <AdSenseAd
        adUnit={adUnit}
        publisherId={config.publisher_id}
        showLabel={config.show_ad_label}
      />
    </div>
  );
}

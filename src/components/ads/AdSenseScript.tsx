'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { useAdSense } from '@/context/AdSenseContext';

/**
 * AdSenseScript — conditionally injects the Google AdSense <script> tag.
 *
 * Rules:
 *  • Only injected once (Next.js <Script strategy="afterInteractive"> deduplicates).
 *  • Only injected when AdSense is globally enabled AND a valid publisher_id exists.
 *  • When auto_ads_enabled is true, sets data-ad-client so Auto Ads activates.
 *  • Does NOT load any script when AdSense is disabled — zero network impact.
 *
 * Place this component inside a Client Component wrapper at the root layout level.
 */
export function AdSenseScript() {
  const { config, isLoading } = useAdSense();

  // Nothing to do while config is fetching or when AdSense is disabled
  if (isLoading) return null;
  if (!config.enabled || !config.publisher_id?.trim()) return null;

  const src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.publisher_id}`;

  return (
    <Script
      id="adsense-script"
      src={src}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      data-ad-client={config.auto_ads_enabled ? config.publisher_id : undefined}
    />
  );
}

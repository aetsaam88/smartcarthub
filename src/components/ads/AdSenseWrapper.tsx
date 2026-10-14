'use client';

import React from 'react';
import { AdSenseProvider } from '@/context/AdSenseContext';
import { AdSenseScript } from '@/components/ads/AdSenseScript';

/**
 * AdSenseWrapper
 *
 * A thin client-component shell that:
 *   1. Wraps children with the AdSenseProvider (fetches config, exposes context).
 *   2. Conditionally injects the AdSense <script> tag once the config is known.
 *
 * This wrapper is imported inside the server-component root layout so we avoid
 * making the entire layout a client component.
 */
export function AdSenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdSenseProvider>
      <AdSenseScript />
      {children}
    </AdSenseProvider>
  );
}

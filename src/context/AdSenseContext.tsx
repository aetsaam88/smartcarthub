'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AdSenseSettings, AdPlacementKey, AdUnit } from '@/types/adsense';
import { DEFAULT_ADSENSE_SETTINGS } from '@/types/adsense';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicAdSenseConfig {
  publisher_id: string;
  enabled: boolean;
  auto_ads_enabled: boolean;
  show_ad_label: boolean;
  placements: Partial<Record<AdPlacementKey, boolean>>;
  ad_units: AdUnit[];
}

interface AdSenseContextValue {
  config: PublicAdSenseConfig;
  isLoading: boolean;
  /** True only when AdSense is globally enabled AND a valid publisher_id exists */
  isActive: boolean;
  /**
   * Returns the first enabled ad unit for a given placement,
   * or undefined if the placement is disabled or no unit is configured.
   */
  getAdUnitForPlacement: (placement: AdPlacementKey) => AdUnit | undefined;
  /** Whether a specific placement is enabled */
  isPlacementEnabled: (placement: AdPlacementKey) => boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AdSenseContext = createContext<AdSenseContextValue>({
  config: { ...DEFAULT_ADSENSE_SETTINGS, ad_units: [] },
  isLoading: true,
  isActive: false,
  getAdUnitForPlacement: () => undefined,
  isPlacementEnabled: () => false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AdSenseProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PublicAdSenseConfig>({
    publisher_id: '',
    enabled: false,
    auto_ads_enabled: false,
    show_ad_label: true,
    placements: {},
    ad_units: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch('/api/adsense-config', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as PublicAdSenseConfig;
        if (!cancelled) setConfig(data);
      } catch {
        // Network error — leave defaults (no ads shown)
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const isActive = Boolean(config.enabled && config.publisher_id?.trim());

  const getAdUnitForPlacement = useCallback(
    (placement: AdPlacementKey): AdUnit | undefined => {
      if (!isActive) return undefined;
      if (!config.placements[placement]) return undefined;
      return config.ad_units.find(
        (u) => u.enabled && u.placement === placement
      );
    },
    [isActive, config]
  );

  const isPlacementEnabled = useCallback(
    (placement: AdPlacementKey): boolean => {
      if (!isActive) return false;
      return Boolean(config.placements[placement]);
    },
    [isActive, config]
  );

  return (
    <AdSenseContext.Provider
      value={{ config, isLoading, isActive, getAdUnitForPlacement, isPlacementEnabled }}
    >
      {children}
    </AdSenseContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAdSense(): AdSenseContextValue {
  return useContext(AdSenseContext);
}

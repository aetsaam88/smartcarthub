'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MarketplaceCode, MarketplaceConfig } from '@/types';
import { MARKETPLACES, MARKETPLACE_LIST } from '@/lib/marketplaces';

interface MarketplaceContextType {
  currentMarketplace: MarketplaceConfig;
  setMarketplace: (code: MarketplaceCode) => void;
  allMarketplaces: MarketplaceConfig[];
}

const MarketplaceContext = createContext<MarketplaceContextType>({
  currentMarketplace: MARKETPLACES.US,
  setMarketplace: () => {},
  allMarketplaces: MARKETPLACE_LIST,
});

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [marketplaceCode, setMarketplaceCode] = useState<MarketplaceCode>('US');

  useEffect(() => {
    const saved = localStorage.getItem('gc_marketplace') as MarketplaceCode;
    if (saved && saved in MARKETPLACES) {
      setMarketplaceCode(saved);
    }
  }, []);

  const handleSetMarketplace = (code: MarketplaceCode) => {
    setMarketplaceCode(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gc_marketplace', code);
    }
  };

  return (
    <MarketplaceContext.Provider
      value={{
        currentMarketplace: MARKETPLACES[marketplaceCode] || MARKETPLACES.US,
        setMarketplace: handleSetMarketplace,
        allMarketplaces: MARKETPLACE_LIST,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  return useContext(MarketplaceContext);
}

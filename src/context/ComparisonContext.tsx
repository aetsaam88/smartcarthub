'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface ComparisonContextType {
  comparedProducts: Product[];
  addToCompare: (product: Product) => { success: boolean; message?: string };
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompared: (productId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType>({
  comparedProducts: [],
  addToCompare: () => ({ success: false }),
  removeFromCompare: () => {},
  clearCompare: () => {},
  isCompared: () => false,
});

export function ComparisonProvider({ children }: { children: React.ReactNode }) {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gc_compared_products');
    if (saved) {
      try {
        setComparedProducts(JSON.parse(saved));
      } catch {
        // ignore JSON parse error
      }
    }
  }, []);

  const saveToStorage = (items: Product[]) => {
    setComparedProducts(items);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gc_compared_products', JSON.stringify(items));
    }
  };

  const addToCompare = (product: Product) => {
    if (comparedProducts.some((p) => p.id === product.id)) {
      return { success: false, message: 'Product already in comparison list.' };
    }
    if (comparedProducts.length >= 4) {
      return { success: false, message: 'You can compare a maximum of 4 products at once.' };
    }
    const updated = [...comparedProducts, product];
    saveToStorage(updated);
    return { success: true };
  };

  const removeFromCompare = (productId: string) => {
    const updated = comparedProducts.filter((p) => p.id !== productId);
    saveToStorage(updated);
  };

  const clearCompare = () => {
    saveToStorage([]);
  };

  const isCompared = (productId: string) => {
    return comparedProducts.some((p) => p.id === productId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparedProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  return useContext(ComparisonContext);
}

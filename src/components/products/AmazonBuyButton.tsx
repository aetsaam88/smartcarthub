'use client';

import React, { useState } from 'react';
import { ExternalLink, ShoppingCart, Loader2 } from 'lucide-react';
import { Product, MarketplaceCode } from '@/types';
import { useMarketplace } from '@/context/MarketplaceContext';
import { buildAffiliateUrl } from '@/lib/marketplaces';

interface AmazonBuyButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showMarketplaceLabel?: boolean;
}

export function AmazonBuyButton({
  product,
  size = 'md',
  className = '',
  showMarketplaceLabel = true,
}: AmazonBuyButtonProps) {
  const { currentMarketplace } = useMarketplace();
  const [clicked, setClicked] = useState(false);

  // Find marketplace link for current selected country, or fallback to US, or first available
  const marketplaceEntry =
    product.marketplaces?.find((m) => m.marketplace_code === currentMarketplace.code) ||
    product.marketplaces?.find((m) => m.marketplace_code === 'US') ||
    product.marketplaces?.[0];

  const destinationUrl = marketplaceEntry?.affiliate_url
    ? marketplaceEntry.affiliate_url
    : marketplaceEntry?.amazon_product_url
    ? buildAffiliateUrl(marketplaceEntry.amazon_product_url, currentMarketplace.defaultAssociateTag)
    : `https://www.${currentMarketplace.domain}/s?k=${encodeURIComponent(product.name)}&tag=${currentMarketplace.defaultAssociateTag}`;

  const handleClick = () => {
    setClicked(true);
    // Asynchronously record click to analytics
    try {
      fetch('/api/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          marketplaceCode: currentMarketplace.code,
          referrerPage: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      }).catch(() => {});
    } catch {
      // ignore
    }
    setTimeout(() => setClicked(false), 2000);
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 font-medium',
    md: 'px-4 py-2.5 text-sm gap-2 font-semibold',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-bold',
  };

  return (
    <a
      href={destinationUrl}
      target="_blank"
      rel="sponsored noopener noreferrer"
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.98] transition-all cursor-pointer ${sizeStyles[size]} ${className}`}
      title={`Check current price on Amazon ${currentMarketplace.domain} (Opens in new tab)`}
    >
      <ShoppingCart className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>Buy on Amazon</span>
      {showMarketplaceLabel && (
        <span className="text-[11px] font-normal px-1.5 py-0.5 rounded bg-black/10">
          {currentMarketplace.flag} {currentMarketplace.code}
        </span>
      )}
      <ExternalLink className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    </a>
  );
}

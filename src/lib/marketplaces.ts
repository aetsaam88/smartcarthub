import type { MarketplaceCode, MarketplaceConfig } from '../types/index.ts';

export const MARKETPLACES: Record<MarketplaceCode, MarketplaceConfig> = {
  US: {
    code: 'US',
    name: 'United States',
    country: 'United States',
    flag: '🇺🇸',
    domain: 'amazon.com',
    currency: 'USD',
    currencySymbol: '$',
    defaultAssociateTag: 'globalcart-us-20',
  },
  UK: {
    code: 'UK',
    name: 'United Kingdom',
    country: 'United Kingdom',
    flag: '🇬🇧',
    domain: 'amazon.co.uk',
    currency: 'GBP',
    currencySymbol: '£',
    defaultAssociateTag: 'globalcart-uk-21',
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    country: 'Canada',
    flag: '🇨🇦',
    domain: 'amazon.ca',
    currency: 'CAD',
    currencySymbol: 'CA$',
    defaultAssociateTag: 'globalcart-ca-20',
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    country: 'Germany',
    flag: '🇩🇪',
    domain: 'amazon.de',
    currency: 'EUR',
    currencySymbol: '€',
    defaultAssociateTag: 'globalcart-de-21',
  },
  FR: {
    code: 'FR',
    name: 'France',
    country: 'France',
    flag: '🇫🇷',
    domain: 'amazon.fr',
    currency: 'EUR',
    currencySymbol: '€',
    defaultAssociateTag: 'globalcart-fr-21',
  },
  IT: {
    code: 'IT',
    name: 'Italy',
    country: 'Italy',
    flag: '🇮🇹',
    domain: 'amazon.it',
    currency: 'EUR',
    currencySymbol: '€',
    defaultAssociateTag: 'globalcart-it-21',
  },
};

export const MARKETPLACE_LIST = Object.values(MARKETPLACES);

export function getMarketplace(code: string | undefined): MarketplaceConfig {
  if (code && code.toUpperCase() in MARKETPLACES) {
    return MARKETPLACES[code.toUpperCase() as MarketplaceCode];
  }
  return MARKETPLACES.US;
}

export function buildAffiliateUrl(baseUrl: string, tag: string): string {
  if (!baseUrl) return '#';
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('tag', tag);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

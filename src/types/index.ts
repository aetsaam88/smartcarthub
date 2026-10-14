export type MarketplaceCode = 'US' | 'UK' | 'CA' | 'DE' | 'FR' | 'IT';

export interface MarketplaceConfig {
  code: MarketplaceCode;
  name: string;
  country: string;
  flag: string;
  domain: string;
  currency: string;
  currencySymbol: string;
  defaultAssociateTag: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_reference?: string;
  seo_title?: string;
  seo_description?: string;
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductMarketplace {
  id: string;
  product_id: string;
  marketplace_code: MarketplaceCode;
  amazon_product_url: string;
  affiliate_url: string;
  currency_code: string;
  last_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category_id: string;
  category?: Category;
  short_description: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  pros: string[];
  cons: string[];
  editorial_rating: number; // e.g. 4.8
  featured: boolean;
  status: 'published' | 'draft' | 'archived';
  image_reference: string;
  gallery_images?: string[];
  marketplaces?: ProductMarketplace[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_reference: string;
  author_id?: string;
  author_name: string;
  author_role: string;
  status: 'published' | 'draft' | 'archived';
  category_slug: string;
  category_name: string;
  published_at?: string;
  reading_time_minutes: number;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface AffiliateClick {
  id: string;
  product_id: string;
  product_name?: string;
  marketplace_code: MarketplaceCode;
  clicked_at: string;
  referrer_page?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  consent_timestamp: string;
  subscription_status: 'subscribed' | 'unsubscribed';
  unsubscribe_token_hash: string;
  created_at: string;
}

export interface AdminActivityLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: string;
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  logo_text: string;
  tagline: string;
  contact_email: string;
  default_marketplace: MarketplaceCode;
  affiliate_disclosure_short: string;
  affiliate_disclosure_full: string;
  twitter_url: string;
  facebook_url: string;
  youtube_url: string;
  enable_price_display: boolean;
}

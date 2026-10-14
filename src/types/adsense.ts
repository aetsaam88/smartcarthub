// ─── Google AdSense Types ──────────────────────────────────────────────────────

/** Every named placement slot on the public-facing site */
export type AdPlacementKey =
  | 'homepage_below_hero'
  | 'homepage_between_sections'
  | 'products_between_cards'
  | 'product_detail_below_info'
  | 'product_detail_below_related'
  | 'blog_between_paragraphs'
  | 'blog_end_of_article'
  | 'sidebar'
  | 'above_footer';

/** Supported AdSense ad formats */
export type AdFormat =
  | 'auto'           // responsive auto
  | 'rectangle'      // medium rectangle
  | 'horizontal'     // leaderboard / banner
  | 'vertical';      // wide skyscraper

/** A single configured ad unit */
export interface AdUnit {
  id: string;
  name: string;               // human-readable label, e.g. "Homepage Hero Banner"
  ad_slot_id: string;         // numeric slot ID from AdSense, e.g. "1234567890"
  ad_format: AdFormat;
  placement: AdPlacementKey;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

/** Global AdSense settings stored in the database */
export interface AdSenseSettings {
  /** The AdSense publisher ID, e.g. "ca-pub-1234567890123456" */
  publisher_id: string;

  /** Master switch – when false no ads are loaded anywhere */
  enabled: boolean;

  /**
   * Enable Google Auto Ads (loads the AdSense script with auto-ads enabled).
   * When true the ad_units list is still respected for manual placements,
   * but Auto Ads may also render additional placements chosen by Google.
   */
  auto_ads_enabled: boolean;

  /** Show "Advertisement" label above each ad container */
  show_ad_label: boolean;

  /** Per-placement on/off switches */
  placements: Record<AdPlacementKey, boolean>;

  /** The individual ad units configured by the admin */
  ad_units: AdUnit[];

  created_at: string;
  updated_at: string;
}

/** Default / empty AdSense settings (no ads shown until configured) */
export const DEFAULT_ADSENSE_SETTINGS: AdSenseSettings = {
  publisher_id: '',
  enabled: false,
  auto_ads_enabled: false,
  show_ad_label: true,
  placements: {
    homepage_below_hero: true,
    homepage_between_sections: true,
    products_between_cards: true,
    product_detail_below_info: true,
    product_detail_below_related: true,
    blog_between_paragraphs: true,
    blog_end_of_article: true,
    sidebar: true,
    above_footer: true,
  },
  ad_units: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

/** Human-readable labels for each placement key */
export const PLACEMENT_LABELS: Record<AdPlacementKey, string> = {
  homepage_below_hero: 'Homepage — Below Hero Section',
  homepage_between_sections: 'Homepage — Between Product Sections',
  products_between_cards: 'Product Listing — Between Product Cards',
  product_detail_below_info: 'Product Detail — Below Product Information',
  product_detail_below_related: 'Product Detail — Below Related Products',
  blog_between_paragraphs: 'Blog Article — Between Paragraphs',
  blog_end_of_article: 'Blog Article — End of Article',
  sidebar: 'Sidebar (Desktop)',
  above_footer: 'Above Footer',
};

/** Human-readable labels for each ad format */
export const FORMAT_LABELS: Record<AdFormat, string> = {
  auto: 'Responsive Auto',
  rectangle: 'Medium Rectangle (300×250)',
  horizontal: 'Leaderboard / Banner (728×90)',
  vertical: 'Wide Skyscraper (160×600)',
};

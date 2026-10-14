import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(60),
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500),
  image_reference: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
  seo_title: z.string().max(100).optional().or(z.literal('')),
  seo_description: z.string().max(200).optional().or(z.literal('')),
});

export const ProductMarketplaceSchema = z.object({
  marketplace_code: z.enum(['US', 'UK', 'CA', 'DE', 'FR', 'IT']),
  amazon_product_url: z.string().url('Must be a valid Amazon product URL'),
  affiliate_url: z.string().url('Must be a valid affiliate URL').optional().or(z.literal('')),
  currency_code: z.string().min(3).max(3),
});

export const ProductSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(150),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  brand: z.string().min(2, 'Brand is required').max(60),
  category_id: z.string().min(1, 'Category is required'),
  short_description: z.string().min(10, 'Short description is required').max(300),
  description: z.string().min(20, 'Full description is required'),
  editorial_rating: z.number().min(1).max(5),
  featured: z.boolean().default(false),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  image_reference: z.string().url('Product image URL must be valid'),
  specifications: z.record(z.string()).default({}),
  features: z.array(z.string()).default([]),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  seo_title: z.string().max(100).optional().or(z.literal('')),
  seo_description: z.string().max(200).optional().or(z.literal('')),
  marketplaces: z.array(ProductMarketplaceSchema).default([]),
});

export const BlogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(150),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(300),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  featured_image_reference: z.string().url('Featured image must be a valid URL'),
  author_name: z.string().min(2, 'Author name is required'),
  author_role: z.string().min(2, 'Author role is required'),
  category_slug: z.string().min(1, 'Category is required'),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  reading_time_minutes: z.number().min(1).default(5),
  seo_title: z.string().max(100).optional().or(z.literal('')),
  seo_description: z.string().max(200).optional().or(z.literal('')),
});

export const NewsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to receiving our product recommendations.' }),
  }),
});

export const AdminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SiteSettingsSchema = z.object({
  site_name: z.string().min(2).max(50),
  logo_text: z.string().min(2).max(50),
  tagline: z.string().max(150),
  contact_email: z.string().email(),
  default_marketplace: z.enum(['US', 'UK', 'CA', 'DE', 'FR', 'IT']),
  affiliate_disclosure_short: z.string().min(10),
  affiliate_disclosure_full: z.string().min(20),
  twitter_url: z.string().url().optional().or(z.literal('')),
  facebook_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal('')),
  enable_price_display: z.boolean(),
});

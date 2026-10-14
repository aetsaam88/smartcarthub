-- GlobalCart PostgreSQL Database Schema
-- Multi-Marketplace Amazon Affiliate Marketing Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admins / Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Categories
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('cat-' || substr(md5(random()::text), 1, 8)),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  image_reference TEXT,
  seo_title VARCHAR(150),
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. Products
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 8)),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  brand VARCHAR(100) NOT NULL,
  category_id VARCHAR(64) REFERENCES categories(id) ON DELETE RESTRICT,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  pros JSONB NOT NULL DEFAULT '[]'::jsonb,
  cons JSONB NOT NULL DEFAULT '[]'::jsonb,
  editorial_rating NUMERIC(2,1) NOT NULL DEFAULT 4.5,
  featured BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  image_reference TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  seo_title VARCHAR(150),
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- 4. Product Marketplaces (US, UK, CA, DE, FR, IT)
CREATE TABLE IF NOT EXISTS product_marketplaces (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('pm-' || substr(md5(random()::text), 1, 8)),
  product_id VARCHAR(64) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  marketplace_code VARCHAR(10) NOT NULL,
  amazon_product_url TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  currency_code VARCHAR(10) NOT NULL DEFAULT 'USD',
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, marketplace_code)
);

CREATE INDEX IF NOT EXISTS idx_product_marketplaces_product ON product_marketplaces(product_id);
CREATE INDEX IF NOT EXISTS idx_product_marketplaces_code ON product_marketplaces(marketplace_code);

-- 5. Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('bcat-' || substr(md5(random()::text), 1, 8)),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('post-' || substr(md5(random()::text), 1, 8)),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_reference TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  author_name VARCHAR(100) NOT NULL DEFAULT 'Editorial Staff',
  author_role VARCHAR(100) NOT NULL DEFAULT 'Editor',
  category_slug VARCHAR(120) NOT NULL,
  category_name VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'published',
  published_at TIMESTAMPTZ,
  reading_time_minutes INT NOT NULL DEFAULT 5,
  seo_title VARCHAR(150),
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- 7. Affiliate Clicks (Privacy-conscious, no raw IP or sensitive PII stored)
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('clk-' || substr(md5(random()::text), 1, 8)),
  product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
  marketplace_code VARCHAR(10) NOT NULL,
  referrer_page VARCHAR(255),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_prod ON affiliate_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_market ON affiliate_clicks(marketplace_code);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_time ON affiliate_clicks(clicked_at);

-- 8. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('sub-' || substr(md5(random()::text), 1, 8)),
  email VARCHAR(255) NOT NULL UNIQUE,
  consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  subscription_status VARCHAR(20) NOT NULL DEFAULT 'subscribed',
  unsubscribe_token_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);

-- 9. Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id VARCHAR(64) PRIMARY KEY DEFAULT ('act-' || substr(md5(random()::text), 1, 8)),
  admin_id VARCHAR(64) NOT NULL,
  admin_name VARCHAR(100) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_time ON admin_activity_logs(created_at);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_marketplaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Public READ policies
CREATE POLICY "Public can view categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view product marketplaces" ON product_marketplaces FOR SELECT USING (true);
CREATE POLICY "Public can view published blog posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can insert affiliate clicks" ON affiliate_clicks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

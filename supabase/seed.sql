-- GlobalCart Seed Data for Supabase / PostgreSQL

INSERT INTO categories (id, name, slug, description, image_reference, seo_title, seo_description)
VALUES
  ('cat-1', 'Electronics', 'electronics', 'High-fidelity audio, noise-canceling headphones, and essential consumer electronics.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', 'Best Electronics & Audio Gear | GlobalCart', 'Explore the highest rated electronics and audio equipment.'),
  ('cat-2', 'Computers & Accessories', 'computers-and-accessories', 'Ergonomic keyboards, precision mice, monitors, and productivity hardware.', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', 'Top Computer Accessories | GlobalCart', 'Ergonomic keyboards, mice, and workstation tech.'),
  ('cat-3', 'Gaming', 'gaming', 'Ultra-low latency controllers, mechanical gaming keyboards, and immersive audio headsets.', 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&q=80', 'Best Gaming Gear | GlobalCart', 'Reviews and comparisons of top-tier gaming peripherals.'),
  ('cat-4', 'Smart Home', 'smart-home', 'Connected security cameras, ambient smart lighting, and energy-efficient automation.', 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80', 'Smart Home Automation | GlobalCart', 'Reliable smart home devices tested for interoperability.'),
  ('cat-5', 'Home & Kitchen', 'home-and-kitchen', 'Specialty coffee makers, smart air fryers, and culinary tools.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', 'Top Kitchen Appliances | GlobalCart', 'Durable, high-efficiency appliances and culinary gear.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO products (id, name, slug, brand, category_id, short_description, description, specifications, features, pros, cons, editorial_rating, featured, status, image_reference, seo_title, seo_description)
VALUES
  (
    'prod-1',
    'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    'sony-wh-1000xm5-wireless-headphones',
    'Sony',
    'cat-1',
    'Industry-leading noise cancellation with two processors and 8 microphones for quiet and clarity.',
    'The Sony WH-1000XM5 rewrites the rules for distraction-free listening. Engineered with two processors controlling eight microphones, Auto NC Optimizer, and up to 30 hours of battery life.',
    '{"Battery Life": "Up to 30 hours", "Connectivity": "Bluetooth 5.2, Multipoint", "Weight": "250g", "Charging": "USB-C Fast Charging"}'::jsonb,
    '["Industry-leading active noise cancellation", "Multipoint connection pairs two devices simultaneously", "Up to 30-hour battery life with quick charging"]'::jsonb,
    '["Exceptional noise cancellation in low and mid ranges", "Plush earcups for all-day comfort", "Rich soundstage with LDAC support"]'::jsonb,
    '["Earcups do not fold inwards", "No official IP water resistance rating"]'::jsonb,
    4.8,
    true,
    'published',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    'Sony WH-1000XM5 Review & Guide | GlobalCart',
    'In-depth review of Sony WH-1000XM5 headphones.'
  ),
  (
    'prod-2',
    'Logitech MX Master 3S Advanced Wireless Mouse',
    'logitech-mx-master-3s-wireless-mouse',
    'Logitech',
    'cat-2',
    'Ergonomic precision mouse with 8K DPI glass tracking and quiet click switches.',
    'The Logitech MX Master 3S features 8,000 DPI optical tracking on glass and Quiet Clicks that offer 90% less click noise.',
    '{"Sensor DPI": "200 to 8000 DPI", "Scroll Wheel": "MagSpeed Electromagnetic", "Battery": "Up to 70 days", "Weight": "141g"}'::jsonb,
    '["Any-surface 8K DPI sensor", "Quiet Click switches", "MagSpeed ultra-fast scrolling"]'::jsonb,
    '["Unrivaled ergonomic palm grip", "MagSpeed scroll wheel benchmark", "Long-lasting battery"]'::jsonb,
    '["Right-handed only form factor", "Heavier than ultra-light mice"]'::jsonb,
    4.9,
    true,
    'published',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    'Logitech MX Master 3S Review | GlobalCart',
    'Full analysis of Logitech MX Master 3S mouse.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO product_marketplaces (id, product_id, marketplace_code, amazon_product_url, affiliate_url, currency_code)
VALUES
  ('pm-1-us', 'prod-1', 'US', 'https://www.amazon.com/dp/B09XS7JWHH', 'https://www.amazon.com/dp/B09XS7JWHH?tag=globalcart-us-20', 'USD'),
  ('pm-1-uk', 'prod-1', 'UK', 'https://www.amazon.co.uk/dp/B09XS7JWHH', 'https://www.amazon.co.uk/dp/B09XS7JWHH?tag=globalcart-uk-21', 'GBP'),
  ('pm-2-us', 'prod-2', 'US', 'https://www.amazon.com/dp/B09HM94VDS', 'https://www.amazon.com/dp/B09HM94VDS?tag=globalcart-us-20', 'USD'),
  ('pm-2-de', 'prod-2', 'DE', 'https://www.amazon.de/dp/B09HM94VDS', 'https://www.amazon.de/dp/B09HM94VDS?tag=globalcart-de-21', 'EUR')
ON CONFLICT (id) DO NOTHING;

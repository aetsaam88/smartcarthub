import { NextResponse } from 'next/server';
import { repository } from '@/lib/data/repository';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://globalcart.example';

  const [categories, products, posts] = await Promise.all([
    repository.getCategories(),
    repository.getProducts({ status: 'published' }),
    repository.getBlogPosts({ status: 'published' }),
  ]);

  const staticUrls = [
    '',
    '/products',
    '/compare',
    '/blog',
    '/about',
    '/contact',
    '/affiliate-disclosure',
    '/editorial-policy',
    '/privacy-policy',
    '/terms',
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  staticUrls.forEach((path) => {
    xml += `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${path === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  // Categories
  categories.forEach((c) => {
    xml += `  <url>\n    <loc>${siteUrl}/category/${c.slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Products
  products.forEach((p) => {
    xml += `  <url>\n    <loc>${siteUrl}/product/${p.slug}</loc>\n    <lastmod>${p.updated_at.split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Blog Posts
  posts.forEach((post) => {
    xml += `  <url>\n    <loc>${siteUrl}/blog/${post.slug}</loc>\n    <lastmod>${post.updated_at.split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

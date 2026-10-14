import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/data/repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ products: [], posts: [] });
  }

  const [products, posts] = await Promise.all([
    repository.getProducts({ search: q, limit: 5 }),
    repository.getBlogPosts({ search: q, limit: 3 }),
  ]);

  return NextResponse.json({
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      image_reference: p.image_reference,
      editorial_rating: p.editorial_rating,
    })),
    posts: posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      category_name: post.category_name,
    })),
  });
}

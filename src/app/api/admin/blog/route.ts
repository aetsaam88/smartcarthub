import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const posts = await repository.getBlogPosts({ status: 'all' });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const post = await repository.saveBlogPost(body);

    await repository.logAdminActivity(
      admin.name,
      'CREATE_POST',
      'blog_post',
      post.id,
      `Created guide "${post.title}"`
    );

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save post' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const post = await repository.saveBlogPost(body);

    await repository.logAdminActivity(
      admin.name,
      'UPDATE_POST',
      'blog_post',
      post.id,
      `Updated guide "${post.title}"`
    );

    return NextResponse.json({ success: true, post });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update post' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
  }

  const success = await repository.deleteBlogPost(id);
  if (success) {
    await repository.logAdminActivity(
      admin.name,
      'DELETE_POST',
      'blog_post',
      id,
      `Deleted guide ID ${id}`
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Failed to delete post' }, { status: 404 });
}

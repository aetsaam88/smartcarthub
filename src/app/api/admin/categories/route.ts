import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const categories = await repository.getCategories();
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const category = await repository.saveCategory(body);

    await repository.logAdminActivity(
      admin.name,
      'CREATE_CATEGORY',
      'category',
      category.id,
      `Created category "${category.name}"`
    );

    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save category' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const category = await repository.saveCategory(body);

    await repository.logAdminActivity(
      admin.name,
      'UPDATE_CATEGORY',
      'category',
      category.id,
      `Updated category "${category.name}"`
    );

    return NextResponse.json({ success: true, category });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update category' }, { status: 400 });
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
    return NextResponse.json({ error: 'Missing category ID' }, { status: 400 });
  }

  const result = await repository.deleteCategory(id);
  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 400 });
  }

  await repository.logAdminActivity(
    admin.name,
    'DELETE_CATEGORY',
    'category',
    id,
    `Deleted category ID ${id}`
  );

  return NextResponse.json({ success: true });
}

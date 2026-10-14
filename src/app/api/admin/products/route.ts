import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';

export async function GET(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const products = await repository.getProducts({ status: 'all' });
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const product = await repository.saveProduct(body);

    await repository.logAdminActivity(
      admin.name,
      'CREATE_PRODUCT',
      'product',
      product.id,
      `Created product "${product.name}"`
    );

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const product = await repository.saveProduct(body);

    await repository.logAdminActivity(
      admin.name,
      'UPDATE_PRODUCT',
      'product',
      product.id,
      `Updated product "${product.name}"`
    );

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 400 });
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
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
  }

  const success = await repository.deleteProduct(id);
  if (success) {
    await repository.logAdminActivity(
      admin.name,
      'DELETE_PRODUCT',
      'product',
      id,
      `Deleted product ID ${id}`
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Product not found or delete failed' }, { status: 404 });
}

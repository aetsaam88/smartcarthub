import { NextRequest, NextResponse } from 'next/server';
import { repository } from '@/lib/data/repository';
import { MarketplaceCode } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, marketplaceCode, referrerPage } = body;

    if (!productId || !marketplaceCode) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const click = await repository.recordAffiliateClick(
      productId,
      marketplaceCode as MarketplaceCode,
      referrerPage
    );

    return NextResponse.json({ success: true, clickId: click.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record click' }, { status: 500 });
  }
}

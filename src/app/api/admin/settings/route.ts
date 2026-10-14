import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';

export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await repository.getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await repository.updateSettings(body);

    await repository.logAdminActivity(
      admin.name,
      'UPDATE_SETTINGS',
      'site_settings',
      'settings',
      'Updated site configuration and affiliate disclosures'
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update settings' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';

/** GET /api/admin/adsense — returns full AdSense settings */
export async function GET() {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await repository.getAdSenseSettings();
  return NextResponse.json(settings);
}

/** PUT /api/admin/adsense — update global fields (publisher_id, enabled, auto_ads_enabled, etc.) */
export async function PUT(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Sanitise: strip ad_units from this route — use the /ad-units sub-route for those
    const { ad_units: _ignored, ...globalFields } = body;

    const updated = await repository.updateAdSenseSettings(globalFields);

    await repository.logAdminActivity(
      admin.name,
      'UPDATE_ADSENSE_SETTINGS',
      'adsense_settings',
      'adsense',
      `Updated AdSense global configuration (enabled=${updated.enabled})`
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update AdSense settings';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

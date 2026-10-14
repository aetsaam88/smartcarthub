import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import type { AdUnit, AdPlacementKey, AdFormat } from '@/types/adsense';

/** POST /api/admin/adsense/ad-units — create a new ad unit */
export async function POST(req: NextRequest) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, ad_slot_id, ad_format, placement, enabled } = body as Partial<AdUnit>;

    if (!name || !ad_slot_id || !placement) {
      return NextResponse.json(
        { error: 'name, ad_slot_id, and placement are required' },
        { status: 400 }
      );
    }

    const settings = await repository.getAdSenseSettings();

    const newUnit: AdUnit = {
      id: `adunit-${Date.now()}`,
      name: name.trim(),
      ad_slot_id: ad_slot_id.trim(),
      ad_format: (ad_format as AdFormat) || 'auto',
      placement: placement as AdPlacementKey,
      enabled: enabled !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedUnits = [...settings.ad_units, newUnit];
    await repository.updateAdSenseSettings({ ad_units: updatedUnits });

    await repository.logAdminActivity(
      admin.name,
      'CREATE_AD_UNIT',
      'ad_unit',
      newUnit.id,
      `Created ad unit "${newUnit.name}" for placement "${newUnit.placement}"`
    );

    return NextResponse.json({ success: true, ad_unit: newUnit }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create ad unit';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

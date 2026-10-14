import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/session';
import { repository } from '@/lib/data/repository';
import type { AdUnit, AdPlacementKey, AdFormat } from '@/types/adsense';

interface RouteContext {
  params: { id: string };
}

/** PUT /api/admin/adsense/ad-units/[id] — update an existing ad unit */
export async function PUT(req: NextRequest, { params }: RouteContext) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const settings = await repository.getAdSenseSettings();

    const idx = settings.ad_units.findIndex((u) => u.id === params.id);
    if (idx === -1) {
      return NextResponse.json({ error: 'Ad unit not found' }, { status: 404 });
    }

    const existing = settings.ad_units[idx];
    const updatedUnit: AdUnit = {
      ...existing,
      name: (body.name as string | undefined)?.trim() || existing.name,
      ad_slot_id: (body.ad_slot_id as string | undefined)?.trim() || existing.ad_slot_id,
      ad_format: (body.ad_format as AdFormat | undefined) || existing.ad_format,
      placement: (body.placement as AdPlacementKey | undefined) || existing.placement,
      enabled: typeof body.enabled === 'boolean' ? body.enabled : existing.enabled,
      updated_at: new Date().toISOString(),
    };

    const updatedUnits = [...settings.ad_units];
    updatedUnits[idx] = updatedUnit;

    await repository.updateAdSenseSettings({ ad_units: updatedUnits });

    await repository.logAdminActivity(
      admin.name,
      'UPDATE_AD_UNIT',
      'ad_unit',
      params.id,
      `Updated ad unit "${updatedUnit.name}"`
    );

    return NextResponse.json({ success: true, ad_unit: updatedUnit });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update ad unit';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/** DELETE /api/admin/adsense/ad-units/[id] — remove an ad unit */
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const admin = await verifyAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const settings = await repository.getAdSenseSettings();
    const unit = settings.ad_units.find((u) => u.id === params.id);

    if (!unit) {
      return NextResponse.json({ error: 'Ad unit not found' }, { status: 404 });
    }

    const updatedUnits = settings.ad_units.filter((u) => u.id !== params.id);
    await repository.updateAdSenseSettings({ ad_units: updatedUnits });

    await repository.logAdminActivity(
      admin.name,
      'DELETE_AD_UNIT',
      'ad_unit',
      params.id,
      `Deleted ad unit "${unit.name}"`
    );

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete ad unit';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

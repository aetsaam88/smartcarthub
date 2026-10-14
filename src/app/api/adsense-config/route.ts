import { NextResponse } from 'next/server';
import { repository } from '@/lib/data/repository';

/**
 * GET /api/adsense-config
 *
 * Public, read-only endpoint that returns the AdSense configuration needed
 * by the frontend to decide whether to load ads and which slots to render.
 *
 * We intentionally expose only what the browser needs and nothing more.
 */
export async function GET() {
  try {
    const settings = await repository.getAdSenseSettings();

    // Return a safe subset — no admin-only metadata
    return NextResponse.json(
      {
        publisher_id: settings.publisher_id,
        enabled: settings.enabled,
        auto_ads_enabled: settings.auto_ads_enabled,
        show_ad_label: settings.show_ad_label,
        placements: settings.placements,
        ad_units: settings.ad_units.filter((u) => u.enabled),
      },
      {
        headers: {
          // Short cache: 60 s on the edge, 5 min stale-while-revalidate
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return NextResponse.json(
      { publisher_id: '', enabled: false, auto_ads_enabled: false, show_ad_label: true, placements: {}, ad_units: [] },
      { status: 200 }
    );
  }
}

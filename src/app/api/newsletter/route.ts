import { NextRequest, NextResponse } from 'next/server';
import { NewsletterSchema } from '@/lib/validation';
import { repository } from '@/lib/data/repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = NewsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid input' },
        { status: 400 }
      );
    }

    const result = await repository.subscribeNewsletter(parsed.data.email);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

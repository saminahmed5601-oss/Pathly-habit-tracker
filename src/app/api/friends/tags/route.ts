import { NextRequest, NextResponse } from 'next/server';
import { restClaimTag } from '@/lib/firestoreRest';

function cleanTag(input: string): string {
  let clean = (input || '').trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

// POST: Claim or verify a tag in Cloud Firestore
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { desiredTag, uid } = body;

    if (!desiredTag || !uid) {
      return NextResponse.json({ success: false, error: 'desiredTag and uid are required' }, { status: 400 });
    }

    const formatted = cleanTag(desiredTag);
    const rawName = formatted.replace('#pathly-', '').replace('pathly-', '');

    if (rawName.length < 2) {
      return NextResponse.json({ success: false, error: 'Tag name must be at least 2 characters' }, { status: 400 });
    }

    const res = await restClaimTag(formatted, uid);
    if (!res.success) {
      return NextResponse.json({
        success: false,
        error: res.error || `The tag ${formatted} is already taken by another user.`,
      }, { status: 409 });
    }

    return NextResponse.json({
      success: true,
      tag: formatted,
      message: `Tag ${formatted} successfully claimed!`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

interface TagOwner {
  tag: string;
  uid: string;
  claimedAt: string;
}

// Global server memory store for claimed tags
declare global {
  // eslint-disable-next-line no-var
  var __PATHLY_CLAIMED_TAGS__: Map<string, TagOwner> | undefined;
}

if (!global.__PATHLY_CLAIMED_TAGS__) {
  global.__PATHLY_CLAIMED_TAGS__ = new Map<string, TagOwner>();
}

const tagsStore = global.__PATHLY_CLAIMED_TAGS__;

function cleanTag(input: string): string {
  let clean = (input || '').trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

// POST: Claim or verify a tag
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

    const existing = tagsStore.get(formatted);
    if (existing && existing.uid !== uid) {
      return NextResponse.json({
        success: false,
        error: `The tag ${formatted} is already taken by another user. Please choose a different handle!`,
      }, { status: 409 });
    }

    // Reserve tag
    tagsStore.set(formatted, {
      tag: formatted,
      uid,
      claimedAt: new Date().toISOString(),
    });

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

// GET: Check if tag is available
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    if (!tag) {
      return NextResponse.json({ success: false, error: 'tag param is required' }, { status: 400 });
    }

    const formatted = cleanTag(tag);
    const existing = tagsStore.get(formatted);

    return NextResponse.json({
      success: true,
      tag: formatted,
      isTaken: Boolean(existing),
      ownerUid: existing?.uid || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

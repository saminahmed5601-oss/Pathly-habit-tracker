import { NextRequest, NextResponse } from 'next/server';

interface FriendRequestItem {
  id: string;
  fromUid: string;
  fromName: string;
  fromTag: string;
  fromPhotoURL?: string | null;
  fromLevel: number;
  toTag: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
  updatedAt?: string;
}

// Global server memory store (persists across requests during runtime)
declare global {
  // eslint-disable-next-line no-var
  var __PATHLY_FRIEND_REQUESTS__: Map<string, FriendRequestItem> | undefined;
}

if (!global.__PATHLY_FRIEND_REQUESTS__) {
  global.__PATHLY_FRIEND_REQUESTS__ = new Map<string, FriendRequestItem>();
}

const requestsStore = global.__PATHLY_FRIEND_REQUESTS__;

function cleanTag(input: string): string {
  let clean = (input || '').trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

// GET: Fetch incoming and sent requests for a tag
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tagParam = searchParams.get('tag');

    if (!tagParam) {
      return NextResponse.json({ success: false, error: 'Tag parameter is required' }, { status: 400 });
    }

    const myTag = cleanTag(tagParam);
    const all = Array.from(requestsStore.values());

    const incoming = all.filter(
      (r) => cleanTag(r.toTag) === myTag && r.status === 'pending'
    );

    const sent = all.filter(
      (r) => cleanTag(r.fromTag) === myTag
    );

    return NextResponse.json({
      success: true,
      tag: myTag,
      incoming,
      sent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Create and send a new friend request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fromUid, fromName, fromTag, fromPhotoURL, fromLevel, toTag, id } = body;

    if (!fromTag || !toTag) {
      return NextResponse.json({ success: false, error: 'Both fromTag and toTag are required' }, { status: 400 });
    }

    const senderTag = cleanTag(fromTag);
    const recipientTag = cleanTag(toTag);

    if (senderTag === recipientTag) {
      return NextResponse.json({ success: false, error: 'You cannot send a friend request to your own tag!' }, { status: 400 });
    }

    const reqId = id || `req-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: FriendRequestItem = {
      id: reqId,
      fromUid: fromUid || `user-${Date.now()}`,
      fromName: fromName || senderTag,
      fromTag: senderTag,
      fromPhotoURL: fromPhotoURL || null,
      fromLevel: fromLevel || 1,
      toTag: recipientTag,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requestsStore.set(reqId, newRequest);

    return NextResponse.json({
      success: true,
      message: `Friend request sent to ${recipientTag}!`,
      request: newRequest,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PATCH: Update request status (accept or decline)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 });
    }

    const existing = requestsStore.get(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
    }

    existing.status = status;
    existing.updatedAt = new Date().toISOString();
    requestsStore.set(id, existing);

    return NextResponse.json({
      success: true,
      request: existing,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

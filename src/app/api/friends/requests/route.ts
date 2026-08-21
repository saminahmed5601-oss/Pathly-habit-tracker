import { NextRequest, NextResponse } from 'next/server';
import { restSaveFriendRequest, restGetFriendRequests, restUpdateRequestStatus } from '@/lib/firestoreRest';

function cleanTag(input: string): string {
  let clean = (input || '').trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

// GET: Fetch incoming and sent requests for a tag across all serverless instances
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tagParam = searchParams.get('tag');

    if (!tagParam) {
      return NextResponse.json({ success: false, error: 'Tag parameter is required' }, { status: 400 });
    }

    const myTag = cleanTag(tagParam);
    const { incoming, sent } = await restGetFriendRequests(myTag);

    return NextResponse.json({
      success: true,
      tag: myTag,
      incoming,
      sent,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST: Create and send a new friend request to Cloud Firestore
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

    const newRequest = {
      id: reqId,
      fromUid: fromUid || `user-${Date.now()}`,
      fromName: fromName || senderTag,
      fromTag: senderTag,
      fromPhotoURL: fromPhotoURL || null,
      fromLevel: fromLevel || 1,
      toTag: recipientTag,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await restSaveFriendRequest(newRequest);

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

    await restUpdateRequestStatus(id, status);

    return NextResponse.json({
      success: true,
      message: `Request status updated to ${status}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { restSaveProfile, restGetProfile, restSearchProfiles } from '@/lib/firestoreRest';

function cleanTag(input: string): string {
  let clean = (input || '').trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

// POST: Save or update a public profile in Cloud Firestore
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, uid, name, photoURL, level, streak, bestStreak, todayMinutes, todayGoalTitle, totalMilestonesCompleted, totalMilestonesCount, activeGoals } = body;

    if (!tag) {
      return NextResponse.json({ success: false, error: 'tag is required' }, { status: 400 });
    }

    const formatted = cleanTag(tag);
    const profile = {
      uid: uid || `user-${Date.now()}`,
      tag: formatted,
      name: name || formatted,
      photoURL: photoURL || null,
      level: level || 1,
      streak: streak || 0,
      bestStreak: bestStreak || streak || 0,
      todayMinutes: todayMinutes || 0,
      todayGoalTitle: todayGoalTitle || 'Daily Habits',
      totalMilestonesCompleted: totalMilestonesCompleted || 0,
      totalMilestonesCount: totalMilestonesCount || 0,
      activeGoals: activeGoals || [],
      updatedAt: new Date().toISOString(),
    };

    await restSaveProfile(profile);

    return NextResponse.json({ success: true, profile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// GET: Fetch a public profile by tag or search profiles by query in Cloud Firestore
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const searchQuery = searchParams.get('search') || searchParams.get('q');

    // 1. Search Query
    if (searchQuery) {
      const results = await restSearchProfiles(searchQuery);
      return NextResponse.json({
        success: true,
        query: searchQuery,
        profiles: results.slice(0, 10),
      }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      });
    }

    // 2. Exact Tag Lookup
    if (!tag) {
      return NextResponse.json({ success: false, error: 'tag or search query is required' }, { status: 400 });
    }

    const formatted = cleanTag(tag);
    const profile = await restGetProfile(formatted);

    if (!profile) {
      return NextResponse.json({
        success: true,
        profile: {
          uid: `f-${formatted.replace(/[^a-z0-9]/g, '')}`,
          tag: formatted,
          name: formatted,
          avatarId: 'sprout',
          photoURL: null,
          level: 1,
          streak: 0,
          bestStreak: 0,
          todayMinutes: 0,
          todayGoalTitle: 'Daily Habits',
          totalMilestonesCompleted: 0,
          totalMilestonesCount: 0,
          activeGoals: [],
        }
      });
    }

    return NextResponse.json({ success: true, profile }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

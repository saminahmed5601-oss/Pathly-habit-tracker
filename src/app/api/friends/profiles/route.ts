import { NextRequest, NextResponse } from 'next/server';

interface PublicProfile {
  uid: string;
  tag: string;
  name: string;
  photoURL?: string | null;
  level: number;
  streak: number;
  bestStreak: number;
  todayMinutes: number;
  todayGoalTitle: string;
  totalMilestonesCompleted: number;
  totalMilestonesCount: number;
  activeGoals: Array<{ title: string; completedCount: number; totalCount: number; icon: string }>;
  updatedAt: string;
}

// Global server memory store for profiles
declare global {
  // eslint-disable-next-line no-var
  var __PATHLY_PUBLIC_PROFILES__: Map<string, PublicProfile> | undefined;
}

if (!global.__PATHLY_PUBLIC_PROFILES__) {
  global.__PATHLY_PUBLIC_PROFILES__ = new Map<string, PublicProfile>();
}

const profilesStore = global.__PATHLY_PUBLIC_PROFILES__;

function cleanTag(input: string): string {
  let clean = (input || '').trim().toLowerCase().replace(/^#/, '');
  if (!clean.startsWith('pathly-')) {
    clean = `pathly-${clean}`;
  }
  return `#${clean}`;
}

// POST: Save or update a public profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, uid, name, photoURL, level, streak, bestStreak, todayMinutes, todayGoalTitle, totalMilestonesCompleted, totalMilestonesCount, activeGoals } = body;

    if (!tag) {
      return NextResponse.json({ success: false, error: 'tag is required' }, { status: 400 });
    }

    const formatted = cleanTag(tag);
    const profile: PublicProfile = {
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

    profilesStore.set(formatted, profile);

    return NextResponse.json({ success: true, profile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// GET: Fetch a public profile by tag
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');

    if (!tag) {
      return NextResponse.json({ success: false, error: 'tag is required' }, { status: 400 });
    }

    const formatted = cleanTag(tag);
    const profile = profilesStore.get(formatted);

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

    return NextResponse.json({ success: true, profile });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

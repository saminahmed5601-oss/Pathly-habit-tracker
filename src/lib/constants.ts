import { Goal, DailyPlan, UserProfile, FriendBuddy, Badge } from '@/types';

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-step',
    title: 'Seed Planted',
    description: 'Began your journey by setting your first milestone!',
    icon: '🌱',
    rarity: 'common',
  },
  {
    id: 'offset-master',
    title: 'Honest Starter',
    description: 'Imported past progress without needing to restart from zero!',
    icon: '🎯',
    rarity: 'rare',
  },
  {
    id: 'focus-hero',
    title: 'Deep Work Pioneer',
    description: 'Completed 1 hour of continuous focused study timer.',
    icon: '⚡',
    rarity: 'common',
  },
  {
    id: 'streak-3',
    title: 'Tri-Flame Streak',
    description: 'Showed up for 3 days in a row!',
    icon: '🔥',
    rarity: 'rare',
  },
  {
    id: 'friend-cheer',
    title: 'Village Spirit',
    description: 'Exchanged energy and high-fives with accountability buddies.',
    icon: '🤝',
    rarity: 'common',
  },
  {
    id: 'course-master',
    title: 'Milestone Conqueror',
    description: 'Complete 100% of any long-term goal course.',
    icon: '👑',
    rarity: 'legendary',
  }
];

// Clean slate: 0 pre-filled goals (user creates what they actually want)
export const INITIAL_GOALS: Goal[] = [];

// Clean slate: Level 1, 0 XP, 0 Streak
export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Pathly Explorer',
  avatarId: 'sprout',
  level: 1,
  currentXP: 0,
  nextLevelXP: 100,
  streakDays: 0,
  bestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakShields: 2,
  unlockedBadges: [],
  soundEnabled: true,
  theme: 'light',
  antiCheatEnabled: true,
  pacingCooldownSeconds: 45,
};

// Clean slate: 0 pre-filled tasks (user sets their own morning plan)
export const INITIAL_DAILY_PLAN: DailyPlan = {
  date: new Date().toISOString().split('T')[0],
  targetFocusMinutes: 120,
  morningCompleted: false,
  eveningCompleted: false,
  createdAt: new Date().toISOString(),
  gratitudeNote: '',
  priorityTasks: [],
};

// Clean slate: 0 fake bot friends (only real connected friends)
export const INITIAL_FRIENDS: FriendBuddy[] = [];

export const AVATAR_OPTIONS = [
  { id: 'sprout', name: 'Sproutling', emoji: '🌱', bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' },
  { id: 'fox', name: 'Kitsune Fox', emoji: '🦊', bg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400' },
  { id: 'cat', name: 'Matcha Cat', emoji: '🐱', bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' },
  { id: 'owl', name: 'Sage Owl', emoji: '🦉', bg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' },
  { id: 'blossom', name: 'Sakura Pet', emoji: '🌸', bg: 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400' },
  { id: 'spark', name: 'Volt Spark', emoji: '⚡', bg: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-400' },
];

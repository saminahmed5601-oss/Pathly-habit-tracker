import { Goal, DailyPlan, UserProfile, FriendBuddy, Badge, PlantInfo } from '@/types';
import { getLocalDateString } from './dateUtils';

export const PLANT_SPECIES_LIST: PlantInfo[] = [
  {
    id: 'succulent',
    name: 'Cozy Jade Succulent',
    seedName: 'Jade Seed',
    tagline: 'Resilient, calm, and forgiving',
    costXP: 0,
    emoji: '🪴',
    color: 'from-emerald-400 to-teal-600',
    description: 'A hardy companion that stays verdant even on light focus days. Thrives on steady, daily consistency.',
    benefit: 'Default starter plant • Boosts habit recovery',
  },
  {
    id: 'bonsai',
    name: 'Zen Master Pine Bonsai',
    seedName: 'Bonsai Seed',
    tagline: 'Precision, patience & deep code flow',
    costXP: 180,
    emoji: '🌲',
    color: 'from-emerald-600 to-green-800',
    description: 'Requires intentional cultivation. Grows miniature winding branches as you conquer 45m+ deep focus sprints.',
    benefit: '+10% XP bonus on Focus Dial sessions over 45m',
  },
  {
    id: 'sunflower',
    name: 'Golden Solar Sunflower',
    seedName: 'Helios Seed',
    tagline: 'Optimism, vibrant creative sparks & energy',
    costXP: 250,
    emoji: '🌻',
    color: 'from-amber-400 to-yellow-600',
    description: 'Always faces the light. Reaches towering heights when you complete your Sunrise #1 Must-Win task early.',
    benefit: '+15 XP bonus when completing morning intent before noon',
  },
  {
    id: 'cherry_blossom',
    name: 'Sakura Petal Blossom',
    seedName: 'Sakura Seed',
    tagline: 'Mindfulness, elegance & peaceful evenings',
    costXP: 350,
    emoji: '🌸',
    color: 'from-pink-400 to-rose-500',
    description: 'Delicate petals gently drift within the terrarium glass. Flourishes during calm evening reflection rituals.',
    benefit: '+20 XP bonus on Sunset reflections with 5/5 energy',
  },
  {
    id: 'monstera',
    name: 'Lush Forest Monstera',
    seedName: 'Monstera Seed',
    tagline: 'Expansive growth for grand project builders',
    costXP: 500,
    emoji: '🌿',
    color: 'from-teal-500 to-emerald-700',
    description: 'Develops iconic fenestrated leaves that fill the entire terrarium container as you complete major milestone goals.',
    benefit: '+30 XP bonus upon completing any milestone journey unit',
  },
];

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-step',
    title: 'Seed Planted',
    description: 'Began your journey by setting your first milestone!',
    icon: '🌱',
    rarity: 'common',
    tier: 'wood',
  },
  {
    id: 'offset-master',
    title: 'Honest Starter',
    description: 'Imported past progress without needing to restart from zero!',
    icon: '🎯',
    rarity: 'rare',
    tier: 'silver',
  },
  {
    id: 'focus-hero',
    title: 'Deep Work Pioneer',
    description: 'Completed 1 hour of continuous focused study timer.',
    icon: '⚡',
    rarity: 'common',
    tier: 'wood',
  },
  {
    id: 'streak-3',
    title: 'Tri-Flame Streak',
    description: 'Showed up for 3 days in a row!',
    icon: '🔥',
    rarity: 'rare',
    tier: 'gold',
  },
  {
    id: 'friend-cheer',
    title: 'Village Spirit',
    description: 'Exchanged water drops and high-fives with squad buddies.',
    icon: '💧',
    rarity: 'common',
    tier: 'wood',
  },
  {
    id: 'zen-master',
    title: 'Zen Sanctuary',
    description: 'Immersed in full-screen Zen focus mode with ambient soundscapes.',
    icon: '🧘',
    rarity: 'epic',
    tier: 'silver',
  },
  {
    id: 'course-master',
    title: 'Milestone Conqueror',
    description: 'Complete 100% of any long-term goal course.',
    icon: '👑',
    rarity: 'legendary',
    tier: 'prismatic',
  },
  {
    id: 'greenhouse-collector',
    title: 'Master Botanist',
    description: 'Unlocked 3 or more exotic seed varieties in the XP Plant Shop.',
    icon: '🌺',
    rarity: 'epic',
    tier: 'prismatic',
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
  lastActiveDate: getLocalDateString(),
  streakShields: 2,
  unlockedBadges: [],
  unlockedPlants: ['succulent'],
  activePlant: 'succulent',
  soundEnabled: true,
  theme: 'light',
  antiCheatEnabled: true,
  pacingCooldownSeconds: 45,
};

// Clean slate: 0 pre-filled tasks (user sets their own morning plan)
export const INITIAL_DAILY_PLAN: DailyPlan = {
  date: getLocalDateString(),
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

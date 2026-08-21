import { Goal, DailyPlan, UserProfile, FriendBuddy, Badge } from '@/types';

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-step',
    title: 'Seed Planted',
    description: 'Began your journey by setting your first milestone!',
    icon: '🌱',
    rarity: 'common',
    unlockedAt: '2026-08-20T10:00:00.000Z',
  },
  {
    id: 'offset-master',
    title: 'Honest Starter',
    description: 'Imported past progress without needing to restart from zero!',
    icon: '🎯',
    rarity: 'rare',
    unlockedAt: '2026-08-20T10:05:00.000Z',
  },
  {
    id: 'focus-hero',
    title: 'Deep Work Pioneer',
    description: 'Completed 1 hour of continuous focused study timer.',
    icon: '⚡',
    rarity: 'common',
    unlockedAt: '2026-08-21T15:30:00.000Z',
  },
  {
    id: 'streak-3',
    title: 'Tri-Flame Streak',
    description: 'Showed up for 3 days in a row!',
    icon: '🔥',
    rarity: 'rare',
    unlockedAt: '2026-08-22T08:00:00.000Z',
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

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-web-dev',
    title: 'Full-Stack Web Development Course',
    description: '12 core milestones covering HTML, CSS, JavaScript, React, Next.js, Backend & Full Project Deployment.',
    category: 'coding',
    totalMilestones: 12,
    startingOffset: 3, // Started from milestone 3 completed
    color: 'from-emerald-400 to-teal-500',
    icon: '💻',
    targetDate: '2026-10-15',
    createdAt: '2026-08-15T09:00:00.000Z',
    lastProgressAt: '2026-08-21T18:00:00.000Z',
    milestones: [
      { id: 'm-1', order: 1, title: 'HTML5 Semantic Layouts & SEO Core', isCompleted: true, completedAt: '2026-08-15T12:00:00.000Z', wasInitialOffset: true },
      { id: 'm-2', order: 2, title: 'Modern CSS, Flexbox & CSS Grid Masters', isCompleted: true, completedAt: '2026-08-16T15:00:00.000Z', wasInitialOffset: true },
      { id: 'm-3', order: 3, title: 'JavaScript ES6+, DOM & Async / Await', isCompleted: true, completedAt: '2026-08-18T17:00:00.000Z', wasInitialOffset: true },
      { id: 'm-4', order: 4, title: 'React Essentials & State Architecture', isCompleted: false },
      { id: 'm-5', order: 5, title: 'Tailwind CSS Component System', isCompleted: false },
      { id: 'm-6', order: 6, title: 'Next.js App Router & Server Components', isCompleted: false },
      { id: 'm-7', order: 7, title: 'TypeScript Foundations & API Contracts', isCompleted: false },
      { id: 'm-8', order: 8, title: 'Database Modeling & Supabase / Prisma', isCompleted: false },
      { id: 'm-9', order: 9, title: 'Authentication, Sessions & JWT Guard', isCompleted: false },
      { id: 'm-10', order: 10, title: 'Building Full Capstone SaaS Project', isCompleted: false },
      { id: 'm-11', order: 11, title: 'Testing, Performance Optimization & SEO', isCompleted: false },
      { id: 'm-12', order: 12, title: 'Deployment, Custom Domain & Portfolio Launch', isCompleted: false },
    ]
  },
  {
    id: 'goal-atomic-habits',
    title: 'Read & Apply "Atomic Habits"',
    description: '10 practical chapters on identity-based habits, cue priming, and 1% compounding gains.',
    category: 'reading',
    totalMilestones: 10,
    startingOffset: 2,
    color: 'from-amber-400 to-orange-500',
    icon: '📖',
    targetDate: '2026-09-01',
    createdAt: '2026-08-18T10:00:00.000Z',
    milestones: [
      { id: 'ah-1', order: 1, title: 'The Surprising Power of Atomic Habits', isCompleted: true, completedAt: '2026-08-18T12:00:00.000Z', wasInitialOffset: true },
      { id: 'ah-2', order: 2, title: 'How Your Habits Shape Your Identity', isCompleted: true, completedAt: '2026-08-19T14:00:00.000Z', wasInitialOffset: true },
      { id: 'ah-3', order: 3, title: '1st Law: Make It Obvious (Environment Design)', isCompleted: false },
      { id: 'ah-4', order: 4, title: '2nd Law: Make It Attractive (Temptation Bundling)', isCompleted: false },
      { id: 'ah-5', order: 5, title: '3rd Law: Make It Easy (2-Minute Rule)', isCompleted: false },
      { id: 'ah-6', order: 6, title: '4th Law: Make It Satisfying (Immediate Rewards)', isCompleted: false },
      { id: 'ah-7', order: 7, title: 'Advanced Tactics: Habit Tracking & Accountability', isCompleted: false },
      { id: 'ah-8', order: 8, title: 'The Goldilocks Rule: Staying Motivated in Work', isCompleted: false },
      { id: 'ah-9', order: 9, title: 'The Downside of Creating Good Habits', isCompleted: false },
      { id: 'ah-10', order: 10, title: 'Mastering the Habit Ecosystem Summary', isCompleted: false },
    ]
  },
  {
    id: 'goal-health',
    title: 'Daily Movement & Posture Reset',
    description: '20 progressive daily movement & core sessions.',
    category: 'fitness',
    totalMilestones: 20,
    startingOffset: 4,
    color: 'from-rose-400 to-pink-500',
    icon: '🏃',
    targetDate: '2026-09-30',
    createdAt: '2026-08-16T08:00:00.000Z',
    milestones: Array.from({ length: 20 }).map((_, i) => ({
      id: `fit-${i + 1}`,
      order: i + 1,
      title: `Day ${i + 1}: ${i < 4 ? 'Foundation Mobility Routine' : i < 10 ? 'Core Activation & 20m Walk' : 'Strength & Posture Alignment'}`,
      isCompleted: i < 4,
      wasInitialOffset: i < 4,
      completedAt: i < 4 ? '2026-08-19T08:00:00.000Z' : undefined
    }))
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Dev Cadet',
  avatarId: 'sprout',
  level: 3,
  currentXP: 340,
  nextLevelXP: 500,
  streakDays: 3,
  bestStreak: 7,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakShields: 2,
  unlockedBadges: ['first-step', 'offset-master', 'focus-hero', 'streak-3'],
  soundEnabled: true,
  theme: 'light',
  antiCheatEnabled: true,
  pacingCooldownSeconds: 45, // 45 seconds pacing between milestone claims
};

export const INITIAL_DAILY_PLAN: DailyPlan = {
  date: new Date().toISOString().split('T')[0],
  targetFocusMinutes: 120, // 2 hours
  morningCompleted: true,
  eveningCompleted: false,
  createdAt: new Date().toISOString(),
  gratitudeNote: 'Grateful for clean morning air and energy to build my dreams!',
  priorityTasks: [
    {
      id: 'task-1',
      title: 'Study React Component Lifecycle & State Hooks',
      completed: false,
      goalId: 'goal-web-dev',
      estimatedMinutes: 60,
      xpValue: 80,
    },
    {
      id: 'task-2',
      title: 'Practice 20 minutes of Core Posture Drills',
      completed: true,
      completedAt: '2026-08-22T08:30:00.000Z',
      goalId: 'goal-health',
      estimatedMinutes: 20,
      xpValue: 40,
    },
    {
      id: 'task-3',
      title: 'Read Chapter 3 of Atomic Habits (Make It Obvious)',
      completed: false,
      goalId: 'goal-atomic-habits',
      estimatedMinutes: 25,
      xpValue: 45,
    }
  ]
};

export const INITIAL_FRIENDS: FriendBuddy[] = [
  {
    id: 'f-maya',
    name: 'Maya Chen',
    avatarId: 'fox',
    tagline: 'Crushing Python & DSA every morning! 🚀',
    currentLevel: 5,
    streak: 12,
    todayMinutes: 85,
    todayTargetMinutes: 120,
    todayGoalTitle: 'LeetCode Medium Graphs',
    completedMilestonesToday: 1,
    recentCheers: [
      { id: 'c-1', fromName: 'Dev Cadet', avatarId: 'sprout', emoji: '🔥', label: 'On Fire!', timestamp: '2h ago' }
    ]
  },
  {
    id: 'f-liam',
    name: 'Liam Walker',
    avatarId: 'cat',
    tagline: 'Building a portfolio in Next.js 💻',
    currentLevel: 4,
    streak: 6,
    todayMinutes: 110,
    todayTargetMinutes: 90,
    todayGoalTitle: 'Tailwind UI Polish & Dark Mode',
    completedMilestonesToday: 2,
    recentCheers: [
      { id: 'c-2', fromName: 'Alex', avatarId: 'owl', emoji: '☕', label: 'Coffee Boost!', timestamp: '30m ago' }
    ]
  },
  {
    id: 'f-zara',
    name: 'Zara Patel',
    avatarId: 'blossom',
    tagline: 'Morning gym + 1 hour Japanese practice 🌸',
    currentLevel: 7,
    streak: 21,
    todayMinutes: 60,
    todayTargetMinutes: 60,
    todayGoalTitle: 'Kanji Flashcards N4',
    completedMilestonesToday: 1,
    recentCheers: [
      { id: 'c-3', fromName: 'Dev Cadet', avatarId: 'sprout', emoji: '🌟', label: 'Legendary!', timestamp: '1h ago' }
    ]
  }
];

export const AVATAR_OPTIONS = [
  { id: 'sprout', name: 'Sproutling', emoji: '🌱', bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' },
  { id: 'fox', name: 'Kitsune Fox', emoji: '🦊', bg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400' },
  { id: 'cat', name: 'Matcha Cat', emoji: '🐱', bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' },
  { id: 'owl', name: 'Sage Owl', emoji: '🦉', bg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400' },
  { id: 'blossom', name: 'Sakura Pet', emoji: '🌸', bg: 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400' },
  { id: 'spark', name: 'Volt Spark', emoji: '⚡', bg: 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-400' },
];

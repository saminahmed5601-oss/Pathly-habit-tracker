export type GoalCategory = 'study' | 'coding' | 'fitness' | 'reading' | 'career' | 'creative' | 'mindset';

export interface MilestoneItem {
  id: string;
  order: number;
  title: string;
  isCompleted: boolean;
  completedAt?: string;
  proofNote?: string;
  timeSpentMinutes?: number;
  wasInitialOffset?: boolean; // If completed before tracking began
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  totalMilestones: number;
  startingOffset: number; // e.g. already did 3 out of 12 before starting the app
  milestones: MilestoneItem[];
  color: string;
  icon: string;
  targetDate?: string;
  createdAt: string;
  lastProgressAt?: string;
}

export interface PriorityTask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  goalId?: string;
  estimatedMinutes?: number;
  xpValue: number;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  targetFocusMinutes: number;
  priorityTasks: PriorityTask[];
  gratitudeNote?: string;
  eveningReflection?: string;
  morningCompleted: boolean;
  eveningCompleted: boolean;
  createdAt: string;
}

export interface FocusSessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  goalId?: string;
  taskTitle: string;
  notes?: string;
  timestamp: string;
  xpEarned: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserProfile {
  name: string;
  avatarId: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  bestStreak: number;
  lastActiveDate: string;
  streakShields: number;
  unlockedBadges: string[];
  soundEnabled: boolean;
  theme: 'light' | 'dark';
  antiCheatEnabled: boolean;
  pacingCooldownSeconds: number;
}

export interface CheerReaction {
  id: string;
  fromName: string;
  avatarId: string;
  emoji: string;
  label: string;
  timestamp: string;
}

export interface FriendBuddy {
  id: string;
  name: string;
  avatarId: string;
  tagline: string;
  currentLevel: number;
  streak: number;
  todayMinutes: number;
  todayTargetMinutes: number;
  todayGoalTitle: string;
  completedMilestonesToday: number;
  recentCheers: CheerReaction[];
  isUserAdded?: boolean;
}

export interface AntiCheatAttempt {
  goalId: string;
  milestoneId: string;
  timestamp: number;
}

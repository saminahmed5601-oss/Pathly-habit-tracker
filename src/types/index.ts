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

export type PlantSpecies = 'bonsai' | 'sunflower' | 'succulent' | 'cherry_blossom' | 'monstera';

export interface PlantInfo {
  id: PlantSpecies;
  name: string;
  seedName: string;
  tagline: string;
  costXP: number;
  emoji: string;
  color: string;
  description: string;
  benefit: string;
}

export interface PriorityTask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
  goalId?: string;
  estimatedMinutes?: number;
  xpValue: number;
  isMustWin?: boolean;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  targetFocusMinutes: number;
  priorityTasks: PriorityTask[];
  gratitudeNote?: string;
  eveningReflection?: string;
  energyRating?: number; // 1 to 5 stars
  dailyWin?: string; // 1-line daily win
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

export type BadgeTier = 'wood' | 'silver' | 'gold' | 'prismatic';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  tier?: BadgeTier;
}

export interface UserProfile {
  name: string;
  avatarId: string;
  bio?: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  streakDays: number;
  bestStreak: number;
  lastActiveDate: string;
  streakShields: number;
  unlockedBadges: string[];
  unlockedPlants?: PlantSpecies[];
  activePlant?: PlantSpecies;
  soundEnabled: boolean;
  sfxVolume?: number;
  theme: 'light' | 'dark';
  darkStyle?: 'obsidian' | 'oled' | 'midnight' | 'coffee';
  themeAccent?: 'emerald' | 'indigo' | 'rose' | 'amber' | 'cyan' | 'coral';
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
  photoURL?: string | null;
  tagline: string;
  currentLevel: number;
  streak: number;
  bestStreak?: number;
  todayMinutes: number;
  todayTargetMinutes: number;
  todayGoalTitle: string;
  focusStatus?: {
    isFocusing: boolean;
    activity?: string;
    minutesLeft?: number;
    plantStage?: string;
  };
  totalMilestonesCompleted?: number;
  totalMilestonesCount?: number;
  activeGoals?: Array<{ title: string; completedCount: number; totalCount: number; icon: string }>;
  completedMilestonesToday: number;
  recentCheers: CheerReaction[];
  isUserAdded?: boolean;
}

export interface FriendRequest {
  id: string;
  fromUid: string;
  fromName: string;
  fromTag: string;
  fromPhotoURL?: string | null;
  fromLevel: number;
  toTag: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export interface AntiCheatAttempt {
  goalId: string;
  milestoneId: string;
  timestamp: number;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD (local calendar date)
  focusMinutes: number;
  tasksCompleted: number;
  totalTasks: number;
  milestonesCompleted: number;
  xpEarned: number;
  updatedAt?: string;
}

export type XPRewardSourceType = 
  | 'task' 
  | 'milestone' 
  | 'focus_session' 
  | 'morning_kickoff' 
  | 'evening_reflection' 
  | 'cheer' 
  | 'goal_created' 
  | 'plant_unlocked'
  | 'bonus';

export interface XPReward {
  id: string;
  sourceType: XPRewardSourceType;
  sourceId: string;
  amount: number;
  date: string; // YYYY-MM-DD (local)
  timestamp: string; // ISO
  description?: string;
}



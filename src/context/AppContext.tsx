'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Goal, 
  DailyPlan, 
  UserProfile, 
  FriendBuddy, 
  FocusSessionLog, 
  Badge, 
  GoalCategory, 
  MilestoneItem, 
  FriendRequest,
  DailyProgress,
  XPReward,
  XPRewardSourceType,
  PriorityTask,
  PlantSpecies
} from '@/types';
import {
  getStoredGoals, saveStoredGoals,
  getStoredDailyPlan, saveStoredDailyPlan,
  getStoredProfile, saveStoredProfile,
  getStoredFriends, saveStoredFriends,
  getStoredFocusLogs, saveStoredFocusLogs,
  getStoredBadges, saveStoredBadges,
  saveStoredDailyProgress, getInitializedDailyProgress,
  saveStoredXPRewards, getInitializedXPRewards,
  exportAllDataJSON, importAllDataJSON
} from '@/lib/storage';
import { INITIAL_GOALS, INITIAL_DAILY_PLAN, INITIAL_USER_PROFILE, INITIAL_FRIENDS, DEFAULT_BADGES, PLANT_SPECIES_LIST } from '@/lib/constants';
import { getLocalDateString } from '@/lib/dateUtils';
import { sounds } from '@/lib/sounds';
import { 
  loginWithGoogle, 
  logoutUser, 
  saveUserDataToFirestore, 
  loadUserDataFromFirestore, 
  lookupFriendByCode, 
  AuthUserProfile, 
  formatFriendCode,
  checkAndClaimTag,
  sendFriendRequestToCloud,
  subscribeToIncomingFriendRequests,
  subscribeToSentFriendRequests,
  fetchIncomingRequestsFromCloud,
  updateFriendRequestStatusInCloud 
} from '@/lib/firebase';

interface MilestoneCompletionPayload {
  goalId: string;
  milestoneId: string;
  proofNote?: string;
  timeSpentMinutes?: number;
}

interface AppContextType {
  isLoaded: boolean;
  goals: Goal[];
  dailyPlan: DailyPlan;
  profile: UserProfile;
  friends: FriendBuddy[];
  focusLogs: FocusSessionLog[];
  badges: Badge[];
  dailyProgress: DailyProgress[];
  xpRewards: XPReward[];
  
  // Anti-Cheat State
  lastMilestoneCompletedTime: number | null;
  antiCheatModalTarget: { goalId: string; milestone: MilestoneItem } | null;
  setAntiCheatModalTarget: (target: { goalId: string; milestone: MilestoneItem } | null) => void;

  // Goals & Milestones Actions
  createGoal: (data: {
    title: string;
    description?: string;
    category: GoalCategory;
    totalMilestones: number;
    startingOffset: number;
    color: string;
    icon: string;
    targetDate?: string;
  }) => void;
  deleteGoal: (goalId: string) => void;
  requestCompleteMilestone: (goalId: string, milestone: MilestoneItem) => { requiresVerification: boolean; reason?: string };
  confirmCompleteMilestone: (payload: MilestoneCompletionPayload) => void;
  uncompleteMilestone: (goalId: string, milestoneId: string) => void;

  // Daily Tasks & Morning/Evening Rituals
  togglePriorityTask: (taskId: string) => void;
  addPriorityTask: (title: string, goalId?: string, estimatedMinutes?: number, isMustWin?: boolean) => void;
  deletePriorityTask: (taskId: string) => void;
  updateMorningPlan: (data: { targetFocusMinutes: number; tasks: { title: string; goalId?: string; estimatedMinutes?: number; isMustWin?: boolean }[]; gratitudeNote?: string }) => void;
  updateEveningReflection: (data: { reflection: string; energyRating?: number; dailyWin?: string }) => void;

  // Focus Sessions
  recordFocusSession: (data: { durationMinutes: number; goalId?: string; taskTitle: string; notes?: string }) => void;

  // Social & Cloud Sync
  authUser: AuthUserProfile | null;
  friendCode: string;
  updateCustomFriendCode: (newCode: string) => Promise<{ success: boolean; error?: string }>;
  incomingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  sendFriendRequest: (targetTag: string) => Promise<{ success: boolean; message: string }>;
  acceptFriendRequest: (requestId: string) => void;
  declineFriendRequest: (requestId: string) => void;
  cancelSentRequest: (requestId: string) => void;
  refreshFriendRequests: () => Promise<void>;
  handleGoogleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
  connectFriendByCode: (code: string) => Promise<boolean>;
  removeFriend: (friendId: string) => void;
  sendCheer: (friendId: string, emoji: string, label: string) => void;
  sendWaterDrop: (friendId: string) => void;
  addNewFriend: (data: { name: string; avatarId: string; tagline: string; todayGoalTitle: string }) => void;

  // Gamification, Power-Ups, Plant Shop & Badges
  gainXP: (amount: number, reason?: string) => void;
  awardXPOnce: (params: {
    amount: number;
    sourceType: XPRewardSourceType;
    sourceId: string;
    description?: string;
    date?: string;
  }) => boolean;
  hasXPRewardBeenAwarded: (sourceType: XPRewardSourceType, sourceId: string) => boolean;
  recordDailyProgress: (updater: (prev: DailyProgress[]) => DailyProgress[]) => void;
  getDailyProgressForDate: (dateStr: string) => DailyProgress | undefined;
  buyStreakShield: () => { success: boolean; message: string };
  buyPlantSeed: (species: PlantSpecies) => { success: boolean; message: string };
  setActivePlant: (species: PlantSpecies) => void;
  unlockBadge: (badgeId: string) => void;

  // Settings, Customization & Data Management
  toggleTheme: () => void;
  isDarkMode: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setThemeAccent: (accent: 'emerald' | 'indigo' | 'rose' | 'amber' | 'cyan' | 'coral') => void;
  setDarkStyle: (style: 'obsidian' | 'oled' | 'midnight' | 'coffee') => void;
  toggleSound: () => void;
  setSfxVolume: (vol: number) => void;
  toggleAntiCheat: () => void;
  triggerCelebration: () => void;
  resetAllDemoData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(() => (typeof window !== 'undefined' ? getStoredGoals() : INITIAL_GOALS));
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(() => (typeof window !== 'undefined' ? getStoredDailyPlan() : INITIAL_DAILY_PLAN));
  const [profile, setProfile] = useState<UserProfile>(() => (typeof window !== 'undefined' ? getStoredProfile() : INITIAL_USER_PROFILE));
  const [friends, setFriends] = useState<FriendBuddy[]>(() => (typeof window !== 'undefined' ? getStoredFriends() : INITIAL_FRIENDS));
  const [focusLogs, setFocusLogs] = useState<FocusSessionLog[]>(() => (typeof window !== 'undefined' ? getStoredFocusLogs() : []));
  const [badges, setBadges] = useState<Badge[]>(() => (typeof window !== 'undefined' ? getStoredBadges() : DEFAULT_BADGES));
  const [dailyProgress, setDailyProgress] = useState<DailyProgress[]>(() => (typeof window !== 'undefined' ? getInitializedDailyProgress() : []));
  const [xpRewards, setXpRewards] = useState<XPReward[]>(() => (typeof window !== 'undefined' ? getInitializedXPRewards() : []));

  // Ref to hold the latest rewards ledger to guarantee instantaneous synchronous idempotent checks
  const xpRewardsRef = useRef<XPReward[]>([]);

  // Keep ref synchronized with state
  useEffect(() => {
    xpRewardsRef.current = xpRewards;
  }, [xpRewards]);

  // Authentication & Cloud Sync
  const [authUser, setAuthUser] = useState<AuthUserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedAuth = localStorage.getItem('pathly_auth_user');
        return cachedAuth ? JSON.parse(cachedAuth) : null;
      } catch {}
    }
    return null;
  });

  const [friendCode, setFriendCode] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cachedAuth = localStorage.getItem('pathly_auth_user');
        if (cachedAuth) {
          const parsed = JSON.parse(cachedAuth);
          return parsed.friendCode || formatFriendCode(parsed.displayName || 'user');
        }
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        const generatedTag = `#pathly-user${randomDigits}`;
        const localCode = localStorage.getItem('pathly_friend_code') || generatedTag;
        return formatFriendCode(localCode);
      } catch {}
    }
    return '#pathly-mahin';
  });

  // Friend Requests State
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedInc = localStorage.getItem('pathly_incoming_requests_v2');
        return storedInc ? JSON.parse(storedInc) : [];
      } catch {}
    }
    return [];
  });

  const [sentRequests, setSentRequests] = useState<FriendRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSent = localStorage.getItem('pathly_sent_requests_v2');
        return storedSent ? JSON.parse(storedSent) : [];
      } catch {}
    }
    return [];
  });

  // Anti-cheat state tracking
  const [lastMilestoneCompletedTime, setLastMilestoneCompletedTime] = useState<number | null>(null);
  const [antiCheatModalTarget, setAntiCheatModalTarget] = useState<{ goalId: string; milestone: MilestoneItem } | null>(null);

  // Initial client hydration from LocalStorage & safe data migration
  useEffect(() => {
    sounds.setMuted(!profile.soundEnabled);
    if (profile.sfxVolume !== undefined) {
      sounds.setSfxVolume(profile.sfxVolume);
    }
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [profile.soundEnabled, profile.sfxVolume]);

  // Real-time listener for incoming & sent friend requests + backup interval
  useEffect(() => {
    if (!isLoaded || !friendCode) return;

    // 1. Subscribe to incoming requests in real-time from Firestore
    const unsubIncoming = subscribeToIncomingFriendRequests(friendCode, (reqs) => {
      const mapped = reqs as unknown as FriendRequest[];
      setIncomingRequests(mapped);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathly_incoming_requests_v2', JSON.stringify(mapped));
      }
    });

    // 2. Subscribe to sent requests status updates in real-time
    const unsubSent = subscribeToSentFriendRequests(friendCode, (reqs) => {
      const mapped = reqs as unknown as FriendRequest[];
      setSentRequests(mapped.filter(r => r.status === 'pending'));

      // If a recipient accepted our sent request, automatically add them to squad!
      const acceptedReqs = mapped.filter(r => r.status === 'accepted');
      if (acceptedReqs.length > 0) {
        acceptedReqs.forEach(async (req) => {
          const buddy = await lookupFriendByCode(req.toTag);
          const newBuddy: FriendBuddy = {
            id: buddy.id,
            name: buddy.name || req.toTag,
            avatarId: buddy.avatarId || 'sprout',
            photoURL: buddy.photoURL || null,
            tagline: req.toTag,
            currentLevel: buddy.level || 1,
            streak: buddy.streak || 0,
            bestStreak: buddy.bestStreak || 0,
            todayMinutes: buddy.todayMinutes || 0,
            todayTargetMinutes: 60,
            todayGoalTitle: buddy.todayGoalTitle || 'Daily Habits',
            totalMilestonesCompleted: buddy.totalMilestonesCompleted || 0,
            totalMilestonesCount: buddy.totalMilestonesCount || 0,
            activeGoals: buddy.activeGoals || [],
            completedMilestonesToday: 0,
            recentCheers: [],
            isUserAdded: true,
          };

          setFriends(prev => {
            const exists = prev.some(f => f.id === newBuddy.id || f.tagline.toLowerCase() === newBuddy.tagline.toLowerCase());
            if (exists) return prev;
            const updated = [newBuddy, ...prev];
            saveStoredFriends(updated);
            return updated;
          });
        });
      }
    });

    // 3. Lightning-fast sync: 1.5-second polling + window focus & visibility change
    const checkRequests = () => {
      fetchIncomingRequestsFromCloud(friendCode).then((reqs) => {
        if (reqs && reqs.length > 0) {
          setIncomingRequests(reqs as unknown as FriendRequest[]);
        }
      });
    };

    checkRequests();
    const interval = setInterval(checkRequests, 1500);

    const handleWindowFocus = () => {
      checkRequests();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkRequests();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (unsubIncoming) unsubIncoming();
      if (unsubSent) unsubSent();
    };
  }, [friendCode, isLoaded]);

  // Save changes to localStorage
  useEffect(() => {
    if (isLoaded) saveStoredGoals(goals);
  }, [goals, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveStoredDailyPlan(dailyPlan);
  }, [dailyPlan, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      saveStoredProfile(profile);
      sounds.setMuted(!profile.soundEnabled);
      if (profile.sfxVolume !== undefined) {
        sounds.setSfxVolume(profile.sfxVolume);
      }
    }
  }, [profile, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveStoredFriends(friends);
  }, [friends, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveStoredFocusLogs(focusLogs);
  }, [focusLogs, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveStoredBadges(badges);
  }, [badges, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveStoredDailyProgress(dailyProgress);
  }, [dailyProgress, isLoaded]);

  useEffect(() => {
    if (isLoaded) saveStoredXPRewards(xpRewards);
  }, [xpRewards, isLoaded]);

  const triggerCelebration = useCallback(() => {
    sounds.playMilestoneFanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34D399', '#F472B6', '#FBBF24', '#60A5FA', '#A78BFA'],
      });
    } catch {}
  }, []);

  /**
   * Unlock a badge if not already unlocked
   */
  const unlockBadge = useCallback((badgeId: string) => {
    setProfile(prev => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      sounds.playLevelUp();
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#6366F1']
        });
      } catch {}
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      };
    });
  }, []);

  // Automatic badge condition checker
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      const totalFocus = focusLogs.reduce((acc, l) => acc + l.durationMinutes, 0);

      if (goals.length > 0 && !profile.unlockedBadges.includes('first-step')) {
        unlockBadge('first-step');
      }
      if (totalFocus >= 60 && !profile.unlockedBadges.includes('focus-hero')) {
        unlockBadge('focus-hero');
      }
      if (profile.streakDays >= 3 && !profile.unlockedBadges.includes('streak-3')) {
        unlockBadge('streak-3');
      }
      if (goals.some(g => g.milestones.every(m => m.isCompleted)) && !profile.unlockedBadges.includes('course-master')) {
        unlockBadge('course-master');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [goals, focusLogs, profile.streakDays, profile.unlockedBadges, isLoaded, unlockBadge]);

  /**
   * Check if an XP reward with a specific sourceType and sourceId has already been awarded.
   */
  const hasXPRewardBeenAwarded = useCallback((sourceType: XPRewardSourceType, sourceId: string): boolean => {
    return xpRewardsRef.current.some(r => r.sourceType === sourceType && r.sourceId === sourceId);
  }, []);

  /**
   * Idempotent XP awarding function.
   */
  const awardXPOnce = useCallback((params: {
    amount: number;
    sourceType: XPRewardSourceType;
    sourceId: string;
    description?: string;
    date?: string;
  }): boolean => {
    const { amount, sourceType, sourceId, description, date } = params;
    const targetDate = date || getLocalDateString();

    if (amount <= 0) return false;

    // Check ref for instantaneous synchronous guard
    if (xpRewardsRef.current.some(r => r.sourceType === sourceType && r.sourceId === sourceId)) {
      return false;
    }

    const newReward: XPReward = {
      id: `xp-${sourceType}-${sourceId}`,
      sourceType,
      sourceId,
      amount,
      date: targetDate,
      timestamp: new Date().toISOString(),
      description: description || `Awarded for ${sourceType}`,
    };

    // 1. Immediately update ref and ledger state
    xpRewardsRef.current = [newReward, ...xpRewardsRef.current];
    setXpRewards(prev => {
      if (prev.some(r => r.sourceType === sourceType && r.sourceId === sourceId)) return prev;
      const updated = [newReward, ...prev];
      saveStoredXPRewards(updated);
      return updated;
    });

    // 2. Increase profile XP & handle level progression
    setProfile(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let newNextXP = prev.nextLevelXP;

      if (newXP >= newNextXP) {
        newLevel += 1;
        newXP = newXP - newNextXP;
        newNextXP = Math.round(newNextXP * 1.35);
        sounds.playLevelUp();
        try {
          confetti({
            particleCount: 120,
            spread: 100,
            origin: { y: 0.5 },
            colors: ['#F59E0B', '#10B981', '#EC4899', '#8B5CF6']
          });
        } catch {}
      }

      return {
        ...prev,
        level: newLevel,
        currentXP: newXP,
        nextLevelXP: newNextXP,
        lastActiveDate: targetDate,
      };
    });

    // 3. Record XP in DailyProgress
    setDailyProgress(prev => {
      const existingIndex = prev.findIndex(p => p.date === targetDate);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          xpEarned: (updated[existingIndex].xpEarned || 0) + amount,
          updatedAt: new Date().toISOString(),
        };
        saveStoredDailyProgress(updated);
        return updated;
      } else {
        const newDay: DailyProgress = {
          date: targetDate,
          focusMinutes: 0,
          tasksCompleted: 0,
          totalTasks: 0,
          milestonesCompleted: 0,
          xpEarned: amount,
          updatedAt: new Date().toISOString(),
        };
        const updated = [newDay, ...prev];
        saveStoredDailyProgress(updated);
        return updated;
      }
    });

    return true;
  }, []);

  const gainXP = useCallback((amount: number, reason?: string) => {
    const rewardId = `bonus-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    awardXPOnce({
      amount,
      sourceType: 'bonus',
      sourceId: rewardId,
      description: reason || 'Bonus XP',
      date: getLocalDateString(),
    });
  }, [awardXPOnce]);

  const buyStreakShield = useCallback((): { success: boolean; message: string } => {
    const COST = 150;
    if (profile.currentXP < COST) {
      return { success: false, message: `Need ${COST} XP to buy a Streak Shield (You have ${profile.currentXP} XP).` };
    }

    setProfile(prev => ({
      ...prev,
      currentXP: prev.currentXP - COST,
      streakShields: (prev.streakShields || 0) + 1,
    }));

    sounds.playStreakShield();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#60A5FA', '#34D399', '#FBBF24']
      });
    } catch {}

    return { success: true, message: '🛡️ Streak Shield acquired! Your streak is now protected from missed days.' };
  }, [profile.currentXP]);

  const buyPlantSeed = useCallback((species: PlantSpecies): { success: boolean; message: string } => {
    const plantInfo = PLANT_SPECIES_LIST.find(p => p.id === species);
    if (!plantInfo) {
      return { success: false, message: 'Unknown seed variety.' };
    }

    const unlocked = profile.unlockedPlants || ['succulent'];
    if (unlocked.includes(species)) {
      setProfile(prev => ({ ...prev, activePlant: species }));
      sounds.playTap();
      return { success: true, message: `Equipped ${plantInfo.name} in your Growth Terrarium!` };
    }

    if (profile.currentXP < plantInfo.costXP) {
      return { success: false, message: `Need ${plantInfo.costXP} XP to unlock ${plantInfo.name} (You have ${profile.currentXP} XP).` };
    }

    const updatedUnlocked = [...unlocked, species];
    setProfile(prev => ({
      ...prev,
      currentXP: prev.currentXP - plantInfo.costXP,
      unlockedPlants: updatedUnlocked,
      activePlant: species,
    }));

    awardXPOnce({
      amount: 25,
      sourceType: 'plant_unlocked',
      sourceId: `plant-${species}-${Date.now()}`,
      description: `Unlocked ${plantInfo.name}`,
      date: getLocalDateString(),
    });

    if (updatedUnlocked.length >= 3) {
      unlockBadge('greenhouse-collector');
    }

    sounds.playLevelUp();
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#F472B6', '#FBBF24']
      });
    } catch {}

    return { success: true, message: `🌱 Unlocked and equipped ${plantInfo.name}!` };
  }, [profile.unlockedPlants, profile.currentXP, awardXPOnce, unlockBadge]);

  const setActivePlant = useCallback((species: PlantSpecies) => {
    const unlocked = profile.unlockedPlants || ['succulent'];
    if (unlocked.includes(species)) {
      setProfile(prev => ({ ...prev, activePlant: species }));
      sounds.playTap();
    }
  }, [profile.unlockedPlants]);

  const recordDailyProgress = useCallback((updater: (prev: DailyProgress[]) => DailyProgress[]) => {
    setDailyProgress(prev => {
      const updated = updater(prev);
      saveStoredDailyProgress(updated);
      return updated;
    });
  }, []);

  const getDailyProgressForDate = useCallback((dateStr: string): DailyProgress | undefined => {
    return dailyProgress.find(p => p.date === dateStr);
  }, [dailyProgress]);

  // Goal Creation with Starting Offset
  const createGoal = useCallback((data: {
    title: string;
    description?: string;
    category: GoalCategory;
    totalMilestones: number;
    startingOffset: number;
    color: string;
    icon: string;
    targetDate?: string;
  }) => {
    const todayDate = getLocalDateString();
    const total = Math.max(1, data.totalMilestones);
    const offset = Math.min(Math.max(0, data.startingOffset), total);

    const milestones: MilestoneItem[] = Array.from({ length: total }).map((_, i) => {
      const order = i + 1;
      const isPast = order <= offset;
      return {
        id: `ms-${Date.now()}-${order}`,
        order,
        title: `Milestone ${order}`,
        isCompleted: isPast,
        wasInitialOffset: isPast,
        completedAt: isPast ? new Date().toISOString() : undefined,
      };
    });

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      totalMilestones: total,
      startingOffset: offset,
      milestones,
      color: data.color,
      icon: data.icon,
      targetDate: data.targetDate,
      createdAt: new Date().toISOString(),
    };

    setGoals(prev => [newGoal, ...prev]);
    
    awardXPOnce({
      amount: 30,
      sourceType: 'goal_created',
      sourceId: newGoal.id,
      description: `Created goal "${data.title}"`,
      date: todayDate,
    });

    sounds.playTaskPop();
  }, [awardXPOnce]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    sounds.playTap();
  }, []);

  const confirmCompleteMilestone = useCallback((payload: MilestoneCompletionPayload) => {
    const nowStr = new Date().toISOString();
    const todayDate = getLocalDateString();
    setLastMilestoneCompletedTime(Date.now());

    let wasGoalFinished = false;

    setGoals(prev => prev.map(goal => {
      if (goal.id !== payload.goalId) return goal;

      const updatedMilestones = goal.milestones.map(m => {
        if (m.id === payload.milestoneId) {
          return {
            ...m,
            isCompleted: true,
            completedAt: nowStr,
            proofNote: payload.proofNote || 'Verified progress log',
            timeSpentMinutes: payload.timeSpentMinutes || 30,
          };
        }
        return m;
      });

      const allDone = updatedMilestones.every(m => m.isCompleted);
      if (allDone) wasGoalFinished = true;

      return {
        ...goal,
        milestones: updatedMilestones,
        lastProgressAt: nowStr,
      };
    }));

    awardXPOnce({
      amount: 100,
      sourceType: 'milestone',
      sourceId: payload.milestoneId,
      description: 'Completed Milestone',
      date: todayDate,
    });

    setDailyProgress(prev => {
      const existingIndex = prev.findIndex(p => p.date === todayDate);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          milestonesCompleted: (updated[existingIndex].milestonesCompleted || 0) + 1,
          updatedAt: new Date().toISOString(),
        };
        saveStoredDailyProgress(updated);
        return updated;
      } else {
        const newDay: DailyProgress = {
          date: todayDate,
          focusMinutes: 0,
          tasksCompleted: 0,
          totalTasks: 0,
          milestonesCompleted: 1,
          xpEarned: 0,
          updatedAt: new Date().toISOString(),
        };
        const updated = [newDay, ...prev];
        saveStoredDailyProgress(updated);
        return updated;
      }
    });

    setAntiCheatModalTarget(null);

    if (wasGoalFinished) {
      triggerCelebration();
    } else {
      sounds.playMilestoneFanfare();
    }
  }, [awardXPOnce, triggerCelebration]);

  const requestCompleteMilestone = useCallback((goalId: string, milestone: MilestoneItem): { requiresVerification: boolean; reason?: string } => {
    if (!profile.antiCheatEnabled) {
      confirmCompleteMilestone({ goalId, milestoneId: milestone.id });
      return { requiresVerification: false };
    }

    const now = Date.now();
    const cooldownMs = (profile.pacingCooldownSeconds || 45) * 1000;

    if (lastMilestoneCompletedTime && now - lastMilestoneCompletedTime < cooldownMs) {
      const remainingSecs = Math.ceil((cooldownMs - (now - lastMilestoneCompletedTime)) / 1000);
      sounds.playWarning();
      setAntiCheatModalTarget({ goalId, milestone });
      return {
        requiresVerification: true,
        reason: `Pacing Guard Active! You just completed a milestone recently. Wait ${remainingSecs}s or write your proof of work / key takeaway note.`
      };
    }

    setAntiCheatModalTarget({ goalId, milestone });
    return { requiresVerification: true };
  }, [profile.antiCheatEnabled, profile.pacingCooldownSeconds, lastMilestoneCompletedTime, confirmCompleteMilestone]);

  const uncompleteMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      return {
        ...goal,
        milestones: goal.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              isCompleted: false,
              completedAt: undefined,
              proofNote: undefined,
              wasInitialOffset: false,
            };
          }
          return m;
        })
      };
    }));
    sounds.playTap();
  }, []);

  const togglePriorityTask = useCallback((taskId: string) => {
    const todayDate = getLocalDateString();

    setDailyPlan(prev => {
      let wasTicked = false;
      let targetTask: PriorityTask | undefined;

      const updatedTasks = prev.priorityTasks.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          wasTicked = nextState;
          targetTask = t;
          return {
            ...t,
            completed: nextState,
            completedAt: nextState ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });

      if (wasTicked && targetTask) {
        sounds.playTaskPop();
        awardXPOnce({
          amount: targetTask.xpValue || 50,
          sourceType: 'task',
          sourceId: taskId,
          description: `Completed: ${targetTask.title}`,
          date: todayDate,
        });
      } else {
        sounds.playTap();
      }

      const completedCount = updatedTasks.filter(t => t.completed).length;
      const totalCount = updatedTasks.length;

      setDailyProgress(progPrev => {
        const existingIndex = progPrev.findIndex(p => p.date === todayDate);
        if (existingIndex >= 0) {
          const updated = [...progPrev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            tasksCompleted: completedCount,
            totalTasks: totalCount,
            updatedAt: new Date().toISOString(),
          };
          saveStoredDailyProgress(updated);
          return updated;
        } else {
          const newDay: DailyProgress = {
            date: todayDate,
            focusMinutes: 0,
            tasksCompleted: completedCount,
            totalTasks: totalCount,
            milestonesCompleted: 0,
            xpEarned: 0,
            updatedAt: new Date().toISOString(),
          };
          const updated = [newDay, ...progPrev];
          saveStoredDailyProgress(updated);
          return updated;
        }
      });

      return { ...prev, priorityTasks: updatedTasks };
    });
  }, [awardXPOnce]);

  const addPriorityTask = useCallback((title: string, goalId?: string, estimatedMinutes?: number, isMustWin?: boolean) => {
    if (!title.trim()) return;
    const todayDate = getLocalDateString();
    const newTask: PriorityTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      completed: false,
      goalId,
      estimatedMinutes: estimatedMinutes || 30,
      xpValue: isMustWin ? 60 : 40,
      isMustWin: isMustWin || false,
    };
    
    setDailyPlan(prev => {
      const updated = {
        ...prev,
        priorityTasks: [...prev.priorityTasks, newTask],
      };

      setDailyProgress(progPrev => {
        const existingIndex = progPrev.findIndex(p => p.date === todayDate);
        const total = updated.priorityTasks.length;
        const done = updated.priorityTasks.filter(t => t.completed).length;
        if (existingIndex >= 0) {
          const u = [...progPrev];
          u[existingIndex] = { ...u[existingIndex], totalTasks: total, tasksCompleted: done };
          saveStoredDailyProgress(u);
          return u;
        }
        return progPrev;
      });

      return updated;
    });
    sounds.playTap();
  }, []);

  const deletePriorityTask = useCallback((taskId: string) => {
    const todayDate = getLocalDateString();
    setDailyPlan(prev => {
      const updated = {
        ...prev,
        priorityTasks: prev.priorityTasks.filter(t => t.id !== taskId),
      };

      setDailyProgress(progPrev => {
        const existingIndex = progPrev.findIndex(p => p.date === todayDate);
        const total = updated.priorityTasks.length;
        const done = updated.priorityTasks.filter(t => t.completed).length;
        if (existingIndex >= 0) {
          const u = [...progPrev];
          u[existingIndex] = { ...u[existingIndex], totalTasks: total, tasksCompleted: done };
          saveStoredDailyProgress(u);
          return u;
        }
        return progPrev;
      });

      return updated;
    });
    sounds.playTap();
  }, []);

  const updateMorningPlan = useCallback((data: {
    targetFocusMinutes: number;
    tasks: { title: string; goalId?: string; estimatedMinutes?: number; isMustWin?: boolean }[];
    gratitudeNote?: string;
  }) => {
    const todayDate = getLocalDateString();
    const formattedTasks = data.tasks.map((t, idx) => ({
      id: `task-morning-${Date.now()}-${idx}`,
      title: t.title,
      completed: false,
      goalId: t.goalId,
      estimatedMinutes: t.estimatedMinutes || 30,
      xpValue: t.isMustWin ? 70 : 50,
      isMustWin: t.isMustWin || idx === 0,
    }));

    setDailyPlan(prev => ({
      ...prev,
      targetFocusMinutes: data.targetFocusMinutes,
      priorityTasks: formattedTasks,
      gratitudeNote: data.gratitudeNote || prev.gratitudeNote,
      morningCompleted: true,
    }));

    awardXPOnce({
      amount: 60,
      sourceType: 'morning_kickoff',
      sourceId: `morning-${todayDate}`,
      description: 'Sunrise Intent Set',
      date: todayDate,
    });

    setDailyProgress(progPrev => {
      const existingIndex = progPrev.findIndex(p => p.date === todayDate);
      if (existingIndex >= 0) {
        const updated = [...progPrev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          totalTasks: formattedTasks.length,
          tasksCompleted: 0,
        };
        saveStoredDailyProgress(updated);
        return updated;
      }
      return progPrev;
    });

    sounds.playTaskPop();
  }, [awardXPOnce]);

  const updateEveningReflection = useCallback((data: { reflection: string; energyRating?: number; dailyWin?: string }) => {
    const todayDate = getLocalDateString();

    setDailyPlan(prev => ({
      ...prev,
      eveningReflection: data.reflection,
      energyRating: data.energyRating || 5,
      dailyWin: data.dailyWin || '',
      eveningCompleted: true,
    }));

    awardXPOnce({
      amount: 80,
      sourceType: 'evening_reflection',
      sourceId: `evening-${todayDate}`,
      description: 'Sunset Reflection & Momentum Preserved',
      date: todayDate,
    });

    triggerCelebration();
  }, [awardXPOnce, triggerCelebration]);

  const recordFocusSession = useCallback((data: {
    durationMinutes: number;
    goalId?: string;
    taskTitle: string;
    notes?: string;
  }) => {
    const todayDate = getLocalDateString();
    const xp = Math.round(data.durationMinutes * 2);
    const newLog: FocusSessionLog = {
      id: `flog-${Date.now()}`,
      date: todayDate,
      durationMinutes: data.durationMinutes,
      goalId: data.goalId,
      taskTitle: data.taskTitle,
      notes: data.notes,
      timestamp: new Date().toISOString(),
      xpEarned: xp,
    };

    setFocusLogs(prev => [newLog, ...prev]);

    awardXPOnce({
      amount: xp,
      sourceType: 'focus_session',
      sourceId: newLog.id,
      description: `Focused ${data.durationMinutes}m on "${data.taskTitle}"`,
      date: todayDate,
    });

    setDailyProgress(prev => {
      const existingIndex = prev.findIndex(p => p.date === todayDate);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          focusMinutes: (updated[existingIndex].focusMinutes || 0) + data.durationMinutes,
          updatedAt: new Date().toISOString(),
        };
        saveStoredDailyProgress(updated);
        return updated;
      } else {
        const newDay: DailyProgress = {
          date: todayDate,
          focusMinutes: data.durationMinutes,
          tasksCompleted: 0,
          totalTasks: 0,
          milestonesCompleted: 0,
          xpEarned: 0,
          updatedAt: new Date().toISOString(),
        };
        const updated = [newDay, ...prev];
        saveStoredDailyProgress(updated);
        return updated;
      }
    });

    sounds.playTimerFinish();
  }, [awardXPOnce]);

  const sendCheer = useCallback((friendId: string, emoji: string, label: string) => {
    const todayDate = getLocalDateString();
    const cheer = {
      id: `cheer-${Date.now()}`,
      fromName: profile.name,
      avatarId: profile.avatarId,
      emoji,
      label,
      timestamp: 'Just now',
    };

    setFriends(prev => prev.map(f => {
      if (f.id === friendId) {
        return {
          ...f,
          recentCheers: [cheer, ...(f.recentCheers || [])].slice(0, 5)
        };
      }
      return f;
    }));

    sounds.playTaskPop();

    awardXPOnce({
      amount: 15,
      sourceType: 'cheer',
      sourceId: cheer.id,
      description: `Cheered: "${label}"`,
      date: todayDate,
    });
  }, [profile.name, profile.avatarId, awardXPOnce]);

  const sendWaterDrop = useCallback((friendId: string) => {
    const todayDate = getLocalDateString();
    const waterDropCheer = {
      id: `water-${Date.now()}`,
      fromName: profile.name,
      avatarId: profile.avatarId,
      emoji: '💧',
      label: 'Water Drop',
      timestamp: 'Just now',
    };

    setFriends(prev => prev.map(f => {
      if (f.id === friendId) {
        return {
          ...f,
          recentCheers: [waterDropCheer, ...(f.recentCheers || [])].slice(0, 5)
        };
      }
      return f;
    }));

    sounds.playWaterDrop();

    awardXPOnce({
      amount: 10,
      sourceType: 'cheer',
      sourceId: waterDropCheer.id,
      description: 'Watered buddy virtual plant',
      date: todayDate,
    });
  }, [profile.name, profile.avatarId, awardXPOnce]);

  const addNewFriend = useCallback((data: {
    name: string;
    avatarId: string;
    tagline: string;
    todayGoalTitle: string;
  }) => {
    const newFriend: FriendBuddy = {
      id: `f-${Date.now()}`,
      name: data.name,
      avatarId: data.avatarId,
      tagline: data.tagline,
      currentLevel: 1,
      streak: 1,
      todayMinutes: 30,
      todayTargetMinutes: 60,
      todayGoalTitle: data.todayGoalTitle,
      completedMilestonesToday: 0,
      recentCheers: [],
      isUserAdded: true,
    };

    setFriends(prev => [newFriend, ...prev]);
    sounds.playTap();
  }, []);

  // Theme & Accent synchronizer
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (profile.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.setAttribute('data-dark-style', profile.darkStyle || 'obsidian');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.removeAttribute('data-dark-style');
      }
      document.documentElement.setAttribute('data-theme', profile.themeAccent || 'emerald');
    }
  }, [profile.theme, profile.themeAccent, profile.darkStyle]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathly_user_profile', JSON.stringify(updated));
      }
      return updated;
    });
    sounds.playTap();
  }, []);

  const toggleTheme = useCallback(() => {
    setProfile(prev => {
      const nextTheme: 'light' | 'dark' = prev.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
    sounds.playTap();
  }, []);

  const setThemeAccent = useCallback((accent: 'emerald' | 'indigo' | 'rose' | 'amber' | 'cyan' | 'coral') => {
    setProfile(prev => ({ ...prev, themeAccent: accent }));
    sounds.playTap();
  }, []);

  const setDarkStyle = useCallback((style: 'obsidian' | 'oled' | 'midnight' | 'coffee') => {
    setProfile(prev => ({ ...prev, darkStyle: style }));
    sounds.playTap();
  }, []);

  const toggleSound = useCallback(() => {
    setProfile(prev => {
      const nextVal = !prev.soundEnabled;
      sounds.setMuted(!nextVal);
      return { ...prev, soundEnabled: nextVal };
    });
  }, []);

  const setSfxVolume = useCallback((vol: number) => {
    setProfile(prev => ({ ...prev, sfxVolume: vol }));
    sounds.setSfxVolume(vol);
  }, []);

  const toggleAntiCheat = useCallback(() => {
    setProfile(prev => ({ ...prev, antiCheatEnabled: !prev.antiCheatEnabled }));
    sounds.playTap();
  }, []);

  const resetAllDemoData = useCallback(() => {
    setGoals(INITIAL_GOALS);
    setDailyPlan(INITIAL_DAILY_PLAN);
    setProfile(INITIAL_USER_PROFILE);
    setFriends(INITIAL_FRIENDS);
    setFocusLogs([]);
    setBadges(DEFAULT_BADGES);
    setDailyProgress([]);
    setXpRewards([]);
    xpRewardsRef.current = [];
    saveStoredGoals(INITIAL_GOALS);
    saveStoredDailyPlan(INITIAL_DAILY_PLAN);
    saveStoredProfile(INITIAL_USER_PROFILE);
    saveStoredFriends(INITIAL_FRIENDS);
    saveStoredFocusLogs([]);
    saveStoredBadges(DEFAULT_BADGES);
    saveStoredDailyProgress([]);
    saveStoredXPRewards([]);
    sounds.playTap();
  }, []);

  const exportDataJSON = useCallback(() => {
    return exportAllDataJSON();
  }, []);

  const importDataJSON = useCallback((jsonStr: string): boolean => {
    const success = importAllDataJSON(jsonStr);
    if (success) {
      setGoals(getStoredGoals());
      setDailyPlan(getStoredDailyPlan());
      setProfile(getStoredProfile());
      setFriends(getStoredFriends());
      setFocusLogs(getStoredFocusLogs());
      setBadges(getStoredBadges());
      setDailyProgress(getInitializedDailyProgress());
      setXpRewards(getInitializedXPRewards());
      sounds.playLevelUp();
    }
    return success;
  }, []);

  // Google Authentication & Cloud Sync
  const handleGoogleSignIn = useCallback(async () => {
    try {
      const user = await loginWithGoogle();
      setAuthUser(user);
      setFriendCode(user.friendCode);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathly_auth_user', JSON.stringify(user));
        localStorage.setItem('pathly_friend_code', user.friendCode);
      }

      const cloudData = await loadUserDataFromFirestore(user.uid);
      if (cloudData) {
        if (cloudData.goals) setGoals(cloudData.goals as Goal[]);
        if (cloudData.dailyPlan) setDailyPlan(cloudData.dailyPlan as DailyPlan);
        if (cloudData.profile) setProfile(cloudData.profile as UserProfile);
        if (cloudData.friends) setFriends(cloudData.friends as FriendBuddy[]);
        if (cloudData.focusLogs) setFocusLogs(cloudData.focusLogs as FocusSessionLog[]);
        if (cloudData.badges) setBadges(cloudData.badges as Badge[]);
        if (cloudData.dailyProgress) setDailyProgress(cloudData.dailyProgress as DailyProgress[]);
        if (cloudData.xpRewards) {
          const loadedRewards = cloudData.xpRewards as XPReward[];
          setXpRewards(loadedRewards);
          xpRewardsRef.current = loadedRewards;
        }
      } else {
        saveUserDataToFirestore(user.uid, {
          goals,
          dailyPlan,
          profile,
          friends,
          focusLogs,
          badges,
          dailyProgress,
          xpRewards,
          friendCode: user.friendCode,
        });
      }
      sounds.playLevelUp();
    } catch (err) {
      console.error('Google Sign In Error:', err);
      throw err;
    }
  }, [goals, dailyPlan, profile, friends, focusLogs, badges, dailyProgress, xpRewards]);

  const handleSignOut = useCallback(async () => {
    await logoutUser();
    setAuthUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pathly_auth_user');
    }
  }, []);

  const connectFriendByCode = useCallback(async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    const cleanCode = code.trim().toUpperCase();
    const buddy = await lookupFriendByCode(cleanCode);

    const newFriend: FriendBuddy = {
      id: buddy.id || `f-${Date.now()}`,
      name: buddy.name || cleanCode,
      avatarId: buddy.avatarId || 'sprout',
      photoURL: buddy.photoURL || null,
      tagline: 'Connected Squad Buddy 🚀',
      currentLevel: buddy.level || 1,
      streak: buddy.streak || 0,
      todayMinutes: buddy.todayMinutes || 0,
      todayTargetMinutes: 60,
      todayGoalTitle: buddy.todayGoalTitle || 'Daily Habits',
      completedMilestonesToday: 0,
      recentCheers: [],
      isUserAdded: true,
    };

    setFriends(prev => {
      const exists = prev.some(f => f.name.toLowerCase() === newFriend.name.toLowerCase() || f.id === newFriend.id);
      if (exists) return prev;
      const updated = [newFriend, ...prev];
      saveStoredFriends(updated);
      return updated;
    });

    sounds.playTaskPop();
    return true;
  }, []);

  const removeFriend = useCallback((friendId: string) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
    sounds.playTap();
  }, []);

  const updateCustomFriendCode = useCallback(async (newCode: string): Promise<{ success: boolean; error?: string }> => {
    const uid = authUser?.uid || (typeof window !== 'undefined' ? (localStorage.getItem('pathly_device_uid') || `dev-${Date.now()}`) : 'guest-user');
    if (typeof window !== 'undefined') {
      localStorage.setItem('pathly_device_uid', uid);
    }

    const claimRes = await checkAndClaimTag(newCode, uid);
    if (!claimRes.success) {
      sounds.playTap();
      return { success: false, error: claimRes.error };
    }

    const formatted = claimRes.tag;
    setFriendCode(formatted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pathly_friend_code', formatted);
      if (authUser) {
        const updatedAuth = { ...authUser, friendCode: formatted };
        localStorage.setItem('pathly_auth_user', JSON.stringify(updatedAuth));
        setAuthUser(updatedAuth);
      }
    }
    sounds.playLevelUp();
    return { success: true };
  }, [authUser]);

  const sendFriendRequest = useCallback(async (targetTag: string): Promise<{ success: boolean; message: string }> => {
    if (!targetTag.trim()) {
      return { success: false, message: 'Please enter a valid Friend Tag.' };
    }

    const formattedTarget = formatFriendCode(targetTag);
    const myTag = friendCode;

    if (formattedTarget.toLowerCase() === myTag.toLowerCase()) {
      return { success: false, message: 'You cannot send a friend request to your own tag!' };
    }

    if (friends.some(f => f.tagline === formattedTarget || f.name.toLowerCase() === formattedTarget.toLowerCase())) {
      return { success: false, message: 'This friend is already in your connected squad!' };
    }

    if (sentRequests.some(r => r.toTag.toLowerCase() === formattedTarget.toLowerCase() && r.status === 'pending')) {
      return { success: false, message: 'A request has already been sent to this tag.' };
    }

    const newReq: FriendRequest = {
      id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fromUid: authUser?.uid || `user-${Date.now()}`,
      fromName: authUser?.displayName || profile.name || 'Pathly Explorer',
      fromTag: myTag,
      fromPhotoURL: authUser?.photoURL || null,
      fromLevel: profile.level || 1,
      toTag: formattedTarget,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setSentRequests(prev => {
      const updated = [newReq, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathly_sent_requests_v2', JSON.stringify(updated));
      }
      return updated;
    });

    sendFriendRequestToCloud(newReq as unknown as Record<string, unknown>);
    sounds.playTaskPop();
    return { success: true, message: `Friend request sent to ${formattedTarget}!` };
  }, [friendCode, friends, sentRequests, authUser, profile.name, profile.level]);

  const acceptFriendRequest = useCallback(async (requestId: string) => {
    const req = incomingRequests.find(r => r.id === requestId);
    if (!req) return;

    const buddy = await lookupFriendByCode(req.fromTag);

    const newBuddy: FriendBuddy = {
      id: req.fromUid || buddy.id,
      name: req.fromName || buddy.name || req.fromTag,
      avatarId: buddy.avatarId || 'sprout',
      photoURL: req.fromPhotoURL || buddy.photoURL || null,
      tagline: req.fromTag,
      currentLevel: req.fromLevel || buddy.level || 1,
      streak: buddy.streak || 0,
      bestStreak: buddy.bestStreak || 0,
      todayMinutes: buddy.todayMinutes || 0,
      todayTargetMinutes: 60,
      todayGoalTitle: buddy.todayGoalTitle || 'Daily Habits',
      totalMilestonesCompleted: buddy.totalMilestonesCompleted || 0,
      totalMilestonesCount: buddy.totalMilestonesCount || 0,
      activeGoals: buddy.activeGoals || [],
      completedMilestonesToday: 0,
      recentCheers: [],
      isUserAdded: true,
    };

    setFriends(prev => {
      const exists = prev.some(f => f.id === newBuddy.id || f.name.toLowerCase() === newBuddy.name.toLowerCase());
      if (exists) return prev;
      const updated = [newBuddy, ...prev];
      saveStoredFriends(updated);
      return updated;
    });

    setIncomingRequests(prev => {
      const updated = prev.filter(r => r.id !== requestId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathly_incoming_requests_v2', JSON.stringify(updated));
      }
      return updated;
    });

    updateFriendRequestStatusInCloud(requestId, 'accepted', req.toTag, req.fromTag);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    sounds.playLevelUp();
  }, [incomingRequests]);

  const declineFriendRequest = useCallback((requestId: string) => {
    const req = incomingRequests.find(r => r.id === requestId);
    setIncomingRequests(prev => {
      const updated = prev.filter(r => r.id !== requestId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathly_incoming_requests_v2', JSON.stringify(updated));
      }
      return updated;
    });
    updateFriendRequestStatusInCloud(requestId, 'declined', req?.toTag, req?.fromTag);
    sounds.playTap();
  }, [incomingRequests]);

  const cancelSentRequest = useCallback((requestId: string) => {
    const req = sentRequests.find(r => r.id === requestId);
    setSentRequests(prev => {
      const updated = prev.filter(r => r.id !== requestId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('pathly_sent_requests_v2', JSON.stringify(updated));
      }
      return updated;
    });
    updateFriendRequestStatusInCloud(requestId, 'declined', req?.toTag, req?.fromTag);
    sounds.playTap();
  }, [sentRequests]);

  // Auto-sync state changes to cloud if user is signed in
  useEffect(() => {
    if (isLoaded && authUser) {
      saveUserDataToFirestore(authUser.uid, {
        goals,
        dailyPlan,
        profile: {
          ...profile,
          name: authUser.displayName || profile.name,
        },
        friends,
        focusLogs,
        badges,
        dailyProgress,
        xpRewards,
        friendCode,
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
      });
    }
  }, [goals, dailyPlan, profile, friends, focusLogs, badges, dailyProgress, xpRewards, authUser, friendCode, isLoaded]);

  const refreshFriendRequests = useCallback(async () => {
    if (!friendCode) return;
    const reqs = await fetchIncomingRequestsFromCloud(friendCode);
    if (reqs) {
      setIncomingRequests(reqs as unknown as FriendRequest[]);
    }
  }, [friendCode]);

  return (
    <AppContext.Provider
      value={{
        isLoaded,
        goals,
        dailyPlan,
        profile,
        friends,
        focusLogs,
        badges,
        dailyProgress,
        xpRewards,
        authUser,
        friendCode,
        updateCustomFriendCode,
        incomingRequests,
        sentRequests,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        cancelSentRequest,
        refreshFriendRequests,
        handleGoogleSignIn,
        handleSignOut,
        connectFriendByCode,
        removeFriend,
        lastMilestoneCompletedTime,
        antiCheatModalTarget,
        setAntiCheatModalTarget,
        createGoal,
        deleteGoal,
        requestCompleteMilestone,
        confirmCompleteMilestone,
        uncompleteMilestone,
        togglePriorityTask,
        addPriorityTask,
        deletePriorityTask,
        updateMorningPlan,
        updateEveningReflection,
        recordFocusSession,
        sendCheer,
        sendWaterDrop,
        addNewFriend,
        gainXP,
        awardXPOnce,
        hasXPRewardBeenAwarded,
        recordDailyProgress,
        getDailyProgressForDate,
        buyStreakShield,
        buyPlantSeed,
        setActivePlant,
        unlockBadge,
        toggleTheme,
        isDarkMode: profile.theme === 'dark',
        updateProfile,
        setThemeAccent,
        setDarkStyle,
        toggleSound,
        setSfxVolume,
        toggleAntiCheat,
        triggerCelebration,
        resetAllDemoData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

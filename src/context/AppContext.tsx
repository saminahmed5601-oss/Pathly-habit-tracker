'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Goal, DailyPlan, UserProfile, FriendBuddy, FocusSessionLog, Badge, GoalCategory, MilestoneItem } from '@/types';
import {
  getStoredGoals, saveStoredGoals,
  getStoredDailyPlan, saveStoredDailyPlan,
  getStoredProfile, saveStoredProfile,
  getStoredFriends, saveStoredFriends,
  getStoredFocusLogs, saveStoredFocusLogs,
  getStoredBadges, saveStoredBadges
} from '@/lib/storage';
import { INITIAL_GOALS, INITIAL_DAILY_PLAN, INITIAL_USER_PROFILE, INITIAL_FRIENDS, DEFAULT_BADGES } from '@/lib/constants';
import { sounds } from '@/lib/sounds';

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
  addPriorityTask: (title: string, goalId?: string, estimatedMinutes?: number) => void;
  deletePriorityTask: (taskId: string) => void;
  updateMorningPlan: (data: { targetFocusMinutes: number; tasks: { title: string; goalId?: string; estimatedMinutes?: number }[]; gratitudeNote?: string }) => void;
  updateEveningReflection: (reflection: string) => void;

  // Focus Sessions
  recordFocusSession: (data: { durationMinutes: number; goalId?: string; taskTitle: string; notes?: string }) => void;

  // Social Accountability
  sendCheer: (friendId: string, emoji: string, label: string) => void;
  addNewFriend: (data: { name: string; avatarId: string; tagline: string; todayGoalTitle: string }) => void;

  // Profile & Gamification
  gainXP: (amount: number, reason?: string) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  toggleSound: () => void;
  toggleAntiCheat: () => void;
  triggerCelebration: () => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(INITIAL_DAILY_PLAN);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [friends, setFriends] = useState<FriendBuddy[]>(INITIAL_FRIENDS);
  const [focusLogs, setFocusLogs] = useState<FocusSessionLog[]>([]);
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);

  // Anti-cheat state tracking
  const [lastMilestoneCompletedTime, setLastMilestoneCompletedTime] = useState<number | null>(null);
  const [antiCheatModalTarget, setAntiCheatModalTarget] = useState<{ goalId: string; milestone: MilestoneItem } | null>(null);

  // Initial client hydration from LocalStorage
  useEffect(() => {
    setGoals(getStoredGoals());
    setDailyPlan(getStoredDailyPlan());
    const storedProf = getStoredProfile();
    setProfile(storedProf);
    sounds.setMuted(!storedProf.soundEnabled);
    setFriends(getStoredFriends());
    setFocusLogs(getStoredFocusLogs());
    setBadges(getStoredBadges());
    setIsLoaded(true);
  }, []);

  // Save changes
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

  const triggerCelebration = useCallback(() => {
    sounds.playMilestoneFanfare();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#34D399', '#F472B6', '#FBBF24', '#60A5FA', '#A78BFA'],
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const gainXP = useCallback((amount: number) => {
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
      };
    });
  }, []);

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
    gainXP(30);
    sounds.playTaskPop();
  }, [gainXP]);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    sounds.playTap();
  }, []);

  // Anti-Cheat Check
  const requestCompleteMilestone = useCallback((goalId: string, milestone: MilestoneItem): { requiresVerification: boolean; reason?: string } => {
    if (!profile.antiCheatEnabled) {
      // If anti-cheat is disabled, allow direct check
      confirmCompleteMilestone({ goalId, milestoneId: milestone.id });
      return { requiresVerification: false };
    }

    const now = Date.now();
    const cooldownMs = (profile.pacingCooldownSeconds || 45) * 1000;

    // Check rapid clicking cooldown
    if (lastMilestoneCompletedTime && now - lastMilestoneCompletedTime < cooldownMs) {
      const remainingSecs = Math.ceil((cooldownMs - (now - lastMilestoneCompletedTime)) / 1000);
      sounds.playWarning();
      setAntiCheatModalTarget({ goalId, milestone });
      return {
        requiresVerification: true,
        reason: `Pacing Guard Active! You just completed a milestone recently. Wait ${remainingSecs}s or write your proof of work / key takeaway note.`
      };
    }

    // By default open verification modal to log reflection/proof
    setAntiCheatModalTarget({ goalId, milestone });
    return { requiresVerification: true };
  }, [profile.antiCheatEnabled, profile.pacingCooldownSeconds, lastMilestoneCompletedTime]);

  const confirmCompleteMilestone = useCallback((payload: MilestoneCompletionPayload) => {
    const nowStr = new Date().toISOString();
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

    // Reward XP
    gainXP(100);
    setAntiCheatModalTarget(null);

    if (wasGoalFinished) {
      triggerCelebration();
    } else {
      sounds.playMilestoneFanfare();
    }
  }, [gainXP, triggerCelebration]);

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

  // Priority Tasks & Rituals
  const togglePriorityTask = useCallback((taskId: string) => {
    setDailyPlan(prev => {
      const updated = prev.priorityTasks.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            sounds.playTaskPop();
            gainXP(t.xpValue || 50);
          } else {
            sounds.playTap();
          }
          return {
            ...t,
            completed: nextState,
            completedAt: nextState ? new Date().toISOString() : undefined,
          };
        }
        return t;
      });
      return { ...prev, priorityTasks: updated };
    });
  }, [gainXP]);

  const addPriorityTask = useCallback((title: string, goalId?: string, estimatedMinutes?: number) => {
    if (!title.trim()) return;
    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      completed: false,
      goalId,
      estimatedMinutes: estimatedMinutes || 30,
      xpValue: 40,
    };
    setDailyPlan(prev => ({
      ...prev,
      priorityTasks: [...prev.priorityTasks, newTask],
    }));
    sounds.playTap();
  }, []);

  const deletePriorityTask = useCallback((taskId: string) => {
    setDailyPlan(prev => ({
      ...prev,
      priorityTasks: prev.priorityTasks.filter(t => t.id !== taskId),
    }));
    sounds.playTap();
  }, []);

  const updateMorningPlan = useCallback((data: {
    targetFocusMinutes: number;
    tasks: { title: string; goalId?: string; estimatedMinutes?: number }[];
    gratitudeNote?: string;
  }) => {
    const formattedTasks = data.tasks.map((t, idx) => ({
      id: `task-morning-${Date.now()}-${idx}`,
      title: t.title,
      completed: false,
      goalId: t.goalId,
      estimatedMinutes: t.estimatedMinutes || 30,
      xpValue: 50,
    }));

    setDailyPlan(prev => ({
      ...prev,
      targetFocusMinutes: data.targetFocusMinutes,
      priorityTasks: formattedTasks,
      gratitudeNote: data.gratitudeNote || prev.gratitudeNote,
      morningCompleted: true,
    }));

    gainXP(60);
    sounds.playTaskPop();
  }, [gainXP]);

  const updateEveningReflection = useCallback((reflection: string) => {
    setDailyPlan(prev => ({
      ...prev,
      eveningReflection: reflection,
      eveningCompleted: true,
    }));
    gainXP(80);
    triggerCelebration();
  }, [gainXP, triggerCelebration]);

  // Focus Log
  const recordFocusSession = useCallback((data: {
    durationMinutes: number;
    goalId?: string;
    taskTitle: string;
    notes?: string;
  }) => {
    const xp = Math.round(data.durationMinutes * 2);
    const newLog: FocusSessionLog = {
      id: `flog-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      durationMinutes: data.durationMinutes,
      goalId: data.goalId,
      taskTitle: data.taskTitle,
      notes: data.notes,
      timestamp: new Date().toISOString(),
      xpEarned: xp,
    };

    setFocusLogs(prev => [newLog, ...prev]);
    gainXP(xp);
    sounds.playTimerFinish();
  }, [gainXP]);

  // Social Cheers
  const sendCheer = useCallback((friendId: string, emoji: string, label: string) => {
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
    gainXP(15);
  }, [profile.name, profile.avatarId, gainXP]);

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

  // Theme synchronizer with html.dark
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (profile.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }
  }, [profile.theme]);

  const toggleTheme = useCallback(() => {
    setProfile(prev => {
      const nextTheme: 'light' | 'dark' = prev.theme === 'dark' ? 'light' : 'dark';
      return { ...prev, theme: nextTheme };
    });
    sounds.playTap();
  }, []);

  const toggleSound = useCallback(() => {
    setProfile(prev => {
      const nextVal = !prev.soundEnabled;
      sounds.setMuted(!nextVal);
      return { ...prev, soundEnabled: nextVal };
    });
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
    saveStoredGoals(INITIAL_GOALS);
    saveStoredDailyPlan(INITIAL_DAILY_PLAN);
    saveStoredProfile(INITIAL_USER_PROFILE);
    saveStoredFriends(INITIAL_FRIENDS);
    saveStoredFocusLogs([]);
    saveStoredBadges(DEFAULT_BADGES);
    sounds.playTap();
  }, []);

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
        addNewFriend,
        gainXP,
        toggleTheme,
        isDarkMode: profile.theme === 'dark',
        toggleSound,
        toggleAntiCheat,
        triggerCelebration,
        resetAllDemoData,
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

import { Goal, DailyPlan, UserProfile, FriendBuddy, FocusSessionLog, Badge, DailyProgress, XPReward } from '@/types';
import { INITIAL_GOALS, INITIAL_DAILY_PLAN, INITIAL_USER_PROFILE, INITIAL_FRIENDS, DEFAULT_BADGES } from './constants';
import { getLocalDateString } from './dateUtils';

const STORAGE_KEYS = {
  GOALS: 'pathly_goals_v2',
  DAILY_PLAN: 'pathly_daily_plan_v2',
  USER_PROFILE: 'pathly_profile_v2',
  FRIENDS: 'pathly_friends_v2',
  FOCUS_LOGS: 'pathly_focus_logs_v2',
  BADGES: 'pathly_badges_v2',
  DAILY_PROGRESS: 'pathly_daily_progress_v2',
  XP_REWARDS: 'pathly_xp_rewards_v2',
  LAST_ANTI_CHEAT: 'pathly_anticheat_timestamp_v2',
};

export const getStoredGoals = (): Goal[] => {
  if (typeof window === 'undefined') return INITIAL_GOALS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.GOALS);
    return item ? JSON.parse(item) : INITIAL_GOALS;
  } catch {
    return INITIAL_GOALS;
  }
};

export const saveStoredGoals = (goals: Goal[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
};

export const getStoredDailyPlan = (): DailyPlan => {
  const today = getLocalDateString();
  if (typeof window === 'undefined') return INITIAL_DAILY_PLAN;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.DAILY_PLAN);
    if (!item) return INITIAL_DAILY_PLAN;
    const parsed: DailyPlan = JSON.parse(item);
    // If stored plan is from a previous day, roll over tasks or start fresh morning
    if (parsed.date !== today) {
      return {
        date: today,
        targetFocusMinutes: parsed.targetFocusMinutes || 120,
        priorityTasks: parsed.priorityTasks
          .filter(t => !t.completed) // carry over unfinished tasks
          .slice(0, 3),
        morningCompleted: false,
        eveningCompleted: false,
        createdAt: new Date().toISOString(),
      };
    }
    return parsed;
  } catch {
    return INITIAL_DAILY_PLAN;
  }
};

export const saveStoredDailyPlan = (plan: DailyPlan) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Failed to save daily plan', e);
  }
};

export const getStoredProfile = (): UserProfile => {
  if (typeof window === 'undefined') return INITIAL_USER_PROFILE;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return item ? JSON.parse(item) : INITIAL_USER_PROFILE;
  } catch {
    return INITIAL_USER_PROFILE;
  }
};

export const saveStoredProfile = (profile: UserProfile) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
};

export const getStoredFriends = (): FriendBuddy[] => {
  if (typeof window === 'undefined') return INITIAL_FRIENDS;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.FRIENDS);
    return item ? JSON.parse(item) : INITIAL_FRIENDS;
  } catch {
    return INITIAL_FRIENDS;
  }
};

export const saveStoredFriends = (friends: FriendBuddy[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  } catch (e) {
    console.error('Failed to save friends', e);
  }
};

export const getStoredFocusLogs = (): FocusSessionLog[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(STORAGE_KEYS.FOCUS_LOGS);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

export const saveStoredFocusLogs = (logs: FocusSessionLog[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.FOCUS_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save focus logs', e);
  }
};

export const getStoredBadges = (): Badge[] => {
  if (typeof window === 'undefined') return DEFAULT_BADGES;
  try {
    const item = localStorage.getItem(STORAGE_KEYS.BADGES);
    return item ? JSON.parse(item) : DEFAULT_BADGES;
  } catch {
    return DEFAULT_BADGES;
  }
};

export const saveStoredBadges = (badges: Badge[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  } catch (e) {
    console.error('Failed to save badges', e);
  }
};

export const getStoredDailyProgress = (): DailyProgress[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

export const saveStoredDailyProgress = (progress: DailyProgress[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save daily progress', e);
  }
};

export const getInitializedDailyProgress = (): DailyProgress[] => {
  if (typeof window === 'undefined') return [];
  const today = getLocalDateString();
  let progress = getStoredDailyProgress();
  const logs = getStoredFocusLogs();
  const plan = getStoredDailyPlan();

  // If no progress records but focus logs exist, backfill
  if (progress.length === 0 && logs.length > 0) {
    const grouped = new Map<string, { focusMinutes: number; xp: number }>();
    logs.forEach(l => {
      const d = l.date || today;
      const cur = grouped.get(d) || { focusMinutes: 0, xp: 0 };
      cur.focusMinutes += l.durationMinutes || 0;
      cur.xp += l.xpEarned || 0;
      grouped.set(d, cur);
    });

    const migrated: DailyProgress[] = [];
    grouped.forEach((val, dateKey) => {
      const isTodayDate = dateKey === today;
      migrated.push({
        date: dateKey,
        focusMinutes: val.focusMinutes,
        tasksCompleted: isTodayDate ? plan.priorityTasks.filter(t => t.completed).length : 0,
        totalTasks: isTodayDate ? plan.priorityTasks.length : 0,
        milestonesCompleted: 0,
        xpEarned: val.xp,
        updatedAt: new Date().toISOString(),
      });
    });
    progress = migrated;
    saveStoredDailyProgress(migrated);
  }

  // Ensure today's entry is initialized
  const todayIndex = progress.findIndex(p => p.date === today);
  const todayFocus = logs.filter(l => l.date === today).reduce((acc, l) => acc + l.durationMinutes, 0);
  const todayTasksCompleted = plan.priorityTasks.filter(t => t.completed).length;
  const todayTotalTasks = plan.priorityTasks.length;

  if (todayIndex >= 0) {
    progress[todayIndex] = {
      ...progress[todayIndex],
      focusMinutes: Math.max(progress[todayIndex].focusMinutes, todayFocus),
      tasksCompleted: todayTasksCompleted,
      totalTasks: todayTotalTasks,
    };
  } else {
    progress = [
      {
        date: today,
        focusMinutes: todayFocus,
        tasksCompleted: todayTasksCompleted,
        totalTasks: todayTotalTasks,
        milestonesCompleted: 0,
        xpEarned: 0,
        updatedAt: new Date().toISOString(),
      },
      ...progress,
    ];
  }
  saveStoredDailyProgress(progress);
  return progress;
};

export const getStoredXPRewards = (): XPReward[] => {
  if (typeof window === 'undefined') return [];
  try {
    const item = localStorage.getItem(STORAGE_KEYS.XP_REWARDS);
    return item ? JSON.parse(item) : [];
  } catch {
    return [];
  }
};

export const saveStoredXPRewards = (rewards: XPReward[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.XP_REWARDS, JSON.stringify(rewards));
  } catch (e) {
    console.error('Failed to save XP rewards', e);
  }
};

export const getInitializedXPRewards = (): XPReward[] => {
  if (typeof window === 'undefined') return [];
  const today = getLocalDateString();
  let rewards = getStoredXPRewards();
  const plan = getStoredDailyPlan();
  const goals = getStoredGoals();

  if (rewards.length === 0) {
    const initialLedger: XPReward[] = [];
    plan.priorityTasks.forEach(t => {
      if (t.completed) {
        initialLedger.push({
          id: `xp-task-${t.id}`,
          sourceType: 'task',
          sourceId: t.id,
          amount: t.xpValue || 50,
          date: plan.date || today,
          timestamp: t.completedAt || new Date().toISOString(),
          description: t.title,
        });
      }
    });
    goals.forEach(g => {
      g.milestones.forEach(m => {
        if (m.isCompleted && !m.wasInitialOffset) {
          initialLedger.push({
            id: `xp-milestone-${m.id}`,
            sourceType: 'milestone',
            sourceId: m.id,
            amount: 100,
            date: m.completedAt ? m.completedAt.split('T')[0] : today,
            timestamp: m.completedAt || new Date().toISOString(),
            description: m.title,
          });
        }
      });
    });
    rewards = initialLedger;
    saveStoredXPRewards(initialLedger);
  }
  return rewards;
};


export const exportAllDataJSON = () => {
  const data = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    goals: getStoredGoals(),
    dailyPlan: getStoredDailyPlan(),
    profile: getStoredProfile(),
    friends: getStoredFriends(),
    focusLogs: getStoredFocusLogs(),
    badges: getStoredBadges(),
    dailyProgress: getStoredDailyProgress(),
    xpRewards: getStoredXPRewards(),
  };
  return JSON.stringify(data, null, 2);
};

export const importAllDataJSON = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.goals) saveStoredGoals(data.goals);
    if (data.dailyPlan) saveStoredDailyPlan(data.dailyPlan);
    if (data.profile) saveStoredProfile(data.profile);
    if (data.friends) saveStoredFriends(data.friends);
    if (data.focusLogs) saveStoredFocusLogs(data.focusLogs);
    if (data.badges) saveStoredBadges(data.badges);
    if (data.dailyProgress) saveStoredDailyProgress(data.dailyProgress);
    if (data.xpRewards) saveStoredXPRewards(data.xpRewards);
    return true;
  } catch {
    return false;
  }
};


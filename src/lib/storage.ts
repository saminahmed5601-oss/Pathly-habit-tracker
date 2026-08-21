import { Goal, DailyPlan, UserProfile, FriendBuddy, FocusSessionLog, Badge } from '@/types';
import { INITIAL_GOALS, INITIAL_DAILY_PLAN, INITIAL_USER_PROFILE, INITIAL_FRIENDS, DEFAULT_BADGES } from './constants';

const STORAGE_KEYS = {
  GOALS: 'bloomtrack_goals_v1',
  DAILY_PLAN: 'bloomtrack_daily_plan_v1',
  USER_PROFILE: 'bloomtrack_profile_v1',
  FRIENDS: 'bloomtrack_friends_v1',
  FOCUS_LOGS: 'bloomtrack_focus_logs_v1',
  BADGES: 'bloomtrack_badges_v1',
  LAST_ANTI_CHEAT: 'bloomtrack_anticheat_timestamp',
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
  const today = new Date().toISOString().split('T')[0];
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

export const exportAllDataJSON = () => {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    goals: getStoredGoals(),
    dailyPlan: getStoredDailyPlan(),
    profile: getStoredProfile(),
    friends: getStoredFriends(),
    focusLogs: getStoredFocusLogs(),
    badges: getStoredBadges(),
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
    return true;
  } catch {
    return false;
  }
};

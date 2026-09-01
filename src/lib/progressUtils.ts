import { DailyProgress } from '@/types';
import { getLocalDateString, parseLocalDateString } from './dateUtils';

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 (Sun) to 6 (Sat)
  month: number; // 0-11
  isFuture: boolean;
  isToday: boolean;
  progress?: DailyProgress;
  intensity: 0 | 1 | 2 | 3 | 4;
}

export interface HeatmapWeek {
  weekIndex: number;
  days: HeatmapDay[];
}

export interface MonthLabel {
  monthName: string;
  colIndex: number;
}

export interface HeatmapCalendarData {
  weeks: HeatmapWeek[];
  monthLabels: MonthLabel[];
  totalDays: number;
}

export interface ProgressSummaryStats {
  currentStreak: number;
  bestStreak: number;
  totalFocusMinutes: number;
  focusThisWeek: number;
  focusThisMonth: number;
  totalXPEarned: number;
  averageDailyFocus: number;
  totalTasksCompleted: number;
  totalMilestonesCompleted: number;
  activeDaysCount: number;
}

export interface DayBarData {
  dayName: string; // "Mon", "Tue", etc.
  fullDate: string; // "YYYY-MM-DD"
  focusMinutes: number;
  tasksCompleted: number;
  targetMinutes: number;
  percentOfTarget: number;
  isToday: boolean;
  xpEarned: number;
}

export interface ProductivityInsights {
  bestDayOfWeek: string;
  bestDayMinutesAvg: number;
  taskCompletionRate: number; // percentage (e.g. 85%)
  totalSessionsEstimate: number;
  streakShieldsCount: number;
}

/**
 * Maps focus minutes to activity heatmap intensity level 0-4.
 */
export function getFocusIntensityLevel(focusMinutes?: number): 0 | 1 | 2 | 3 | 4 {
  const mins = focusMinutes || 0;
  if (mins <= 0) return 0;
  if (mins < 30) return 1;
  if (mins < 60) return 2;
  if (mins < 120) return 3;
  return 4;
}

/**
 * Generates the full 365-day (~52 weeks) GitHub-style grid data.
 */
export function generateHeatmapCalendar(
  progressMap: Map<string, DailyProgress>
): HeatmapCalendarData {
  const today = new Date();
  const todayStr = getLocalDateString(today);

  const currentDayOfWeek = today.getDay();
  const daysToEndOfWeek = 6 - currentDayOfWeek;

  const endDate = new Date(today);
  endDate.setDate(today.getDate() + daysToEndOfWeek);

  const totalWeeks = 53;
  const totalDays = totalWeeks * 7;

  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalDays + 1);

  const weeks: HeatmapWeek[] = [];
  const monthLabels: MonthLabel[] = [];
  let lastLabeledMonth = -1;

  const cursor = new Date(startDate);
  let currentWeekDays: HeatmapDay[] = [];
  let weekIndex = 0;

  for (let i = 0; i < totalDays; i++) {
    const dateStr = getLocalDateString(cursor);
    const dayOfWeek = cursor.getDay();
    const month = cursor.getMonth();
    const isFuture = dateStr > todayStr;
    const isToday = dateStr === todayStr;
    const dayProgress = progressMap.get(dateStr);
    const intensity = isFuture ? 0 : getFocusIntensityLevel(dayProgress?.focusMinutes);

    currentWeekDays.push({
      date: dateStr,
      dayOfWeek,
      month,
      isFuture,
      isToday,
      progress: dayProgress,
      intensity,
    });

    if (dayOfWeek === 0 && month !== lastLabeledMonth && !isFuture) {
      const monthName = cursor.toLocaleDateString('en-US', { month: 'short' });
      monthLabels.push({
        monthName,
        colIndex: weekIndex,
      });
      lastLabeledMonth = month;
    }

    if (dayOfWeek === 6 || i === totalDays - 1) {
      weeks.push({
        weekIndex,
        days: currentWeekDays,
      });
      currentWeekDays = [];
      weekIndex++;
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    weeks,
    monthLabels,
    totalDays,
  };
}

/**
 * Returns past 7 days of focus data for the visual bar chart.
 */
export function getPast7DaysProgress(
  history: DailyProgress[],
  defaultTargetMinutes: number = 120
): DayBarData[] {
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const map = new Map<string, DailyProgress>();
  history.forEach(d => map.set(d.date, d));

  const result: DayBarData[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayData = map.get(dateStr);

    const focusMinutes = dayData?.focusMinutes || 0;
    const tasksCompleted = dayData?.tasksCompleted || 0;
    const target = defaultTargetMinutes || 120;
    const percentOfTarget = Math.min(100, Math.round((focusMinutes / target) * 100));

    result.push({
      dayName,
      fullDate: dateStr,
      focusMinutes,
      tasksCompleted,
      targetMinutes: target,
      percentOfTarget,
      isToday: dateStr === todayStr,
      xpEarned: dayData?.xpEarned || 0,
    });
  }

  return result;
}

/**
 * Calculates advanced productivity insights.
 */
export function getProductivityInsights(
  history: DailyProgress[],
  streakShields: number = 0
): ProductivityInsights {
  const weekdayMinutes = new Map<number, number[]>(); // 0-6 -> [minutes]

  let totalTasksDone = 0;
  let totalTasksOverall = 0;

  history.forEach(d => {
    const parsed = parseLocalDateString(d.date);
    const dayOfWeek = parsed.getDay();
    const current = weekdayMinutes.get(dayOfWeek) || [];
    current.push(d.focusMinutes || 0);
    weekdayMinutes.set(dayOfWeek, current);

    totalTasksDone += d.tasksCompleted || 0;
    totalTasksOverall += d.totalTasks || 0;
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let bestDayIndex = 1; // Default to Monday
  let maxAvg = 0;

  weekdayMinutes.forEach((minsArr, dayIdx) => {
    if (minsArr.length > 0) {
      const avg = minsArr.reduce((a, b) => a + b, 0) / minsArr.length;
      if (avg > maxAvg) {
        maxAvg = avg;
        bestDayIndex = dayIdx;
      }
    }
  });

  const completionRate = totalTasksOverall > 0 
    ? Math.round((totalTasksDone / totalTasksOverall) * 100) 
    : 100;

  const totalSessionsEstimate = history.reduce((acc, d) => acc + (d.focusMinutes > 0 ? Math.ceil(d.focusMinutes / 25) : 0), 0);

  return {
    bestDayOfWeek: dayNames[bestDayIndex] || 'Monday',
    bestDayMinutesAvg: Math.round(maxAvg),
    taskCompletionRate: completionRate,
    totalSessionsEstimate,
    streakShieldsCount: streakShields,
  };
}

/**
 * Calculates summary statistics based on daily history and user profile.
 */
export function calculateProgressSummary(
  history: DailyProgress[],
  profileStreak: number = 0,
  profileBestStreak: number = 0,
  profileXP: number = 0
): ProgressSummaryStats {
  const today = new Date();
  const todayStr = getLocalDateString(today);
  const currentYearMonth = todayStr.slice(0, 7);

  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  startOfWeek.setDate(today.getDate() - dayOfWeek);
  const startOfWeekStr = getLocalDateString(startOfWeek);

  let totalFocusMinutes = 0;
  let focusThisWeek = 0;
  let focusThisMonth = 0;
  let totalTasksCompleted = 0;
  let totalMilestonesCompleted = 0;
  let historyXPTotal = 0;
  let activeDaysCount = 0;

  history.forEach((day) => {
    const mins = day.focusMinutes || 0;
    const tasks = day.tasksCompleted || 0;
    const ms = day.milestonesCompleted || 0;
    const xp = day.xpEarned || 0;

    totalFocusMinutes += mins;
    totalTasksCompleted += tasks;
    totalMilestonesCompleted += ms;
    historyXPTotal += xp;

    if (mins > 0 || tasks > 0 || ms > 0 || xp > 0) {
      activeDaysCount++;
    }

    if (day.date >= startOfWeekStr && day.date <= todayStr) {
      focusThisWeek += mins;
    }

    if (day.date.startsWith(currentYearMonth)) {
      focusThisMonth += mins;
    }
  });

  const last30DaysFocus = history
    .filter((d) => {
      const parsed = parseLocalDateString(d.date);
      const diffDays = Math.floor((today.getTime() - parsed.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays < 30;
    })
    .reduce((acc, d) => acc + (d.focusMinutes || 0), 0);

  const averageDailyFocus = Math.round(last30DaysFocus / 30);
  const totalXPEarned = Math.max(profileXP, historyXPTotal);

  return {
    currentStreak: profileStreak,
    bestStreak: Math.max(profileBestStreak, profileStreak),
    totalFocusMinutes,
    focusThisWeek,
    focusThisMonth,
    totalXPEarned,
    averageDailyFocus,
    totalTasksCompleted,
    totalMilestonesCompleted,
    activeDaysCount,
  };
}

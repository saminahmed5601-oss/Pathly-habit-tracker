'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivityHeatmap } from './ActivityHeatmap';
import { WeeklyFocusChart } from './WeeklyFocusChart';
import { 
  calculateProgressSummary, 
  getPast7DaysProgress, 
  getProductivityInsights 
} from '@/lib/progressUtils';
import { formatMinutes, formatDateDisplay, formatFullDateDisplay, isToday, isYesterday, getLocalDateString } from '@/lib/dateUtils';
import { 
  Flame, 
  Clock, 
  Calendar, 
  Trophy, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Coins, 
  ShieldCheck, 
  Zap, 
  Compass
} from 'lucide-react';

interface ProgressViewProps {
  onOpenShareCard?: () => void;
}

export function ProgressView({ onOpenShareCard }: ProgressViewProps) {
  const { dailyProgress, profile, focusLogs, xpRewards, goals } = useApp();
  
  const todayStr = getLocalDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [showXPLedger, setShowXPLedger] = useState<boolean>(false);
  const [activeVisualTab, setActiveVisualTab] = useState<'both' | 'weekly' | 'heatmap'>('both');

  // Compute summary statistics
  const summary = useMemo(() => {
    return calculateProgressSummary(
      dailyProgress,
      profile.streakDays,
      profile.bestStreak,
      profile.currentXP
    );
  }, [dailyProgress, profile.streakDays, profile.bestStreak, profile.currentXP]);

  // Compute 7-day bar chart data
  const weeklyData = useMemo(() => {
    return getPast7DaysProgress(dailyProgress, 120);
  }, [dailyProgress]);

  // Compute productivity insights
  const insights = useMemo(() => {
    return getProductivityInsights(dailyProgress, profile.streakShields || 0);
  }, [dailyProgress, profile.streakShields]);

  // Sort daily progress descending by date (most recent first)
  const sortedHistory = useMemo(() => {
    return [...dailyProgress].sort((a, b) => b.date.localeCompare(a.date));
  }, [dailyProgress]);

  // Get selected day record and associated focus logs & XP rewards
  const selectedDayProgress = useMemo(() => {
    return dailyProgress.find((d) => d.date === selectedDate);
  }, [dailyProgress, selectedDate]);

  const selectedDayFocusLogs = useMemo(() => {
    return focusLogs.filter((l) => l.date === selectedDate);
  }, [focusLogs, selectedDate]);

  const selectedDayXPRewards = useMemo(() => {
    return xpRewards.filter((r) => r.date === selectedDate);
  }, [xpRewards, selectedDate]);

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'milestone':
        return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
      case 'focus_session':
        return <Clock className="w-3.5 h-3.5 text-blue-500" />;
      case 'morning_kickoff':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'evening_reflection':
        return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      case 'cheer':
        return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
      case 'goal_created':
        return <Trophy className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <Coins className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">
              Your Momentum
            </h1>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-text)] border border-[var(--primary)]/20">
              Activity &amp; Growth
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
            Celebrate daily consistency, weekly focus flow, and milestone achievements
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenShareCard && (
            <button
              onClick={onOpenShareCard}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-bold text-xs shadow-xs transition-all w-full sm:w-auto cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Daily Card</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary Stat Cards (6 Cards Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
        
        {/* Streak */}
        <div className="clean-card p-3.5 sm:p-4 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/70 dark:border-white/[0.08] relative overflow-hidden group hover:border-orange-500/50 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Streak
            </span>
            <div className="p-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-orange-500 animate-flame" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1.5 flex items-baseline gap-1">
            <span>{summary.currentStreak}</span>
            <span className="text-xs font-bold text-stone-400">days</span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1 font-semibold">
            <span>Best:</span>
            <strong className="text-orange-600 dark:text-orange-400">{summary.bestStreak}d</strong>
          </p>
        </div>

        {/* Total Focus */}
        <div className="clean-card p-3.5 sm:p-4 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/70 dark:border-white/[0.08] relative overflow-hidden group hover:border-teal-500/50 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Total Focus
            </span>
            <div className="p-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-2xs">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1.5 flex items-baseline gap-1">
            <span>{formatMinutes(summary.totalFocusMinutes)}</span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold">
            {summary.activeDaysCount} active days
          </p>
        </div>

        {/* This Week */}
        <div className="clean-card p-3.5 sm:p-4 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/70 dark:border-white/[0.08] relative overflow-hidden group hover:border-emerald-500/50 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              This Week
            </span>
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-700 dark:text-emerald-300 mt-1.5 flex items-baseline gap-1">
            <span>{formatMinutes(summary.focusThisWeek)}</span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold">
            Since Sunday
          </p>
        </div>

        {/* This Month */}
        <div className="clean-card p-3.5 sm:p-4 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/70 dark:border-white/[0.08] relative overflow-hidden group hover:border-indigo-500/50 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              This Month
            </span>
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-2xs">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-indigo-700 dark:text-indigo-300 mt-1.5 flex items-baseline gap-1">
            <span>{formatMinutes(summary.focusThisMonth)}</span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold">
            Current calendar
          </p>
        </div>

        {/* Total XP */}
        <div className="clean-card p-3.5 sm:p-4 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/70 dark:border-white/[0.08] relative overflow-hidden group hover:border-amber-500/50 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Total XP
            </span>
            <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1.5 flex items-baseline gap-1">
            <span>{summary.totalXPEarned}</span>
            <span className="text-xs font-bold text-stone-400">XP</span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold">
            Lv. {profile.level} Explorer
          </p>
        </div>

        {/* Daily Average */}
        <div className="clean-card p-3.5 sm:p-4 bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/70 dark:border-white/[0.08] relative overflow-hidden group hover:border-purple-500/50 shadow-sm transition-all hover:-translate-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Daily Avg
            </span>
            <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-2xs">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1.5 flex items-baseline gap-1">
            <span>{summary.averageDailyFocus}</span>
            <span className="text-xs font-bold text-stone-400">m/d</span>
          </div>
          <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold">
            Past 30d pace
          </p>
        </div>

      </div>

      {/* Visual Analytics Selector & Productivity Insights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Toggle Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs font-bold w-fit">
          <button
            onClick={() => setActiveVisualTab('both')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeVisualTab === 'both'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            All Visuals
          </button>
          <button
            onClick={() => setActiveVisualTab('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeVisualTab === 'weekly'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            7-Day Chart
          </button>
          <button
            onClick={() => setActiveVisualTab('heatmap')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeVisualTab === 'heatmap'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            Habit Calendar
          </button>
        </div>

        {/* Productivity Highlights Pill */}
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>Peak Day: <strong className="text-[var(--text-main)]">{insights.bestDayOfWeek}</strong></span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completion: <strong className="text-emerald-600 dark:text-emerald-400">{insights.taskCompletionRate}%</strong></span>
          </span>
        </div>
      </div>

      {/* 1. Weekly 7-Day Bar Chart */}
      {(activeVisualTab === 'both' || activeVisualTab === 'weekly') && (
        <WeeklyFocusChart
          data={weeklyData}
          selectedDate={selectedDate}
          onSelectDate={(d) => setSelectedDate(d)}
        />
      )}

      {/* 2. 365-Day GitHub-Style Activity Heatmap */}
      {(activeVisualTab === 'both' || activeVisualTab === 'heatmap') && (
        <ActivityHeatmap
          history={dailyProgress}
          selectedDate={selectedDate}
          onSelectDate={(dateStr) => setSelectedDate(dateStr)}
        />
      )}

      {/* Day Inspector Card */}
      <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--primary-light)] text-[var(--primary-text)] font-black text-sm sm:text-base shrink-0">
              {isToday(selectedDate) ? '📅 Today' : isYesterday(selectedDate) ? '⏮️ Yesterday' : '🗓️'}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[var(--text-main)]">
                {formatFullDateDisplay(selectedDate)}
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                Detailed breakdown of your focus sessions and achievements on this day
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedDate(todayStr)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              selectedDate === todayStr
                ? 'bg-[var(--primary)] text-white shadow-xs'
                : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)]'
            }`}
          >
            Jump to Today
          </button>
        </div>

        {/* Selected Day Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[var(--border)]">
          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-center">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Focus Minutes</span>
            <div className="text-base sm:text-xl font-black text-[var(--text-main)] mt-0.5">
              {selectedDayProgress?.focusMinutes || 0} <span className="text-xs font-normal text-[var(--text-muted)]">mins</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-center">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Missions Done</span>
            <div className="text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {selectedDayProgress?.tasksCompleted || 0} <span className="text-xs font-normal text-[var(--text-muted)]">/ {selectedDayProgress?.totalTasks || 0}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-center">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">Milestones</span>
            <div className="text-base sm:text-xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {selectedDayProgress?.milestonesCompleted || 0} <span className="text-xs font-normal text-[var(--text-muted)]">completed</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-center">
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">XP Gained</span>
            <div className="text-base sm:text-xl font-black text-amber-500 mt-0.5">
              +{selectedDayProgress?.xpEarned || 0} <span className="text-xs font-normal text-[var(--text-muted)]">XP</span>
            </div>
          </div>
        </div>

        {/* Selected Day Focus Sessions List */}
        <div className="pt-4 space-y-3">
          <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Focus Sessions on this date ({selectedDayFocusLogs.length})</span>
          </h4>

          {selectedDayFocusLogs.length === 0 ? (
            <div className="py-6 text-center text-xs text-[var(--text-muted)] rounded-xl bg-[var(--bg-card-subtle)]/50 border border-dashed border-[var(--border)]">
              No individual focus timer sessions recorded on this date.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedDayFocusLogs.map((log) => {
                const associatedGoal = goals.find(g => g.id === log.goalId);
                return (
                  <div 
                    key={log.id} 
                    className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm font-bold shrink-0">
                        {associatedGoal?.icon || '⚡'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[var(--text-main)] truncate">
                          {log.taskTitle}
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate">
                          {associatedGoal ? associatedGoal.title : 'Deep Focus Session'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-blue-600 dark:text-blue-400">
                        {log.durationMinutes}m
                      </div>
                      <div className="text-[10px] font-bold text-amber-500">
                        +{log.xpEarned} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Day XP Rewards Audit */}
        {selectedDayXPRewards.length > 0 && (
          <div className="pt-4 space-y-2 border-t border-[var(--border)] mt-4">
            <h4 className="text-xs font-bold text-[var(--text-main)] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>XP Reward Transactions ({selectedDayXPRewards.length})</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedDayXPRewards.map((reward) => (
                <div 
                  key={reward.id}
                  className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)]/70 border border-[var(--border)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {getSourceIcon(reward.sourceType)}
                    <span className="text-[11px] font-semibold text-[var(--text-main)] truncate">
                      {reward.description}
                    </span>
                  </div>
                  <span className="font-bold text-amber-500 text-xs shrink-0 ml-2">
                    +{reward.amount} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Recent History Timeline List */}
      <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                Recent Daily Activity
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
                Chronological log of past days you performed work
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[var(--text-muted)]">
            {sortedHistory.length} Total Records
          </span>
        </div>

        <div className="space-y-2.5">
          {sortedHistory.slice(0, 10).map((record) => {
            const isRecToday = isToday(record.date);
            const isRecYesterday = isYesterday(record.date);
            const isSelected = selectedDate === record.date;

            return (
              <button
                key={record.date}
                type="button"
                onClick={() => setSelectedDate(record.date)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                  isSelected
                    ? 'bg-[var(--primary-light)]/40 border-[var(--primary)] shadow-xs'
                    : 'bg-[var(--bg-card-subtle)] border-[var(--border)] hover:border-[var(--primary)]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    record.focusMinutes >= 60
                      ? 'bg-emerald-500 text-white'
                      : record.focusMinutes > 0
                      ? 'bg-teal-500/20 text-teal-700 dark:text-teal-300'
                      : 'bg-slate-200 dark:bg-slate-800 text-[var(--text-muted)]'
                  }`}>
                    {record.focusMinutes > 0 ? `${record.focusMinutes}m` : '0m'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        {formatDateDisplay(record.date)}
                      </span>
                      {isRecToday && (
                        <span className="px-1.5 py-0.2 text-[9px] font-black uppercase rounded bg-[var(--primary)] text-white">
                          Today
                        </span>
                      )}
                      {isRecYesterday && (
                        <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-slate-200 dark:bg-slate-700 text-[var(--text-muted)]">
                          Yesterday
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] mt-0.5 flex items-center gap-3">
                      <span>🎯 {record.tasksCompleted}/{record.totalTasks} missions</span>
                      {record.milestonesCompleted > 0 && (
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          🏆 {record.milestonesCompleted} milestone{record.milestonesCompleted > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                  <span className="text-xs font-black text-amber-500">
                    +{record.xpEarned} XP
                  </span>
                  <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                    {record.focusMinutes > 0 ? `${Math.round(record.focusMinutes / 60 * 10) / 10} hrs` : '0 hrs'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsible XP Reward History Ledger */}
      <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)]">
        <button
          onClick={() => setShowXPLedger(!showXPLedger)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <span>Activity &amp; Reward Log</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Verified History
                </span>
              </h3>
              <p className="text-[10px] sm:text-xs text-[var(--text-muted)]">
                Permanent ledger of all experience points and breakthroughs earned ({xpRewards.length} entries)
              </p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]">
            {showXPLedger ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showXPLedger && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2 max-h-80 overflow-y-auto pr-1">
            {xpRewards.length === 0 ? (
              <div className="text-center py-6 text-xs text-[var(--text-muted)]">
                No XP rewards recorded in ledger yet.
              </div>
            ) : (
              xpRewards.map((reward) => (
                <div
                  key={reward.id}
                  className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0">
                      {getSourceIcon(reward.sourceType)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-[var(--text-main)] truncate text-[11px] sm:text-xs">
                        {reward.description || `Reward: ${reward.sourceType}`}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] flex items-center gap-2">
                        <span>📅 {reward.date}</span>
                        <span>•</span>
                        <span className="uppercase font-semibold tracking-wider text-[9px]">{reward.sourceType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-amber-500 text-xs sm:text-sm shrink-0 ml-3">
                    +{reward.amount} XP
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DailyProgress } from '@/types';
import { formatFullDateDisplay, isToday, isYesterday, getLocalDateString } from '@/lib/dateUtils';
import { sounds } from '@/lib/sounds';
import { useApp } from '@/context/AppContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Layers,
  LayoutGrid,
  Clock,
  CheckCircle2,
  Trophy,
  Flame,
  Moon,
  Sun,
  Compass,
  Flower2,
  TreePine,
  Sprout,
  Orbit,
  Star,
  Zap,
  Heart,
  Leaf
} from 'lucide-react';

interface ActivityHeatmapProps {
  history: DailyProgress[];
  selectedDate?: string;
  onSelectDate: (dateStr: string) => void;
}

const WEEKDAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function ActivityHeatmap({ history, selectedDate: propSelectedDate, onSelectDate }: ActivityHeatmapProps) {
  const { focusLogs, dailyPlan } = useApp();
  const todayStr = getLocalDateString();
  const selectedDate = propSelectedDate || todayStr;

  const [calendarMode, setCalendarMode] = useState<'canopy' | 'orbit'>('canopy');
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  // Month navigation state
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed

  // Fast map lookup for progress data
  const progressMap = useMemo(() => {
    const map = new Map<string, DailyProgress>();
    history.forEach((d) => map.set(d.date, d));
    return map;
  }, [history]);

  // Selected Day's Focus Sessions from focusLogs
  const selectedDayFocusSessions = useMemo(() => {
    return focusLogs.filter((log) => log.date === selectedDate);
  }, [focusLogs, selectedDate]);

  // Selected Day's Progress summary
  const selectedDayProgress = useMemo(() => {
    return progressMap.get(selectedDate);
  }, [progressMap, selectedDate]);

  // Generate matrix for current month
  const monthCalendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Mon = 0, Sun = 6
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isFuture: boolean;
      progress?: DailyProgress;
      stage: 'rest' | 'sprout' | 'flourish' | 'bloom';
      streakConnectedLeft: boolean;
      streakConnectedRight: boolean;
      taskCompletionRatio: number; // 0 to 3
    }[] = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, d);
      const y = prevDate.getFullYear();
      const m = String(prevDate.getMonth() + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      const prog = progressMap.get(dateStr);
      const focusM = prog?.focusMinutes || 0;
      const stage = focusM >= 90 ? 'bloom' : focusM >= 45 ? 'flourish' : focusM > 0 ? 'sprout' : 'rest';
      const tasksDone = Math.min(3, prog?.tasksCompleted || 0);

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isFuture: dateStr > todayStr,
        progress: prog,
        stage,
        streakConnectedLeft: false,
        streakConnectedRight: false,
        taskCompletionRatio: tasksDone,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const y = currentYear;
      const m = String(currentMonth + 1).padStart(2, '0');
      const day = String(d).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      const prog = progressMap.get(dateStr);
      const focusM = prog?.focusMinutes || 0;
      const stage = focusM >= 90 ? 'bloom' : focusM >= 45 ? 'flourish' : focusM > 0 ? 'sprout' : 'rest';
      const tasksDone = Math.min(3, prog?.tasksCompleted || 0);

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isFuture: dateStr > todayStr,
        progress: prog,
        stage,
        streakConnectedLeft: false,
        streakConnectedRight: false,
        taskCompletionRatio: tasksDone,
      });
    }

    // Next month padding days
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let d = 1; d <= remainingDays; d++) {
        const nextDate = new Date(currentYear, currentMonth + 1, d);
        const y = nextDate.getFullYear();
        const m = String(nextDate.getMonth() + 1).padStart(2, '0');
        const day = String(d).padStart(2, '0');
        const dateStr = `${y}-${m}-${day}`;
        const prog = progressMap.get(dateStr);
        const focusM = prog?.focusMinutes || 0;
        const stage = focusM >= 90 ? 'bloom' : focusM >= 45 ? 'flourish' : focusM > 0 ? 'sprout' : 'rest';
        const tasksDone = Math.min(3, prog?.tasksCompleted || 0);

        days.push({
          dateStr,
          dayNumber: d,
          isCurrentMonth: false,
          isFuture: dateStr > todayStr,
          progress: prog,
          stage,
          streakConnectedLeft: false,
          streakConnectedRight: false,
          taskCompletionRatio: tasksDone,
        });
      }
    }

    // Calculate streak threading between adjacent days
    for (let i = 0; i < days.length; i++) {
      const current = days[i];
      const hasCurrentActivity = (current.progress?.focusMinutes || 0) > 0 || (current.progress?.tasksCompleted || 0) > 0;

      if (hasCurrentActivity) {
        if (i % 7 !== 0 && i > 0) {
          const prev = days[i - 1];
          const hasPrev = (prev.progress?.focusMinutes || 0) > 0 || (prev.progress?.tasksCompleted || 0) > 0;
          if (hasPrev) {
            current.streakConnectedLeft = true;
          }
        }
        if (i % 7 !== 6 && i < days.length - 1) {
          const next = days[i + 1];
          const hasNext = (next.progress?.focusMinutes || 0) > 0 || (next.progress?.tasksCompleted || 0) > 0;
          if (hasNext) {
            current.streakConnectedRight = true;
          }
        }
      }
    }

    return days;
  }, [currentYear, currentMonth, progressMap, todayStr]);

  // Last 30 days for Solar Constellation Orbit View
  const last30Days = useMemo(() => {
    const list: {
      dateStr: string;
      dateObj: Date;
      progress?: DailyProgress;
      starMagnitude: number; // 0 to 3
    }[] = [];

    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      const prog = progressMap.get(dateStr);
      const focusM = prog?.focusMinutes || 0;

      let starMagnitude = 0;
      if (focusM >= 90) starMagnitude = 3;
      else if (focusM >= 45) starMagnitude = 2;
      else if (focusM > 0) starMagnitude = 1;

      list.push({
        dateStr,
        dateObj: d,
        progress: prog,
        starMagnitude,
      });
    }
    return list;
  }, [progressMap]);

  // Month Statistics
  const monthStats = useMemo(() => {
    let totalFocusMinutes = 0;
    let totalTasksCompleted = 0;
    let totalXpEarned = 0;
    let flourishingDaysCount = 0;

    monthCalendarDays.forEach((day) => {
      if (day.isCurrentMonth && day.progress) {
        const fm = day.progress.focusMinutes || 0;
        const tc = day.progress.tasksCompleted || 0;
        totalFocusMinutes += fm;
        totalTasksCompleted += tc;
        totalXpEarned += day.progress.xpEarned || 0;
        if (fm >= 45 || tc >= 2) {
          flourishingDaysCount++;
        }
      }
    });

    return {
      totalFocusMinutes,
      totalTasksCompleted,
      totalXpEarned,
      flourishingDaysCount,
    };
  }, [monthCalendarDays]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    sounds.playTap();
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    sounds.playTap();
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    onSelectDate(todayStr);
    sounds.playTap();
  };

  const monthLabel = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="clean-card p-4 sm:p-7 bg-[#F9F9F8] dark:bg-stone-900/90 backdrop-blur-2xl border border-stone-200/70 dark:border-white/[0.08] shadow-sm space-y-6 select-none transition-colors">
      
      {/* 1. Header & Overhauled Legend Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200/60 dark:border-white/[0.06]">
        
        {/* Left: Editorial Month Heading + Flourishing Badge */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-sm ring-1 ring-emerald-400/30">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 tracking-tight">
                  {monthLabel}
                </h2>
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{monthStats.flourishingDaysCount} Days Flourishing</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Botanical canopy record of your focus depth and streak momentum
              </p>
            </div>
          </div>
        </div>

        {/* Right: Mode Switcher & Stepper Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-stone-200/60 dark:bg-stone-800/60 border border-stone-300/40 dark:border-white/[0.06] text-xs font-bold shadow-2xs">
            <button
              type="button"
              onClick={() => {
                setCalendarMode('canopy');
                sounds.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                calendarMode === 'canopy'
                  ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-xs font-black'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Canopy Grid</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setCalendarMode('orbit');
                sounds.playTap();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                calendarMode === 'orbit'
                  ? 'bg-white dark:bg-stone-700 text-purple-700 dark:text-purple-300 shadow-xs font-black'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Solar Orbit</span>
            </button>
          </div>

          {/* Month Stepper (in Canopy mode) */}
          {calendarMode === 'canopy' && (
            <div className="flex items-center gap-1 bg-white/80 dark:bg-stone-800/80 p-1 rounded-2xl border border-stone-200/80 dark:border-white/[0.08] shadow-2xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Jump to Today Button */}
          <button
            type="button"
            onClick={handleJumpToToday}
            className="px-3 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs transition-all shadow-xs shadow-emerald-600/20 cursor-pointer"
          >
            Today
          </button>
        </div>

      </div>

      {/* 2. Refined Segmented Tier Legend Pill Bar */}
      <div className="p-2 rounded-2xl bg-white/70 dark:bg-stone-800/60 border border-stone-200/60 dark:border-white/[0.06] flex items-center justify-between text-xs font-semibold text-stone-600 dark:text-stone-300 flex-wrap gap-2">
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-stone-300 dark:bg-stone-600" />
            <span>Rest (0m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Sprout (1–45m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>Flourish (45–90m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 ring-1 ring-amber-300 shadow-xs" />
            <span className="font-bold text-stone-800 dark:text-stone-200">Golden Bloom (90m+)</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono text-stone-400 dark:text-stone-500">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>3 Dots = Rule of 3 Missions</span>
        </div>
      </div>

      {/* 3. MODE A: The Living Canopy Month Grid */}
      {calendarMode === 'canopy' && (
        <div className="space-y-3">
          
          {/* Weekday Editorial Headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 text-center">
            {WEEKDAY_NAMES.map((name) => (
              <div key={name} className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 py-1">
                {name}
              </div>
            ))}
          </div>

          {/* Living Canopy Grid Tiles */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {monthCalendarDays.map((dayItem) => {
              const { 
                dateStr, 
                dayNumber, 
                isCurrentMonth, 
                isFuture, 
                progress, 
                stage, 
                streakConnectedLeft, 
                streakConnectedRight,
                taskCompletionRatio
              } = dayItem;

              const isSelected = selectedDate === dateStr;
              const isDayToday = isToday(dateStr);
              const focusMins = progress?.focusMinutes || 0;

              // Tile Styling
              let tileBgClass = 'bg-white/80 dark:bg-stone-800/70 border-stone-200/80 dark:border-white/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)]';
              let badgeElement = null;

              if (isFuture) {
                tileBgClass = 'opacity-30 bg-stone-100/40 dark:bg-stone-900/20 border-stone-200/40 dark:border-white/[0.02] cursor-not-allowed';
              } else if (stage === 'bloom') {
                // 90m+ Golden Bloom
                tileBgClass = 'bg-gradient-to-br from-emerald-500/25 via-teal-500/20 to-amber-500/20 border-emerald-500/60 ring-1 ring-amber-400/50 shadow-md shadow-emerald-500/10 text-emerald-950 dark:text-emerald-100';
                badgeElement = (
                  <span className="p-1 rounded-md bg-amber-400/20 text-amber-600 dark:text-amber-300 text-[10px]" title="Golden Bloom">
                    <Flower2 className="w-3 h-3" />
                  </span>
                );
              } else if (stage === 'flourish') {
                // 45-90m Flourish
                tileBgClass = 'bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border-emerald-400/50 text-emerald-900 dark:text-emerald-200 shadow-xs';
                badgeElement = (
                  <span className="p-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px]" title="Flourish">
                    <Leaf className="w-3 h-3" />
                  </span>
                );
              } else if (stage === 'sprout') {
                // 1-45m Sprout
                tileBgClass = 'bg-emerald-50/70 dark:bg-emerald-950/35 border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300';
                badgeElement = (
                  <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]" title="Sprout">
                    <Sprout className="w-3 h-3" />
                  </span>
                );
              } else if (!isCurrentMonth) {
                tileBgClass = 'bg-stone-100/30 dark:bg-stone-900/20 border-stone-200/40 dark:border-white/[0.02] text-stone-400 dark:text-stone-600 opacity-40';
              }

              return (
                <div key={dateStr} className="relative group">
                  
                  {/* Streak Glowing Vine Connecting Filaments */}
                  {streakConnectedLeft && (
                    <div className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 z-0 pointer-events-none rounded-full shadow-xs" />
                  )}
                  {streakConnectedRight && (
                    <div className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 w-2 sm:w-3 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 z-0 pointer-events-none rounded-full shadow-xs" />
                  )}

                  <motion.button
                    whileHover={!isFuture ? { y: -3, scale: 1.02 } : {}}
                    whileTap={!isFuture ? { scale: 0.97 } : {}}
                    transition={{ duration: 0.15 }}
                    type="button"
                    disabled={isFuture}
                    onMouseEnter={() => setHoveredDate(dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                    onClick={() => {
                      if (!isFuture) {
                        onSelectDate(dateStr);
                        sounds.playTap();
                      }
                    }}
                    className={`relative w-full p-2 sm:p-2.5 rounded-2xl border text-left flex flex-col justify-between min-h-[72px] sm:min-h-[86px] z-10 cursor-pointer ${tileBgClass} ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 shadow-lg scale-[1.03] bg-white dark:bg-stone-800'
                        : ''
                    }`}
                  >
                    {/* Top Row: Date Number + Visual Activity Badge */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-mono text-xs sm:text-sm font-black ${
                        isDayToday
                          ? 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] sm:text-xs shadow-xs'
                          : isCurrentMonth
                          ? 'text-stone-800 dark:text-stone-200'
                          : 'text-stone-400 dark:text-stone-600'
                      }`}>
                        {dayNumber}
                      </span>

                      {badgeElement}
                    </div>

                    {/* Center Focus Minutes Chip */}
                    <div className="my-1">
                      {focusMins > 0 ? (
                        <span className="px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-stone-900/60 border border-stone-200/60 dark:border-white/[0.08] text-[9px] sm:text-[10px] font-mono font-black text-emerald-700 dark:text-emerald-300">
                          {focusMins}m
                        </span>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-dashed border-stone-300 dark:border-stone-700 flex items-center justify-center text-[7px] text-stone-400">
                          ·
                        </div>
                      )}
                    </div>

                    {/* Bottom Micro-Metrics: 3 Discrete Task Dots (Rule of 3) */}
                    <div className="flex items-center gap-1 mt-auto">
                      {[0, 1, 2].map((dotIdx) => {
                        const isDone = taskCompletionRatio > dotIdx;
                        return (
                          <span
                            key={dotIdx}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${
                              isDone
                                ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]'
                                : 'bg-stone-300/80 dark:bg-stone-700/80'
                            }`}
                            title={`Task ${dotIdx + 1}: ${isDone ? 'Completed' : 'Pending'}`}
                          />
                        );
                      })}
                    </div>

                  </motion.button>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 4. MODE B: Solar Constellation Orbit View */}
      {calendarMode === 'orbit' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>30-Day Solar Constellation Line</span>
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-[11px]">
              Star Magnitude = Focus Depth
            </span>
          </div>

          <div className="relative p-6 rounded-3xl bg-stone-950 text-white border border-stone-800 overflow-x-auto shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:20px_20px] opacity-15" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/30 via-cyan-400/40 to-emerald-400/30 -translate-y-1/2" />

            <div className="relative flex items-center gap-5 min-w-max py-4 px-2">
              {last30Days.map((item) => {
                const isSelected = selectedDate === item.dateStr;
                const focusM = item.progress?.focusMinutes || 0;
                const tasksDone = item.progress?.tasksCompleted || 0;
                const dayNum = item.dateObj.getDate();
                const dayName = item.dateObj.toLocaleDateString('en-US', { weekday: 'short' });

                return (
                  <div
                    key={item.dateStr}
                    onClick={() => {
                      onSelectDate(item.dateStr);
                      sounds.playTap();
                    }}
                    className={`relative flex flex-col items-center cursor-pointer group transition-transform ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-stone-400 group-hover:text-white uppercase mb-2">
                      {dayName} {dayNum}
                    </span>

                    <div 
                      className={`relative rounded-full flex items-center justify-center transition-all ${
                        item.starMagnitude === 3
                          ? 'w-10 h-10 bg-gradient-to-tr from-amber-400 to-orange-500 ring-4 ring-amber-400/40 shadow-lg shadow-amber-500/50'
                          : item.starMagnitude === 2
                          ? 'w-8 h-8 bg-gradient-to-tr from-emerald-400 to-teal-500 ring-2 ring-emerald-400/30 shadow-md shadow-emerald-500/40'
                          : item.starMagnitude === 1
                          ? 'w-6 h-6 bg-cyan-400 ring-1 ring-cyan-400/30 shadow-sm'
                          : 'w-4 h-4 bg-stone-800 border border-stone-700'
                      } ${isSelected ? 'ring-white' : ''}`}
                    >
                      {item.starMagnitude === 3 ? (
                        <span className="text-xs">☀️</span>
                      ) : item.starMagnitude === 2 ? (
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                      ) : item.starMagnitude === 1 ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      ) : null}
                    </div>

                    <div className="mt-2 text-center">
                      <span className={`text-[10px] font-mono font-bold block ${
                        focusM > 0 ? 'text-emerald-400' : 'text-stone-500'
                      }`}>
                        {focusM}m
                      </span>
                      {tasksDone > 0 && (
                        <span className="text-[8px] font-black text-amber-400">
                          ✓{tasksDone}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Bento Popover Capsule for Selected Date */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-stone-850 border border-stone-200/80 dark:border-white/[0.08] shadow-md space-y-4 animate-fadeIn">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200/60 dark:border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-black text-sm sm:text-base shrink-0">
              {isToday(selectedDate) ? '☀️ Today' : isYesterday(selectedDate) ? '⏮️ Yesterday' : '🗓️ Day Capsule'}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900 dark:text-stone-100">
                {formatFullDateDisplay(selectedDate)}
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Focus ratio, completed mission checklist, and reflection capsule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
              +{selectedDayProgress?.xpEarned || 0} XP Earned
            </span>
          </div>
        </div>

        {/* Selected Day Stats & Mini-Dial Bento */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Mini Donut Chart for Focus Ratio */}
          <div className="md:col-span-4 p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/60 dark:border-white/[0.04] flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  className="text-stone-200 dark:text-stone-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  className="text-emerald-500 transition-all duration-500"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 14}
                  strokeDashoffset={(2 * Math.PI * 14) * (1 - Math.min(1, (selectedDayProgress?.focusMinutes || 0) / 120))}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-black font-mono text-stone-900 dark:text-stone-100 block">
                  {selectedDayProgress?.focusMinutes || 0}m
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider block">
                Focus Depth Ratio
              </span>
              <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                {selectedDayProgress?.focusMinutes 
                  ? `${Math.round((selectedDayProgress.focusMinutes / 120) * 100)}% of 2h target` 
                  : 'Resting Day'}
              </span>
            </div>
          </div>

          {/* Mission Checklist Bento */}
          <div className="md:col-span-8 p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-900/60 border border-stone-200/60 dark:border-white/[0.04] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-black text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Mission Checklist</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                {selectedDayProgress?.tasksCompleted || 0} conquered
              </span>
            </div>

            {selectedDayFocusSessions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {selectedDayFocusSessions.map((session) => (
                  <span 
                    key={session.id}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-white/[0.06] text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="line-through opacity-80">{session.taskTitle}</span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">({session.durationMinutes}m)</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic">
                {selectedDate === todayStr ? 'No tasks completed yet today. Start your first sprint!' : 'No individual sprint logs recorded for this day.'}
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { sounds } from '@/lib/sounds';
import { Sparkles, Clock, CheckCircle2, Trophy, Sun, Moon } from 'lucide-react';
import { getLocalDateString } from '@/lib/dateUtils';

interface DailyHeroRingProps {
  onOpenFocus: () => void;
  onOpenMorning: () => void;
  onOpenEvening: () => void;
}

export function DailyHeroRing({ onOpenFocus, onOpenMorning, onOpenEvening }: DailyHeroRingProps) {
  const { dailyPlan, focusLogs, goals } = useApp();

  const todayStr = getLocalDateString();
  
  // Total focus minutes today
  const todayFocusMinutes = focusLogs
    .filter(log => log.date === todayStr)
    .reduce((acc, log) => acc + log.durationMinutes, 0);


  const targetMinutes = dailyPlan.targetFocusMinutes || 120;
  const timeProgressPercent = Math.min(100, Math.round((todayFocusMinutes / targetMinutes) * 100));

  // Tasks progress
  const totalTasks = dailyPlan.priorityTasks.length;
  const completedTasks = dailyPlan.priorityTasks.filter(t => t.completed).length;
  const taskProgressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Blended day momentum score
  const blendedScore = totalTasks > 0
    ? Math.round(timeProgressPercent * 0.6 + taskProgressPercent * 0.4)
    : timeProgressPercent;

  // Mascot evolution stage
  const getMascotStage = (score: number) => {
    if (score >= 100) {
      return {
        stage: 'Radiant Bloom 🌸',
        emoji: '🌸✨',
        title: 'Full Bloom Masterpiece!',
        desc: 'You completed your daily mission with authentic focus! Your seedling is glowing.',
        bg: 'from-pink-500/20 via-purple-500/10 to-amber-500/20',
        ringColor: '#EC4899',
      };
    }
    if (score >= 75) {
      return {
        stage: 'Budding Flower 🌺',
        emoji: '🌺',
        title: 'Petals are Opening!',
        desc: 'Over 75% complete! One final push and you will reach full bloom.',
        bg: 'from-rose-500/15 via-pink-500/10 to-teal-500/15',
        ringColor: '#F43F5E',
      };
    }
    if (score >= 50) {
      return {
        stage: 'Flourishing Sapling 🌿',
        emoji: '🌿',
        title: 'Strong Momentum!',
        desc: 'Halfway through your daily goals. Keep the deep work rhythm going.',
        bg: 'from-emerald-500/15 via-teal-500/10 to-cyan-500/15',
        ringColor: '#10B981',
      };
    }
    if (score >= 20) {
      return {
        stage: 'Fresh Sproutling 🌱',
        emoji: '🌱',
        title: 'Rooting In!',
        desc: 'Great morning start! Every small focused minute counts towards compounding gains.',
        bg: 'from-teal-500/10 via-emerald-500/10 to-amber-500/10',
        ringColor: '#14B8A6',
      };
    }
    return {
      stage: 'Cozy Seed 🌰',
      emoji: '🌰',
      title: 'Resting Seed at Dawn',
      desc: 'Set your morning intention and begin a quick focus session to awaken your sprout.',
      bg: 'from-amber-500/10 via-orange-500/10 to-emerald-500/10',
      ringColor: '#F59E0B',
    };
  };

  const mascot = getMascotStage(blendedScore);

  // SVG Circular Ring geometry
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (blendedScore / 100) * circumference;

  // Active goals summary
  const totalGoalMilestones = goals.reduce((acc, g) => acc + g.totalMilestones, 0);
  const completedGoalMilestones = goals.reduce(
    (acc, g) => acc + g.milestones.filter(m => m.isCompleted).length,
    0
  );

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-white/90 via-white/80 to-amber-50/50 dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-950/90 border border-amber-900/10 dark:border-white/10 shadow-lg">
      
      {/* Decorative ambient background glows */}
      <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${mascot.bg} blur-3xl pointer-events-none transition-all duration-700`} />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Mascot & Circular Momentum Ring */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
          
          <div className="relative flex items-center justify-center">
            {/* SVG Ring */}
            <svg width={size} height={size} className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-zinc-100 dark:text-zinc-800"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                stroke={mascot.ringColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Mascot Center Avatar */}
            <div 
              onClick={() => {
                sounds.playTaskPop();
              }}
              className="absolute flex flex-col items-center justify-center w-32 h-32 rounded-full cursor-pointer hover:scale-110 active:scale-95 transition-transform group"
              title="Click your mascot for a cheer!"
            >
              <span className="text-5xl animate-float filter drop-shadow-md select-none group-hover:rotate-12 transition-transform">
                {mascot.emoji}
              </span>
              <span className="text-xs font-black tracking-tight mt-1 text-zinc-700 dark:text-zinc-200">
                {blendedScore}% Bloom
              </span>
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {mascot.stage}
            </span>
          </div>
        </div>

        {/* Right Column: Day Overview & Action Buttons */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                  Daily Momentum
                </span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>

              {dailyPlan.morningCompleted ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Sunrise Planned
                </span>
              ) : (
                <button
                  onClick={onOpenMorning}
                  className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 px-2.5 py-0.5 rounded-full transition-colors"
                >
                  ☀️ Plan Morning
                </button>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-800 dark:text-zinc-100 tracking-tight">
              {mascot.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1 max-w-xl leading-relaxed">
              {mascot.desc}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 my-5">
            {/* Metric 1: Focus Time */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Focus Time</span>
              </div>
              <div className="text-lg font-black text-zinc-800 dark:text-zinc-100 mt-1">
                {todayFocusMinutes} <span className="text-xs font-normal text-zinc-400">/ {targetMinutes}m</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (todayFocusMinutes / targetMinutes) * 100)}%` }}
                />
              </div>
            </div>

            {/* Metric 2: Priority Tasks */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                <span>Rule-of-3</span>
              </div>
              <div className="text-lg font-black text-zinc-800 dark:text-zinc-100 mt-1">
                {completedTasks} <span className="text-xs font-normal text-zinc-400">/ {totalTasks} done</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${taskProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Metric 3: Active Milestones */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span>Milestones</span>
              </div>
              <div className="text-lg font-black text-zinc-800 dark:text-zinc-100 mt-1">
                {completedGoalMilestones} <span className="text-xs font-normal text-zinc-400">/ {totalGoalMilestones}</span>
              </div>
              <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${totalGoalMilestones > 0 ? (completedGoalMilestones / totalGoalMilestones) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenFocus}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Clock className="w-4 h-4" />
              <span>Start Focus Timer</span>
            </button>

            {!dailyPlan.morningCompleted && (
              <button
                onClick={onOpenMorning}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-bold text-sm border border-amber-300 dark:border-amber-800 transition-all active:scale-95"
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Sunrise Ritual</span>
              </button>
            )}

            <button
              onClick={onOpenEvening}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 dark:hover:bg-purple-900/60 text-purple-900 dark:text-purple-200 font-bold text-sm border border-purple-300 dark:border-purple-800 transition-all active:scale-95"
              title="Sunset Gratitude & Streak Lock"
            >
              <Moon className="w-4 h-4 text-purple-500" />
              <span>Sunset Review</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

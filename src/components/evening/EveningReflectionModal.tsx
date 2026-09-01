'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Moon, Sparkles, X, Flame, Zap, Trophy, Archive } from 'lucide-react';
import { getLocalDateString } from '@/lib/dateUtils';
import { sounds } from '@/lib/sounds';

interface EveningReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ENERGY_LEVELS = [
  { level: 1, emoji: '😴', label: 'Exhausted' },
  { level: 2, emoji: '🥱', label: 'Low Energy' },
  { level: 3, emoji: '⚡', label: 'Steady' },
  { level: 4, emoji: '🔥', label: 'High Energy' },
  { level: 5, emoji: '🚀', label: 'Unstoppable' },
];

export function EveningReflectionModal({ isOpen, onClose }: EveningReflectionModalProps) {
  const { dailyPlan, focusLogs, profile, updateEveningReflection } = useApp();

  const [reflection, setReflection] = useState(dailyPlan.eveningReflection || '');
  const [dailyWin, setDailyWin] = useState(dailyPlan.dailyWin || '');
  const [energyRating, setEnergyRating] = useState<number>(dailyPlan.energyRating || 4);

  if (!isOpen) return null;

  const todayStr = getLocalDateString();
  const todayFocusMinutes = focusLogs
    .filter(log => log.date === todayStr)
    .reduce((acc, log) => acc + log.durationMinutes, 0);

  const completedTasks = dailyPlan.priorityTasks.filter(t => t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEveningReflection({
      reflection: reflection.trim() || 'Wrapped up daily missions and rested.',
      energyRating,
      dailyWin: dailyWin.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg clean-card p-5 sm:p-7 bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] shadow-2xl overflow-hidden space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-xs">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[var(--text-main)]">
                Sunset Wind-Down & Reflection
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
                +80 XP
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Reflect on today&apos;s breakthroughs and preserve streak momentum
            </p>
          </div>
        </div>

        {/* Today's Summary Metrics */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3 rounded-2xl bg-purple-500/[0.05] border border-purple-500/20 text-center">
            <div className="text-[10px] text-[var(--text-muted)] font-black uppercase">Focus Time</div>
            <div className="text-sm sm:text-base font-black text-purple-600 dark:text-purple-400 mt-0.5">
              {todayFocusMinutes}m
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20 text-center">
            <div className="text-[10px] text-[var(--text-muted)] font-black uppercase">Missions</div>
            <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {completedTasks} Done
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-orange-500/[0.05] border border-orange-500/20 text-center">
            <div className="text-[10px] text-[var(--text-muted)] font-black uppercase">Streak Guard</div>
            <div className="text-sm sm:text-base font-black text-orange-500 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{profile.streakDays}d</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Energy Rating Selector (1..5) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>How was your energy and clarity today?</span>
            </label>

            <div className="grid grid-cols-5 gap-1.5">
              {ENERGY_LEVELS.map((item) => {
                const isSelected = energyRating === item.level;
                return (
                  <button
                    key={item.level}
                    type="button"
                    onClick={() => {
                      setEnergyRating(item.level);
                      sounds.playTap();
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-300 ring-1 ring-purple-500/40 font-black shadow-xs'
                        : 'bg-[var(--bg-card-subtle)] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:border-purple-500/40'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl">{item.emoji}</div>
                    <div className="text-[9px] font-bold truncate mt-0.5">{item.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1-Line Daily Win */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Line Daily Breakthrough / Win</span>
            </label>
            <input
              type="text"
              value={dailyWin}
              onChange={(e) => setDailyWin(e.target.value)}
              placeholder="e.g. Mastered Next.js state & finished 3 core sprint tasks!"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          {/* Reflection Thoughts */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-purple-500" />
              <span>Evening Reflections &amp; Learnings</span>
            </label>
            <textarea
              rows={2}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What worked well? What will you tweak tomorrow?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>

          {/* Auto-Archive Notice */}
          <div className="p-2.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
            <Archive className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
            <span>Completed missions will be auto-archived into your Momentum Activity Ledger.</span>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lock Momentum & Finish Day (+80 XP)</span>
          </button>
        </form>

      </div>
    </div>
  );
}

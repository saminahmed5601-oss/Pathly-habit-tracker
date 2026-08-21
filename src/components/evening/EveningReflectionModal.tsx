'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Moon, Sparkles, X, Flame, Trophy, CheckCircle2, Heart } from 'lucide-react';

interface EveningReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EveningReflectionModal({ isOpen, onClose }: EveningReflectionModalProps) {
  const { dailyPlan, focusLogs, profile, updateEveningReflection } = useApp();

  const [reflection, setReflection] = useState(
    dailyPlan.eveningReflection || 'Crushed my focus goals and made clean progress on coding!'
  );

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFocusMinutes = focusLogs
    .filter(log => log.date === todayStr)
    .reduce((acc, log) => acc + log.durationMinutes, 0);

  const completedTasks = dailyPlan.priorityTasks.filter(t => t.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEveningReflection(reflection.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-purple-300 dark:border-purple-900/60 shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 shadow-sm">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
              Sunset Wrap-Up
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Celebrate your wins & preserve your streak
            </p>
          </div>
        </div>

        {/* Today's Stats Summary */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-900/40 text-center">
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Focus</div>
            <div className="text-base font-black text-purple-700 dark:text-purple-300 mt-0.5">
              {todayFocusMinutes}m
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Tasks</div>
            <div className="text-base font-black text-emerald-700 dark:text-emerald-300 mt-0.5">
              {completedTasks} Done
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 text-center">
            <div className="text-[10px] text-zinc-400 font-bold uppercase">Streak</div>
            <div className="text-base font-black text-orange-600 dark:text-orange-400 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              {profile.streakDays}d
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              What went well today? What did you discover?
            </label>
            <textarea
              rows={3}
              required
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g. Felt focused during the morning Pomodoro, debugged the API error cleanly..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lock In Streak & Finish Day (+80 XP)</span>
          </button>
        </form>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Moon, Sparkles, X, Flame } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md clean-card p-6 sm:p-7 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
            <Moon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)]">
              Sunset Wrap-Up
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Lock in your streak for tomorrow
            </p>
          </div>
        </div>

        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-center">
            <div className="text-[10px] text-[var(--text-muted)] font-black uppercase">Focus</div>
            <div className="text-sm font-black text-purple-500 mt-0.5">
              {todayFocusMinutes}m
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-center">
            <div className="text-[10px] text-[var(--text-muted)] font-black uppercase">Tasks</div>
            <div className="text-sm font-black text-[var(--primary)] mt-0.5">
              {completedTasks} Done
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-center">
            <div className="text-[10px] text-[var(--text-muted)] font-black uppercase">Streak</div>
            <div className="text-sm font-black text-orange-500 mt-0.5 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              {profile.streakDays}d
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
              Quick Reflection
            </label>
            <textarea
              rows={2}
              required
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="e.g. Mastered Next.js state and finished 2 pomodoros..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-xs transition-opacity"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lock In Streak & Finish Day (+80 XP)</span>
          </button>
        </form>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sun, Sparkles, X, Heart, Target, Clock, Crown, Flame } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface MorningKickoffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MorningKickoffModal({ isOpen, onClose }: MorningKickoffModalProps) {
  const { updateMorningPlan, goals } = useApp();

  const [targetFocusHours, setTargetFocusHours] = useState(2);
  const [gratitude, setGratitude] = useState('');
  const [tasks, setTasks] = useState([
    { title: '', goalId: '', estimatedMinutes: 45, isMustWin: true },
    { title: '', goalId: '', estimatedMinutes: 25, isMustWin: false },
    { title: '', goalId: '', estimatedMinutes: 25, isMustWin: false },
  ]);

  if (!isOpen) return null;

  const handleTaskChange = (index: number, field: string, value: string | number | boolean) => {
    setTasks(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddTask = () => {
    if (tasks.length < 5) {
      setTasks(prev => [...prev, { title: '', goalId: '', estimatedMinutes: 30, isMustWin: false }]);
      sounds.playTap();
    }
  };

  const handleRemoveTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(prev => prev.filter((_, i) => i !== index));
      sounds.playTap();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTasks = tasks.filter(t => t.title.trim().length > 0);
    if (validTasks.length === 0) return;

    updateMorningPlan({
      targetFocusMinutes: targetFocusHours * 60,
      tasks: validTasks,
      gratitudeNote: gratitude.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg clean-card p-5 sm:p-7 bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-xs">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[var(--text-main)]">
                Sunrise Morning Intent
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                +60 XP
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Prime your mental clarity and define today&apos;s #1 Must-Win priority
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Morning Affirmation / Gratitude */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Morning Affirmation / Intention</span>
            </label>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="e.g. Calm focus on high-leverage execution today..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Target Focus Hours Slider */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
            <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Target Deep Focus Today</span>
              </span>
              <span className="text-[var(--primary)] font-black">
                {targetFocusHours}h ({targetFocusHours * 60}m)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={targetFocusHours}
              onChange={(e) => setTargetFocusHours(Number(e.target.value))}
              className="w-full h-1.5 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
            />
          </div>

          {/* Rule of 3 Missions (#1 Must-Win + 2 Supporting) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Missions (Rule of 3)</span>
              </label>
              {tasks.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="text-[11px] font-bold text-[var(--primary)] hover:underline cursor-pointer"
                >
                  + Add Mission
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {tasks.map((task, idx) => {
                const isFirst = idx === 0;
                return (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl border transition-all space-y-2 ${
                      isFirst 
                        ? 'bg-amber-500/[0.04] border-amber-500/30 ring-1 ring-amber-500/20' 
                        : 'bg-[var(--bg-card-subtle)] border-black/[0.05] dark:border-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        isFirst 
                          ? 'bg-amber-500 text-white shadow-xs' 
                          : 'bg-black/[0.05] dark:bg-white/[0.08] text-[var(--text-muted)]'
                      }`}>
                        {isFirst ? <Crown className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <input
                        type="text"
                        required
                        value={task.title}
                        onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                        placeholder={isFirst ? "Top #1 Must-Win Mission (e.g. Ship core auth flow)..." : `Supporting mission ${idx + 1}...`}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] font-medium"
                      />

                      {tasks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTask(idx)}
                          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* Metadata: Goal Link & Duration selector */}
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      {goals.length > 0 && (
                        <select
                          value={task.goalId}
                          onChange={(e) => handleTaskChange(idx, 'goalId', e.target.value)}
                          className="px-2 py-1 rounded-lg bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] text-[10px] text-[var(--text-muted)] focus:outline-none max-w-[140px]"
                        >
                          <option value="">Link a goal...</option>
                          {goals.map(g => (
                            <option key={g.id} value={g.id}>{g.icon} {g.title.slice(0, 15)}</option>
                          ))}
                        </select>
                      )}

                      <div className="flex items-center gap-1 ml-auto">
                        {[15, 25, 45, 60].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => handleTaskChange(idx, 'estimatedMinutes', mins)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-all cursor-pointer ${
                              task.estimatedMinutes === mins
                                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                                : 'bg-[var(--bg-card)] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)]'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-95 active:scale-98 text-white font-black text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sun className="w-4 h-4" />
            <span>Lock Sunrise Intent (+60 XP)</span>
          </button>
        </form>

      </div>
    </div>
  );
}

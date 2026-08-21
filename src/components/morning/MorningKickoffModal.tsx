'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sun, Sparkles, X, Heart, Target, Clock, Check } from 'lucide-react';

interface MorningKickoffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MorningKickoffModal({ isOpen, onClose }: MorningKickoffModalProps) {
  const { updateMorningPlan, goals } = useApp();

  const [targetFocusHours, setTargetFocusHours] = useState(2);
  const [gratitude, setGratitude] = useState('Grateful for energy to learn code and make real progress today.');
  const [tasks, setTasks] = useState([
    { title: 'Study next Web Development course milestone', goalId: 'goal-web-dev', estimatedMinutes: 60 },
    { title: 'Practice 20 minutes posture & movement', goalId: 'goal-health', estimatedMinutes: 20 },
    { title: 'Read 1 chapter of Atomic Habits', goalId: 'goal-atomic-habits', estimatedMinutes: 25 },
  ]);

  if (!isOpen) return null;

  const handleTaskChange = (index: number, field: string, value: string | number) => {
    setTasks(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddTask = () => {
    if (tasks.length < 5) {
      setTasks(prev => [...prev, { title: '', goalId: '', estimatedMinutes: 30 }]);
    }
  };

  const handleRemoveTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(prev => prev.filter((_, i) => i !== index));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-amber-300 dark:border-amber-900/60 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Ambient Top Sun Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 shadow-sm">
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
              Sunrise Kickoff Ritual
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Set clear intentions for today & unlock your morning momentum
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Gratitude Priming */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Morning Gratitude / Positive Affirmation
            </label>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="What are you grateful for this morning?"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-amber-50/50 dark:bg-zinc-800/80 border border-amber-200/80 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Target Focus Hours Slider */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60">
            <div className="flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                Target Deep Work / Focus Today
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                {targetFocusHours} Hours ({targetFocusHours * 60} mins)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={targetFocusHours}
              onChange={(e) => setTargetFocusHours(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Rule of 3 Priority Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-teal-500" />
                Today&apos;s Core Priorities (Rule of 3)
              </label>
              {tasks.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  + Add Item
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {tasks.map((task, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      required
                      value={task.title}
                      onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                      placeholder={`Priority #${idx + 1}...`}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-100 focus:outline-none"
                    />
                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(idx)}
                        className="text-zinc-400 hover:text-red-500 p-1 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {goals.length > 0 && (
                    <div className="flex items-center gap-2 pl-7">
                      <span className="text-[10px] text-zinc-400">Link Journey:</span>
                      <select
                        value={task.goalId}
                        onChange={(e) => handleTaskChange(idx, 'goalId', e.target.value)}
                        className="px-2 py-1 rounded-lg text-[11px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none"
                      >
                        <option value="">None (Custom Task)</option>
                        {goals.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.icon} {g.title.slice(0, 20)}...
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-white font-extrabold text-sm shadow-md transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Lock In Today&apos;s Mission (+60 XP)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

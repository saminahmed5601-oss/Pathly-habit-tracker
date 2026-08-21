'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Sun, Sparkles, X, Heart, Target, Clock } from 'lucide-react';

interface MorningKickoffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MorningKickoffModal({ isOpen, onClose }: MorningKickoffModalProps) {
  const { updateMorningPlan, goals } = useApp();

  const [targetFocusHours, setTargetFocusHours] = useState(2);
  const [gratitude, setGratitude] = useState('Grateful for energy to learn and build today.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg clean-card p-6 sm:p-7 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)]">
              Sunrise Kickoff
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Set today&apos;s 3 core priorities
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Gratitude Priming */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Morning Affirmation
            </label>
            <input
              type="text"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="What are you grateful for this morning?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            />
          </div>

          {/* Target Focus Hours Slider */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
            <div className="flex justify-between text-xs font-bold text-[var(--text-main)] mb-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                Target Focus Today
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
              className="w-full accent-[var(--primary)] cursor-pointer"
            />
          </div>

          {/* Rule of 3 Priority Tasks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[var(--primary)]" />
                Priorities (Rule of 3)
              </label>
              {tasks.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="text-[11px] font-bold text-[var(--primary)] hover:underline"
                >
                  + Add Priority
                </button>
              )}
            </div>

            <div className="space-y-2">
              {tasks.map((task, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[var(--primary-light)] text-[var(--primary-text)] text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      required
                      value={task.title}
                      onChange={(e) => handleTaskChange(idx, 'title', e.target.value)}
                      placeholder={`Priority #${idx + 1}...`}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-xs font-semibold text-[var(--text-main)] focus:outline-none"
                    />
                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTask(idx)}
                        className="text-[var(--text-muted)] hover:text-red-500 p-1 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {goals.length > 0 && (
                    <div className="flex items-center gap-2 pl-7">
                      <span className="text-[10px] text-[var(--text-muted)]">Journey:</span>
                      <select
                        value={task.goalId}
                        onChange={(e) => handleTaskChange(idx, 'goalId', e.target.value)}
                        className="px-2 py-0.5 rounded text-[11px] bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none"
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
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-[var(--primary)] text-white font-bold text-xs shadow-xs transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              <span>Lock Today&apos;s Mission (+60 XP)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

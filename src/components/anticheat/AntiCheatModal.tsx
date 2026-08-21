'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, Sparkles, X, Clock, Brain, CheckCircle } from 'lucide-react';

export function AntiCheatModal() {
  const { antiCheatModalTarget, setAntiCheatModalTarget, confirmCompleteMilestone, goals } = useApp();
  
  const [proofNote, setProofNote] = useState('');
  const [timeSpent, setTimeSpent] = useState(45);
  const [errorMsg, setErrorMsg] = useState('');

  if (!antiCheatModalTarget) return null;

  const { goalId, milestone } = antiCheatModalTarget;
  const currentGoal = goals.find(g => g.id === goalId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proofNote.trim().length < 8) {
      setErrorMsg('Please write at least 8 characters describing what you learned or built (keeps your progress honest!).');
      return;
    }

    confirmCompleteMilestone({
      goalId,
      milestoneId: milestone.id,
      proofNote: proofNote.trim(),
      timeSpentMinutes: Number(timeSpent),
    });

    setProofNote('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-500/30 shadow-2xl p-6 sm:p-7 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setAntiCheatModalTarget(null)}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shadow-2xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Anti-Cheat Pacing Guard
            </span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
              Verify Milestone #{milestone.order}
            </h3>
          </div>
        </div>

        {/* Milestone info banner */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 mb-4">
          <div className="text-xs text-zinc-400 font-semibold">
            {currentGoal ? `${currentGoal.icon} ${currentGoal.title}` : 'Milestone'}
          </div>
          <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
            {milestone.title}
          </div>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
          To build authentic habits and protect your dopamine, logging genuine progress requires a brief proof-of-work reflection.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Proof note / key takeaway */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-emerald-500" />
              What did you learn or build in this step? *
            </label>
            <textarea
              required
              rows={3}
              value={proofNote}
              onChange={(e) => {
                setProofNote(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Mastered useState hook and built a dynamic interactive counter with sound..."
              className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            {errorMsg && (
              <p className="text-[11px] font-medium text-rose-500 mt-1">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Time spent */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              Estimated Study / Work Time (Minutes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="600"
                value={timeSpent}
                onChange={(e) => setTimeSpent(Number(e.target.value))}
                className="w-24 px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 focus:outline-none"
              />
              <span className="text-xs text-zinc-400 font-medium">mins</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAntiCheatModalTarget(null)}
              className="flex-1 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-98"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify & Complete (+100 XP)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

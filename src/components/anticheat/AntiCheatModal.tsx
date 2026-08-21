'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, X, Clock, Brain, CheckCircle } from 'lucide-react';

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
    if (proofNote.trim().length < 6) {
      setErrorMsg('Please write a brief note of what you built or learned.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setAntiCheatModalTarget(null)}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--primary)]">
              Proof of Work
            </span>
            <h3 className="text-base sm:text-lg font-black text-[var(--text-main)]">
              Verify Milestone #{milestone.order}
            </h3>
          </div>
        </div>

        {/* Milestone info banner */}
        <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] mb-4">
          <div className="text-[10px] text-[var(--text-muted)] font-bold">
            {currentGoal ? `${currentGoal.icon} ${currentGoal.title}` : 'Milestone'}
          </div>
          <div className="text-xs font-bold text-[var(--text-main)] mt-0.5">
            {milestone.title}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[var(--primary)]" />
              What did you learn or build? *
            </label>
            <textarea
              required
              rows={2}
              value={proofNote}
              onChange={(e) => {
                setProofNote(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Mastered useState and built an interactive counter..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            />
            {errorMsg && (
              <p className="text-[11px] font-medium text-rose-500 mt-1">
                {errorMsg}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
              Study Time (Minutes)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="600"
                value={timeSpent}
                onChange={(e) => setTimeSpent(Number(e.target.value))}
                className="w-20 px-3 py-1.5 rounded-lg bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs font-bold text-[var(--text-main)] focus:outline-none"
              />
              <span className="text-xs text-[var(--text-muted)] font-medium">mins</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAntiCheatModalTarget(null)}
              className="flex-1 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] text-[var(--text-main)] font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-opacity"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Verify (+100 XP)</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

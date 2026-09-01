'use client';

import React from 'react';
import { X, Sparkles, Target, ShieldCheck, Sun, Flame } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpGuideModal({ isOpen, onClose }: HelpGuideModalProps) {
  if (!isOpen) return null;

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
          <div className="p-3 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)]">
              The Pathly System
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Core mechanics to build compounding daily consistency
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-[var(--text-main)]">
          
          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
            <h3 className="font-bold text-amber-500 text-xs flex items-center gap-1.5 mb-1">
              <Sun className="w-4 h-4" />
              1. The Rule of 3
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Focus on 1 Core Mission and 2 Supporting Habits each morning to eliminate overwhelm.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
            <h3 className="font-bold text-[var(--primary)] text-xs flex items-center gap-1.5 mb-1">
              <Target className="w-4 h-4" />
              2. Starting Offsets (No Resetting)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Already did 3/12 milestones before? Start at #3 with full progress credit immediately.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
            <h3 className="font-bold text-[var(--primary)] text-xs flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4" />
              3. Proof of Work (Anti-Cheat)
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Prevents fake multi-clicks by asking for a 1-sentence note of what you actually built.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
            <h3 className="font-bold text-orange-500 text-xs flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4" />
              4. Streak Shield
            </h3>
            <p className="text-[var(--text-muted)] leading-relaxed">
              Doing 15 minutes on low-energy days protects your streak and keeps your identity intact.
            </p>
          </div>

        </div>

        <div className="mt-5 pt-3 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-xs"
          >
            Got It!
          </button>
        </div>

      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { X, Sparkles, Target, ShieldCheck, Sun, Users, Flame, HeartHandshake } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpGuideModal({ isOpen, onClose }: HelpGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-500/30 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
              The Pathly Life-Improvement System
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Science-backed habit psychology to make daily progress effortless & addictive
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          
          {/* Card 1: Sunrise Intentions */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
            <h3 className="font-bold text-amber-900 dark:text-amber-200 text-sm flex items-center gap-2 mb-1">
              <Sun className="w-4 h-4 text-amber-500" />
              1. The Rule of 3 (Avoid Overwhelm)
            </h3>
            <p>
              When you wake up, avoid making a 15-item todo list. Instead, set <strong>1 Primary Mission</strong> and <strong>2 Supporting Habits</strong>. Completing 3 focused tasks every single day beats 10 half-baked tasks abandoned by 3 PM.
            </p>
          </div>

          {/* Card 2: Starting Offsets */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/40">
            <h3 className="font-bold text-teal-900 dark:text-teal-200 text-sm flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-teal-500" />
              2. Retroactive Starting Baselines
            </h3>
            <p>
              Real life doesn&apos;t always start at day zero. If you already completed 3 or 4 milestones in your Web Development bootcamp before finding this tracker, set your <strong>Starting Offset</strong> to 4. Your progress bar starts immediately at 33% with full visual credit!
            </p>
          </div>

          {/* Card 3: Anti-Cheat & Genuine Dopamine */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              3. Anti-Cheat Pacing Guard
            </h3>
            <p>
              Clicking 10 checkmarks in 2 seconds gives fake dopamine that damages genuine discipline. Pathly enforces a <strong>pacing cooldown</strong> and asks for a quick <strong>1-sentence reflection</strong> (*&quot;What did you build or learn?&quot;*) to anchor your brain&apos;s memory.
            </p>
          </div>

          {/* Card 4: Minimum Viable Day & Streak Shields */}
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
            <h3 className="font-bold text-rose-900 dark:text-rose-200 text-sm flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-rose-500" />
              4. The Minimum Viable Day (Streak Shield)
            </h3>
            <p>
              On low-energy or sick days, never quit completely. Do just <strong>15 minutes of focus or 1 mini task</strong>. This preserves your identity as someone who shows up, keeping your streak alive!
            </p>
          </div>

          {/* Card 5: Accountability Squad */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/80 dark:border-purple-900/40">
            <h3 className="font-bold text-purple-900 dark:text-purple-200 text-sm flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-purple-500" />
              5. The Village Accountability
            </h3>
            <p>
              Share your daily progress card with friends or study buddies on WhatsApp/Discord. Exchanging energy, cheers, and coffee boosts increases habit consistency by over <strong>65%</strong> according to behavioral studies!
            </p>
          </div>

        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
          >
            Got It, Let&apos;s Build My Habits! 🚀
          </button>
        </div>

      </div>
    </div>
  );
}

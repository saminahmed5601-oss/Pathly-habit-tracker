'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Award, Flame, Shield, Share2, Sparkles, Trophy, CheckCircle, Target } from 'lucide-react';

interface AchievementsViewProps {
  onOpenShareCard: () => void;
  onOpenHelp: () => void;
}

export function AchievementsView({ onOpenShareCard, onOpenHelp }: AchievementsViewProps) {
  const { profile, badges, focusLogs, goals } = useApp();

  const unlockedCount = badges.filter(b => profile.unlockedBadges.includes(b.id)).length;
  const totalFocusMinutes = focusLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalMilestonesDone = goals.reduce((acc, g) => acc + g.milestones.filter(m => m.isCompleted).length, 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Trophy Case & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Your compounding achievements, streaks, and proof-of-work badges
          </p>
        </div>

        <button
          onClick={onOpenShareCard}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-center"
        >
          <Share2 className="w-4 h-4" />
          <span>Export Daily Card</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="clean-card p-4 bg-white dark:bg-[#151C28] text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Current Level</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Lv. {profile.level}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            {profile.currentXP} / {profile.nextLevelXP} XP
          </div>
        </div>

        <div className="clean-card p-4 bg-white dark:bg-[#151C28] text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Current Streak</div>
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            {profile.streakDays} Days
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            Best: {profile.bestStreak} days
          </div>
        </div>

        <div className="clean-card p-4 bg-white dark:bg-[#151C28] text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Total Focus</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {totalFocusMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            Deep work logged
          </div>
        </div>

        <div className="clean-card p-4 bg-white dark:bg-[#151C28] text-center">
          <div className="text-xs font-bold text-slate-400 uppercase">Milestones Done</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {totalMilestonesDone}
          </div>
          <div className="text-[11px] text-slate-400 font-medium mt-0.5">
            Across all courses
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="clean-card p-6 bg-white dark:bg-[#151C28]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Unlocked Badges ({unlockedCount}/{badges.length})
              </h2>
              <p className="text-xs text-slate-400">
                Earned through authentic daily consistency
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/40 shadow-2xs'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-2xs shrink-0 select-none">
                  {badge.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {badge.title}
                    </h3>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

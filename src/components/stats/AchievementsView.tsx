'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Award, Flame, Share2 } from 'lucide-react';

interface AchievementsViewProps {
  onOpenShareCard: () => void;
  onOpenHelp: () => void;
}

export function AchievementsView({ onOpenShareCard }: AchievementsViewProps) {
  const { profile, badges, focusLogs, goals } = useApp();

  const unlockedCount = badges.filter(b => profile.unlockedBadges.includes(b.id)).length;
  const totalFocusMinutes = focusLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalMilestonesDone = goals.reduce((acc, g) => acc + g.milestones.filter(m => m.isCompleted).length, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">
            Trophy Case
          </h1>
          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
            Your earned badges and consistency milestones
          </p>
        </div>

        <button
          onClick={onOpenShareCard}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs transition-all w-full sm:w-auto"
        >
          <Share2 className="w-4 h-4" />
          <span>Export Daily Card</span>
        </button>
      </div>

      {/* Visual Stat Counters (2x2 on Mobile, 4 Cols on Desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-[var(--border)] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Level</div>
          <div className="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5">
            Lv. {profile.level}
          </div>
          <div className="text-[9px] sm:text-[10px] text-[var(--primary)] font-bold mt-0.5">
            {profile.currentXP} XP
          </div>
        </div>

        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-[var(--border)] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Streak</div>
          <div className="text-xl sm:text-2xl font-black text-orange-500 mt-0.5 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-500 text-orange-500" />
            {profile.streakDays}d
          </div>
          <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
            Best: {profile.bestStreak}d
          </div>
        </div>

        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-[var(--border)] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Focus</div>
          <div className="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5">
            {totalFocusMinutes} <span className="text-xs font-normal text-[var(--text-muted)]">m</span>
          </div>
        </div>

        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-[var(--border)] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Milestones</div>
          <div className="text-xl sm:text-2xl font-black text-[var(--primary)] mt-0.5">
            {totalMilestonesDone}
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)]">
        <div className="flex items-center justify-between gap-2 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
              Badges ({unlockedCount}/{badges.length})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {badges.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-amber-500/5 border-amber-500/30'
                    : 'bg-[var(--bg-card-subtle)] border-[var(--border)] opacity-40 grayscale'
                }`}
              >
                <div className="text-2xl sm:text-3xl p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shrink-0 select-none">
                  {badge.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] truncate">
                      {badge.title}
                    </h3>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      {badge.rarity}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5 sm:mt-1">
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

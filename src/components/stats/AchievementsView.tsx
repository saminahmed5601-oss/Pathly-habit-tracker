'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PlantShopCard } from './PlantShopCard';
import { Award, Flame, Share2, ShieldCheck, Sparkles, Filter, Leaf } from 'lucide-react';
import { BadgeTier } from '@/types';

interface AchievementsViewProps {
  onOpenShareCard: () => void;
  onOpenHelp: () => void;
}

const RANKS = [
  { minLevel: 1, maxLevel: 2, title: 'Sproutling', emoji: '🌱', color: 'text-emerald-500' },
  { minLevel: 3, maxLevel: 5, title: 'Bronze Pioneer', emoji: '🥉', color: 'text-amber-700' },
  { minLevel: 6, maxLevel: 9, title: 'Silver Achiever', emoji: '🥈', color: 'text-slate-400' },
  { minLevel: 10, maxLevel: 14, title: 'Gold Master', emoji: '🥇', color: 'text-amber-500' },
  { minLevel: 15, maxLevel: 19, title: 'Diamond Titan', emoji: '💎', color: 'text-cyan-400' },
  { minLevel: 20, maxLevel: 999, title: 'Grandmaster Legend', emoji: '👑', color: 'text-purple-500' },
];

export function AchievementsView({ onOpenShareCard }: AchievementsViewProps) {
  const { profile, badges, focusLogs, goals, buyStreakShield } = useApp();
  const [shieldMsg, setShieldMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'shop' | 'badges'>('all');
  const [badgeFilter, setBadgeFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = badges.filter(b => profile.unlockedBadges.includes(b.id)).length;
  const totalFocusMinutes = focusLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  const totalMilestonesDone = goals.reduce((acc, g) => acc + g.milestones.filter(m => m.isCompleted).length, 0);

  const currentRank = RANKS.find(r => profile.level >= r.minLevel && profile.level <= r.maxLevel) || RANKS[0];
  const nextRank = RANKS.find(r => r.minLevel > profile.level) || null;

  const xpPercent = Math.min(100, Math.round((profile.currentXP / profile.nextLevelXP) * 100));

  const handleBuyShield = () => {
    const res = buyStreakShield();
    setShieldMsg({ text: res.message, isError: !res.success });
    setTimeout(() => setShieldMsg(null), 4500);
  };

  const getTierStyle = (tier?: BadgeTier, isUnlocked?: boolean) => {
    if (!isUnlocked) {
      return 'bg-[var(--bg-card-subtle)] border-black/[0.04] dark:border-white/[0.06] opacity-40 grayscale';
    }

    switch (tier) {
      case 'prismatic':
        return 'prismatic-border bg-[var(--bg-card)] shadow-lg shadow-purple-500/10';
      case 'gold':
        return 'bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-2 border-amber-400 dark:border-amber-500 shadow-md shadow-amber-500/10';
      case 'silver':
        return 'bg-gradient-to-br from-slate-200/40 to-slate-300/10 dark:from-slate-800/40 dark:to-slate-900/10 border-2 border-slate-300 dark:border-slate-600 shadow-sm';
      case 'wood':
      default:
        return 'bg-gradient-to-br from-amber-900/5 to-amber-700/5 border-2 border-amber-700/40 shadow-xs';
    }
  };

  const filteredBadges = badges.filter((b) => {
    const isUnlocked = profile.unlockedBadges.includes(b.id);
    if (badgeFilter === 'unlocked') return isUnlocked;
    if (badgeFilter === 'locked') return !isUnlocked;
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">
            Trophy Case &amp; Collectibles
          </h1>
          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
            Your badge collections, botanical seed shop, and streak shield inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenShareCard}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs transition-all w-full sm:w-auto cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Export Trophy Card</span>
          </button>
        </div>
      </div>

      {/* Navigation View Switcher (All / Botanical Shop / Badges) */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] w-fit text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-xs font-black'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          All Collectibles
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shop')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'shop'
              ? 'bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 shadow-xs font-black'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Leaf className="w-3.5 h-3.5" />
          <span>Plant Shop</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('badges')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'badges'
              ? 'bg-[var(--bg-card)] text-amber-600 dark:text-amber-400 shadow-xs font-black'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Tiered Badges</span>
        </button>
      </div>

      {/* Level Progression & Rank Card */}
      <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-500/20 flex items-center justify-center text-3xl sm:text-4xl shadow-inner shrink-0">
              {currentRank.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-sm sm:text-base font-black ${currentRank.color}`}>
                  {currentRank.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-text)] font-black text-[10px]">
                  Lv. {profile.level}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {profile.currentXP} / {profile.nextLevelXP} XP towards Level {profile.level + 1}
              </p>
            </div>
          </div>

          {nextRank && (
            <div className="sm:text-right text-xs text-[var(--text-muted)]">
              <span>Next Rank: </span>
              <strong className="text-[var(--text-main)]">{nextRank.emoji} {nextRank.title}</strong>
              <div className="text-[10px] text-[var(--text-muted)]">Unlocks at Level {nextRank.minLevel}</div>
            </div>
          )}

        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-2.5 sm:h-3 bg-black/[0.04] dark:bg-white/[0.08] rounded-full overflow-hidden border border-black/[0.04] dark:border-white/[0.06]">
            <div 
              className="h-full bg-gradient-to-r from-[var(--primary)] to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Stat Counters (4 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Level</div>
          <div className="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5">
            Lv. {profile.level}
          </div>
          <div className="text-[9px] sm:text-[10px] text-[var(--primary)] font-bold mt-0.5">
            {profile.currentXP} XP
          </div>
        </div>

        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Streak</div>
          <div className="text-xl sm:text-2xl font-black text-orange-500 mt-0.5 flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-orange-500 text-orange-500 animate-flame" />
            {profile.streakDays}d
          </div>
          <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
            Best: {profile.bestStreak}d
          </div>
        </div>

        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Focus Logged</div>
          <div className="text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5">
            {totalFocusMinutes} <span className="text-xs font-normal text-[var(--text-muted)]">m</span>
          </div>
        </div>

        <div className="clean-card p-3 sm:p-4 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] text-center">
          <div className="text-[9px] sm:text-[10px] font-black text-[var(--text-muted)] uppercase">Milestones</div>
          <div className="text-xl sm:text-2xl font-black text-[var(--primary)] mt-0.5">
            {totalMilestonesDone}
          </div>
        </div>
      </div>

      {/* Botanical Seed Nursery & XP Shop */}
      {(activeTab === 'all' || activeTab === 'shop') && (
        <PlantShopCard />
      )}

      {/* Streak Shield Power-Up Management */}
      {(activeTab === 'all' || activeTab === 'shop') && (
        <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                    Streak Shield Protection
                  </h3>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {profile.streakShields || 0} Available
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
                  Automatically consumes 1 shield if you miss a day, preserving your active streak!
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyShield}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all w-full sm:w-auto shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Buy Shield (150 XP)</span>
            </button>
          </div>

          {shieldMsg && (
            <div className={`mt-3 p-2.5 rounded-xl text-xs font-bold transition-all ${
              shieldMsg.isError
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}>
              {shieldMsg.text}
            </div>
          )}
        </div>
      )}

      {/* Tiered Badges Grid */}
      {(activeTab === 'all' || activeTab === 'badges') && (
        <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Award className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-[var(--text-main)]">
                  Tiered Badges ({unlockedCount}/{badges.length})
                </h2>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Wood, Silver, Gold, and Prismatic tiered achievements
                </p>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setBadgeFilter('all')}
                className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  badgeFilter === 'all' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setBadgeFilter('unlocked')}
                className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  badgeFilter === 'unlocked' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'
                }`}
              >
                Unlocked ({unlockedCount})
              </button>
              <button
                type="button"
                onClick={() => setBadgeFilter('locked')}
                className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                  badgeFilter === 'locked' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'
                }`}
              >
                Locked
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filteredBadges.map((badge) => {
              const isUnlocked = profile.unlockedBadges.includes(badge.id);
              const tier = badge.tier || 'wood';

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl transition-all flex items-start gap-3.5 relative overflow-hidden ${getTierStyle(tier, isUnlocked)}`}
                >
                  <div className="text-3xl p-2.5 rounded-2xl bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] shrink-0 select-none shadow-xs">
                    {badge.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-xs sm:text-sm font-black text-[var(--text-main)] truncate">
                        {badge.title}
                      </h3>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        tier === 'prismatic'
                          ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                          : tier === 'gold'
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                          : tier === 'silver'
                          ? 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border border-slate-500/30'
                          : 'bg-amber-900/15 text-amber-800 dark:text-amber-200'
                      }`}>
                        {tier}
                      </span>
                    </div>

                    <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-relaxed">
                      {badge.description}
                    </p>

                    {isUnlocked && (
                      <div className="mt-2 text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span>✓ Unlocked</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

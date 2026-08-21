'use client';

import React from 'react';
import { FriendBuddy } from '@/types';
import { useApp } from '@/context/AppContext';
import { X, Flame, Target, Trophy, Clock, Heart, CheckCircle2 } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface BuddyDetailModalProps {
  buddy: FriendBuddy | null;
  onClose: () => void;
}

export function BuddyDetailModal({ buddy, onClose }: BuddyDetailModalProps) {
  const { sendCheer } = useApp();

  if (!buddy) return null;

  const CHEER_EMOJIS = [
    { emoji: '🔥', label: 'Fire' },
    { emoji: '☕', label: 'Coffee' },
    { emoji: '🌟', label: 'Star' },
    { emoji: '💪', label: 'Power' },
  ];

  const initialLetter = (buddy.name.replace('#pathly-', '').replace('pathly-', '').replace('#', '').charAt(0) || 'P').toUpperCase();
  const overallMilestonePercent = buddy.totalMilestonesCount && buddy.totalMilestonesCount > 0
    ? Math.min(100, Math.round(((buddy.totalMilestonesCompleted || 0) / buddy.totalMilestonesCount) * 100))
    : 0;

  const todayFocusPercent = Math.min(100, Math.round((buddy.todayMinutes / (buddy.todayTargetMinutes || 60)) * 100));

  const handleSendCheer = (emoji: string, label: string) => {
    sendCheer(buddy.id, emoji, label);
    sounds.playTaskPop();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="clean-card w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp">
        
        {/* Modal Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent border-b border-[var(--border)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Real Google Profile Photo or Large Gradient Avatar */}
            {buddy.photoURL ? (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border-2 border-purple-500 overflow-hidden shrink-0 shadow-md bg-purple-500/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={buddy.photoURL}
                  alt={buddy.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 text-white font-black flex items-center justify-center text-2xl sm:text-3xl shadow-md shrink-0 select-none">
                {initialLetter}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-xl font-black text-[var(--text-main)] truncate">
                  {buddy.name}
                </h2>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400">
                  Level {buddy.currentLevel}
                </span>
              </div>

              <div className="text-xs font-mono text-[var(--primary)] font-semibold mt-0.5 truncate">
                {buddy.tagline || `#pathly-${buddy.name.toLowerCase()}`}
              </div>

              <div className="flex items-center gap-3 mt-2 text-xs font-bold">
                <div className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span>{buddy.streak} Day Streak</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-center">
              <div className="text-xs text-[var(--text-muted)] font-medium mb-0.5 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Today Focus</span>
              </div>
              <div className="text-sm sm:text-base font-black text-[var(--text-main)]">
                {buddy.todayMinutes}m
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-center">
              <div className="text-xs text-[var(--text-muted)] font-medium mb-0.5 flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-emerald-400" />
                <span>Milestones Done</span>
              </div>
              <div className="text-sm sm:text-base font-black text-[var(--text-main)]">
                {buddy.totalMilestonesCompleted || 0}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-[var(--text-muted)] font-medium mb-0.5 flex items-center justify-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                <span>Best Streak</span>
              </div>
              <div className="text-sm sm:text-base font-black text-[var(--text-main)]">
                {buddy.bestStreak || buddy.streak || 0}d
              </div>
            </div>
          </div>

          {/* What They're Trying to Achieve (Active Goals) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs sm:text-sm font-black text-[var(--text-main)] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-500" />
                <span>What They&apos;re Trying to Achieve</span>
              </h3>
              {buddy.totalMilestonesCount ? (
                <span className="text-[11px] font-bold text-[var(--text-muted)]">
                  {buddy.totalMilestonesCompleted || 0} / {buddy.totalMilestonesCount} Steps ({overallMilestonePercent}%)
                </span>
              ) : null}
            </div>

            {buddy.activeGoals && buddy.activeGoals.length > 0 ? (
              <div className="space-y-2.5">
                {buddy.activeGoals.map((goal, idx) => {
                  const percent = Math.min(100, Math.round((goal.completedCount / (goal.totalCount || 1)) * 100));
                  return (
                    <div key={idx} className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[var(--text-main)]">
                        <span className="flex items-center gap-1.5">
                          <span>{goal.icon || '🎯'}</span>
                          <span className="truncate max-w-[200px]">{goal.title}</span>
                        </span>
                        <span className="text-purple-400 font-mono text-[11px]">
                          {goal.completedCount} / {goal.totalCount} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-center space-y-2">
                <div className="text-xs font-bold text-[var(--text-main)] flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>🎯 {buddy.todayGoalTitle || 'Daily Habits & Discipline'}</span>
                </div>
                <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${todayFocusPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {todayFocusPercent}% of today&apos;s target completed ({buddy.todayMinutes}m focus logged)
                </p>
              </div>
            )}
          </div>

          {/* Recent Cheers */}
          {buddy.recentCheers && buddy.recentCheers.length > 0 && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-[var(--text-main)] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <span>
                Recent Cheer: {buddy.recentCheers[0].emoji} {buddy.recentCheers[0].label} from {buddy.recentCheers[0].fromName}
              </span>
            </div>
          )}

          {/* 1-Tap Boost / Cheer Section */}
          <div className="pt-2">
            <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase mb-2 text-center">
              Send an Instant Cheer Boost ⚡
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CHEER_EMOJIS.map((c) => (
                <button
                  key={c.emoji}
                  onClick={() => handleSendCheer(c.emoji, c.label)}
                  className="py-3 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-purple-500/20 border border-[var(--border)] text-2xl hover:scale-105 active:scale-95 transition-all flex flex-col items-center gap-0.5"
                  title={c.label}
                >
                  <span>{c.emoji}</span>
                  <span className="text-[9px] font-bold text-[var(--text-muted)]">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[var(--bg-card-subtle)] border-t border-[var(--border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

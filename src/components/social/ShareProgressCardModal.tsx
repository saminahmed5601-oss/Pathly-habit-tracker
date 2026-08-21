'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { sounds } from '@/lib/sounds';
import { Share2, X, Copy, Check, Sparkles, Flame, Clock, Trophy } from 'lucide-react';

interface ShareProgressCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareProgressCardModal({ isOpen, onClose }: ShareProgressCardModalProps) {
  const { profile, dailyPlan, focusLogs, goals } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatarId) || AVATAR_OPTIONS[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const todayFocusMinutes = focusLogs
    .filter(log => log.date === todayStr)
    .reduce((acc, log) => acc + log.durationMinutes, 0);

  const completedTasks = dailyPlan.priorityTasks.filter(t => t.completed).length;
  const totalTasks = dailyPlan.priorityTasks.length;

  const activeGoal = goals[0];
  const goalCompletedCount = activeGoal ? activeGoal.milestones.filter(m => m.isCompleted).length : 0;

  const shareText = `🌱 Pathly Daily Report 🌱
📅 ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
👤 ${profile.name} (Lv. ${profile.level})
🔥 ${profile.streakDays}-Day Streak Unbroken
⏱️ ${todayFocusMinutes} mins of deep focus
✅ ${completedTasks}/${totalTasks} Priority Missions
🎯 ${activeGoal ? `${activeGoal.title}: ${goalCompletedCount}/${activeGoal.totalMilestones} milestones` : ''}
🚀 "Every focused step moves you further along your path!"`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    sounds.playTaskPop();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-teal-300 dark:border-teal-900/60 shadow-2xl p-6 sm:p-8 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-5 h-5 text-teal-500" />
          <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
            Share Daily Progress Card
          </h2>
        </div>

        {/* The Cute Rendered Graphic Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 border-2 border-teal-200 dark:border-teal-800 shadow-md my-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center text-2xl">
                {currentAvatar.emoji}
              </div>
              <div>
                <div className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                  {profile.name}
                </div>
                <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400">
                  Level {profile.level} • {profile.currentXP} XP
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-xs font-black shadow-xs">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>{profile.streakDays}d Streak</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 my-3">
            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-teal-100 dark:border-zinc-700">
              <div className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-500" /> Focus Time
              </div>
              <div className="text-base font-black text-zinc-800 dark:text-zinc-100 mt-0.5">
                {todayFocusMinutes} mins
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-teal-100 dark:border-zinc-700">
              <div className="text-[10px] text-zinc-400 font-bold uppercase flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500" /> Priority Tasks
              </div>
              <div className="text-base font-black text-zinc-800 dark:text-zinc-100 mt-0.5">
                {completedTasks}/{totalTasks} Done
              </div>
            </div>
          </div>

          {activeGoal && (
            <div className="p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-teal-100 dark:border-zinc-700 text-xs">
              <div className="text-[10px] text-zinc-400 font-semibold truncate">
                Active Journey: {activeGoal.title}
              </div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {goalCompletedCount} / {activeGoal.totalMilestones} Milestones Completed ({Math.round((goalCompletedCount / activeGoal.totalMilestones) * 100)}%)
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-teal-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[10px] text-zinc-400 font-bold">
            <span>🌱 Pathly System</span>
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs shadow-md transition-all active:scale-98"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard! 🎉</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Shareable Card Text</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}

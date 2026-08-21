'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { sounds } from '@/lib/sounds';
import { Share2, X, Copy, Check, Flame, Clock, Trophy } from 'lucide-react';

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
⏱️ ${todayFocusMinutes} mins focused
✅ ${completedTasks}/${totalTasks} Missions Done
🎯 ${activeGoal ? `${activeGoal.title}: ${goalCompletedCount}/${activeGoal.totalMilestones}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    sounds.playTaskPop();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-sm clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Share2 className="w-4 h-4 text-[var(--primary)]" />
          <h2 className="text-base font-black text-[var(--text-main)]">
            Share Daily Card
          </h2>
        </div>

        {/* Card */}
        <div className="p-5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] my-3 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center text-xl">
                {currentAvatar.emoji}
              </div>
              <div>
                <div className="text-xs font-black text-[var(--text-main)]">
                  {profile.name}
                </div>
                <div className="text-[10px] font-bold text-[var(--primary)]">
                  Level {profile.level}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-orange-500/10 text-orange-500 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
              <span>{profile.streakDays}d</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold">Focus</div>
              <div className="text-xs font-black text-[var(--text-main)] mt-0.5">{todayFocusMinutes} mins</div>
            </div>
            <div className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
              <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold">Tasks</div>
              <div className="text-xs font-black text-[var(--text-main)] mt-0.5">{completedTasks}/{totalTasks} Done</div>
            </div>
          </div>

          {activeGoal && (
            <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-xs">
              <div className="text-[10px] text-[var(--text-muted)] font-semibold truncate">{activeGoal.title}</div>
              <div className="text-xs font-black text-[var(--primary)] mt-0.5">
                {goalCompletedCount}/{activeGoal.totalMilestones} Milestones ({Math.round((goalCompletedCount / activeGoal.totalMilestones) * 100)}%)
              </div>
            </div>
          )}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-opacity"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Card Text</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}

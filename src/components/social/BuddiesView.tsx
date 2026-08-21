'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { Flame, Plus, Heart, Sparkles } from 'lucide-react';

export function BuddiesView() {
  const { friends, sendCheer, addNewFriend } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [avatar, setAvatar] = useState('fox');

  const CHEER_EMOJIS = [
    { emoji: '🔥', label: 'Fire' },
    { emoji: '☕', label: 'Coffee' },
    { emoji: '🌟', label: 'Star' },
    { emoji: '💪', label: 'Power' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewFriend({
      name: name.trim(),
      avatarId: avatar,
      tagline: 'Studying & building daily! ✨',
      todayGoalTitle: goal.trim() || 'Finish Daily Goals',
    });

    setShowAddModal(false);
    setName('');
    setGoal('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">
            Accountability Buddies
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Share progress and exchange 1-tap energy boosts
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-xs transition-opacity self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Buddy</span>
        </button>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {friends.map((friend) => {
          const avatarMeta = AVATAR_OPTIONS.find(a => a.id === friend.avatarId) || AVATAR_OPTIONS[0];
          const progressPercent = Math.min(100, Math.round((friend.todayMinutes / (friend.todayTargetMinutes || 60)) * 100));

          return (
            <div
              key={friend.id}
              className="clean-card p-5 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Profile row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-2xl">
                      {avatarMeta.emoji}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        {friend.name}
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-500">
                          Lv.{friend.currentLevel}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] truncate max-w-[160px]">
                        {friend.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    <span>{friend.streak}d</span>
                  </div>
                </div>

                {/* Today's Goal Progress */}
                <div className="my-3 p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
                  <div className="flex justify-between text-xs font-semibold text-[var(--text-main)] mb-1.5">
                    <span className="truncate max-w-[160px]">🎯 {friend.todayGoalTitle}</span>
                    <span className="text-purple-500 font-bold">{friend.todayMinutes}m</span>
                  </div>
                  <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recent Cheer */}
                {friend.recentCheers && friend.recentCheers.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                    <span className="truncate">
                      {friend.recentCheers[0].emoji} {friend.recentCheers[0].label} from {friend.recentCheers[0].fromName}
                    </span>
                  </div>
                )}
              </div>

              {/* 1-Tap Cheer Buttons */}
              <div className="pt-3 border-t border-[var(--border)]">
                <div className="grid grid-cols-4 gap-1.5">
                  {CHEER_EMOJIS.map((c) => (
                    <button
                      key={c.emoji}
                      onClick={() => sendCheer(friend.id, c.emoji, c.label)}
                      className="py-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-purple-500/15 border border-[var(--border)] text-base hover:scale-105 active:scale-95 transition-all"
                      title={c.label}
                    >
                      {c.emoji}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Buddy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl">
            <h3 className="text-base font-bold text-[var(--text-main)] mb-1">
              Add Buddy
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">
              Add a friend to share progress and keep streaks alive
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  Avatar Pet
                </label>
                <div className="flex gap-2">
                  {AVATAR_OPTIONS.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => setAvatar(a.id)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        avatar === a.id ? 'bg-purple-500/20 border-2 border-purple-500 scale-105' : 'bg-[var(--bg-card-subtle)]'
                      }`}
                    >
                      {a.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                  Today&apos;s Focus Goal
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Master React Hooks"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-main)] font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:opacity-90 text-white font-bold text-xs shadow-xs"
                >
                  Add Buddy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

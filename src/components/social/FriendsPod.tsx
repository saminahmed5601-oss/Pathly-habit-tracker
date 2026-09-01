'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { Users, Flame, Heart, Plus } from 'lucide-react';

export function FriendsPod() {
  const { friends, sendCheer, addNewFriend } = useApp();
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [friendName, setFriendName] = useState('');
  const [friendTagline, setFriendTagline] = useState('');
  const [friendGoal, setFriendGoal] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('fox');

  const CHEER_EMOJIS = [
    { emoji: '🔥', label: 'On Fire!' },
    { emoji: '☕', label: 'Coffee Boost' },
    { emoji: '🌟', label: 'Superstar' },
    { emoji: '💪', label: 'Keep Crushing' },
  ];

  const handleAddFriendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendName.trim()) return;

    addNewFriend({
      name: friendName.trim(),
      avatarId: selectedAvatar,
      tagline: friendTagline.trim() || 'Studying & building every day! ✨',
      todayGoalTitle: friendGoal.trim() || 'Finish Daily Goals',
    });

    setShowAddFriendModal(false);
    setFriendName('');
    setFriendTagline('');
    setFriendGoal('');
  };

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-white/10 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Friend Pod & Accountability
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 font-bold">
                {friends.length} Buddies
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Cheer your squad, protect shared momentum & exchange energy
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddFriendModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Buddy</span>
        </button>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {friends.map((friend) => {
          const avatarMeta = AVATAR_OPTIONS.find(a => a.id === friend.avatarId) || AVATAR_OPTIONS[0];
          const progressPercent = Math.min(100, Math.round((friend.todayMinutes / (friend.todayTargetMinutes || 60)) * 100));

          return (
            <div
              key={friend.id}
              className="rounded-2xl p-4 bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/80 dark:border-zinc-700/60 flex flex-col justify-between hover:border-purple-300 dark:hover:border-purple-700 transition-all"
            >
              <div>
                {/* Top Profile row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-xl shadow-xs">
                      {avatarMeta.emoji}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        {friend.name}
                        <span className="text-[10px] text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/70 px-1.5 py-0.2 rounded-sm font-semibold">
                          Lv.{friend.currentLevel}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
                        {friend.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600 dark:text-orange-400">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    <span>{friend.streak}d</span>
                  </div>
                </div>

                {/* Today's Goal & Progress Bar */}
                <div className="my-3 p-2.5 rounded-xl bg-white dark:bg-zinc-800/70 border border-zinc-100 dark:border-zinc-700/50">
                  <div className="flex justify-between text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    <span className="truncate max-w-[130px]">🎯 {friend.todayGoalTitle}</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{friend.todayMinutes}m</span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recent Cheer feed */}
                {friend.recentCheers && friend.recentCheers.length > 0 && (
                  <div className="flex items-center gap-1 mb-3 text-[10px] text-zinc-500 dark:text-zinc-400">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span className="truncate">
                      {friend.recentCheers[0].emoji} {friend.recentCheers[0].label} from {friend.recentCheers[0].fromName}
                    </span>
                  </div>
                )}
              </div>

              {/* One-click Cheer Buttons */}
              <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Send Energy Boost:
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {CHEER_EMOJIS.map((c) => (
                    <button
                      key={c.emoji}
                      onClick={() => sendCheer(friend.id, c.emoji, c.label)}
                      className="py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 border border-zinc-200/80 dark:border-zinc-700/80 text-sm hover:scale-110 active:scale-95 transition-all"
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

      {/* Add Friend Modal */}
      {showAddFriendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Add Accountability Buddy
            </h3>
            <p className="text-xs text-zinc-500 mb-4">
              Add a friend or create a study partner to hold each other to daily goals!
            </p>

            <form onSubmit={handleAddFriendSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Buddy Name *
                </label>
                <input
                  type="text"
                  required
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Avatar Pet
                </label>
                <div className="flex gap-2">
                  {AVATAR_OPTIONS.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => setSelectedAvatar(a.id)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        selectedAvatar === a.id ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500 scale-105' : 'bg-zinc-100 dark:bg-zinc-800'
                      }`}
                    >
                      {a.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Today&apos;s Focus Mission
                </label>
                <input
                  type="text"
                  value={friendGoal}
                  onChange={(e) => setFriendGoal(e.target.value)}
                  placeholder="e.g. Master Flexbox Layouts"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFriendModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
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

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { Users, Flame, Plus, Heart, Sparkles, Send } from 'lucide-react';

export function BuddiesView() {
  const { friends, sendCheer, addNewFriend } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [goal, setGoal] = useState('');
  const [avatar, setAvatar] = useState('fox');

  const CHEER_EMOJIS = [
    { emoji: '🔥', label: 'On Fire!' },
    { emoji: '☕', label: 'Coffee' },
    { emoji: '🌟', label: 'Superstar' },
    { emoji: '💪', label: 'Keep Pumping' },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewFriend({
      name: name.trim(),
      avatarId: avatar,
      tagline: tagline.trim() || 'Studying & building every day! ✨',
      todayGoalTitle: goal.trim() || 'Finish Daily Goals',
    });

    setShowAddModal(false);
    setName('');
    setTagline('');
    setGoal('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Accountability Buddies & Friend Pod
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Cheer your squad, stay accountable together, and exchange daily energy
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Buddy</span>
        </button>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {friends.map((friend) => {
          const avatarMeta = AVATAR_OPTIONS.find(a => a.id === friend.avatarId) || AVATAR_OPTIONS[0];
          const progressPercent = Math.min(100, Math.round((friend.todayMinutes / (friend.todayTargetMinutes || 60)) * 100));

          return (
            <div
              key={friend.id}
              className="clean-card p-5 bg-white dark:bg-[#151C28] flex flex-col justify-between space-y-4 hover:border-purple-300 dark:hover:border-purple-800 transition-colors"
            >
              <div>
                {/* Profile row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/80 flex items-center justify-center text-2xl">
                      {avatarMeta.emoji}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        {friend.name}
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          Lv.{friend.currentLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate max-w-[170px]">
                        {friend.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-1 rounded-lg">
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                    <span>{friend.streak}d</span>
                  </div>
                </div>

                {/* Today's Goal Progress */}
                <div className="my-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    <span className="truncate max-w-[160px]">🎯 {friend.todayGoalTitle}</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">{friend.todayMinutes}m focused</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recent Cheer */}
                {friend.recentCheers && friend.recentCheers.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                    <span className="truncate">
                      {friend.recentCheers[0].emoji} {friend.recentCheers[0].label} from {friend.recentCheers[0].fromName}
                    </span>
                  </div>
                )}
              </div>

              {/* One-click Cheer Boost Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Send Quick Cheer Boost:
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {CHEER_EMOJIS.map((c) => (
                    <button
                      key={c.emoji}
                      onClick={() => sendCheer(friend.id, c.emoji, c.label)}
                      className="py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/60 border border-slate-200/80 dark:border-slate-700 text-base hover:scale-105 active:scale-95 transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm clean-card p-6 bg-white dark:bg-[#151C28] shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Add Accountability Buddy
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a friend to track daily habits and keep each other consistent!
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Avatar Pet
                </label>
                <div className="flex gap-2">
                  {AVATAR_OPTIONS.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => setAvatar(a.id)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                        avatar === a.id ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-500 scale-105' : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      {a.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Today&apos;s Focus Mission
                </label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Master React Hooks"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
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

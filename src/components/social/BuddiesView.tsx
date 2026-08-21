'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { Flame, Heart, Copy, Check, UserPlus } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export function BuddiesView() {
  const { friends, sendCheer, friendCode, connectFriendByCode } = useApp();
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState('');
  const [copiedMyCode, setCopiedMyCode] = useState(false);

  const CHEER_EMOJIS = [
    { emoji: '🔥', label: 'Fire' },
    { emoji: '☕', label: 'Coffee' },
    { emoji: '🌟', label: 'Star' },
    { emoji: '💪', label: 'Power' },
  ];

  const handleCopyMyCode = () => {
    navigator.clipboard.writeText(friendCode);
    setCopiedMyCode(true);
    sounds.playTaskPop();
    setTimeout(() => setCopiedMyCode(false), 2000);
  };

  const handleConnectByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;

    try {
      setIsConnecting(true);
      setConnectError('');
      const success = await connectFriendByCode(friendCodeInput.trim());
      if (success) {
        setFriendCodeInput('');
      } else {
        setConnectError('Could not find friend with this code.');
      }
    } catch {
      setConnectError('Error connecting to friend.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header & Friend Code Bar */}
      <div className="clean-card p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
            Your Personal Friend Code
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-base sm:text-lg font-black text-[var(--primary)]">
              {friendCode}
            </span>
            <button
              onClick={handleCopyMyCode}
              className="px-2.5 py-1.5 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] hover:opacity-80 text-xs font-bold flex items-center gap-1 transition-opacity active:scale-95"
            >
              {copiedMyCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMyCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Connect Friend Form */}
        <form onSubmit={handleConnectByCode} className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:max-w-md">
          <input
            type="text"
            required
            value={friendCodeInput}
            onChange={(e) => {
              setFriendCodeInput(e.target.value);
              if (connectError) setConnectError('');
            }}
            placeholder="Friend's Code (e.g. PATH-MAYA)..."
            className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none uppercase font-mono"
          />
          <button
            type="submit"
            disabled={isConnecting || !friendCodeInput.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:opacity-90 active:scale-98 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isConnecting ? 'Adding...' : 'Connect Buddy'}</span>
          </button>
        </form>
      </div>

      {connectError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-bold">
          {connectError}
        </div>
      )}

      {/* Friends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {friends.map((friend) => {
          const avatarMeta = AVATAR_OPTIONS.find(a => a.id === friend.avatarId) || AVATAR_OPTIONS[0];
          const progressPercent = Math.min(100, Math.round((friend.todayMinutes / (friend.todayTargetMinutes || 60)) * 100));

          return (
            <div
              key={friend.id}
              className="clean-card p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between space-y-3.5"
            >
              <div>
                {/* Profile row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                      {avatarMeta.emoji}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
                        {friend.name}
                        <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-500">
                          Lv.{friend.currentLevel}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[var(--text-muted)] truncate max-w-[140px] sm:max-w-[160px]">
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
                <div className="my-2.5 p-2.5 sm:p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
                  <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-main)] mb-1">
                    <span className="truncate max-w-[150px]">🎯 {friend.todayGoalTitle}</span>
                    <span className="text-purple-500 font-bold">{friend.todayMinutes}m</span>
                  </div>
                  <div className="w-full bg-[var(--border)] h-1.5 sm:h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recent Cheer */}
                {friend.recentCheers && friend.recentCheers.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                    <span className="truncate">
                      {friend.recentCheers[0].emoji} {friend.recentCheers[0].label} from {friend.recentCheers[0].fromName}
                    </span>
                  </div>
                )}
              </div>

              {/* 1-Tap Cheer Boost Buttons */}
              <div className="pt-2.5 border-t border-[var(--border)]">
                <div className="grid grid-cols-4 gap-1.5">
                  {CHEER_EMOJIS.map((c) => (
                    <button
                      key={c.emoji}
                      onClick={() => sendCheer(friend.id, c.emoji, c.label)}
                      className="py-2.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-purple-500/15 border border-[var(--border)] text-lg hover:scale-105 active:scale-95 transition-all"
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

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { Flame, Heart, Copy, Check, UserPlus, Trash2, Plus, X, Edit3 } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export function BuddiesView() {
  const { 
    friends, 
    sendCheer, 
    friendCode, 
    updateCustomFriendCode, 
    connectFriendByCode, 
    removeFriend, 
    addNewFriend 
  } = useApp();

  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [connectError, setConnectError] = useState('');
  const [copiedMyCode, setCopiedMyCode] = useState(false);

  // Custom Friend Code Editing State
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editHandleInput, setEditHandleInput] = useState('');

  // Manual Add Modal / State
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTagline, setCustomTagline] = useState('Learning & Building Every Day 🔥');
  const [customGoalTitle, setCustomGoalTitle] = useState('Daily Goals');
  const [customAvatarId, setCustomAvatarId] = useState(AVATAR_OPTIONS[0].id);

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

  const handleSaveCustomCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHandleInput.trim()) return;
    updateCustomFriendCode(editHandleInput.trim());
    setIsEditingCode(false);
    setSuccessMsg(`🏷️ Your Friend Tag is now set to ${friendCode}!`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleConnectByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim()) return;

    try {
      setIsConnecting(true);
      setConnectError('');
      setSuccessMsg('');
      const success = await connectFriendByCode(friendCodeInput.trim());
      if (success) {
        setSuccessMsg(`✨ Successfully connected buddy to your squad!`);
        setFriendCodeInput('');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setConnectError('Could not connect friend.');
      }
    } catch {
      setConnectError('Error connecting to friend.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateCustomBuddy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addNewFriend({
      name: customName.trim(),
      avatarId: customAvatarId,
      tagline: customTagline.trim() || 'Accountability Partner',
      todayGoalTitle: customGoalTitle.trim() || 'Daily Habits',
    });

    setCustomName('');
    setShowAddCustom(false);
    sounds.playLevelUp();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header & Customizable Friend Code Bar */}
      <div className="clean-card p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
            Your Personal Friend Tag
          </div>

          {isEditingCode ? (
            <form onSubmit={handleSaveCustomCode} className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-[var(--primary)]">#pathly-</span>
              <input
                type="text"
                autoFocus
                required
                value={editHandleInput}
                onChange={(e) => setEditHandleInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="yourname"
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[var(--bg-card-subtle)] border border-[var(--primary)] text-[var(--text-main)] w-32 focus:outline-none"
              />
              <button
                type="submit"
                className="px-2.5 py-1 rounded-lg bg-[var(--primary)] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingCode(false)}
                className="px-2 py-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-medium"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-base sm:text-lg font-black text-[var(--primary)]">
                {friendCode}
              </span>

              <button
                onClick={() => {
                  const raw = friendCode.replace('#pathly-', '').replace('pathly-', '').replace('#', '');
                  setEditHandleInput(raw);
                  setIsEditingCode(true);
                }}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] text-xs font-bold flex items-center gap-1 transition-colors active:scale-95"
                title="Change your tag (e.g. #pathly-mahin)"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Set Tag</span>
              </button>

              <button
                onClick={handleCopyMyCode}
                className="px-2.5 py-1.5 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] hover:opacity-80 text-xs font-bold flex items-center gap-1 transition-opacity active:scale-95"
              >
                {copiedMyCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMyCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
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
            placeholder="Friend's Tag (e.g. #pathly-alex)..."
            className="flex-1 min-w-[160px] px-3.5 py-2.5 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none font-mono"
          />
          <button
            type="submit"
            disabled={isConnecting || !friendCodeInput.trim()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:opacity-90 active:scale-98 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{isConnecting ? 'Connecting...' : 'Connect Buddy'}</span>
          </button>
        </form>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-[var(--primary)] font-bold flex items-center gap-2 animate-fadeIn">
          <span>🎉</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {connectError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-bold">
          {connectError}
        </div>
      )}

      {/* Section Header with + Add Custom Buddy Option */}
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm sm:text-base font-black text-[var(--text-main)]">
          Connected Squad ({friends.length})
        </h2>

        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-bold text-[var(--text-main)] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-purple-500" />
          <span>Add Custom Buddy</span>
        </button>
      </div>

      {/* Custom Buddy Inline Form */}
      {showAddCustom && (
        <form onSubmit={handleCreateCustomBuddy} className="clean-card p-4 sm:p-5 bg-[var(--bg-card)] border border-purple-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
              Add a Friend or Study Partner
            </h3>
            <button 
              type="button" 
              onClick={() => setShowAddCustom(false)} 
              className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Friend Name</label>
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1">Today Goal</label>
              <input
                type="text"
                value={customGoalTitle}
                onChange={(e) => setCustomGoalTitle(e.target.value)}
                placeholder="e.g. Daily Habits & Coding"
                className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none"
              />
            </div>
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase mb-1.5">Pick Avatar</label>
            <div className="flex items-center gap-2">
              {AVATAR_OPTIONS.map((a) => (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => setCustomAvatarId(a.id)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border transition-all ${
                    customAvatarId === a.id
                      ? 'border-purple-500 bg-purple-500/10 scale-110 shadow-xs'
                      : 'border-[var(--border)] bg-[var(--bg-card-subtle)]'
                  }`}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:opacity-90 active:scale-98 text-white font-bold text-xs transition-all shadow-xs"
          >
            Save Buddy to Squad
          </button>
        </form>
      )}

      {/* Friends Grid */}
      {friends.length === 0 ? (
        <div className="clean-card p-8 sm:p-12 text-center bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)] mb-1">
            No accountability buddies connected yet
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-4">
            Share your Friend Tag <strong className="text-[var(--primary)] font-mono">{friendCode}</strong> with friends, or enter their tag above to connect!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={handleCopyMyCode}
              className="px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              {copiedMyCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMyCode ? 'Copied Tag!' : 'Copy My Tag'}</span>
            </button>

            <button
              onClick={() => setShowAddCustom(true)}
              className="px-4 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border)] text-xs font-bold hover:bg-[var(--border)] active:scale-95 transition-all inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-purple-500" />
              <span>Add Custom Buddy</span>
            </button>
          </div>
        </div>
      ) : (
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
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl sm:text-2xl shrink-0">
                        {avatarMeta.emoji}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5 truncate">
                          <span className="truncate">{friend.name}</span>
                          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-500 shrink-0">
                            Lv.{friend.currentLevel}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-[var(--text-muted)] truncate">
                          {friend.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        <span>{friend.streak}d</span>
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${friend.name}" from your squad?`)) {
                            removeFriend(friend.id);
                          }
                        }}
                        className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        title="Remove buddy"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
      )}

    </div>
  );
}

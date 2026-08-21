import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { FriendBuddy } from '@/types';
import { Flame, Heart, Copy, Check, Trash2, Plus, X, Edit3, User, Send, Clock, UserCheck, UserX, ChevronRight, Target, Search, Sparkles, Loader2 } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { searchPublicProfiles, formatFriendCode } from '@/lib/firebase';
import { BuddyDetailModal } from './BuddyDetailModal';

export function BuddiesView() {
  const { 
    friends, 
    sendCheer, 
    friendCode, 
    updateCustomFriendCode, 
    incomingRequests,
    sentRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    cancelSentRequest,
    refreshFriendRequests,
    removeFriend, 
    addNewFriend,
    authUser,
    profile 
  } = useApp();

  const [friendTagInput, setFriendTagInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedMyCode, setCopiedMyCode] = useState(false);

  // Live Friend Search & Discovered Profiles State
  const [searchResults, setSearchResults] = useState<Array<{
    uid: string;
    tag: string;
    name: string;
    photoURL?: string | null;
    level: number;
    streak: number;
    bestStreak: number;
    todayGoalTitle: string;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced live search
  useEffect(() => {
    const query = friendTagInput.trim();
    if (!query || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchPublicProfiles(query);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [friendTagInput]);

  // Selected Buddy for Full Progress Modal
  const [selectedBuddy, setSelectedBuddy] = useState<FriendBuddy | null>(null);

  // Custom Friend Code Editing State
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [editHandleInput, setEditHandleInput] = useState('');
  const [isSavingCode, setIsSavingCode] = useState(false);

  // Manual Add Modal / State
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customTagline, setCustomTagline] = useState('Learning & Building Every Day 🔥');
  const [customGoalTitle, setCustomGoalTitle] = useState('Daily Goals');

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

  const handleSaveCustomCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHandleInput.trim()) return;
    setIsSavingCode(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateCustomFriendCode(editHandleInput.trim());
      if (res.success) {
        setIsEditingCode(false);
        setSuccessMsg(`🏷️ Your Friend Tag is now reserved & set to ${friendCode}!`);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.error || 'This handle is already taken by another user. Please choose another!');
      }
    } catch {
      setErrorMsg('Error reserving tag. Please try again.');
    } finally {
      setIsSavingCode(false);
    }
  };

  const handleSendDirectTag = async (tagToSend: string) => {
    if (!tagToSend.trim()) return;
    try {
      setIsSending(true);
      setErrorMsg('');
      setSuccessMsg('');
      const res = await sendFriendRequest(tagToSend.trim());
      if (res.success) {
        setSuccessMsg(res.message);
        setFriendTagInput('');
        setSearchResults([]);
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.message);
      }
    } catch {
      setErrorMsg('Error sending friend request.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendDirectTag(friendTagInput);
  };

  const handleCreateCustomBuddy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    addNewFriend({
      name: customName.trim(),
      avatarId: 'sprout',
      tagline: customTagline.trim() || 'Accountability Partner',
      todayGoalTitle: customGoalTitle.trim() || 'Daily Habits',
    });

    setCustomName('');
    setShowAddCustom(false);
    sounds.playLevelUp();
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header & Customizable Profile + Friend Request Bar */}
      <div className="clean-card p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: User Profile Picture & Tag */}
        <div className="flex items-center gap-3">
          {authUser?.photoURL ? (
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[var(--primary)] shrink-0 shadow-xs bg-emerald-500/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={authUser.photoURL} alt={authUser.displayName || 'You'} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white font-black flex items-center justify-center text-lg shrink-0 shadow-xs select-none">
              {(authUser?.displayName || profile.name || 'M').charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-[var(--text-main)]">
                {authUser?.displayName || profile.name}
              </span>
              <span className="text-[9px] font-bold text-[var(--primary)] bg-[var(--primary-light)] px-1.5 py-0.2 rounded">
                You
              </span>
            </div>

            {isEditingCode ? (
              <form onSubmit={handleSaveCustomCode} className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="font-mono text-xs font-bold text-[var(--primary)]">#pathly-</span>
                <input
                  type="text"
                  autoFocus
                  required
                  value={editHandleInput}
                  onChange={(e) => setEditHandleInput(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder="yourname"
                  className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-[var(--bg-card-subtle)] border border-[var(--primary)] text-[var(--text-main)] w-28 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSavingCode}
                  className="px-2.5 py-0.5 rounded-lg bg-[var(--primary)] disabled:opacity-50 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  {isSavingCode ? 'Checking...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingCode(false)}
                  className="px-1.5 py-0.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs font-medium"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-sm sm:text-base font-black text-[var(--primary)]">
                  {friendCode}
                </span>

                <button
                  onClick={() => {
                    const raw = friendCode.replace('#pathly-', '').replace('pathly-', '').replace('#', '');
                    setEditHandleInput(raw);
                    setIsEditingCode(true);
                  }}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)] text-xs font-bold flex items-center gap-1 transition-colors active:scale-95"
                  title="Change your tag (e.g. #pathly-mahin)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden sm:inline">Set Tag</span>
                </button>

                <button
                  onClick={handleCopyMyCode}
                  className="px-2 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] hover:opacity-80 text-xs font-bold flex items-center gap-1 transition-opacity active:scale-95"
                >
                  {copiedMyCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[11px]">{copiedMyCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Search User / Send Friend Request Form */}
        <form onSubmit={handleSendRequest} className="relative flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:max-w-md">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={friendTagInput}
              onChange={(e) => {
                setFriendTagInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Search by name or #tag (e.g. mahin)..."
              className="w-full pl-8.5 pr-7 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500 font-mono transition-colors"
            />
            {friendTagInput && (
              <button
                type="button"
                onClick={() => {
                  setFriendTagInput('');
                  setSearchResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] p-0.5 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSending || !friendTagInput.trim()}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:opacity-90 active:scale-98 disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>{isSending ? 'Sending...' : 'Send Request'}</span>
          </button>
        </form>
      </div>

      {/* Live Discovered User Search Preview Card */}
      {friendTagInput.trim().length >= 2 && (
        <div className="clean-card p-3.5 sm:p-4 bg-[var(--bg-card)] border-2 border-purple-500/30 rounded-2xl shadow-lg space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-bold text-purple-400 px-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>
                {isSearching 
                  ? 'Searching Pathly profiles...' 
                  : searchResults.length > 0 
                    ? `Discovered Users (${searchResults.length})` 
                    : 'Profile Search'}
              </span>
            </span>
            {isSearching && <Loader2 className="w-3 h-3 animate-spin text-purple-400" />}
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {searchResults.map((user, idx) => {
                const userTag = String(user?.tag || formatFriendCode(user?.name || `user-${idx}`)).trim();
                const myCode = String(friendCode || '').trim();
                const isMe = Boolean(userTag && myCode && userTag.toLowerCase() === myCode.toLowerCase());
                const isFriend = Boolean(userTag && friends.some(f => String(f?.tagline || '').toLowerCase() === userTag.toLowerCase()));
                const hasSent = Boolean(userTag && sentRequests.some(r => String(r?.toTag || '').toLowerCase() === userTag.toLowerCase()));
                
                const rawName = String(user?.name || userTag || 'User');
                const cleanDisplayName = rawName.startsWith('#')
                  ? rawName.replace(/^#pathly-/, '').replace(/^#/, '')
                  : (rawName || 'User');
                const letter = (cleanDisplayName.charAt(0) || 'P').toUpperCase();

                return (
                  <div 
                    key={userTag || `u-${idx}`}
                    className="p-3 rounded-xl bg-[var(--bg-card-subtle)] hover:border-purple-500/40 border border-[var(--border)] flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {user?.photoURL ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/40 shrink-0 bg-purple-500/10 shadow-2xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={user.photoURL} alt={cleanDisplayName} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white font-black flex items-center justify-center text-sm shrink-0 select-none shadow-2xs">
                          {letter}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[var(--text-main)] truncate">{cleanDisplayName}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-400 shrink-0">
                            Lv.{user.level || 1}
                          </span>
                          {user.streak > 0 && (
                            <span className="text-[9px] font-bold text-amber-500 flex items-center gap-0.5 shrink-0">
                              <Flame className="w-2.5 h-2.5" />
                              {user.streak}d
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[var(--primary)] truncate font-semibold">
                          {user.tag}
                        </div>
                        {user.todayGoalTitle && (
                          <div className="text-[10px] text-[var(--text-muted)] truncate flex items-center gap-1 mt-0.5">
                            <Target className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{user.todayGoalTitle}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isMe ? (
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] text-[11px] font-bold">
                          You
                        </span>
                      ) : isFriend ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Connected
                        </span>
                      ) : hasSent ? (
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[11px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Sent
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendDirectTag(user.tag)}
                          disabled={isSending}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 disabled:opacity-50 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isSending ? 'Sending...' : 'Send Request'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : !isSearching ? (
            <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-[var(--text-muted)]">
                <span>No profile named &ldquo;<span className="text-[var(--text-main)] font-semibold">{friendTagInput}</span>&rdquo; found yet. You can still send an invite to </span>
                <span className="font-mono font-bold text-[var(--primary)]">{formatFriendCode(friendTagInput)}</span>:
              </div>
              <button
                type="button"
                onClick={() => handleSendDirectTag(formatFriendCode(friendTagInput))}
                disabled={isSending}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 shrink-0 transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Invite {formatFriendCode(friendTagInput)}</span>
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-[var(--primary)] font-bold flex items-center gap-2 animate-fadeIn">
          <span>🎉</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-bold">
          {errorMsg}
        </div>
      )}

      {/* 1. Incoming Friend Requests Banner (Actionable) */}
      {incomingRequests.length > 0 && (
        <div className="clean-card p-4 sm:p-5 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-transparent border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-black text-[var(--text-main)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
              <span>Incoming Friend Requests ({incomingRequests.length})</span>
            </h3>

            <button
              onClick={() => {
                refreshFriendRequests();
                sounds.playTap();
              }}
              className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
              title="Refresh requests"
            >
              <span>Refresh</span>
              <span>🔄</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incomingRequests.map((req) => {
              const initial = (req.fromName.charAt(0) || 'P').toUpperCase();
              return (
                <div
                  key={req.id}
                  className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {req.fromPhotoURL ? (
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-purple-500/30 shrink-0 bg-purple-500/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={req.fromPhotoURL} alt={req.fromName} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black flex items-center justify-center text-sm shrink-0">
                        {initial}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[var(--text-main)] truncate flex items-center gap-1">
                        <span>{req.fromName}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-500">
                          Lv.{req.fromLevel}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--primary)] truncate block">
                        {req.fromTag}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:opacity-90 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => declineFriendRequest(req.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Decline"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Pending Sent Requests (Pending Confirmation) */}
      {sentRequests.length > 0 && (
        <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Sent Requests Pending ({sentRequests.length}):</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {sentRequests.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-main)] inline-flex items-center gap-1"
                >
                  {s.toTag}
                  <button
                    onClick={() => cancelSentRequest(s.id)}
                    className="text-[var(--text-muted)] hover:text-red-500 text-xs ml-0.5"
                    title="Cancel request"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section Header with + Add Custom Buddy Option */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-[var(--text-main)]">
            Connected Squad ({friends.length})
          </h2>
          <p className="text-[11px] text-[var(--text-muted)]">
            Tap any buddy card to inspect what they&apos;re trying to achieve and their real milestones progress!
          </p>
        </div>

        <button
          onClick={() => setShowAddCustom(!showAddCustom)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] border border-[var(--border)] text-xs font-bold text-[var(--text-main)] transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5 text-purple-500" />
          <span>Add Custom Buddy</span>
        </button>
      </div>

      {/* Custom Buddy Inline Form */}
      {showAddCustom && (
        <form onSubmit={handleCreateCustomBuddy} className="clean-card p-4 sm:p-5 bg-[var(--bg-card)] border border-purple-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-[var(--text-main)] flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-500" />
              <span>Add Friend / Study Partner</span>
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

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:opacity-90 active:scale-98 text-white font-bold text-xs transition-all shadow-xs"
          >
            Save Buddy to Squad
          </button>
        </form>
      )}

      {/* Friends Grid (Only shows accepted buddies) */}
      {friends.length === 0 ? (
        <div className="clean-card p-8 sm:p-12 text-center bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)] mb-1">
            No connected buddies in your squad yet
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-4">
            Send a friend request to a friend&apos;s tag above, or share your tag <strong className="text-[var(--primary)] font-mono">{friendCode}</strong> so they can request you!
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
            const progressPercent = Math.min(100, Math.round((friend.todayMinutes / (friend.todayTargetMinutes || 60)) * 100));
            const initialLetter = (friend.name.replace('#pathly-', '').replace('pathly-', '').replace('#', '').charAt(0) || 'P').toUpperCase();

            return (
              <div
                key={friend.id}
                className="clean-card p-4 sm:p-5 bg-[var(--bg-card)] border border-[var(--border)] hover:border-purple-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-3.5 group"
              >
                {/* Clickable Card Body to Inspect Progress */}
                <div
                  onClick={() => setSelectedBuddy(friend)}
                  className="cursor-pointer space-y-3.5"
                >
                  {/* Profile row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                      
                      {/* Real Google Profile Photo or Clean Gradient Letter Avatar */}
                      {friend.photoURL ? (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 border-purple-500/40 overflow-hidden shrink-0 bg-purple-500/10 shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={friend.photoURL} alt={friend.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-600 text-white font-black flex items-center justify-center text-lg sm:text-xl shadow-xs shrink-0 select-none">
                          {initialLetter}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-black text-[var(--text-main)] flex items-center gap-1.5 truncate group-hover:text-purple-400 transition-colors">
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

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
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
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
                    <div className="flex justify-between text-[11px] sm:text-xs font-semibold text-[var(--text-main)] mb-1">
                      <span className="truncate max-w-[150px] flex items-center gap-1">
                        <Target className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{friend.todayGoalTitle}</span>
                      </span>
                      <span className="text-purple-500 font-bold">{friend.todayMinutes}m</span>
                    </div>
                    <div className="w-full bg-[var(--border)] h-1.5 sm:h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Visual Progress Stepper & Callout */}
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-semibold">
                    <span>
                      {friend.totalMilestonesCompleted !== undefined ? (
                        <span>🎯 {friend.totalMilestonesCompleted} milestones achieved</span>
                      ) : (
                        <span>✨ Active Habit</span>
                      )}
                    </span>
                    <span className="text-purple-400 group-hover:underline flex items-center gap-0.5">
                      <span>View Progress</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
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

      {/* Complete Buddy Progress & Achievement Details Modal */}
      <BuddyDetailModal
        buddy={selectedBuddy}
        onClose={() => setSelectedBuddy(null)}
      />

    </div>
  );
}

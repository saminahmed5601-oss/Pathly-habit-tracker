'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { 
  Sun, 
  Moon,
  Target, 
  Users, 
  Award, 
  Flame, 
  ShieldCheck, 
  Share2,
  Cloud
} from 'lucide-react';

export type TabType = 'today' | 'milestones' | 'friends' | 'achievements';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenMorning: () => void;
  onOpenFocus: () => void;
  onOpenNewGoal: () => void;
  onOpenShareCard: () => void;
  onOpenHelp: () => void;
  onOpenAuth: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenShareCard,
  onOpenAuth,
}: NavbarProps) {
  const { profile, toggleTheme, isDarkMode, authUser } = useApp();
  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  const xpPercent = Math.min(100, Math.round((profile.currentXP / profile.nextLevelXP) * 100));

  return (
    <header className="sticky top-0 z-30 w-full bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border)] transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand & Profile Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button 
            onClick={onOpenAuth}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center text-lg sm:text-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0 overflow-hidden"
            title={authUser ? `Signed in as ${authUser.displayName}` : 'Sign in to save progress'}
          >
            {authUser?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authUser.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span>{currentAvatar.emoji}</span>
            )}
            {authUser && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-card)]"></span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-[var(--text-main)]">
                Pathly
              </span>
              <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold bg-[var(--primary-light)] text-[var(--primary-text)] rounded">
                Lv.{profile.level}
              </span>
            </div>
            
            {/* Visual XP Bar */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-12 sm:w-16 h-1 sm:h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--text-muted)]">
                {xpPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs (Hidden on Mobile, handled by bottom nav) */}
        <nav className="hidden sm:flex items-center p-1 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'today'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'milestones'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'friends'
                ? 'bg-[var(--bg-card)] text-purple-500 shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Buddies</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'achievements'
                ? 'bg-[var(--bg-card)] text-amber-500 shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Trophies</span>
          </button>
        </nav>

        {/* Right: Quick Controls & Status */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Cloud Sync Status */}
          <button
            onClick={onOpenAuth}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              authUser
                ? 'bg-emerald-500/10 border-emerald-500/30 text-[var(--primary)]'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-500 hover:bg-blue-500/20'
            }`}
            title={authUser ? 'Cloud Sync: Active' : 'Sign In with Google to protect progress'}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">{authUser ? 'Synced' : 'Sync'}</span>
          </button>

          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold"
            title={`${profile.streakDays} day streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span className="text-[11px] sm:text-xs">{profile.streakDays}d</span>
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] text-[var(--text-main)] border border-[var(--border)] transition-colors active:scale-95"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Share Card */}
          <button
            onClick={onOpenShareCard}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] transition-colors active:scale-95 hidden xs:flex"
            title="Share Daily Progress Card"
          >
            <Share2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}

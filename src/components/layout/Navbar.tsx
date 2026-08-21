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
  Volume2, 
  VolumeX, 
  Share2,
  HelpCircle,
  Clock
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
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenMorning,
  onOpenFocus,
  onOpenNewGoal,
  onOpenShareCard,
  onOpenHelp,
}: NavbarProps) {
  const { profile, toggleSound, toggleAntiCheat, toggleTheme, isDarkMode } = useApp();
  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  const xpPercent = Math.min(100, Math.round((profile.currentXP / profile.nextLevelXP) * 100));

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-card)] border-b border-[var(--border)] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand & Avatar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('today')}
            className="w-10 h-10 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition-transform shrink-0"
            title={`${currentAvatar.name} - Lv. ${profile.level}`}
          >
            {currentAvatar.emoji}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-[var(--text-main)]">
                Pathly
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[var(--primary-light)] text-[var(--primary-text)] rounded">
                Lv.{profile.level}
              </span>
            </div>
            
            {/* Visual XP Bar */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[var(--primary)] rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                {xpPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Center: Visual Navigation Tabs */}
        <nav className="flex items-center p-1 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'today'
                ? 'bg-[var(--bg-card)] text-[var(--primary)] shadow-xs font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Today</span>
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
            <span className="hidden sm:inline">Milestones</span>
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
            <span className="hidden sm:inline">Buddies</span>
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
            <span className="hidden sm:inline">Trophies</span>
          </button>
        </nav>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Streak Flame */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-500 text-xs font-bold"
            title={`${profile.streakDays} day streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Theme Toggle (Sun/Moon) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] text-[var(--text-main)] border border-[var(--border)] transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Anti-Cheat Indicator */}
          <button
            onClick={toggleAntiCheat}
            className={`p-2 rounded-xl border transition-colors ${
              profile.antiCheatEnabled
                ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary)]'
                : 'bg-[var(--bg-card-subtle)] border-[var(--border)] text-[var(--text-muted)]'
            }`}
            title={profile.antiCheatEnabled ? 'Anti-Cheat Pacing Guard: ON' : 'Anti-Cheat: OFF'}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] transition-colors"
            title={profile.soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-[var(--primary)]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Share Card */}
          <button
            onClick={onOpenShareCard}
            className="p-2 rounded-xl bg-[var(--bg-card-subtle)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] transition-colors"
            title="Share Daily Progress Card"
          >
            <Share2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}

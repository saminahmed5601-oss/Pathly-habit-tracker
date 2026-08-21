'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { 
  Sun, 
  Target, 
  Users, 
  Award, 
  Flame, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles,
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
  const { profile, toggleSound, toggleAntiCheat } = useApp();
  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  const xpPercent = Math.min(100, Math.round((profile.currentXP / profile.nextLevelXP) * 100));

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#151C28]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand & Avatar */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveTab('today')}
            className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-xl cursor-pointer hover:scale-105 transition-transform"
            title={`${currentAvatar.name} - Lv. ${profile.level}`}
          >
            {currentAvatar.emoji}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                Pathly
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-md">
                Lv.{profile.level}
              </span>
            </div>
            
            {/* Clean Mini XP Bar */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-400">
                {profile.currentXP}/{profile.nextLevelXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Center: Clean Navigation Tabs */}
        <nav className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'today'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'milestones'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Milestones</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'friends'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Buddies</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'achievements'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Trophies</span>
          </button>
        </nav>

        {/* Right: Quick Actions & Controls */}
        <div className="flex items-center gap-2">
          
          {/* Streak Pill */}
          <div 
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 text-xs font-bold"
            title={`${profile.streakDays} day streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span>{profile.streakDays}d</span>
          </div>

          {/* Quick Focus Button */}
          <button
            onClick={onOpenFocus}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>

          {/* Anti-Cheat Indicator */}
          <button
            onClick={toggleAntiCheat}
            className={`p-1.5 rounded-lg border transition-colors ${
              profile.antiCheatEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}
            title={profile.antiCheatEnabled ? 'Anti-Cheat Pacing Guard: ACTIVE' : 'Anti-Cheat: OFF'}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title={profile.soundEnabled ? 'Mute sound' : 'Enable sound'}
          >
            {profile.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Share Card */}
          <button
            onClick={onOpenShareCard}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="Share Today's Progress Card"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Help Guide */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
            title="Habit Psychology Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

        </div>

      </div>
    </header>
  );
}

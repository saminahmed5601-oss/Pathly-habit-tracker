'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { 
  Sun, 
  Moon,
  Compass, 
  Target, 
  TrendingUp,
  Users, 
  Award, 
  Flame, 
  Share2,
  Cloud,
  CloudCheck,
  Settings,
  Bot,
  Sparkles,
  MoreVertical,
  Layers,
  ChevronDown
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

export type TabType = 'today' | 'milestones' | 'progress' | 'friends' | 'achievements';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenMorning: () => void;
  onOpenFocus: () => void;
  onOpenNewGoal: () => void;
  onOpenShareCard: () => void;
  onOpenHelp: () => void;
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onOpenAIChat: () => void;
  onOpenWelcome?: () => void;
  onOpenZenSanctuary?: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenShareCard,
  onOpenAuth,
  onOpenSettings,
  onOpenAIChat,
  onOpenWelcome,
  onOpenZenSanctuary,
}: NavbarProps) {
  const { profile, toggleTheme, isDarkMode, authUser } = useApp();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatarId) || AVATAR_OPTIONS[0];
  const xpPercent = Math.min(100, Math.round((profile.currentXP / profile.nextLevelXP) * 100));

  // Close quick menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowQuickMenu(false);
      }
    };
    if (showQuickMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showQuickMenu]);

  const navTabs: { id: TabType; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'today', label: 'Today', icon: <Sun className="w-3.5 h-3.5" />, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'milestones', label: 'Milestones', icon: <Target className="w-3.5 h-3.5" />, color: 'text-teal-600 dark:text-teal-400' },
    { id: 'progress', label: 'Progress', icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'friends', label: 'Buddies', icon: <Users className="w-3.5 h-3.5" />, color: 'text-purple-600 dark:text-purple-400' },
    { id: 'achievements', label: 'Trophies', icon: <Award className="w-3.5 h-3.5" />, color: 'text-amber-600 dark:text-amber-400' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.06] transition-colors shadow-xs shadow-emerald-500/5">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand & Profile Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button 
            onClick={onOpenAuth}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-500/20 flex items-center justify-center text-lg sm:text-xl cursor-pointer hover:scale-105 active:scale-95 transition-all shrink-0 overflow-hidden shadow-xs"
            title={authUser ? `Signed in as ${authUser.displayName}` : 'Sign in with Google to sync'}
          >
            {authUser?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={authUser.photoURL} alt="User" className="w-full h-full object-cover" />
            ) : (
              <span>{currentAvatar.emoji}</span>
            )}
            {authUser && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--bg-card)] ring-1 ring-emerald-400/40" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base font-black tracking-tight text-[var(--text-main)]">
                Pathly
              </span>
              <span className="px-1.5 py-0.2 text-[9px] sm:text-[10px] font-black bg-[var(--primary-light)] text-[var(--primary-text)] rounded-full">
                Lv.{profile.level}
              </span>
            </div>
            
            {/* Visual XP Bar */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-14 sm:w-20 h-1 sm:h-1.5 bg-black/[0.04] dark:bg-white/[0.08] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--primary)] to-emerald-400 rounded-full transition-all duration-300 shadow-2xs"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[var(--text-muted)]">
                {xpPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Center: Consolidated Desktop Navigation Tabs (Hidden on Mobile, handled by bottom nav) */}
        <nav className="hidden sm:flex items-center p-1 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs font-semibold shadow-2xs">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  sounds.playTap();
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all select-none cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-sm font-black border border-black/[0.04] dark:border-white/[0.08]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                }`}
              >
                <span className={isActive ? tab.color : 'text-[var(--text-muted)]'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Unified Profile & Quick-Access Dock */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Zen Sanctuary Trigger Button */}
          {onOpenZenSanctuary && (
            <button
              onClick={() => {
                onOpenZenSanctuary();
                sounds.playSingingBowl();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/30 text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer select-none"
              title="Open Zen Sanctuary & Daily Oracle (Hotkey: 'Z')"
            >
              <span className="text-sm">🧘</span>
              <span className="hidden md:inline">Zen Sanctuary</span>
            </button>
          )}

          {/* Streak Badge with Warm Glow */}
          <div 
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-black shadow-2xs select-none"
            title={`${profile.streakDays} day streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-flame shrink-0" />
            <span className="text-[11px] sm:text-xs">{profile.streakDays}d</span>
          </div>

          {/* AI Guide Trigger Pill */}
          <button
            onClick={() => {
              onOpenAIChat();
              sounds.playTap();
            }}
            className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-emerald-500 hover:opacity-95 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xs shadow-emerald-500/20 cursor-pointer border border-white/20"
            title="Ask Pathly AI Companion (Hotkeys: 'A')"
          >
            <Bot className="w-3.5 h-3.5 text-white" />
            <span className="font-bold">AI Guide</span>
          </button>

          {/* Unified Quick Controls Dock Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                setShowQuickMenu(!showQuickMenu);
                sounds.playTap();
              }}
              className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-black/[0.06] dark:border-white/[0.08] transition-all active:scale-95 flex items-center gap-1 shadow-2xs cursor-pointer"
              title="Quick Controls & Utilities"
            >
              <Settings className="w-4 h-4" />
              <ChevronDown className={`w-3 h-3 transition-transform ${showQuickMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Quick Access Menu */}
            {showQuickMenu && (
              <div className="absolute right-0 top-12 w-64 clean-card p-2.5 bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] shadow-2xl space-y-1 z-50 text-xs animate-fadeIn">
                
                {/* Zen Sanctuary in Menu */}
                {onOpenZenSanctuary && (
                  <button
                    onClick={() => {
                      onOpenZenSanctuary();
                      setShowQuickMenu(false);
                      sounds.playSingingBowl();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 transition-colors text-left font-bold"
                  >
                    <span className="text-base">🧘</span>
                    <div>
                      <div className="font-black">Zen Sanctuary</div>
                      <div className="text-[10px] opacity-80">Water greenhouse & breathwork</div>
                    </div>
                  </button>
                )}

                {/* Header item: Cloud Sync */}
                <button
                  onClick={() => {
                    onOpenAuth();
                    setShowQuickMenu(false);
                    sounds.playTap();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${
                      authUser ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                      <Cloud className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-main)]">Cloud Sync</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        {authUser ? `Synced: ${authUser.displayName || 'Active'}` : 'Sign in to sync'}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    authUser ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {authUser ? 'Active' : 'Connect'}
                  </span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme();
                    sounds.playTap();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-main)]">Theme Mode</div>
                      <div className="text-[10px] text-[var(--text-muted)]">
                        Currently {isDarkMode ? 'Dark' : 'Light'}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[var(--text-muted)]">
                    {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                  </span>
                </button>

                {/* Settings & Appearance */}
                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowQuickMenu(false);
                    sounds.playTap();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-main)]">App Preferences</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Themes, audio, and backups</div>
                  </div>
                </button>

                {/* Share Progress Card */}
                <button
                  onClick={() => {
                    onOpenShareCard();
                    setShowQuickMenu(false);
                    sounds.playTap();
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors text-left"
                >
                  <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-500">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-main)]">Share Progress Card</div>
                    <div className="text-[10px] text-[var(--text-muted)]">Export daily summary image</div>
                  </div>
                </button>

                {/* Daily Memes & Portal */}
                {onOpenWelcome && (
                  <button
                    onClick={() => {
                      onOpenWelcome();
                      setShowQuickMenu(false);
                      sounds.playTap();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors text-left"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--text-main)]">Memes & What&apos;s New</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Daily inspiration & releases</div>
                    </div>
                  </button>
                )}

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}

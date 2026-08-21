'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AVATAR_OPTIONS } from '@/lib/constants';
import { 
  Flame, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Sun, 
  Moon, 
  Share2, 
  RotateCcw,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  onOpenMorning: () => void;
  onOpenNewGoal: () => void;
  onOpenFocus: () => void;
  onOpenShareCard: () => void;
  onOpenHelp: () => void;
}

export function Navbar({ onOpenMorning, onOpenNewGoal, onOpenFocus, onOpenShareCard, onOpenHelp }: NavbarProps) {
  const { profile, toggleSound, updateTheme, toggleAntiCheat, resetAllDemoData } = useApp();
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);

  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === profile.avatarId) || AVATAR_OPTIONS[0];

  // XP progress calculation
  const xpPercent = Math.min(100, Math.round((profile.currentXP / profile.nextLevelXP) * 100));

  // Sync theme with body data-theme attribute
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-theme', profile.theme);
    }
  }, [profile.theme]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 dark:border-white/10 glass-panel backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mascot */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onOpenMorning}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-200 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-[14px] flex items-center justify-center text-2xl">
                {currentAvatar.emoji}
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-zinc-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-400 dark:via-teal-300 dark:to-amber-300 bg-clip-text text-transparent">
                Pathly
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 rounded-full">
                Lv. {profile.level}
              </span>
            </div>
            
            {/* Mini XP Bar */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-24 sm:w-32 h-2 bg-zinc-200 dark:bg-zinc-700/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                {profile.currentXP}/{profile.nextLevelXP} XP
              </span>
            </div>
          </div>
        </div>

        {/* Center / Fast Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenMorning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-200/80 dark:hover:bg-amber-900/50 transition-all shadow-xs active:scale-95"
            title="Sunrise Intention Kickoff"
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Sunrise Kickoff</span>
          </button>

          <button
            onClick={onOpenFocus}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200/80 dark:hover:bg-emerald-900/50 transition-all shadow-xs active:scale-95"
            title="Start Focus Timer"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Focus Room</span>
          </button>

          <button
            onClick={onOpenNewGoal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-all shadow-sm active:scale-95"
            title="Add New Milestone Goal"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Goal</span>
          </button>
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Streak Flame Pill */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50 border border-orange-200 dark:border-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-bold shadow-xs cursor-default"
            title={`You are on a ${profile.streakDays} day streak! Keep it alive.`}
          >
            <Flame className="w-4 h-4 text-orange-500 animate-pulse fill-orange-500" />
            <span>{profile.streakDays}d Streak</span>
            {profile.streakShields > 0 && (
              <span className="flex items-center text-[10px] text-teal-700 dark:text-teal-300 bg-teal-200/80 dark:bg-teal-900/80 px-1.5 py-0.2 rounded-full font-medium ml-1" title={`${profile.streakShields} Streak Shields active`}>
                🛡️ {profile.streakShields}
              </span>
            )}
          </div>

          {/* Anti-Cheat Shield Toggle */}
          <button
            onClick={toggleAntiCheat}
            className={`p-2 rounded-xl border text-xs font-medium transition-all ${
              profile.antiCheatEnabled
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-400'
            }`}
            title={profile.antiCheatEnabled ? "Anti-Cheat Pacing Guard: ACTIVE (Prevents instant fake completions)" : "Anti-Cheat Guard: OFF"}
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 transition-all"
            title={profile.soundEnabled ? "Mute sounds" : "Unmute joyful game sounds"}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-700/80 transition-all"
              title="Change Aesthetic Theme"
            >
              {profile.theme === 'cocoa' ? (
                <Moon className="w-4 h-4 text-purple-400" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </button>

            {themeMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onMouseLeave={() => setThemeMenuOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Color Themes
                </div>
                <button
                  onClick={() => { updateTheme('pastel'); setThemeMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${profile.theme === 'pastel' ? 'font-bold text-emerald-600' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  <span>🌸</span> Pastel Cozy
                </button>
                <button
                  onClick={() => { updateTheme('matcha'); setThemeMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${profile.theme === 'matcha' ? 'font-bold text-emerald-600' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  <span>🍵</span> Matcha Green
                </button>
                <button
                  onClick={() => { updateTheme('lavender'); setThemeMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${profile.theme === 'lavender' ? 'font-bold text-purple-600' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  <span>💜</span> Lavender Dream
                </button>
                <button
                  onClick={() => { updateTheme('cocoa'); setThemeMenuOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${profile.theme === 'cocoa' ? 'font-bold text-amber-500' : 'text-zinc-700 dark:text-zinc-300'}`}
                >
                  <span>🍫</span> Cocoa Dark
                </button>
              </div>
            )}
          </div>

          {/* Share Daily Progress Card */}
          <button
            onClick={onOpenShareCard}
            className="p-2 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-emerald-950/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:scale-105 transition-transform"
            title="Export & Share Today's Progress Card"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Guide / How It Works */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/80 transition-all"
            title="How Pathly Helps You Win Daily"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Reset to initial sample data with 12-milestone Web Dev course (offset at 3)?')) {
                resetAllDemoData();
              }
            }}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 text-zinc-400 border border-zinc-200/80 dark:border-zinc-700/80 transition-all"
            title="Reset to Demo State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </header>
  );
}

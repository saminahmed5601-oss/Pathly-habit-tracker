'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar, TabType } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { TodayView } from '@/components/dashboard/TodayView';
import { MilestonesView } from '@/components/milestones/MilestonesView';
import { ProgressView } from '@/components/progress/ProgressView';
import { BuddiesView } from '@/components/social/BuddiesView';
import { AchievementsView } from '@/components/stats/AchievementsView';
import { MorningKickoffModal } from '@/components/morning/MorningKickoffModal';
import { NewGoalModal } from '@/components/milestones/NewGoalModal';
import { FocusTimerModal } from '@/components/focus/FocusTimerModal';
import { EveningReflectionModal } from '@/components/evening/EveningReflectionModal';
import { ShareProgressCardModal } from '@/components/social/ShareProgressCardModal';
import { AntiCheatModal } from '@/components/anticheat/AntiCheatModal';
import { HelpGuideModal } from '@/components/help/HelpGuideModal';
import { AuthModal } from '@/components/auth/AuthModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { AIChatModal } from '@/components/ai/AIChatModal';
import { MemeShowPortal } from '@/components/welcome/MemeShowPortal';
import { ZenSanctuaryModal } from '@/components/zen/ZenSanctuaryModal';
import { sounds } from '@/lib/sounds';
import { motion } from 'framer-motion';
import { Command, Sparkles, Bot, Leaf } from 'lucide-react';

export default function HomePage() {
  const { isLoaded, toggleTheme } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (typeof window !== 'undefined') {
      const validTabs: TabType[] = ['today', 'milestones', 'progress', 'friends', 'achievements'];
      const hash = window.location.hash.replace('#', '') as TabType;
      if (validTabs.includes(hash)) return hash;
      const savedTab = localStorage.getItem('pathly_active_tab') as TabType;
      if (savedTab && validTabs.includes(savedTab)) return savedTab;
    }
    return 'today';
  });

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pathly_active_tab', tab);
      window.history.replaceState(null, '', `#${tab}`);
    }
  };

  // Modals state
  const [showWelcomePortal, setShowWelcomePortal] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hideDate = localStorage.getItem('pathly_hide_welcome_date');
      const todayStr = new Date().toISOString().split('T')[0];
      return hideDate !== todayStr;
    }
    return false;
  });
  const [showMorning, setShowMorning] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showEvening, setShowEvening] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showZenSanctuary, setShowZenSanctuary] = useState(false);
  const [showShortcutsHint, setShowShortcutsHint] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      const isAnyModalOpen =
        showWelcomePortal ||
        showMorning ||
        showNewGoal ||
        showFocus ||
        showEvening ||
        showShareCard ||
        showHelp ||
        showAuth ||
        showSettings ||
        showAIChat ||
        showZenSanctuary;

      if (e.key === 'Escape') {
        setShowWelcomePortal(false);
        setShowMorning(false);
        setShowNewGoal(false);
        setShowFocus(false);
        setShowEvening(false);
        setShowShareCard(false);
        setShowHelp(false);
        setShowAuth(false);
        setShowSettings(false);
        setShowAIChat(false);
        setShowZenSanctuary(false);
        setShowShortcutsHint(false);
        return;
      }

      if (isAnyModalOpen) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowAIChat(true);
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'a':
        case 'k':
          e.preventDefault();
          setShowAIChat(true);
          break;
        case 'z':
          e.preventDefault();
          setShowZenSanctuary(true);
          break;
        case 'f':
          e.preventDefault();
          setShowFocus(true);
          break;
        case 'g':
          e.preventDefault();
          setShowNewGoal(true);
          break;
        case 'm':
          e.preventDefault();
          setShowMorning(true);
          break;
        case 'e':
          e.preventDefault();
          setShowEvening(true);
          break;
        case 's':
          e.preventDefault();
          setShowSettings(true);
          break;
        case 'd':
          e.preventDefault();
          toggleTheme();
          break;
        case '?':
          e.preventDefault();
          setShowHelp(true);
          break;
        case '1':
          handleTabChange('today');
          break;
        case '2':
          handleTabChange('milestones');
          break;
        case '3':
          handleTabChange('progress');
          break;
        case '4':
          handleTabChange('friends');
          break;
        case '5':
          handleTabChange('achievements');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    showWelcomePortal,
    showMorning,
    showNewGoal,
    showFocus,
    showEvening,
    showShareCard,
    showHelp,
    showAuth,
    showSettings,
    showAIChat,
    toggleTheme
  ]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-page)] text-[var(--text-main)]">
        <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-2xl animate-bounce shadow-md">
          🌱
        </div>
        <p className="text-xs font-bold text-[var(--text-muted)] mt-3">Loading Pathly...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenMorning={() => setShowMorning(true)}
        onOpenFocus={() => setShowFocus(true)}
        onOpenNewGoal={() => setShowNewGoal(true)}
        onOpenShareCard={() => setShowShareCard(true)}
        onOpenHelp={() => setShowHelp(true)}
        onOpenAuth={() => setShowAuth(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenAIChat={() => setShowAIChat(true)}
        onOpenWelcome={() => setShowWelcomePortal(true)}
        onOpenZenSanctuary={() => setShowZenSanctuary(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 sm:pb-8">
        {activeTab === 'today' && (
          <TodayView
            onOpenMorning={() => setShowMorning(true)}
            onOpenEvening={() => setShowEvening(true)}
            onOpenZenSanctuary={() => setShowZenSanctuary(true)}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesView
            onOpenNewGoal={() => setShowNewGoal(true)}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressView
            onOpenShareCard={() => setShowShareCard(true)}
          />
        )}

        {activeTab === 'friends' && (
          <BuddiesView />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            onOpenShareCard={() => setShowShareCard(true)}
            onOpenHelp={() => setShowHelp(true)}
          />
        )}
      </main>

      {/* Native-Style Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
      />

      {/* Floating AI Task Companion Widget & Hotkeys (Desktop & Mobile) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-30 flex items-center gap-2">
        {/* Hotkeys Button (Desktop Only) */}
        <div className="hidden lg:block relative">
          <button
            onClick={() => setShowShortcutsHint(!showShortcutsHint)}
            className="p-2.5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-md border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] shadow-lg hover:border-[var(--primary)] transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Keyboard Shortcuts"
          >
            <Command className="w-3.5 h-3.5" />
            <span>Hotkeys</span>
          </button>

          {showShortcutsHint && (
            <div className="absolute bottom-12 right-0 w-64 clean-card p-4 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-[var(--text-main)] pb-2 border-b border-[var(--border)]">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quick Hotkeys</span>
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-card-subtle)] text-[10px] border border-[var(--border)]">Esc</kbd>
              </div>
              <div className="grid grid-cols-2 gap-y-1.5 text-[11px] text-[var(--text-muted)]">
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">Z</kbd> Zen Sanctuary</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">A</kbd> AI Guide</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">F</kbd> Focus Room</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">G</kbd> New Goal</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">M</kbd> Morning Plan</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">E</kbd> Evening Reflection</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">S</kbd> Settings</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">D</kbd> Dark/Light</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">1-5</kbd> Switch Tab</div>
                <div><kbd className="font-mono font-bold text-[var(--text-main)] px-1 py-0.5 bg-[var(--bg-card-subtle)] rounded border">?</kbd> Guide</div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Botanical Concierge Glass Dock Button */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          onClick={() => {
            setShowAIChat(true);
            sounds.playTap();
          }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/70 dark:border-white/[0.08] ring-1 ring-emerald-500/20 hover:border-emerald-500/50 shadow-lg shadow-emerald-950/5 text-stone-800 dark:text-stone-100 font-bold text-xs group cursor-pointer"
          title="Open Pathly Botanical Concierge (Press '⌘K' or 'A')"
        >
          <div className="relative flex items-center justify-center">
            <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs group-hover:rotate-12 transition-transform">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="tracking-tight font-black">Concierge</span>
            <kbd className="hidden xs:inline text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-stone-500 dark:text-stone-400 group-hover:opacity-75 transition-opacity">
              ⌘K
            </kbd>
          </div>
        </motion.button>
      </div>

      {/* Clean Minimal Footer */}
      <footer className="hidden sm:block w-full border-t border-[var(--border)] py-5 text-center text-xs text-[var(--text-muted)]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>🌱</span>
            <span className="font-bold text-[var(--text-main)]">Pathly</span>
            <span>— Simple Daily Progress, Genuine Discipline</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => handleTabChange('today')} className="hover:text-[var(--primary)] transition-colors">Today</button>
            <button onClick={() => handleTabChange('milestones')} className="hover:text-[var(--primary)] transition-colors">Milestones</button>
            <button onClick={() => handleTabChange('progress')} className="hover:text-[var(--primary)] transition-colors">Progress</button>
            <button onClick={() => handleTabChange('friends')} className="hover:text-[var(--primary)] transition-colors">Buddies</button>
            <button onClick={() => setShowAIChat(true)} className="hover:text-[var(--primary)] transition-colors">Concierge</button>
            <button onClick={() => setShowZenSanctuary(true)} className="hover:text-[var(--primary)] transition-colors">Zen Sanctuary</button>
            <button onClick={() => setShowSettings(true)} className="hover:text-[var(--primary)] transition-colors">Settings</button>
            <button onClick={() => setShowAuth(true)} className="hover:text-[var(--primary)] transition-colors">Cloud Sync</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ZenSanctuaryModal
        isOpen={showZenSanctuary}
        onClose={() => setShowZenSanctuary(false)}
      />

      <MorningKickoffModal
        isOpen={showMorning}
        onClose={() => setShowMorning(false)}
      />

      <NewGoalModal
        isOpen={showNewGoal}
        onClose={() => setShowNewGoal(false)}
      />

      <FocusTimerModal
        isOpen={showFocus}
        onClose={() => setShowFocus(false)}
      />

      <EveningReflectionModal
        isOpen={showEvening}
        onClose={() => setShowEvening(false)}
      />

      <ShareProgressCardModal
        isOpen={showShareCard}
        onClose={() => setShowShareCard(false)}
      />

      <AntiCheatModal />

      <HelpGuideModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <AIChatModal
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        onOpenFocus={() => setShowFocus(true)}
        onOpenMorning={() => setShowMorning(true)}
        onOpenZenSanctuary={() => setShowZenSanctuary(true)}
      />

      <MemeShowPortal
        isOpen={showWelcomePortal}
        onClose={() => setShowWelcomePortal(false)}
      />

    </div>
  );
}

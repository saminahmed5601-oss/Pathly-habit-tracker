'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar, TabType } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { TodayView } from '@/components/dashboard/TodayView';
import { MilestonesView } from '@/components/milestones/MilestonesView';
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

export default function HomePage() {
  const { isLoaded } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('today');

  // Modals state
  const [showMorning, setShowMorning] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showEvening, setShowEvening] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-page)] text-[var(--text-main)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center text-xl animate-bounce">
          🌱
        </div>
        <p className="text-xs font-bold text-[var(--text-muted)] mt-2">Loading Pathly...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      
      {/* Top Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMorning={() => setShowMorning(true)}
        onOpenFocus={() => setShowFocus(true)}
        onOpenNewGoal={() => setShowNewGoal(true)}
        onOpenShareCard={() => setShowShareCard(true)}
        onOpenHelp={() => setShowHelp(true)}
        onOpenAuth={() => setShowAuth(true)}
      />

      {/* Main Content (With safe padding for mobile bottom bar) */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-24 sm:pb-8">
        {activeTab === 'today' && (
          <TodayView
            onOpenMorning={() => setShowMorning(true)}
            onOpenEvening={() => setShowEvening(true)}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesView
            onOpenNewGoal={() => setShowNewGoal(true)}
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
        setActiveTab={setActiveTab}
      />

      {/* Clean Minimal Footer (Hidden on tiny screens to avoid clutter) */}
      <footer className="hidden sm:block w-full border-t border-[var(--border)] py-5 text-center text-xs text-[var(--text-muted)]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>🌱</span>
            <span className="font-bold text-[var(--text-main)]">Pathly</span>
            <span>— Simple Daily Progress, Genuine Discipline</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => setActiveTab('today')} className="hover:text-[var(--primary)] transition-colors">Today</button>
            <button onClick={() => setActiveTab('milestones')} className="hover:text-[var(--primary)] transition-colors">Milestones</button>
            <button onClick={() => setActiveTab('friends')} className="hover:text-[var(--primary)] transition-colors">Buddies</button>
            <button onClick={() => setShowAuth(true)} className="hover:text-[var(--primary)] transition-colors">Cloud Sync</button>
          </div>
        </div>
      </footer>

      {/* Modals */}
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

    </div>
  );
}

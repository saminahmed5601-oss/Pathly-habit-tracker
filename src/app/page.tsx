'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { DailyHeroRing } from '@/components/dashboard/DailyHeroRing';
import { PriorityTasksCard } from '@/components/dashboard/PriorityTasksCard';
import { MilestoneGoalList } from '@/components/milestones/MilestoneGoalList';
import { FriendsPod } from '@/components/social/FriendsPod';
import { MorningKickoffModal } from '@/components/morning/MorningKickoffModal';
import { NewGoalModal } from '@/components/milestones/NewGoalModal';
import { FocusTimerModal } from '@/components/focus/FocusTimerModal';
import { EveningReflectionModal } from '@/components/evening/EveningReflectionModal';
import { ShareProgressCardModal } from '@/components/social/ShareProgressCardModal';
import { AntiCheatModal } from '@/components/anticheat/AntiCheatModal';
import { HelpGuideModal } from '@/components/help/HelpGuideModal';
import { Award, Sparkles, Flame, Shield, HelpCircle } from 'lucide-react';

export default function HomePage() {
  const { isLoaded, badges, profile } = useApp();

  // Modals state
  const [showMorning, setShowMorning] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showFocus, setShowFocus] = useState(false);
  const [showEvening, setShowEvening] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Focus timer context passing
  const [focusTaskTitle, setFocusTaskTitle] = useState('');
  const [focusGoalId, setFocusGoalId] = useState('');

  const handleOpenFocusWithTask = (taskTitle: string, goalId?: string) => {
    setFocusTaskTitle(taskTitle);
    setFocusGoalId(goalId || '');
    setShowFocus(true);
  };

  const handleOpenFocusWithGoal = (goalId: string, goalTitle: string) => {
    setFocusTaskTitle(`Focus on ${goalTitle}`);
    setFocusGoalId(goalId);
    setShowFocus(true);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFDF9] dark:bg-[#141115]">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-2xl animate-bounce">
          🌱
        </div>
        <p className="text-xs font-bold text-zinc-500 mt-3">Waking up Pathly...</p>
      </div>
    );
  }

  const unlockedBadgeCount = badges.filter(b => profile.unlockedBadges.includes(b.id)).length;

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        onOpenMorning={() => setShowMorning(true)}
        onOpenNewGoal={() => setShowNewGoal(true)}
        onOpenFocus={() => {
          setFocusTaskTitle('');
          setFocusGoalId('');
          setShowFocus(true);
        }}
        onOpenShareCard={() => setShowShareCard(true)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        
        {/* Hero Section: Daily Momentum & Mascot Seedling */}
        <DailyHeroRing
          onOpenFocus={() => {
            setFocusTaskTitle('');
            setFocusGoalId('');
            setShowFocus(true);
          }}
          onOpenMorning={() => setShowMorning(true)}
          onOpenEvening={() => setShowEvening(true)}
        />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Column (8 cols): Priority Tasks & Milestone Courses */}
          <div className="lg:col-span-8 space-y-8">
            {/* Priority Tasks Card */}
            <PriorityTasksCard
              onOpenMorning={() => setShowMorning(true)}
              onOpenFocusWithTask={handleOpenFocusWithTask}
            />

            {/* Milestone & Course Journeys */}
            <MilestoneGoalList
              onOpenNewGoal={() => setShowNewGoal(true)}
              onOpenFocusWithGoal={handleOpenFocusWithGoal}
            />
          </div>

          {/* Sidebar Column (4 cols): Friend Pod & Trophies */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Friends Pod */}
            <FriendsPod />

            {/* Trophy & Badges Showcase */}
            <div className="rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Trophy Case
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {unlockedBadgeCount} of {badges.length} Badges Unlocked
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowHelp(true)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-600 transition-colors"
                  title="How to earn badges"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {badges.map((badge) => {
                  const isUnlocked = profile.unlockedBadges.includes(badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                        isUnlocked
                          ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-900/50 shadow-2xs hover:scale-105'
                          : 'bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-200/50 dark:border-zinc-800 opacity-40 grayscale'
                      }`}
                      title={`${badge.title}: ${badge.description}`}
                    >
                      <span className="text-2xl mb-1 filter drop-shadow-xs select-none">
                        {badge.icon}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 truncate w-full">
                        {badge.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Anti-Cheat Active Badge Footer */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Pacing Guard: <strong>{profile.antiCheatEnabled ? 'Active' : 'Disabled'}</strong>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {profile.streakShields} Shields Ready
                </span>
              </div>
            </div>

            {/* Daily Habit Psychology Tip Card */}
            <div className="rounded-3xl p-5 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30 border border-teal-200/70 dark:border-teal-800/50 text-xs">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-extrabold mb-1">
                <Sparkles className="w-4 h-4 text-teal-500" />
                <span>Today&apos;s Atomic Tip</span>
              </div>
              <p className="text-teal-900/80 dark:text-teal-200/80 leading-relaxed text-[11px]">
                &ldquo;You do not rise to the level of your goals. You fall to the level of your systems.&rdquo; Complete 1 milestone or 20m of focus today to cement your identity.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-amber-900/10 dark:border-white/10 py-6 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>🌱</span>
            <span className="font-bold text-zinc-600 dark:text-zinc-400">Pathly</span>
            <span>— Daily Progress, Authentic Habits</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowMorning(true)} className="hover:text-emerald-600 transition-colors">Sunrise Ritual</button>
            <button onClick={() => setShowFocus(true)} className="hover:text-emerald-600 transition-colors">Focus Room</button>
            <button onClick={() => setShowShareCard(true)} className="hover:text-emerald-600 transition-colors">Share Card</button>
            <button onClick={() => setShowHelp(true)} className="hover:text-emerald-600 transition-colors">How It Works</button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
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
        initialTaskTitle={focusTaskTitle}
        initialGoalId={focusGoalId}
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

    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Sparkles, RotateCw, CheckCircle2, Trophy, Compass, Star, Crown, Flame } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import confetti from 'canvas-confetti';

interface OracleCard {
  id: string;
  name: string;
  archetype: string;
  emoji: string;
  gradient: string;
  bgGlow: string;
  wisdom: string;
  quest: string;
  xpReward: number;
}

const ORACLE_CARDS: OracleCard[] = [
  {
    id: 'sakura_renewal',
    name: 'The Sakura Renewal',
    archetype: 'Clarity & Fresh Beginnings',
    emoji: '🌸',
    gradient: 'from-pink-500 via-rose-400 to-amber-300',
    bgGlow: 'rgba(244, 114, 182, 0.25)',
    wisdom: 'Clear mental clutter. What was delayed yesterday can be conquered effortlessly today.',
    quest: 'Complete your #1 Must-Win mission before noon.',
    xpReward: 40,
  },
  {
    id: 'ancient_bonsai',
    name: 'The Ancient Bonsai',
    archetype: 'Patient Mastery & Deep Roots',
    emoji: '🌲',
    gradient: 'from-emerald-600 via-teal-500 to-amber-600',
    bgGlow: 'rgba(16, 185, 129, 0.25)',
    wisdom: 'Mastery is not built in a single day, but in 25-minute undisturbed focus blocks.',
    quest: 'Log 45+ minutes of continuous deep focus with ambient brown noise or rain.',
    xpReward: 45,
  },
  {
    id: 'solar_zenith',
    name: 'The Solar Zenith',
    archetype: 'Peak Momentum & Triumph',
    emoji: '☀️',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    bgGlow: 'rgba(245, 158, 11, 0.25)',
    wisdom: 'Your momentum is at its peak. Seize the hardest task first with bold conviction.',
    quest: 'Finish all 3 daily missions to trigger full terrarium bloom.',
    xpReward: 50,
  },
  {
    id: 'tidal_flow',
    name: 'The Tidal Flow',
    archetype: 'Effortless Rhythm',
    emoji: '🌊',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    bgGlow: 'rgba(6, 182, 212, 0.25)',
    wisdom: 'Do not fight resistance. Drop expectations and simply start with the first 5 minutes.',
    quest: 'Start a 15-minute warmup sprint without checking notifications.',
    xpReward: 35,
  },
  {
    id: 'prismatic_crystal',
    name: 'The Prismatic Shield',
    archetype: 'Indestructible Discipline',
    emoji: '💎',
    gradient: 'from-purple-500 via-violet-400 to-pink-500',
    bgGlow: 'rgba(168, 85, 247, 0.25)',
    wisdom: 'A streak is not just a number; it is proof of who you choose to be every single sunrise.',
    quest: 'Hydrate your buddy squad and lock in evening reflection.',
    xpReward: 40,
  },
  {
    id: 'mineral_earth',
    name: 'The Sacred Soil',
    archetype: 'Restoration & Grounding',
    emoji: '🌿',
    gradient: 'from-emerald-700 via-stone-700 to-amber-800',
    bgGlow: 'rgba(5, 150, 105, 0.25)',
    wisdom: 'Great oak trees grow in stillness. Rest with zero guilt when today’s work is done.',
    quest: 'Complete 2 minutes of 4-7-8 mindful breathwork.',
    xpReward: 35,
  },
];

export function MomentumOracleDeck() {
  const { awardXPOnce } = useApp();
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [drawnDate, setDrawnDate] = useState<string>('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDrawnDate(today);
    const savedCardId = localStorage.getItem(`pathly_oracle_${today}`);
    if (savedCardId) {
      const found = ORACLE_CARDS.find(c => c.id === savedCardId);
      if (found) {
        setSelectedCard(found);
        setIsClaimed(true);
      }
    }
  }, []);

  const handleDrawCard = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    sounds.playCardFlip();

    setTimeout(() => {
      // Pick a card based on day seed or random
      const randomCard = ORACLE_CARDS[Math.floor(Math.random() * ORACLE_CARDS.length)];
      setSelectedCard(randomCard);
      setIsFlipping(false);
      setIsClaimed(true);

      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`pathly_oracle_${today}`, randomCard.id);

      awardXPOnce({
        amount: randomCard.xpReward,
        sourceType: 'task',
        sourceId: `oracle-${randomCard.id}-${today}`,
        description: `Daily Oracle: ${randomCard.name}`,
        date: today,
      });

      sounds.playMilestoneFanfare();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#EC4899', '#8B5CF6']
        });
      } catch {}
    }, 600);
  };

  return (
    <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] space-y-4 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-[var(--text-main)]">
                Daily Momentum Oracle
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300">
                Wisdom &amp; Quest
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Draw your daily guiding archetype and unlock bonus focus XP
            </p>
          </div>
        </div>

        {selectedCard && (
          <button
            type="button"
            onClick={handleDrawCard}
            className="px-2.5 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-[11px] font-bold text-[var(--text-muted)] flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
            title="Redraw Oracle"
          >
            <RotateCw className={`w-3 h-3 ${isFlipping ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Draw Again</span>
          </button>
        )}
      </div>

      {/* Card Arena */}
      {!selectedCard ? (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
          <div 
            onClick={handleDrawCard}
            className="w-48 h-64 sm:w-56 sm:h-76 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 border-2 border-purple-500/40 p-5 shadow-2xl flex flex-col items-center justify-between cursor-pointer group hover:scale-105 transition-all relative overflow-hidden"
          >
            <div className="w-full flex items-center justify-between text-purple-400 text-xs font-mono">
              <span>✦</span>
              <span>PATHLY ORACLE</span>
              <span>✦</span>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-4xl shadow-inner group-hover:rotate-12 transition-transform duration-500">
                🔮
              </div>
              <span className="text-xs font-black text-purple-200 mt-3 tracking-widest uppercase">
                Tap to Reveal
              </span>
            </div>

            <div className="text-[10px] text-purple-300/80 font-bold uppercase tracking-wider">
              Daily Fortune &amp; +40 XP
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] max-w-sm">
            Draw your daily sacred archetype to prime your subconscious for effortless productivity.
          </p>
        </div>
      ) : (
        <div className="animate-fadeIn space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* 3D Oracle Card Representation */}
            <div className="md:col-span-5 flex justify-center">
              <div 
                className={`w-48 h-64 sm:w-52 sm:h-72 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between text-white border-2 border-white/30 relative overflow-hidden bg-gradient-to-br ${selectedCard.gradient} transition-transform hover:scale-102 select-none`}
                style={{ boxShadow: `0 20px 40px ${selectedCard.bgGlow}` }}
              >
                {/* Shimmer Overlay */}
                <div className="absolute inset-0 bg-white/10 opacity-30 pointer-events-none" />

                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-white/90">
                  <span>✦ {selectedCard.archetype.split(' ')[0]}</span>
                  <span>+{selectedCard.xpReward} XP</span>
                </div>

                <div className="text-center my-auto">
                  <div className="text-5xl sm:text-6xl drop-shadow-lg animate-bounce" style={{ animationDuration: '4s' }}>
                    {selectedCard.emoji}
                  </div>
                  <h4 className="text-sm sm:text-base font-black tracking-tight mt-2 text-white drop-shadow">
                    {selectedCard.name}
                  </h4>
                </div>

                <div className="text-[9px] font-bold text-center uppercase tracking-widest text-white/80 bg-black/20 py-1 rounded-xl">
                  {selectedCard.archetype}
                </div>
              </div>
            </div>

            {/* Oracle Wisdom & Daily Quest */}
            <div className="md:col-span-7 space-y-3">
              <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-purple-600 dark:text-purple-300 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Oracle Wisdom</span>
                </div>
                <blockquote className="text-xs sm:text-sm text-[var(--text-main)] italic leading-relaxed font-medium">
                  &ldquo;{selectedCard.wisdom}&rdquo;
                </blockquote>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Daily Mini-Quest</span>
                  </span>
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                    +{selectedCard.xpReward} XP Awarded
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-snug">
                  {selectedCard.quest}
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Oracle power active for today!</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

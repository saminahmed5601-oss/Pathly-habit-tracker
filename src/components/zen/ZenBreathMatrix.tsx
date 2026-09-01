'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Wind, Bell, Heart, CheckCircle2 } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { useApp } from '@/context/AppContext';

export type BreathPattern = 'box' | 'relax';

interface PatternConfig {
  name: string;
  description: string;
  phases: { name: 'Inhale' | 'Hold' | 'Exhale' | 'Rest'; seconds: number }[];
}

const PATTERNS: Record<BreathPattern, PatternConfig> = {
  box: {
    name: '4-4-4-4 Box Flow',
    description: 'Navy SEAL method for instant autonomic regulation and laser focus',
    phases: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Hold', seconds: 4 },
      { name: 'Exhale', seconds: 4 },
      { name: 'Rest', seconds: 4 },
    ],
  },
  relax: {
    name: '4-7-8 Deep Sanctuary',
    description: 'Dr. Weil parasympathetic activation to melt anxiety before deep work',
    phases: [
      { name: 'Inhale', seconds: 4 },
      { name: 'Hold', seconds: 7 },
      { name: 'Exhale', seconds: 8 },
    ],
  },
};

export function ZenBreathMatrix() {
  const { awardXPOnce } = useApp();
  const [patternType, setPatternType] = useState<BreathPattern>('box');
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemainingInPhase, setSecondsRemainingInPhase] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);

  const pattern = PATTERNS[patternType];
  const currentPhase = pattern.phases[phaseIndex];

  // Sound trigger on phase change
  const triggerPhaseSound = useCallback((phaseName: string) => {
    if (phaseName === 'Inhale' || phaseName === 'Hold') {
      sounds.playSingingBowl();
    } else {
      sounds.playTap();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsRemainingInPhase((prev) => {
          if (prev <= 1) {
            // Transition to next phase
            const nextIndex = (phaseIndex + 1) % pattern.phases.length;
            if (nextIndex === 0) {
              setCompletedCycles((c) => {
                const nextC = c + 1;
                if (nextC === 3) {
                  awardXPOnce({
                    amount: 25,
                    sourceType: 'task',
                    sourceId: `breath-session-${Date.now()}`,
                    description: 'Mindful Breathwork Session',
                    date: new Date().toISOString().split('T')[0],
                  });
                }
                return nextC;
              });
            }
            setPhaseIndex(nextIndex);
            const nextDuration = pattern.phases[nextIndex].seconds;
            triggerPhaseSound(pattern.phases[nextIndex].name);
            return nextDuration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phaseIndex, pattern.phases, triggerPhaseSound, awardXPOnce]);

  const handleToggleActive = () => {
    if (!isActive) {
      triggerPhaseSound(currentPhase.name);
    }
    setIsActive(!isActive);
    sounds.playTap();
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemainingInPhase(pattern.phases[0].seconds);
    setCompletedCycles(0);
    sounds.playTap();
  };

  const handleSwitchPattern = (newPattern: BreathPattern) => {
    setPatternType(newPattern);
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemainingInPhase(PATTERNS[newPattern].phases[0].seconds);
    setCompletedCycles(0);
    sounds.playTap();
  };

  // Breathing expansion scale
  const isExpanding = currentPhase.name === 'Inhale';
  const isHolding = currentPhase.name === 'Hold';
  const isContracting = currentPhase.name === 'Exhale' || currentPhase.name === 'Rest';

  const scaleClass = isExpanding
    ? 'scale-125 duration-[4000ms]'
    : isHolding
    ? 'scale-125 duration-[1000ms]'
    : 'scale-90 duration-[4000ms]';

  return (
    <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] space-y-4 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-xs">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-[var(--text-main)]">
                Bioluminescent Breathwork Matrix
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400">
                432Hz Sound Guided
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Harmonize your nervous system with synchronized visual geometry &amp; singing bowl acoustics
            </p>
          </div>
        </div>

        {/* Pattern Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs font-bold">
          <button
            type="button"
            onClick={() => handleSwitchPattern('box')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              patternType === 'box'
                ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            4-4-4-4 Box
          </button>
          <button
            type="button"
            onClick={() => handleSwitchPattern('relax')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              patternType === 'relax'
                ? 'bg-[var(--bg-card)] text-[var(--text-main)] shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            4-7-8 Relax
          </button>
        </div>
      </div>

      {/* Interactive Sacred Geometry Breathing Arena */}
      <div className="py-6 flex flex-col items-center justify-center space-y-6">
        
        {/* Animated Bioluminescent Breathing Circles */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center select-none">
          
          {/* Ambient Outer Halo Ring */}
          <div 
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-teal-400/20 via-cyan-500/20 to-emerald-400/20 blur-xl transition-transform ease-in-out ${scaleClass}`}
          />

          {/* Concentric Rotating Sacred Geometry Rings */}
          <div 
            className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-teal-500/40 dark:border-teal-400/40 flex items-center justify-center transition-transform ease-in-out shadow-lg ${scaleClass}`}
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-dashed border-cyan-400/50 flex items-center justify-center animate-spin" style={{ animationDuration: '40s' }}>
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-500/30 backdrop-blur-md flex items-center justify-center shadow-inner">
                
                {/* Central Phase Label */}
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-black text-[var(--text-main)] tracking-tight">
                    {currentPhase.name}
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-black text-teal-600 dark:text-teal-400 mt-0.5">
                    {secondsRemainingInPhase}s
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Status Prompt & Completed Cycles Count */}
        <div className="text-center space-y-1">
          <p className="text-xs sm:text-sm font-bold text-[var(--text-main)]">
            {pattern.description}
          </p>
          <div className="flex items-center justify-center gap-3 text-xs text-[var(--text-muted)] font-semibold">
            <span>Cycle: <strong>{completedCycles}</strong> complete</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3 cycles awards +25 XP</span>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="p-3 rounded-2xl bg-[var(--bg-card-subtle)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] text-[var(--text-muted)] border border-black/[0.04] dark:border-white/[0.06] transition-colors active:scale-95 cursor-pointer"
            title="Reset Breathing Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToggleActive}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:opacity-95 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Breath</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Begin Flow</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

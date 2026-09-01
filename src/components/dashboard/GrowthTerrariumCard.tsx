'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PLANT_SPECIES_LIST } from '@/lib/constants';
import { PlantSpecies } from '@/types';
import { Sparkles, Droplets, Sun, Wind, ChevronRight, Info, Heart } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface GrowthTerrariumCardProps {
  progressPercent: number;
  todayFocusMinutes: number;
  completedTasks: number;
  totalTasks: number;
}

const PLANT_STAGES = [
  { stage: 0, name: 'Seed', minPct: 0, desc: 'Dormant in rich mineral soil, waiting for the first focus spark' },
  { stage: 1, name: 'Sprout', minPct: 25, desc: 'First green shoot emerges! Moisture and morning intent absorbed' },
  { stage: 2, name: 'Sapling', minPct: 50, desc: 'Sturdy stem and leaves reach upward with steady focus momentum' },
  { stage: 3, name: 'Bud', minPct: 75, desc: 'Buds swelling with vibrant energy as daily missions conquer' },
  { stage: 4, name: 'Full Bloom', minPct: 100, desc: 'Magnificent full bloom! Terrarium radiates victorious glow' },
];

export function GrowthTerrariumCard({
  progressPercent,
  todayFocusMinutes,
  completedTasks,
  totalTasks,
}: GrowthTerrariumCardProps) {
  const { profile, setActivePlant } = useApp();
  const [showSeedSelector, setShowSeedSelector] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  const activePlantId: PlantSpecies = profile.activePlant || 'succulent';
  const activePlant = useMemo(() => {
    return PLANT_SPECIES_LIST.find((p) => p.id === activePlantId) || PLANT_SPECIES_LIST[0];
  }, [activePlantId]);

  const unlockedPlants = profile.unlockedPlants || ['succulent'];

  // Current Growth Stage (0..4)
  const currentStageIndex = useMemo(() => {
    if (progressPercent >= 100) return 4;
    if (progressPercent >= 75) return 3;
    if (progressPercent >= 50) return 2;
    if (progressPercent >= 25) return 1;
    return 0;
  }, [progressPercent]);

  const currentStage = PLANT_STAGES[currentStageIndex];

  // Moisture & Sunlight calculations based on actual focus minutes & task progress
  const moistureLevel = Math.min(100, Math.round((todayFocusMinutes / 90) * 100));
  const sunlightLevel = Math.min(100, Math.round(((completedTasks || 0) / Math.max(totalTasks || 1, 3)) * 100));

  const handlePlantClick = () => {
    sounds.playTaskPop();
    const greetings = [
      `🌱 ${activePlant.name} is feeling nourished!`,
      `✨ ${progressPercent}% Daily Vitality — keep going!`,
      `💧 Moisture: ${todayFocusMinutes}m logged today!`,
      `☀️ Sunlight: ${completedTasks}/${totalTasks || 3} missions complete!`,
      `🌸 ${currentStage.name} stage reached with pride!`
    ];
    const picked = greetings[Math.floor(Math.random() * greetings.length)];
    setBubbleText(picked);
    setTimeout(() => setBubbleText(null), 3200);
  };

  // Render SVG illustration for the active plant species and growth stage
  const renderPlantGraphic = () => {
    const isBloom = currentStageIndex === 4;
    const isBud = currentStageIndex === 3;
    const isSapling = currentStageIndex === 2;
    const isSprout = currentStageIndex === 1;
    const isSeed = currentStageIndex === 0;

    return (
      <div 
        onClick={handlePlantClick}
        className="relative w-36 h-44 sm:w-44 sm:h-52 flex items-center justify-center cursor-pointer select-none group"
      >
        {/* Glass Terrarium Jar Outline & Reflections */}
        <svg className="w-full h-full drop-shadow-md" viewBox="0 0 160 190" fill="none">
          
          {/* Glass Dome */}
          <path
            d="M30 50 C30 20, 130 20, 130 50 L135 150 C135 170, 25 170, 25 150 Z"
            className="fill-emerald-500/[0.04] dark:fill-emerald-400/[0.06] stroke-black/[0.08] dark:stroke-white/[0.12]"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Wooden / Cork Lid */}
          <rect x="55" y="14" width="50" height="10" rx="4" className="fill-amber-700/80 stroke-amber-900/60" strokeWidth="1.5" />
          <circle cx="80" cy="12" r="3" className="fill-amber-600" />

          {/* Soil Layer */}
          <path
            d="M27 146 C45 142, 115 142, 133 146 L131 154 C125 166, 35 166, 29 154 Z"
            className="fill-stone-800/80 dark:fill-stone-900"
          />
          {/* Soil highlights */}
          <ellipse cx="80" cy="148" rx="46" ry="6" className="fill-stone-700/60" />
          <circle cx="55" cy="151" r="1.5" className="fill-amber-600/40" />
          <circle cx="105" cy="150" r="1.5" className="fill-amber-600/40" />

          {/* Sunbeam Aura Glow behind plant */}
          <ellipse
            cx="80"
            cy="110"
            rx="38"
            ry="45"
            className="fill-emerald-400/10 dark:fill-emerald-400/20 blur-md terrarium-sunbeam"
          />

          {/* --- Dynamic Plant Anatomy --- */}

          {/* Stage 0: Seed */}
          {isSeed && (
            <g className="animate-bounce transition-all duration-500" style={{ animationDuration: '3s' }}>
              <ellipse cx="80" cy="142" rx="7" ry="5" className="fill-amber-800 stroke-amber-950" strokeWidth="1" />
              <path d="M80 137 Q82 133 80 130" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Stage 1: Sprout */}
          {isSprout && (
            <g className="transition-all duration-500">
              <path d="M80 144 Q79 125 80 115" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
              <path d="M80 118 Q70 112 68 122 Q76 126 80 118" className="fill-emerald-400 stroke-emerald-600" strokeWidth="1" />
              <path d="M80 122 Q90 116 92 126 Q84 130 80 122" className="fill-emerald-500 stroke-emerald-700" strokeWidth="1" />
            </g>
          )}

          {/* Stage 2: Sapling */}
          {isSapling && (
            <g className="transition-all duration-500">
              <path d="M80 144 Q78 115 80 95" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" />
              {/* Lower leaves */}
              <path d="M80 125 Q64 116 62 130 Q74 135 80 125" className="fill-emerald-500 stroke-emerald-700" strokeWidth="1" />
              <path d="M80 120 Q96 111 98 125 Q86 130 80 120" className="fill-emerald-400 stroke-emerald-600" strokeWidth="1" />
              {/* Upper leaves */}
              <path d="M80 102 Q66 94 65 106 Q76 111 80 102" className="fill-emerald-400 stroke-emerald-600" strokeWidth="1" />
              <path d="M80 98 Q94 90 95 102 Q84 107 80 98" className="fill-emerald-300 stroke-emerald-500" strokeWidth="1" />
            </g>
          )}

          {/* Stage 3: Bud */}
          {isBud && (
            <g className="transition-all duration-500">
              <path d="M80 144 Q76 110 80 82" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
              {/* Foliage */}
              <path d="M80 128 Q60 118 58 134 Q72 140 80 128" className="fill-emerald-600" />
              <path d="M80 122 Q100 112 102 128 Q88 134 80 122" className="fill-emerald-500" />
              <path d="M80 105 Q62 95 60 110 Q74 116 80 105" className="fill-emerald-400" />
              <path d="M80 100 Q98 90 100 105 Q86 111 80 100" className="fill-emerald-400" />
              {/* Emerging Flower/Leaf Bud */}
              <ellipse cx="80" cy="80" rx="9" ry="12" className="fill-rose-400 stroke-rose-500 animate-pulse" strokeWidth="1.5" />
              <circle cx="80" cy="78" r="4" className="fill-amber-300" />
            </g>
          )}

          {/* Stage 4: Full Bloom */}
          {isBloom && (
            <g className="transition-all duration-500">
              <path d="M80 144 Q76 105 80 75" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
              {/* Lush foliage */}
              <path d="M80 130 Q54 118 52 136 Q70 144 80 130" className="fill-emerald-600" />
              <path d="M80 124 Q106 112 108 130 Q90 138 80 124" className="fill-emerald-500" />
              <path d="M80 106 Q56 94 54 112 Q72 120 80 106" className="fill-emerald-400" />
              <path d="M80 100 Q104 88 106 106 Q88 114 80 100" className="fill-emerald-400" />

              {/* Master Flower / Tree Crown depending on species */}
              {activePlantId === 'sunflower' ? (
                <g className="animate-spin" style={{ animationDuration: '24s', transformOrigin: '80px 72px' }}>
                  <circle cx="80" cy="72" r="16" className="fill-amber-400 stroke-amber-500" strokeWidth="1.5" />
                  <circle cx="80" cy="72" r="9" className="fill-amber-900 stroke-amber-950" />
                  {/* Petals */}
                  <circle cx="80" cy="52" r="5" className="fill-yellow-300" />
                  <circle cx="80" cy="92" r="5" className="fill-yellow-300" />
                  <circle cx="60" cy="72" r="5" className="fill-yellow-300" />
                  <circle cx="100" cy="72" r="5" className="fill-yellow-300" />
                  <circle cx="66" cy="58" r="5" className="fill-yellow-400" />
                  <circle cx="94" cy="86" r="5" className="fill-yellow-400" />
                  <circle cx="66" cy="86" r="5" className="fill-yellow-400" />
                  <circle cx="94" cy="58" r="5" className="fill-yellow-400" />
                </g>
              ) : activePlantId === 'bonsai' ? (
                <g>
                  {/* Dense Pine Canopy Clouds */}
                  <ellipse cx="65" cy="68" rx="18" ry="10" className="fill-emerald-800 stroke-emerald-950" strokeWidth="1" />
                  <ellipse cx="95" cy="62" rx="20" ry="11" className="fill-emerald-700 stroke-emerald-950" strokeWidth="1" />
                  <ellipse cx="80" cy="52" rx="22" ry="12" className="fill-emerald-600 stroke-emerald-900" strokeWidth="1" />
                </g>
              ) : activePlantId === 'cherry_blossom' ? (
                <g>
                  {/* Sakura Petal Cluster */}
                  <circle cx="80" cy="70" r="14" className="fill-pink-400 stroke-pink-500" strokeWidth="1.5" />
                  <circle cx="66" cy="64" r="10" className="fill-pink-300 stroke-pink-400" />
                  <circle cx="94" cy="64" r="10" className="fill-pink-300 stroke-pink-400" />
                  <circle cx="80" cy="54" r="11" className="fill-rose-300 stroke-rose-400" />
                  <circle cx="80" cy="70" r="5" className="fill-amber-200" />
                </g>
              ) : (
                <g>
                  {/* Lush Blooming Lotus/Succulent */}
                  <path d="M80 50 Q60 65 80 80 Q100 65 80 50" className="fill-pink-400 stroke-pink-500" strokeWidth="1" />
                  <path d="M60 70 Q75 80 90 70 Q75 55 60 70" className="fill-rose-300 stroke-rose-400" strokeWidth="1" />
                  <path d="M100 70 Q85 80 70 70 Q85 55 100 70" className="fill-rose-300 stroke-rose-400" strokeWidth="1" />
                  <circle cx="80" cy="70" r="6" className="fill-amber-300 stroke-amber-400" />
                </g>
              )}
            </g>
          )}

          {/* Glass Condensation Moisture Droplets */}
          <circle cx="45" cy="75" r="1.5" className="fill-cyan-300/80" />
          <circle cx="42" cy="85" r="1" className="fill-cyan-300/60" />
          <circle cx="118" cy="80" r="1.5" className="fill-cyan-300/80" />
          <circle cx="122" cy="95" r="1.2" className="fill-cyan-300/60" />

          {/* Glass Specular Reflection Curves */}
          <path d="M38 48 C38 35, 60 28, 70 28" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M36 60 L38 120" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
        </svg>

        {/* Mascot Speech Bubble */}
        {bubbleText && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-xl border border-slate-700 whitespace-nowrap animate-fadeIn flex items-center gap-1.5">
            <span>{bubbleText}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] shadow-sm relative overflow-hidden">
      
      {/* Background Soft Pastel Gradient Aura */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-400/5 to-transparent blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Column: Living Terrarium Plant Graphic */}
        <div className="flex flex-col items-center justify-center shrink-0">
          {renderPlantGraphic()}
          
          {/* Active Species Switcher Pill */}
          <div className="mt-1 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setShowSeedSelector(!showSeedSelector);
                sounds.playTap();
              }}
              className="px-3 py-1 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] border border-black/[0.04] dark:border-white/[0.06] text-xs font-bold text-[var(--text-main)] flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <span>{activePlant.emoji}</span>
              <span className="truncate max-w-[130px]">{activePlant.name}</span>
              <ChevronRight className={`w-3 h-3 text-[var(--text-muted)] transition-transform ${showSeedSelector ? 'rotate-90' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setShowInfoModal(true)}
              className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
              title="Growth Stage Details"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Seed Selector Quick Switcher Dropdown */}
          {showSeedSelector && (
            <div className="mt-2 p-2 rounded-2xl clean-card bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] shadow-xl w-60 space-y-1 z-30 text-xs animate-fadeIn">
              <div className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] px-2 py-1">
                Your Unlocked Seeds
              </div>
              {unlockedPlants.map((plantId) => {
                const info = PLANT_SPECIES_LIST.find((p) => p.id === plantId);
                if (!info) return null;
                const isSelected = activePlantId === plantId;
                return (
                  <button
                    key={plantId}
                    type="button"
                    onClick={() => {
                      setActivePlant(plantId);
                      setShowSeedSelector(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-[var(--primary-light)] text-[var(--primary-text)] font-black'
                        : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.05] text-[var(--text-main)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{info.emoji}</span>
                      <span className="truncate">{info.name}</span>
                    </div>
                    {isSelected && <span className="text-[10px] font-black">Active</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Stage Progress, Vitality Metrics & Plant Benefit */}
        <div className="flex-1 w-full space-y-4">
          
          {/* Header row with current Stage Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)] px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] border border-[var(--primary)]/20">
                  Growth Terrarium
                </span>
                <span className="text-xs font-bold text-[var(--text-muted)]">
                  Stage {currentStageIndex + 1} of 5
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-[var(--text-main)] mt-1 flex items-center gap-2">
                <span>{currentStage.name}</span>
                <span className="text-sm font-semibold text-[var(--text-muted)]">
                  ({progressPercent}% Daily Vitality)
                </span>
              </h2>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-[var(--primary)]">
                {progressPercent}%
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            {currentStage.desc}
          </p>

          {/* Visual Organic Stepper Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-black/[0.04] dark:bg-white/[0.08] h-2.5 sm:h-3 rounded-full overflow-hidden p-0.5 border border-black/[0.04] dark:border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-pink-500 rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stepper Node Labels */}
            <div className="flex justify-between text-[10px] font-bold text-[var(--text-muted)] px-1">
              {PLANT_STAGES.map((s, idx) => (
                <span 
                  key={s.name}
                  className={idx <= currentStageIndex ? 'text-[var(--primary)] font-black' : 'opacity-50'}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>

          {/* Plant Vitality Drivers (Moisture & Sunlight Grid) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            
            {/* Moisture Meter (Focus Time Driver) */}
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Moisture</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                  {todayFocusMinutes}m / 90m
                </span>
              </div>
              <div className="w-full bg-black/[0.04] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${moistureLevel}%` }}
                />
              </div>
            </div>

            {/* Sunlight Meter (Missions Done Driver) */}
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sunlight</span>
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  {completedTasks}/{totalTasks || 3} Tasks
                </span>
              </div>
              <div className="w-full bg-black/[0.04] dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${sunlightLevel}%` }}
                />
              </div>
            </div>

          </div>

          {/* Plant Passive Perk Badge */}
          <div className="p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 flex items-center justify-between text-xs text-[var(--primary-text)] font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span><strong>{activePlant.name} Perk:</strong> {activePlant.benefit}</span>
            </span>
          </div>

        </div>

      </div>

      {/* Growth Stage Requirements Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <h3 className="text-sm sm:text-base font-black text-[var(--text-main)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Terrarium Growth Formula</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Your terrarium evolves dynamically throughout the day across 5 living stages based on your real discipline:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <span>🌰 <strong>Stage 1: Seed (0%)</strong></span>
                <span className="text-[var(--text-muted)]">Day initialization</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <span>🌱 <strong>Stage 2: Sprout (25%)</strong></span>
                <span className="text-[var(--text-muted)]">Sunrise intent or 1st mission</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <span>🌿 <strong>Stage 3: Sapling (50%)</strong></span>
                <span className="text-[var(--text-muted)]">2 missions + 30m focus</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <span>🌺 <strong>Stage 4: Bud (75%)</strong></span>
                <span className="text-[var(--text-muted)]">3 missions + 60m focus</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] flex items-center justify-between">
                <span>🌸 <strong>Stage 5: Bloom (100%)</strong></span>
                <span className="text-[var(--text-muted)]">All daily goals conquered</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="w-full py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-xs"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

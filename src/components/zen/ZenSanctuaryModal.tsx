'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PLANT_SPECIES_LIST } from '@/lib/constants';
import { PlantSpecies } from '@/types';
import { MomentumOracleDeck } from './MomentumOracleDeck';
import { ZenBreathMatrix } from './ZenBreathMatrix';
import { 
  Sparkles, 
  X, 
  Sun, 
  Moon, 
  Droplets, 
  Wind, 
  Compass, 
  Heart, 
  Flower2,
  TreePine,
  Sparkle
} from 'lucide-react';
import { sounds } from '@/lib/sounds';
import confetti from 'canvas-confetti';

interface ZenSanctuaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ZenSanctuaryModal({ isOpen, onClose }: ZenSanctuaryModalProps) {
  const { profile, awardXPOnce } = useApp();
  const [activeTab, setActiveTab] = useState<'greenhouse' | 'oracle' | 'breath'>('greenhouse');
  const [isNightMode, setIsNightMode] = useState(false);
  const [wateredPlants, setWateredPlants] = useState<Record<string, number>>({});
  const [wateringFeedback, setWateringFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const unlockedPlantIds = profile.unlockedPlants || ['succulent'];
  const unlockedPlants = PLANT_SPECIES_LIST.filter(p => unlockedPlantIds.includes(p.id));

  const handleWaterPlant = (species: PlantSpecies, plantName: string) => {
    sounds.playWaterSplash();
    setWateredPlants(prev => ({
      ...prev,
      [species]: (prev[species] || 0) + 1,
    }));

    setWateringFeedback(`💧 Shimmering water poured on ${plantName}! (+10 XP)`);
    setTimeout(() => setWateringFeedback(null), 3000);

    awardXPOnce({
      amount: 10,
      sourceType: 'task',
      sourceId: `water-plant-${species}-${Date.now()}`,
      description: `Nourished ${plantName} in Zen Greenhouse`,
      date: new Date().toISOString().split('T')[0],
    });

    try {
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#06B6D4', '#3B82F6', '#10B981']
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl clean-card p-5 sm:p-7 bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[var(--text-main)]">
                  Zen Botanical Sanctuary
                </h2>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  Mindfulness &amp; Growth
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Water your virtual greenhouse, draw momentum wisdom, and ground your breathing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] w-fit text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('greenhouse');
              sounds.playTap();
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'greenhouse'
                ? 'bg-[var(--bg-card)] text-emerald-600 dark:text-emerald-400 shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>Botanical Greenhouse</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('oracle');
              sounds.playTap();
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'oracle'
                ? 'bg-[var(--bg-card)] text-purple-600 dark:text-purple-400 shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Daily Oracle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('breath');
              sounds.playTap();
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'breath'
                ? 'bg-[var(--bg-card)] text-teal-600 dark:text-teal-400 shadow-xs font-black'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Breath Matrix</span>
          </button>
        </div>

        {/* Tab 1: Interactive Virtual Greenhouse */}
        {activeTab === 'greenhouse' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Feedback notification */}
            {wateringFeedback && (
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-600 dark:text-cyan-300 font-bold flex items-center gap-2 animate-fadeIn">
                <span>🌱</span>
                <span>{wateringFeedback}</span>
              </div>
            )}

            {/* Greenhouse Patio Arena */}
            <div className={`p-5 sm:p-6 rounded-3xl border transition-colors relative overflow-hidden ${
              isNightMode 
                ? 'bg-slate-950 text-white border-slate-800' 
                : 'bg-gradient-to-b from-emerald-50/50 via-teal-50/30 to-amber-50/20 dark:from-slate-900 dark:to-slate-950 border-black/[0.06] dark:border-white/[0.08]'
            }`}>
              
              {/* Day / Night toggle in Greenhouse */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-muted)]">Atmosphere:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNightMode(!isNightMode);
                      sounds.playTap();
                    }}
                    className="px-2.5 py-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isNightMode ? <Moon className="w-3.5 h-3.5 text-purple-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                    <span>{isNightMode ? 'Midnight Fireflies' : 'Golden Sunbeams'}</span>
                  </button>
                </div>

                <div className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Click plant to water</span>
                </div>
              </div>

              {/* Plant Collection Shelf */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {unlockedPlants.map((plant) => {
                  const timesWatered = wateredPlants[plant.id] || 0;
                  return (
                    <div
                      key={plant.id}
                      onClick={() => handleWaterPlant(plant.id, plant.name)}
                      className="p-3.5 rounded-2xl bg-[var(--bg-card)]/80 backdrop-blur-md border border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-500/60 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-between text-center space-y-2 cursor-pointer group hover:-translate-y-1 select-none active:scale-95"
                    >
                      <div className="relative">
                        <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform drop-shadow-md">
                          {plant.emoji}
                        </div>
                        {timesWatered > 0 && (
                          <span className="absolute -top-1 -right-2 px-1.5 py-0.2 rounded-full bg-cyan-500 text-white text-[9px] font-black">
                            💧 x{timesWatered}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-black text-[var(--text-main)] truncate">
                          {plant.name}
                        </h4>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          {plant.benefit}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="w-full py-1.5 rounded-xl bg-cyan-500/10 group-hover:bg-cyan-500 group-hover:text-white text-cyan-600 dark:text-cyan-300 font-bold text-[10px] transition-all flex items-center justify-center gap-1"
                      >
                        <Droplets className="w-3 h-3" />
                        <span>Water (+10 XP)</span>
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Daily Momentum Oracle */}
        {activeTab === 'oracle' && (
          <MomentumOracleDeck />
        )}

        {/* Tab 3: Bioluminescent Breathwork Matrix */}
        {activeTab === 'breath' && (
          <ZenBreathMatrix />
        )}

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PLANT_SPECIES_LIST } from '@/lib/constants';
import { PlantSpecies } from '@/types';
import { Sparkles, Check, Lock, ChevronRight, ShoppingBag, Leaf } from 'lucide-react';
import { sounds } from '@/lib/sounds';

export function PlantShopCard() {
  const { profile, buyPlantSeed, setActivePlant } = useApp();
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const unlockedPlants = profile.unlockedPlants || ['succulent'];
  const activePlantId: PlantSpecies = profile.activePlant || 'succulent';

  const handleBuy = (species: PlantSpecies) => {
    const res = buyPlantSeed(species);
    setFeedbackMsg(res.message);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleEquip = (species: PlantSpecies) => {
    setActivePlant(species);
    setFeedbackMsg(`Equipped in your Living Growth Terrarium!`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-[var(--text-main)]">
                Botanical Seed Nursery &amp; XP Shop
              </h3>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                {unlockedPlants.length} / {PLANT_SPECIES_LIST.length} Unlocked
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">
              Spend XP to cultivate rare botanical specimens for your Growth Terrarium
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{profile.currentXP} XP Available</span>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-[var(--primary)] font-bold flex items-center gap-2 animate-fadeIn">
          <span>🌱</span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Seed Variety Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {PLANT_SPECIES_LIST.map((plant) => {
          const isUnlocked = unlockedPlants.includes(plant.id);
          const isActive = activePlantId === plant.id;
          const canAfford = profile.currentXP >= plant.costXP;

          return (
            <div
              key={plant.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                isActive
                  ? 'bg-emerald-500/[0.06] border-emerald-500 shadow-sm ring-1 ring-emerald-500/30'
                  : isUnlocked
                  ? 'bg-[var(--bg-card)] border-black/[0.06] dark:border-white/[0.08] hover:border-emerald-500/50 shadow-2xs'
                  : 'bg-[var(--bg-card-subtle)]/70 border-black/[0.04] dark:border-white/[0.04] opacity-90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-500/20 flex items-center justify-center text-2xl shadow-2xs">
                    {plant.emoji}
                  </div>

                  <div className="text-right">
                    {isUnlocked ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {isActive ? 'Active Terrarium' : 'Unlocked'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {plant.costXP} XP
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs sm:text-sm font-black text-[var(--text-main)]">
                    {plant.name}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-relaxed line-clamp-2">
                    {plant.description}
                  </p>
                </div>

                {/* Passive Perk Tag */}
                <div className="mt-2.5 p-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.06] text-[10px] text-[var(--primary-text)] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate"><strong>Perk:</strong> {plant.benefit}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-[var(--border)]/60">
                {isActive ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-2 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Equipped</span>
                  </button>
                ) : isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => handleEquip(plant.id)}
                    className="w-full py-2 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-95 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    Equip in Terrarium
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBuy(plant.id)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                      canAfford
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs hover:opacity-95'
                        : 'bg-black/[0.04] dark:bg-white/[0.06] text-[var(--text-muted)] cursor-not-allowed opacity-60'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Unlock for {plant.costXP} XP</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Need {plant.costXP} XP</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}

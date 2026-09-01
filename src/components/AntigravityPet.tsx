'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { sounds } from '@/lib/sounds';
import { 
  Sparkles, 
  X, 
  Minus,
  Plus,
  Compass,
  Square
} from 'lucide-react';

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// Pet Species Definitions
export type PetType = 'cat' | 'dog' | 'duck' | 'fox';

export type PetState = 'idle' | 'walking' | 'sitting' | 'sleeping' | 'fetching' | 'eating' | 'jumping';

interface PetConfig {
  id: PetType;
  name: string;
  speciesName: string;
  emoji: string;
  toyEmoji: string;
  foodEmoji: string;
  themeColor: string;
  pixelColor: string;
  secondaryColor: string;
  eyeColor: string;
  dialogues: string[];
}

const PET_CONFIGS: Record<PetType, PetConfig> = {
  cat: {
    id: 'cat',
    name: 'Neko',
    speciesName: 'Pixel Cat',
    emoji: '🐱',
    toyEmoji: '🧶',
    foodEmoji: '🐟',
    themeColor: 'from-amber-400 to-orange-500',
    pixelColor: '#F59E0B',
    secondaryColor: '#FFFFFF',
    eyeColor: '#10B981',
    dialogues: [
      'Purr... You are doing awesome today! ✨',
      'Meow! Time for a quick 25m focus sprint? ⏱️',
      '+10 XP for petting! Keep the momentum! 🐾',
      'Purrr... Stay in the flow, friend! 🧘',
      'Neko believes in your daily goals! 🌟',
    ],
  },
  dog: {
    id: 'dog',
    name: 'Shiba',
    speciesName: 'Pixel Shiba',
    emoji: '🐕',
    toyEmoji: '🎾',
    foodEmoji: '🦴',
    themeColor: 'from-amber-500 to-yellow-600',
    pixelColor: '#D97706',
    secondaryColor: '#FEF3C7',
    eyeColor: '#1F2937',
    dialogues: [
      'Woof! Let\'s crush today\'s priority missions! 🎯',
      'Tail wagging at maximum speed! +15 XP! 🐶',
      'Bork! Throw the ball, let\'s play! 🎾',
      'Woof woof! Your streak is on fire today! 🔥',
      'Good human! Stay hydrated and focused! 💧',
    ],
  },
  duck: {
    id: 'duck',
    name: 'Ducky',
    speciesName: 'Pixel Duck',
    emoji: '🦆',
    toyEmoji: '🫧',
    foodEmoji: '🍞',
    themeColor: 'from-yellow-300 to-amber-400',
    pixelColor: '#FBBF24',
    secondaryColor: '#F97316',
    eyeColor: '#111827',
    dialogues: [
      'Quack! Water your habits every day! 🦆',
      'Waddle waddle... Step by step to the goal! 🌾',
      'Quack quack! Focus session time! ⏰',
      '+10 XP! Swimming through tasks smoothly! 🌊',
      'Quack! Remember to take a deep breath! 🍃',
    ],
  },
  fox: {
    id: 'fox',
    name: 'Kitsune',
    speciesName: 'Pixel Fox',
    emoji: '🦊',
    toyEmoji: '🥏',
    foodEmoji: '🍗',
    themeColor: 'from-orange-500 to-rose-500',
    pixelColor: '#EA580C',
    secondaryColor: '#FFFFFF',
    eyeColor: '#3B82F6',
    dialogues: [
      'Chirp! Outsmart your procrastination! 🦊',
      'Swift and agile focus! +10 XP! ⚡',
      'A wise fox focuses on one mission at a time! 📜',
      'Warm and cozy! Your streak flame is protected! 🔥',
      'Fox wisdom: Small daily wins build empires! 👑',
    ],
  },
};

interface BallObject {
  x: number;
  active: boolean;
}

interface FoodObject {
  x: number;
  active: boolean;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

// Helpers outside component for React Compiler purity
function getRandomDialogue(dialogues: string[]): string {
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

function getRandomOffset(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateParticles(baseX: number, count: number, emoji: string): FloatingParticle[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: Date.now() + i,
    x: baseX + 16 + (Math.random() * 30 - 15),
    y: (Math.random() * 20 - 40),
    emoji,
  }));
}

export default function AntigravityPet() {
  const isMounted = useIsMounted();

  // Selected pet species
  const [currentPet, setCurrentPet] = useState<PetType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pathly_pixel_pet');
      if (saved && (saved in PET_CONFIGS)) return saved as PetType;
    }
    return 'cat';
  });

  // Display mode: 'habitat' | 'roam' | 'minimized'
  const [viewMode, setViewMode] = useState<'habitat' | 'roam' | 'minimized'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pathly_pet_view_mode');
      if (saved === 'roam' || saved === 'habitat' || saved === 'minimized') return saved;
    }
    return 'habitat';
  });

  // Custom pet names
  const [customNames, setCustomNames] = useState<Record<string, string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('pathly_pet_custom_names');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  // Current config
  const petConfig = useMemo(() => PET_CONFIGS[currentPet], [currentPet]);
  const displayPetName = customNames[currentPet] || petConfig.name;

  // State Machine
  const [state, setState] = useState<PetState>('idle');
  const [posX, setPosX] = useState<number>(60);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [walkFrame, setWalkFrame] = useState<number>(0);
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [floatingParticles, setFloatingParticles] = useState<FloatingParticle[]>([]);

  // Interactive Game Objects (Ball & Snack)
  const [ball, setBall] = useState<BallObject | null>(null);
  const [food, setFood] = useState<FoodObject | null>(null);

  // Save pet choice
  const handleSelectPet = (petId: PetType) => {
    setCurrentPet(petId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pathly_pixel_pet', petId);
    }
    sounds.playTaskPop();
    triggerDialogue(`Switched to ${PET_CONFIGS[petId].name}! ${PET_CONFIGS[petId].emoji}`);
  };

  const handleCyclePet = () => {
    const list: PetType[] = ['cat', 'dog', 'duck', 'fox'];
    const nextIdx = (list.indexOf(currentPet) + 1) % list.length;
    handleSelectPet(list[nextIdx]);
  };

  const handleSetViewMode = (mode: 'habitat' | 'roam' | 'minimized') => {
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pathly_pet_view_mode', mode);
    }
    sounds.playTap();
  };

  const triggerDialogue = (customMsg?: string) => {
    const msg = customMsg || getRandomDialogue(petConfig.dialogues);
    setDialogue(msg);
    setTimeout(() => setDialogue(null), 3500);
  };

  const spawnParticles = (count = 3, emoji = '💖') => {
    const newItems = generateParticles(posX, count, emoji);
    setFloatingParticles(prev => [...prev, ...newItems]);
    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => !newItems.some(n => n.id === p.id)));
    }, 1200);
  };

  // Pet interaction
  const handlePetClick = () => {
    sounds.playTaskPop();
    let reactionEmoji = '💖';
    if (currentPet === 'cat') reactionEmoji = '💖';
    if (currentPet === 'dog') reactionEmoji = '🦴';
    if (currentPet === 'duck') reactionEmoji = '🫧';
    if (currentPet === 'fox') reactionEmoji = '🍁';
    
    spawnParticles(4, reactionEmoji);
    triggerDialogue();
  };

  // Throw Ball action
  const handleThrowBall = () => {
    sounds.playTap();
    const boundWidth = viewMode === 'habitat' ? 220 : (typeof window !== 'undefined' ? window.innerWidth - 80 : 600);
    const targetX = posX > boundWidth / 2 
      ? Math.max(20, posX - getRandomOffset(60, 140))
      : Math.min(boundWidth - 40, posX + getRandomOffset(60, 140));

    setBall({
      x: targetX,
      active: true,
    });

    setState('fetching');
    setDirection(targetX > posX ? 'right' : 'left');
    triggerDialogue(`Fetch the toy! ${petConfig.toyEmoji}`);
  };

  // Feed Snack action
  const handleFeedSnack = () => {
    sounds.playTaskPop();
    const boundWidth = viewMode === 'habitat' ? 220 : (typeof window !== 'undefined' ? window.innerWidth - 80 : 600);
    const snackX = Math.max(20, Math.min(boundWidth - 40, posX + (direction === 'right' ? 50 : -50)));
    
    setFood({
      x: snackX,
      active: true,
    });

    setState('walking');
    setDirection(snackX > posX ? 'right' : 'left');
    triggerDialogue(`Yum! Snack time! ${petConfig.foodEmoji}`);
  };

  // Put to sleep / wake up action
  const handleToggleSleep = () => {
    sounds.playTap();
    setState(state === 'sleeping' ? 'idle' : 'sleeping');
    triggerDialogue(state === 'sleeping' ? 'Yawn... Good morning! ☀️' : 'Zzz... Time to recharge 🌙');
    if (state !== 'sleeping') {
      spawnParticles(3, '💤');
    }
  };

  // Rename pet
  const handleRenamePet = () => {
    sounds.playTap();
    const newName = window.prompt(`Enter a new name for your ${petConfig.speciesName}:`, displayPetName);
    if (newName && newName.trim().length > 0) {
      setCustomNames(prev => {
        const next = { ...prev, [currentPet]: newName.trim().substring(0, 16) };
        if (typeof window !== 'undefined') {
          localStorage.setItem('pathly_pet_custom_names', JSON.stringify(next));
        }
        return next;
      });
      sounds.playLevelUp();
      triggerDialogue(`I love my new name! ✨`);
    }
  };

  // Autonomous State Machine & Movement Loop
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const interval = setInterval(() => {
      const boundWidth = viewMode === 'habitat' ? 210 : (window.innerWidth - 60);

      // If fetching ball
      if (state === 'fetching' && ball?.active) {
        const speed = 5;
        if (Math.abs(posX - ball.x) <= speed) {
          // Ball caught!
          setPosX(ball.x);
          setBall(null);
          setState('jumping');
          sounds.playMarioCoin();
          setDialogue('Caught it! +20 XP 🎾');
          setTimeout(() => {
            setDialogue(null);
            setState('idle');
          }, 1200);
        } else {
          setDirection(ball.x > posX ? 'right' : 'left');
          setPosX(prev => (ball.x > prev ? prev + speed : prev - speed));
          setWalkFrame(f => (f + 1) % 4);
        }
        return;
      }

      // If eating food
      if (food?.active) {
        const speed = 3.5;
        if (Math.abs(posX - food.x) <= speed) {
          // Food reached!
          setPosX(food.x);
          setFood(null);
          setState('eating');
          sounds.playTaskPop();
          setDialogue('Nom nom! Delicious! 🍎');
          setTimeout(() => {
            setDialogue(null);
            setState('idle');
          }, 1400);
        } else {
          setDirection(food.x > posX ? 'right' : 'left');
          setPosX(prev => (food.x > prev ? prev + speed : prev - speed));
          setWalkFrame(f => (f + 1) % 4);
        }
        return;
      }

      // If sleeping or eating or jumping, do not wander
      if (state === 'sleeping' || state === 'eating' || state === 'jumping') {
        return;
      }

      // Normal Autonomous Wandering
      if (state === 'walking') {
        const step = 2.2;
        setPosX(prev => {
          let next = direction === 'right' ? prev + step : prev - step;
          if (next >= boundWidth) {
            next = boundWidth;
            setDirection('left');
          } else if (next <= 15) {
            next = 15;
            setDirection('right');
          }
          return next;
        });
        setWalkFrame(f => (f + 1) % 4);

        if (Math.random() < 0.05) {
          const rand = Math.random();
          if (rand < 0.4) setState('idle');
          else if (rand < 0.7) setState('sitting');
          else if (rand < 0.85) {
            setState('jumping');
            setTimeout(() => {
              setState('walking');
            }, 400);
          }
          else setState('sleeping');
        }
      } else if (state === 'idle' || state === 'sitting') {
        if (Math.random() < 0.06) {
          setDirection(Math.random() > 0.5 ? 'right' : 'left');
          setState('walking');
        } else if (Math.random() < 0.03) {
          setState(state === 'idle' ? 'sitting' : 'idle');
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [state, posX, direction, ball, food, viewMode]);

  // If not mounted on client yet, return null to avoid any hydration mismatch
  if (!isMounted) return null;

  // MINIMIZED PILL (Positioned on Bottom-Left to never block Hotkeys/AI Guide)
  if (viewMode === 'minimized') {
    return createPortal(
      <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-[99999] flex items-center">
        <button
          onClick={() => handleSetViewMode('habitat')}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#0B0F19]/90 hover:bg-[#0B0F19] text-white border border-emerald-500/40 shadow-xl backdrop-blur-md transition-all active:scale-95 group text-xs font-bold"
          title="Open VS Code Pets Terrarium"
        >
          <span className="text-base animate-bounce">{petConfig.emoji}</span>
          <span 
            onClick={(e) => { e.stopPropagation(); handleRenamePet(); }}
            className="tracking-tight text-emerald-400 font-bold hover:text-white transition-colors cursor-pointer"
            title="Rename pet"
          >
            {displayPetName}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>
      </div>,
      document.body
    );
  }

  // VS CODE PETS HABITAT PANEL (Dedicated Sandbox on Bottom-Left)
  if (viewMode === 'habitat') {
    return createPortal(
      <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-[99999] w-72 bg-[#0d121f]/95 text-white border border-emerald-500/30 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 transition-all select-none">
        
        {/* Sleek Minimal Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <span className="text-base leading-none">{petConfig.emoji}</span>
            <span 
              onClick={handleRenamePet}
              className="text-xs font-black tracking-tight text-emerald-400 hover:text-white transition-colors cursor-pointer"
              title="Rename pet"
            >
              {displayPetName}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-500/15 text-emerald-300 rounded-md border border-emerald-500/30">
              {petConfig.speciesName}
            </span>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1 text-slate-400">
            
            {/* Cycle / Add Pet (+) */}
            <button
              onClick={handleCyclePet}
              className="p-1 rounded hover:bg-slate-800 hover:text-emerald-300 transition-colors"
              title={`Switch Pet Species (Currently: ${petConfig.speciesName})`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Throw Toy */}
            <button
              onClick={handleThrowBall}
              className="p-1 rounded hover:bg-slate-800 hover:text-emerald-300 transition-colors text-[11px]"
              title="Play with Toy"
            >
              {petConfig.toyEmoji}
            </button>

            {/* Feed Snack */}
            <button
              onClick={handleFeedSnack}
              className="p-1 rounded hover:bg-slate-800 hover:text-rose-300 transition-colors text-[11px]"
              title="Feed Snack"
            >
              {petConfig.foodEmoji}
            </button>

            {/* Sleep Toggle (💤) */}
            <button
              onClick={handleToggleSleep}
              className="p-1 rounded hover:bg-slate-800 hover:text-purple-300 transition-colors text-[11px]"
              title={state === 'sleeping' ? 'Wake Up' : 'Put to Sleep'}
            >
              💤
            </button>

            {/* Free Roam Mode Toggle */}
            <button
              onClick={() => handleSetViewMode('roam')}
              className="p-1 rounded hover:bg-slate-800 hover:text-amber-300 transition-colors"
              title="Switch to Screen Free Roam Mode"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>

            {/* Minimize (-) */}
            <button
              onClick={() => handleSetViewMode('minimized')}
              className="p-1 rounded hover:bg-slate-800 hover:text-slate-200 transition-colors"
              title="Minimize Pet"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pet Habitat Sandbox Viewport */}
        <div className="relative h-24 bg-[#090d16] overflow-hidden">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />

          {/* Floating Speech Dialogue Bubble */}
          {dialogue && (
            <div className="absolute top-2 left-2 right-2 bg-slate-900/95 border border-emerald-500/40 text-emerald-300 px-2 py-1 rounded-xl text-[10px] font-bold shadow-lg flex items-center gap-1 animate-in fade-in zoom-in-95 z-10">
              <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{dialogue}</span>
            </div>
          )}

          {/* Floating Love Particles */}
          {floatingParticles.map((item) => (
            <div
              key={item.id}
              className="absolute bottom-6 text-sm animate-bounce pointer-events-none"
              style={{ left: Math.min(230, item.x) }}
            >
              {item.emoji}
            </div>
          ))}

          {/* Thrown Toy */}
          {ball?.active && (
            <div
              className="absolute bottom-3 text-lg animate-bounce pointer-events-auto cursor-pointer"
              style={{ left: Math.min(240, ball.x) }}
              title="Toy"
            >
              {petConfig.toyEmoji}
            </div>
          )}

          {/* Dropped Snack */}
          {food?.active && (
            <div
              className="absolute bottom-3 text-lg animate-pulse pointer-events-auto"
              style={{ left: Math.min(240, food.x) }}
              title="Snack"
            >
              {petConfig.foodEmoji}
            </div>
          )}

          {/* Pixel Pet Character */}
          <div
            onClick={handlePetClick}
            className="absolute bottom-2 cursor-pointer transition-transform hover:scale-110 active:scale-95 group"
            style={{
              bottom: state === 'jumping' ? '40px' : '8px',
              left: Math.min(220, Math.max(10, posX)),
              transform: `scaleX(${direction === 'left' ? -1 : 1}) ${state === 'jumping' ? 'scaleY(1.15) rotate(-5deg)' : ''}`,
              transition: 'left 0.1s linear, bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.2s ease',
            }}
            title={`${displayPetName} (Click to pet!)`}
          >
            <PixelPetSprite
              petType={currentPet}
              state={state}
              walkFrame={walkFrame}
              config={petConfig}
            />

            {state === 'sleeping' && (
              <div className="absolute -top-2 right-0 text-[9px] font-black text-indigo-400 animate-pulse">
                zZz
              </div>
            )}
          </div>

          {/* Habitat Floor Grass Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-900/60 border-t border-emerald-500/30" />
        </div>

      </div>,
      document.body
    );
  }

  // SCREEN FREE ROAM MODE (Pet walks along the bottom edge of the screen)
  return createPortal(
    <>
      {/* Walking Arena for Roaming Pet & Interactive Items */}
      <div className="fixed bottom-16 sm:bottom-10 left-0 right-0 pointer-events-none z-[99999] select-none h-28">
        
        {/* Floating Speech Dialogue Bubble */}
        {dialogue && (
          <div
            className="absolute bottom-16 pointer-events-auto bg-[#0B0F19]/95 text-white border border-emerald-500/40 px-3 py-1 rounded-2xl shadow-2xl text-xs font-bold whitespace-nowrap animate-in fade-in zoom-in-95 flex items-center gap-1.5"
            style={{
              left: Math.max(16, Math.min(typeof window !== 'undefined' ? window.innerWidth - 220 : 600, posX - 40)),
              transition: 'left 0.1s ease-out'
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{dialogue}</span>
          </div>
        )}

        {/* Floating Particles */}
        {floatingParticles.map((item) => (
          <div
            key={item.id}
            className="absolute bottom-12 text-base animate-bounce pointer-events-none"
            style={{ left: item.x }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Thrown Toy */}
        {ball?.active && (
          <div
            className="absolute bottom-3 text-xl animate-bounce pointer-events-auto cursor-pointer"
            style={{ left: ball.x }}
            title="Toy"
          >
            {petConfig.toyEmoji}
          </div>
        )}

        {/* Dropped Snack */}
        {food?.active && (
          <div
            className="absolute bottom-3 text-xl animate-pulse pointer-events-auto"
            style={{ left: food.x }}
            title="Snack"
          >
            {petConfig.foodEmoji}
          </div>
        )}

        {/* The Pixel Pet Character */}
        <div
          onClick={handlePetClick}
          className="absolute cursor-pointer pointer-events-auto transition-transform hover:scale-110 active:scale-95 group"
          style={{
            bottom: state === 'jumping' ? '65px' : '4px',
            left: posX,
            transform: `scaleX(${direction === 'left' ? -1 : 1}) ${state === 'jumping' ? 'scaleY(1.15) rotate(-5deg)' : ''}`,
            transition: 'left 0.1s linear, bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.2s ease',
          }}
          title={`${displayPetName} (Click to pet!)`}
        >
          <PixelPetSprite
            petType={currentPet}
            state={state}
            walkFrame={walkFrame}
            config={petConfig}
          />

          {state === 'sleeping' && (
            <div className="absolute -top-3 right-0 text-xs font-black text-indigo-400 animate-pulse select-none">
              zZz
            </div>
          )}
        </div>

      </div>

      {/* Dedicated Floating Pet Control Bar (Docked gracefully on Bottom-Left, never obscuring footer) */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-[99999] pointer-events-auto flex items-center gap-1 bg-[#0B0F19]/95 backdrop-blur-xl border border-emerald-500/30 p-1.5 rounded-2xl shadow-2xl text-xs">
        <button
          onClick={handleThrowBall}
          className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-emerald-400 text-xs transition-colors"
          title="Play with Toy"
        >
          {petConfig.toyEmoji}
        </button>
        <button
          onClick={handleFeedSnack}
          className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors"
          title="Feed Snack"
        >
          {petConfig.foodEmoji}
        </button>
        <button
          onClick={handleCyclePet}
          className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs transition-colors"
          title="Cycle Pet"
        >
          {petConfig.emoji}
        </button>
        <button
          onClick={() => handleSetViewMode('habitat')}
          className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/20 text-emerald-400 transition-colors"
          title="Dock to Habitat Panel"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleSetViewMode('minimized')}
          className="p-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 transition-colors"
          title="Minimize"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </>,
    document.body
  );
}

// Retro Pixel Art Sprite Component
function PixelPetSprite({
  petType,
  state,
  walkFrame,
  config,
}: {
  petType: PetType;
  state: PetState;
  walkFrame: number;
  config: PetConfig;
}) {
  const isWalking = state === 'walking' || state === 'fetching';
  const isSleeping = state === 'sleeping';
  const isSitting = state === 'sitting';
  const isJumping = state === 'jumping';

  // Cat Pixel Sprite
  if (petType === 'cat') {
    return (
      <svg
        width="38"
        height="32"
        viewBox="0 0 22 18"
        className="shape-rendering-crispEdges drop-shadow-md"
        style={{ imageRendering: 'pixelated' }}
      >
        <rect x="4" y="2" width="3" height="3" fill={config.pixelColor} />
        <rect x="11" y="2" width="3" height="3" fill={config.pixelColor} />
        <rect x="5" y="3" width="1" height="1" fill="#FCA5A5" />
        <rect x="12" y="3" width="1" height="1" fill="#FCA5A5" />

        <rect x="3" y="4" width="12" height="7" fill={config.pixelColor} />
        
        {!isSleeping ? (
          <>
            <rect x="5" y="6" width="2" height="2" fill={config.eyeColor} />
            <rect x="11" y="6" width="2" height="2" fill={config.eyeColor} />
            <rect x="6" y="6" width="1" height="1" fill="#000000" />
            <rect x="12" y="6" width="1" height="1" fill="#000000" />
          </>
        ) : (
          <>
            <rect x="5" y="7" width="2" height="1" fill="#000000" />
            <rect x="11" y="7" width="2" height="1" fill="#000000" />
          </>
        )}

        <rect x="8.5" y="8" width="1" height="1" fill="#F472B6" />
        <rect x="8" y="9" width="2" height="1" fill="#1F2937" />

        <rect x="6" y="10" width="10" height="5" fill={config.pixelColor} />
        <rect x="7" y="11" width="6" height="3" fill={config.secondaryColor} />

        <rect 
          x={isSitting ? '16' : '15'} 
          y={walkFrame % 2 === 0 ? '8' : '9'} 
          width="2" 
          height="4" 
          fill={config.pixelColor} 
        />
        <rect 
          x={isSitting ? '17' : '16'} 
          y={walkFrame % 2 === 0 ? '7' : '8'} 
          width="2" 
          height="2" 
          fill={config.secondaryColor} 
        />

        {!isSleeping && (
          <>
            <rect 
              x={isWalking && walkFrame === 1 ? '7' : '6'} 
              y={isJumping ? '14' : '15'} 
              width="2" 
              height="3" 
              fill={config.secondaryColor} 
            />
            <rect 
              x={isWalking && walkFrame === 3 ? '13' : '14'} 
              y={isJumping ? '14' : '15'} 
              width="2" 
              height="3" 
              fill={config.secondaryColor} 
            />
          </>
        )}
      </svg>
    );
  }

  // Dog Pixel Sprite (Shiba)
  if (petType === 'dog') {
    return (
      <svg
        width="38"
        height="32"
        viewBox="0 0 22 18"
        className="shape-rendering-crispEdges drop-shadow-md"
        style={{ imageRendering: 'pixelated' }}
      >
        <rect x="3" y="1" width="3" height="3" fill={config.pixelColor} />
        <rect x="10" y="1" width="3" height="3" fill={config.pixelColor} />

        <rect x="2" y="3" width="12" height="7" fill={config.pixelColor} />
        <rect x="5" y="7" width="6" height="3" fill={config.secondaryColor} />

        {!isSleeping ? (
          <>
            <rect x="4" y="5" width="2" height="2" fill={config.eyeColor} />
            <rect x="10" y="5" width="2" height="2" fill={config.eyeColor} />
          </>
        ) : (
          <>
            <rect x="4" y="6" width="2" height="1" fill="#000000" />
            <rect x="10" y="6" width="2" height="1" fill="#000000" />
          </>
        )}

        <rect x="7.5" y="7" width="1.5" height="1.5" fill="#000000" />

        <rect x="5" y="9" width="11" height="6" fill={config.pixelColor} />
        <rect x="6" y="10" width="7" height="4" fill={config.secondaryColor} />

        <rect x="15" y="7" width="2" height="3" fill={config.pixelColor} />
        <rect x="14" y="6" width="2" height="2" fill={config.secondaryColor} />

        {!isSleeping && (
          <>
            <rect 
              x={isWalking && walkFrame % 2 === 0 ? '6' : '7'} 
              y="15" 
              width="2" 
              height="3" 
              fill={config.secondaryColor} 
            />
            <rect 
              x={isWalking && walkFrame % 2 === 1 ? '13' : '14'} 
              y="15" 
              width="2" 
              height="3" 
              fill={config.secondaryColor} 
            />
          </>
        )}
      </svg>
    );
  }

  // Duck Pixel Sprite
  if (petType === 'duck') {
    return (
      <svg
        width="36"
        height="32"
        viewBox="0 0 20 18"
        className="shape-rendering-crispEdges drop-shadow-md"
        style={{ imageRendering: 'pixelated' }}
      >
        <rect x="4" y="3" width="7" height="6" fill={config.pixelColor} />

        {!isSleeping ? (
          <rect x="6" y="5" width="2" height="2" fill={config.eyeColor} />
        ) : (
          <rect x="6" y="6" width="2" height="1" fill="#000000" />
        )}

        <rect x="1" y="6" width="4" height="2" fill={config.secondaryColor} />

        <rect x="5" y="8" width="11" height="6" fill={config.pixelColor} />

        <rect 
          x="7" 
          y={isWalking && walkFrame % 2 === 0 ? '8' : '9'} 
          width="5" 
          height="3" 
          fill="#F59E0B" 
        />

        <rect x="15" y="8" width="2" height="2" fill={config.pixelColor} />

        {!isSleeping && (
          <>
            <rect 
              x={isWalking && walkFrame % 2 === 0 ? '6' : '7'} 
              y="14" 
              width="3" 
              height="2" 
              fill={config.secondaryColor} 
            />
            <rect 
              x={isWalking && walkFrame % 2 === 1 ? '11' : '12'} 
              y="14" 
              width="3" 
              height="2" 
              fill={config.secondaryColor} 
            />
          </>
        )}
      </svg>
    );
  }

  // Fox Pixel Sprite
  return (
    <svg
      width="38"
      height="32"
      viewBox="0 0 22 18"
      className="shape-rendering-crispEdges drop-shadow-md"
      style={{ imageRendering: 'pixelated' }}
    >
      <rect x="3" y="1" width="3" height="4" fill={config.pixelColor} />
      <rect x="10" y="1" width="3" height="4" fill={config.pixelColor} />
      <rect x="4" y="2" width="1" height="2" fill="#1F2937" />
      <rect x="11" y="2" width="1" height="2" fill="#1F2937" />

      <rect x="2" y="4" width="12" height="6" fill={config.pixelColor} />
      <rect x="3" y="7" width="10" height="3" fill={config.secondaryColor} />

      {!isSleeping ? (
        <>
          <rect x="4" y="5" width="2" height="2" fill={config.eyeColor} />
          <rect x="10" y="5" width="2" height="2" fill={config.eyeColor} />
        </>
      ) : (
        <>
          <rect x="4" y="6" width="2" height="1" fill="#1F2937" />
          <rect x="10" y="6" width="2" height="1" fill="#1F2937" />
        </>
      )}

      <rect x="7.5" y="8" width="1" height="1" fill="#000000" />

      <rect x="5" y="9" width="10" height="5" fill={config.pixelColor} />
      <rect x="6" y="10" width="6" height="3" fill={config.secondaryColor} />

      <rect x="14" y={walkFrame % 2 === 0 ? '7' : '8'} width="4" height="4" fill={config.pixelColor} />
      <rect x="16" y={walkFrame % 2 === 0 ? '6' : '7'} width="3" height="3" fill={config.secondaryColor} />

      {!isSleeping && (
        <>
          <rect 
            x={isWalking && walkFrame % 2 === 0 ? '6' : '7'} 
            y="14" 
            width="2" 
            height="3" 
            fill="#1F2937" 
          />
          <rect 
            x={isWalking && walkFrame % 2 === 1 ? '12' : '13'} 
            y="14" 
            width="2" 
            height="3" 
            fill="#1F2937" 
          />
        </>
      )}
    </svg>
  );
}
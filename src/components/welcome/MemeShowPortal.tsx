'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';
import { MEMES_COLLECTION, MemeItem, getRandomMeme } from '@/lib/memesData';
import { 
  X, 
  RefreshCw, 
  Volume2, 
  Laugh, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';

interface MemeShowPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MemeShowPortal({ isOpen, onClose }: MemeShowPortalProps) {
  const [currentMeme, setCurrentMeme] = useState<MemeItem>(() => MEMES_COLLECTION[0]);
  const [likesMap, setLikesMap] = useState<{ [key: string]: number }>({});
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Pick a random meme (with prioritized Rickroll) on open
  useEffect(() => {
    if (isOpen) {
      const picked = getRandomMeme();
      const timer = setTimeout(() => {
        setCurrentMeme(picked);
        setImgError(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentLikes = likesMap[currentMeme.id] || currentMeme.likes;

  const handleShuffle = () => {
    sounds.playTaskPop();
    const picked = getRandomMeme(currentMeme.id);
    setCurrentMeme(picked);
    setImgError(false);
  };

  const handlePlaySound = () => {
    setIsPlayingSound(true);
    sounds.playMemeSound(currentMeme.soundType);
    setTimeout(() => setIsPlayingSound(false), 800);
  };

  const handleLike = (e: React.MouseEvent) => {
    sounds.playMemeSound(currentMeme.soundType);
    setLikesMap((prev) => ({
      ...prev,
      [currentMeme.id]: (prev[currentMeme.id] || currentMeme.likes) + 69,
    }));

    const emojis = ['😂', '💀', '🔥', '🚀', '✨', '🗿', '📈', '😹'];
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: e.clientX + (Math.random() * 80 - 40),
      y: e.clientY - 20 - Math.random() * 40,
    }));

    setFloatingParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setFloatingParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1200);
  };

  const handleClose = () => {
    setIsClosing(true);
    sounds.playLevelUp();

    if (dontShowToday) {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem('pathly_hide_welcome_date', todayStr);
    }

    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl transition-all duration-300 ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in fade-in zoom-in-95'
    }`}>
      
      {/* Floating Reactions */}
      {floatingParticles.map((item) => (
        <div
          key={item.id}
          className="fixed pointer-events-none text-3xl animate-bounce transition-all duration-1000 z-50 select-none"
          style={{ left: item.x, top: item.y }}
        >
          {item.emoji}
        </div>
      ))}

      {/* Main Clean Glass Modal Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0B0F19] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col max-h-[92vh] overflow-hidden text-white">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 pb-3 border-b border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xl shrink-0 select-none">
              🎭
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>PATHLY MEME SANCTUARY</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  100+ Library
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-0.5 truncate">
                {currentMeme.title}
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-2xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-all hover:rotate-90 active:scale-95 shadow-xs"
            title="Enter Pathly"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Meme Canvas (Clean & Focused) */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col items-center justify-center space-y-4">
          
          {/* Animated Meme Image Box with Fallback */}
          <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-amber-500/25 shadow-xl flex items-center justify-center group">
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentMeme.imageUrl}
                alt={currentMeme.title}
                referrerPolicy="no-referrer"
                loading="eager"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain bg-black/60 transition-transform duration-300 group-hover:scale-102"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <span className="text-6xl select-none animate-bounce">{currentMeme.fallbackEmoji}</span>
                <span className="text-sm font-bold text-amber-300">{currentMeme.title}</span>
                <span className="text-[10px] text-slate-400">Iconic Productivity Meme</span>
              </div>
            )}

            {/* Category Tag Overlay */}
            <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-black text-amber-300">
              {currentMeme.category}
            </div>
          </div>

          {/* Punchy Relatable Caption */}
          <div className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 text-center shadow-inner">
            <p className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed">
              &ldquo;{currentMeme.caption}&rdquo;
            </p>
          </div>

          {/* Interactive Controls Row (Mobile Touch-Friendly) */}
          <div className="grid grid-cols-3 gap-2 w-full">
            
            {/* Play Sound Button */}
            <button
              type="button"
              onClick={handlePlaySound}
              className={`p-3 sm:p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs min-h-[44px] ${
                isPlayingSound
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 scale-105 shadow-md'
                  : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/10'
              }`}
              title={`Play ${currentMeme.soundLabel}`}
            >
              {isPlayingSound ? <Volume2 className="w-4 h-4 animate-ping text-slate-950" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
              <span className="truncate text-[11px] sm:text-xs">{currentMeme.soundLabel}</span>
            </button>

            {/* Next Meme Shuffle Button */}
            <button
              type="button"
              onClick={handleShuffle}
              className="p-3 sm:p-2.5 rounded-2xl bg-slate-900 hover:bg-amber-500/10 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs min-h-[44px]"
              title="Shuffle next meme from 100+ database"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Shuffle 🎲</span>
            </button>

            {/* Upvote Reaction Button */}
            <button
              type="button"
              onClick={handleLike}
              className="p-3 sm:p-2.5 rounded-2xl bg-slate-900 hover:bg-rose-500/10 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-xs min-h-[44px]"
              title="Give dopamine laugh upvote"
            >
              <Laugh className="w-4 h-4 text-rose-400" />
              <span>{currentLikes.toLocaleString()}</span>
            </button>

          </div>

        </div>

        {/* Bottom Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-amber-500/20 bg-gradient-to-r from-slate-950 to-[#070A10] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Don't show today checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-[11px]">Don&apos;t show on startup today</span>
          </label>

          {/* Glowing CTA Button */}
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-400 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>ENTER PATHLY &amp; FOCUS</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>
    </div>
  );
}

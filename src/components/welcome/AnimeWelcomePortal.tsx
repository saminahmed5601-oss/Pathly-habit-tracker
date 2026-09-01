'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '@/lib/sounds';
import { 
  X, 
  Sparkles, 
  ChevronRight, 
  Star,
  Swords
} from 'lucide-react';

interface AnimeWelcomePortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UPDATE_HIGHLIGHTS = [
  {
    icon: '🐾',
    title: 'Antigravity Companion Pet',
    tag: 'NEW FEATURE',
    tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    desc: 'Adopt Sproutly, Luna, Bambu, Ignis, or Archie! Pet them, feed cosmic berries, and level up together as you crush habits.',
  },
  {
    icon: '⏱️',
    title: 'Custom Task Time & Precision Dial',
    tag: 'PRODUCTIVITY',
    tagColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    desc: 'Set any custom duration (15m, 45m, 90m, or exact custom minutes) for tasks and auto-load with 1-click focus.',
  },
  {
    icon: '🌑',
    title: 'True OLED Black & 6 Neon Themes',
    tag: 'AESTHETICS',
    tagColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    desc: 'Ultra-deep Obsidian pitch blacks, 100% True OLED Pure Black, plus 6 curated anime cyber accents.',
  },
  {
    icon: '🕒',
    title: 'Live Real-Time Cyber Clock',
    tag: 'SYSTEM',
    tagColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    desc: 'Glassmorphic 12H/24H digital clock with live ticking seconds and smooth circular SVG focus ring.',
  },
  {
    icon: '🎧',
    title: 'Zen Ambient Soundscapes',
    tag: 'FOCUS AUDIO',
    tagColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    desc: 'Built-in Rain, Ocean Waves, Brown Noise, and 10Hz Alpha Binaural waves during deep work sessions.',
  },
  {
    icon: '🤖',
    title: 'AI Companion & Voice Input',
    tag: 'INTELLIGENCE',
    tagColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    desc: 'Natural language task creation, voice input recognition, and strict focus coaching guardrails.',
  },
];

const ANIME_QUOTES = [
  { text: 'A single step practiced daily outshines a thousand unattempted dreams.', author: 'Focus Master' },
  { text: 'Even the strongest hero began their journey at Level 1 with 0 XP.', author: 'Pathly Oracle' },
  { text: 'Your streak is your spiritual armor. Keep the flame blazing!', author: 'Spirit Guide' },
  { text: 'Continuous small efforts forge an unbreakable destiny.', author: 'Zen Scroll' },
];

export function AnimeWelcomePortal({ isOpen, onClose }: AnimeWelcomePortalProps) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const idx = Math.floor(Math.random() * ANIME_QUOTES.length);
      const timer = setTimeout(() => {
        setQuoteIndex(idx);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    }, 280);
  };

  const currentQuote = ANIME_QUOTES[quoteIndex] || ANIME_QUOTES[0];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-xl transition-all duration-300 ${
      isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-in fade-in zoom-in-95'
    }`}>
      
      {/* Anime Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none animate-pulse" />

      {/* Main Anime Portal Modal Card */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090D16] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[92vh] overflow-hidden text-white">
        
        {/* Top Glowing Anime Header Bar */}
        <div className="relative p-5 sm:p-6 pb-4 border-b border-cyan-500/20 bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-purple-950/40 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Anime Mascot Avatar with Pulsing Halo */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/25 shrink-0 group hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070A10] rounded-[14px] flex items-center justify-center text-2xl select-none">
                🦊
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#070A10]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>新アップデート // SYSTEM V2.5 ONLINE</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-black">
                  PATCH NOTES
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
                <span>Welcome to Pathly Sanctuary</span>
                <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                  ✨ 2.5 Active
                </span>
              </h1>
            </div>
          </div>

          {/* Anime Close Cross Button */}
          <button
            onClick={handleClose}
            className="p-2 rounded-2xl bg-slate-900/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-all hover:rotate-90 active:scale-95 shadow-xs"
            title="Enter Website (Close Portal)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anime Mascot Dialogue Bubble */}
        <div className="px-5 sm:px-6 pt-3 pb-1">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900/60 border border-cyan-500/20 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
              <Swords className="w-4 h-4" />
            </div>
            <p className="text-xs text-cyan-100 font-medium">
              <strong className="text-cyan-300">Ignis the Spirit Fox:</strong> &ldquo;Senpai! Your daily sanctuary is primed. Check out the latest power-ups below before stepping onto the path!&rdquo;
            </p>
          </div>
        </div>

        {/* Scrollable Updates & Highlights List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3">
          
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>⚔️ What&apos;s New in Version 2.5</span>
            <span className="text-cyan-400">{UPDATE_HIGHLIGHTS.length} Major Upgrades</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {UPDATE_HIGHLIGHTS.map((item, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-[#0D121F]/90 border border-slate-800 hover:border-cyan-500/40 hover:bg-[#111728] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl select-none group-hover:scale-110 transition-transform">
                        {item.icon}
                      </span>
                      <h3 className="text-xs font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-2.5 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${item.tagColor}`}>
                    {item.tag}
                  </span>
                  <span className="text-[10px] text-cyan-400/60 group-hover:text-cyan-300 flex items-center gap-0.5 font-bold transition-colors">
                    <span>Explore</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Daily Anime Motivation Quote Banner */}
          <div className="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/60 border border-purple-500/20 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-300 shrink-0 mt-0.5">
              <Star className="w-4 h-4 fill-purple-400 text-purple-400" />
            </div>
            <div>
              <div className="text-[10px] font-black text-purple-300 uppercase tracking-wider">
                Daily Spirit Scroll // 今日の一言
              </div>
              <p className="text-xs text-slate-200 font-medium italic mt-0.5">
                &ldquo;{currentQuote.text}&rdquo;
              </p>
              <span className="text-[10px] text-purple-400 font-bold mt-1 block">
                — {currentQuote.author}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Anime CTA Action Footer */}
        <div className="p-4 sm:p-5 border-t border-cyan-500/20 bg-gradient-to-r from-[#070A10] to-[#0B101D] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Don't show today checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none hover:text-slate-200 transition-colors">
            <input
              type="checkbox"
              checked={dontShowToday}
              onChange={(e) => setDontShowToday(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-[11px]">Don&apos;t show on startup today</span>
          </label>

          {/* Glowing Anime Launch Button */}
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <span>⚡ ENTER SANCTUARY</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

      </div>
    </div>
  );
}

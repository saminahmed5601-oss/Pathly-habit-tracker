'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { sounds } from '@/lib/sounds';
import { AmbientSoundMixerDrawer } from './AmbientSoundMixerDrawer';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Layers,
  Clock,
  Volume2,
  Maximize2,
  Minimize2,
  Flame,
  Sliders,
  Sparkles
} from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTaskTitle?: string;
  initialGoalId?: string;
}

export function FocusTimerModal({ isOpen, onClose, initialTaskTitle, initialGoalId }: FocusTimerModalProps) {
  const { recordFocusSession, goals } = useApp();

  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>(initialTaskTitle || '');
  const [goalId, setGoalId] = useState<string>(initialGoalId || '');
  
  // Custom Duration State
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customMinutesInput, setCustomMinutesInput] = useState<string>('25');

  // Ambient Soundscape Mixer drawer state
  const [showMixerDrawer, setShowMixerDrawer] = useState<boolean>(false);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (initialTaskTitle) setTaskTitle(initialTaskTitle);
        if (initialGoalId) setGoalId(initialGoalId);
      }, 0);
      return () => clearTimeout(timer);
    } else {
      sounds.stopAllTracks();
    }
  }, [isOpen, initialTaskTitle, initialGoalId]);

  // Global hotkey 'F' for Zen focus mode inside modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsZenMode((prev) => !prev);
        sounds.playTap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelectPreset = (minutes: number) => {
    setSelectedDuration(minutes);
    setTimeLeftSeconds(minutes * 60);
    setIsRunning(false);
    setShowCustomInput(false);
    sounds.playTap();
  };

  const handleApplyCustomMinutes = (mins: number) => {
    const valid = Math.max(1, Math.min(360, mins || 25));
    setSelectedDuration(valid);
    setTimeLeftSeconds(valid * 60);
    setIsRunning(false);
    setShowCustomInput(false);
    sounds.playTap();
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            sounds.stopAllTracks();
            recordFocusSession({
              durationMinutes: selectedDuration,
              goalId: goalId || undefined,
              taskTitle: taskTitle || 'Focus Session',
            });
            sounds.playTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, selectedDuration, goalId, taskTitle, recordFocusSession]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSeconds = selectedDuration * 60;
  const progressRatio = Math.max(0, Math.min(1, timeLeftSeconds / (totalSeconds || 1)));
  const strokeDasharray = 2 * Math.PI * 96; // radius 96
  const strokeDashoffset = strokeDasharray * (1 - progressRatio);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      
      {/* Main Focus Modal Card */}
      <div className="relative w-full max-w-lg clean-card p-5 sm:p-7 bg-[var(--bg-card)] border border-black/[0.06] dark:border-white/[0.08] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-[var(--text-main)]">
                  Focus Sanctuary
                </h2>
                <span className="text-[10px] font-mono font-bold text-[var(--text-muted)] bg-black/[0.04] dark:bg-white/[0.06] px-2 py-0.5 rounded-full">
                  {currentTime}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Immerse into single-task flow state
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Ambient Sound Mixer Drawer Button */}
            <button
              onClick={() => {
                setShowMixerDrawer(true);
                sounds.playTap();
              }}
              className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 transition-all active:scale-95 flex items-center gap-1 text-xs font-bold shadow-2xs"
              title="Open Sound Mixer"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Sounds</span>
            </button>

            {/* Zen Mode Button */}
            <button
              onClick={() => {
                setIsZenMode(true);
                sounds.playTap();
              }}
              className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-black/[0.04] transition-colors"
              title="Zen Mode (Hotkey: 'F')"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-black/[0.03] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task Name & Goal Association */}
        <div className="space-y-2">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Focus objective (e.g. Design auth modal)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-xs font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] text-center"
          />

          {goals.length > 0 && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-bold text-[var(--text-muted)]">Link Goal:</span>
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="px-3 py-1 rounded-xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-xs text-[var(--text-main)] focus:outline-none font-medium"
              >
                <option value="">No goal linked</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.icon} {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Duration Presets */}
        <div className="grid grid-cols-5 gap-1.5">
          {[15, 25, 45, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => handleSelectPreset(mins)}
              className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer active:scale-95 ${
                !showCustomInput && selectedDuration === mins
                  ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                  : 'bg-[var(--bg-card-subtle)] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {mins}m
            </button>
          ))}

          <button
            onClick={() => setShowCustomInput(!showCustomInput)}
            className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95 ${
              showCustomInput
                ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs'
                : 'bg-[var(--bg-card-subtle)] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)]'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Set</span>
          </button>
        </div>

        {/* Custom Input Drawer */}
        {showCustomInput && (
          <div className="p-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2 animate-fadeIn">
            <span className="text-xs font-bold text-[var(--text-muted)]">Custom Duration:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="360"
                value={customMinutesInput}
                onChange={(e) => setCustomMinutesInput(e.target.value)}
                className="w-16 px-2 py-1 rounded-xl text-xs bg-[var(--bg-card)] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-main)] font-black text-center focus:outline-none focus:border-[var(--primary)]"
              />
              <span className="text-xs font-bold text-[var(--text-muted)]">mins</span>
            </div>
            <button
              type="button"
              onClick={() => handleApplyCustomMinutes(parseInt(customMinutesInput, 10))}
              className="px-3.5 py-1 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Apply
            </button>
          </div>
        )}

        {/* Big Circular Dial Display */}
        <div className="relative flex items-center justify-center py-2">
          <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
            
            <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
              <circle
                cx="110"
                cy="110"
                r="96"
                className="text-black/[0.04] dark:text-white/[0.06]"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="110"
                cy="110"
                r="96"
                className="text-[var(--primary)] transition-all duration-500 ease-linear"
                strokeWidth="11"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[var(--text-main)]">
                {formattedTime}
              </div>
              <div className="text-xs font-bold text-[var(--primary)] mt-1.5 flex items-center gap-1">
                {isRunning ? (
                  <>
                    <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-flame" />
                    <span>In Flow (+{selectedDuration * 2} XP)</span>
                  </>
                ) : (
                  <span>Ready ({selectedDuration}m)</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              setTimeLeftSeconds(selectedDuration * 60);
              setIsRunning(false);
              sounds.playTap();
            }}
            className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-black/[0.06] dark:border-white/[0.08] transition-colors active:scale-95 cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (!isRunning) sounds.playFocusStart();
              else sounds.playTap();
              setIsRunning(!isRunning);
            }}
            className="flex-1 py-3.5 rounded-2xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Focus Session (+{selectedDuration * 2} XP)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Sound Mixer Drawer */}
      <AmbientSoundMixerDrawer
        isOpen={showMixerDrawer}
        onClose={() => setShowMixerDrawer(false)}
      />

      {/* Fullscreen Zen Overlay */}
      {isZenMode && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-black/95 backdrop-blur-2xl text-white animate-fadeIn">
          <div className="w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧘</span>
              <span className="font-mono text-sm font-bold text-emerald-400">Zen Focus Sanctuary</span>
            </div>
            <button
              onClick={() => setIsZenMode(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Zen (Esc / F)</span>
            </button>
          </div>

          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  className="text-white/10"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="110"
                  cy="110"
                  r="96"
                  className="text-emerald-400 transition-all duration-500 ease-linear"
                  strokeWidth="9"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl sm:text-6xl font-mono font-black tracking-tight">
                  {formattedTime}
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-2">
                  {isRunning ? 'Flow State Active' : 'Paused'}
                </div>
              </div>
            </div>

            <div className="text-sm sm:text-base font-bold text-slate-300 max-w-md">
              {taskTitle ? `Focusing on: "${taskTitle}"` : 'Deep Work & Calm Clarity'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMixerDrawer(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Adjust Ambient Sound</span>
            </button>

            <button
              onClick={() => {
                if (!isRunning) sounds.playFocusStart();
                else sounds.playTap();
                setIsRunning(!isRunning);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

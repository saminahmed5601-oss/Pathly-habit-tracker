'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { sounds } from '@/lib/sounds';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  Sparkles, 
  CheckCircle, 
  Volume2, 
  VolumeX, 
  Layers
} from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTaskTitle?: string;
  initialGoalId?: string;
}

export function FocusTimerModal({ isOpen, onClose, initialTaskTitle, initialGoalId }: FocusTimerModalProps) {
  const { recordFocusSession, goals } = useApp();

  const [selectedDuration, setSelectedDuration] = useState<number>(25); // minutes
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [taskTitle, setTaskTitle] = useState<string>(initialTaskTitle || '');
  const [goalId, setGoalId] = useState<string>(initialGoalId || '');
  const [ambientSound, setAmbientSound] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update initial values if passed
  useEffect(() => {
    if (initialTaskTitle) setTaskTitle(initialTaskTitle);
    if (initialGoalId) setGoalId(initialGoalId);
  }, [initialTaskTitle, initialGoalId]);

  // Reset timer whenever duration changes
  const handleSelectPreset = (minutes: number) => {
    setSelectedDuration(minutes);
    setTimeLeftSeconds(minutes * 60);
    setIsRunning(false);
    sounds.playTap();
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            // Finish session
            recordFocusSession({
              durationMinutes: selectedDuration,
              goalId: goalId || undefined,
              taskTitle: taskTitle || 'Deep Focus Session',
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
  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalSeconds - timeLeftSeconds) / totalSeconds) * 100)));

  const handleFinishEarly = () => {
    const elapsedMins = Math.round((totalSeconds - timeLeftSeconds) / 60);
    if (elapsedMins >= 1) {
      recordFocusSession({
        durationMinutes: elapsedMins,
        goalId: goalId || undefined,
        taskTitle: taskTitle || 'Focused Study Session',
      });
    }
    setIsRunning(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-zinc-900 border border-emerald-500/20 shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none transition-all ${isRunning ? 'scale-125 opacity-100' : 'opacity-40'}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-100">
            Deep Focus Room
          </h2>
        </div>

        {/* Timer Presets */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { mins: 15, label: '15m Sprint' },
            { mins: 25, label: '25m Pomodoro' },
            { mins: 45, label: '45m Flow' },
            { mins: 60, label: '60m Deep' },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => handleSelectPreset(preset.mins)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDuration === preset.mins
                  ? 'bg-emerald-500 text-white shadow-sm scale-105'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Big Circular Clock Display */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-56 h-56 rounded-full border-8 border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center relative shadow-inner">
            
            {/* Progress overlay ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="#10B981"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 100}
                strokeDashoffset={2 * Math.PI * 100 - (progressPercent / 100) * (2 * Math.PI * 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>

            <span className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100 font-mono">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              {isRunning ? '🔥 Focus Active' : 'Ready to begin'}
            </span>
          </div>
        </div>

        {/* Task & Goal Linking */}
        <div className="space-y-3 mb-6 text-left">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="What specific task are you focusing on?"
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {goals.length > 0 && (
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none"
              >
                <option value="">Link to a Milestone Journey (Optional)</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.icon} {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setTimeLeftSeconds(selectedDuration * 60);
              setIsRunning(false);
              sounds.playTap();
            }}
            className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-300 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setIsRunning(!isRunning);
              sounds.playTaskPop();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-md transition-all active:scale-95"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          {progressPercent > 10 && (
            <button
              onClick={handleFinishEarly}
              className="p-3.5 rounded-2xl bg-teal-100 dark:bg-teal-950/60 hover:bg-teal-200 text-teal-800 dark:text-teal-200 transition-colors"
              title="Save Elapsed Time & Finish"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

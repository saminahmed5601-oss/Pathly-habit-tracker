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
  Layers,
  Clock
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

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (initialTaskTitle) setTaskTitle(initialTaskTitle);
    if (initialGoalId) setGoalId(initialGoalId);
  }, [initialTaskTitle, initialGoalId]);

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
  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalSeconds - timeLeftSeconds) / totalSeconds) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md clean-card p-6 sm:p-7 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-[var(--primary)]" />
          <h2 className="text-lg font-black text-[var(--text-main)]">
            Focus Room
          </h2>
        </div>

        {/* Presets */}
        <div className="flex justify-center gap-1.5 mb-5">
          {[
            { mins: 15, label: '15m' },
            { mins: 25, label: '25m Pomodoro' },
            { mins: 45, label: '45m' },
            { mins: 60, label: '60m' },
          ].map((preset) => (
            <button
              key={preset.mins}
              onClick={() => handleSelectPreset(preset.mins)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDuration === preset.mins
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Big Digits Display */}
        <div className="py-6 my-2 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
          <div className="text-5xl font-black tracking-tight font-mono text-[var(--text-main)]">
            {formattedTime}
          </div>
          <div className="text-xs font-bold text-[var(--primary)] mt-1">
            {isRunning ? '🔥 Focus Active' : 'Ready to begin'}
          </div>
        </div>

        {/* Task linking */}
        <div className="space-y-2.5 my-4 text-left">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Focus task..."
            className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
          />

          {goals.length > 0 && (
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              <select
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none"
              >
                <option value="">Link Journey (Optional)</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.icon} {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => {
              setTimeLeftSeconds(selectedDuration * 60);
              setIsRunning(false);
              sounds.playTap();
            }}
            className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsRunning(!isRunning);
              sounds.playTaskPop();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-opacity"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

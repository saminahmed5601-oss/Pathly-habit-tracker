'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { sounds } from '@/lib/sounds';
import { 
  Check, 
  Plus, 
  Trash2, 
  Sun, 
  Moon, 
  Sparkles, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Target,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface TodayViewProps {
  onOpenMorning: () => void;
  onOpenEvening: () => void;
}

const MASCOT_STAGES = [
  { stage: 0, minPct: 0, emoji: '🌰', name: 'Seed' },
  { stage: 1, minPct: 25, emoji: '🌱', name: 'Sprout' },
  { stage: 2, minPct: 50, emoji: '🌿', name: 'Sapling' },
  { stage: 3, minPct: 75, emoji: '🌺', name: 'Bud' },
  { stage: 4, minPct: 100, emoji: '🌸', name: 'Bloom' },
];

export function TodayView({ onOpenMorning, onOpenEvening }: TodayViewProps) {
  const { dailyPlan, focusLogs, profile, goals, togglePriorityTask, addPriorityTask, deletePriorityTask, recordFocusSession } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');

  // Built-in Focus Timer
  const [timerDuration, setTimerDuration] = useState(25);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerTaskTitle, setTimerTaskTitle] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            recordFocusSession({
              durationMinutes: timerDuration,
              taskTitle: timerTaskTitle || 'Focus Session',
            });
            sounds.playTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerDuration, timerTaskTitle, recordFocusSession]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayFocusMinutes = focusLogs
    .filter(log => log.date === todayStr)
    .reduce((acc, log) => acc + log.durationMinutes, 0);

  const targetMinutes = dailyPlan.targetFocusMinutes || 120;
  const tasks = dailyPlan.priorityTasks || [];
  const completedTasks = tasks.filter(t => t.completed).length;

  const progressPercent = tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  // Mascot stage calculation
  const currentMascotStageIndex = progressPercent >= 100 ? 4 : progressPercent >= 75 ? 3 : progressPercent >= 50 ? 2 : progressPercent >= 25 ? 1 : 0;
  const activeMascot = MASCOT_STAGES[currentMascotStageIndex];

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addPriorityTask(newTaskTitle.trim(), selectedGoalId || undefined, 30);
    setNewTaskTitle('');
    setSelectedGoalId('');
  };

  const timerMin = Math.floor(timerSecondsLeft / 60);
  const timerSec = timerSecondsLeft % 60;
  const formattedTimer = `${String(timerMin).padStart(2, '0')}:${String(timerSec).padStart(2, '0')}`;

  return (
    <div className="space-y-6">
      
      {/* 1. Visual Mascot Growth & Daily Progress Dial */}
      <div className="clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)]">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => sounds.playTaskPop()}
              className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-transform select-none"
              title="Click mascot for cheer"
            >
              {activeMascot.emoji}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <h1 className="text-lg sm:text-xl font-black text-[var(--text-main)]">
                {profile.name}&apos;s Daily Path
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMorning}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Sunrise Plan</span>
            </button>

            <button
              onClick={onOpenEvening}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold transition-colors"
            >
              <Moon className="w-4 h-4 text-purple-500" />
              <span>Sunset Review</span>
            </button>
          </div>
        </div>

        {/* Visual 5-Stage Growth Stepper */}
        <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
          <div className="flex justify-between items-center text-xs font-bold text-[var(--text-muted)] mb-3">
            <span>Mascot Growth Path</span>
            <span className="text-[var(--primary)] font-black">{progressPercent}% Completed</span>
          </div>

          {/* Stepper Icons */}
          <div className="grid grid-cols-5 gap-2 relative">
            {MASCOT_STAGES.map((s, idx) => {
              const isPassed = idx <= currentMascotStageIndex;
              const isCurrent = idx === currentMascotStageIndex;
              return (
                <div 
                  key={s.name}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[var(--bg-card)] border-[var(--primary)] shadow-sm scale-105 ring-2 ring-[var(--primary)]/20'
                      : isPassed
                      ? 'bg-[var(--primary-light)] border-[var(--primary)]/40 text-[var(--primary)]'
                      : 'bg-[var(--bg-card)] border-[var(--border)] opacity-40 grayscale'
                  }`}
                >
                  <span className="text-2xl select-none">{s.emoji}</span>
                  <span className="text-[10px] font-bold text-[var(--text-main)] mt-1">
                    {s.name}
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)]">
                    {s.minPct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Connected Growth Progress Line */}
          <div className="w-full bg-[var(--border)] h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* 2. Visual 2-Column: Priority Missions (Left) + Visual Focus Dial (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Priority Missions */}
        <div className="lg:col-span-7 clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[var(--text-main)]">
                    Priority Missions (Rule of 3)
                  </h2>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-text)]">
                {completedTasks}/{tasks.length} Done
              </span>
            </div>

            {/* Visual Task Cards */}
            <div className="space-y-2.5">
              {tasks.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)]">
                  No priority missions for today yet. Add one below!
                </div>
              ) : (
                tasks.map((task) => {
                  const linkedGoal = goals.find(g => g.id === task.goalId);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-[var(--bg-card-subtle)] border-[var(--border)] opacity-60'
                          : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--primary)] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => togglePriorityTask(task.id)}
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-[var(--primary)] text-white'
                              : 'border-2 border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-card)]'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <span
                            onClick={() => togglePriorityTask(task.id)}
                            className={`text-xs sm:text-sm font-bold block truncate cursor-pointer select-none ${
                              task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'
                            }`}
                          >
                            {task.title}
                          </span>
                          
                          <div className="flex items-center gap-2 mt-0.5">
                            {linkedGoal && (
                              <span className="text-[10px] font-bold text-[var(--primary-text)] bg-[var(--primary-light)] px-1.5 py-0.2 rounded">
                                {linkedGoal.icon} {linkedGoal.title.slice(0, 16)}...
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-amber-500">
                              +{task.xpValue} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!task.completed && (
                          <button
                            onClick={() => {
                              setTimerTaskTitle(task.title);
                              setIsTimerRunning(true);
                              sounds.playTaskPop();
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] hover:opacity-80 text-[11px] font-bold transition-opacity"
                            title="Start timer with this task"
                          >
                            Focus ⏱️
                          </button>
                        )}
                        <button
                          onClick={() => deletePriorityTask(task.id)}
                          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Add Mission */}
          <form onSubmit={handleAddTask} className="pt-2 border-t border-[var(--border)] flex items-center gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add priority task..."
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            {goals.length > 0 && (
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="px-2 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none max-w-[120px]"
              >
                <option value="">No goal</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.icon} {g.title.slice(0, 15)}...</option>
                ))}
              </select>
            )}
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="p-2 rounded-xl bg-[var(--primary)] hover:opacity-90 disabled:opacity-40 text-white font-bold transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Visual Focus Dial */}
        <div className="lg:col-span-5 clean-card p-6 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between text-center space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Focus Dial</span>
              </span>
              <span className="text-[var(--text-main)] font-black">
                {todayFocusMinutes}m / {targetMinutes}m Today
              </span>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-3 gap-1.5 my-3">
              {[15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTimerDuration(mins);
                    setTimerSecondsLeft(mins * 60);
                    setIsTimerRunning(false);
                    sounds.playTap();
                  }}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    timerDuration === mins
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-card-subtle)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Big Timer Digits */}
            <div className="my-4 py-5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[var(--text-main)]">
                {formattedTimer}
              </div>
              <div className="text-xs font-bold text-[var(--primary)] mt-1.5 flex items-center justify-center gap-1">
                {isTimerRunning ? '🔥 Deep Focus in Progress' : 'Ready to begin'}
              </div>
            </div>

            <input
              type="text"
              value={timerTaskTitle}
              onChange={(e) => setTimerTaskTitle(e.target.value)}
              placeholder="What are you focusing on?"
              className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none text-center"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                setTimerSecondsLeft(timerDuration * 60);
                setIsTimerRunning(false);
                sounds.playTap();
              }}
              className="p-2.5 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(!isTimerRunning);
                sounds.playTaskPop();
              }}
              className="flex-1 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-opacity flex items-center justify-center gap-1.5"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Focus (+{timerDuration * 2} XP)</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

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
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Target
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
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. Mascot Growth Header Card */}
      <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)]">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => sounds.playTaskPop()}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center text-2xl sm:text-3xl cursor-pointer hover:scale-110 active:scale-95 transition-transform select-none shrink-0"
              title="Click mascot for cheer"
            >
              {activeMascot.emoji}
            </div>
            <div>
              <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <h1 className="text-base sm:text-xl font-black text-[var(--text-main)]">
                {profile.name}&apos;s Daily Path
              </h1>
            </div>
          </div>

          {/* Quick Sunrise / Sunset Actions */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <button
              onClick={onOpenMorning}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-98 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Sunrise</span>
            </button>

            <button
              onClick={onOpenEvening}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 sm:py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 active:scale-98 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold transition-all"
            >
              <Moon className="w-4 h-4 text-purple-500" />
              <span>Sunset</span>
            </button>
          </div>
        </div>

        {/* Visual 5-Stage Growth Stepper */}
        <div className="p-3 sm:p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
          <div className="flex justify-between items-center text-xs font-bold text-[var(--text-muted)] mb-2.5">
            <span>Growth Path</span>
            <span className="text-[var(--primary)] font-black">{progressPercent}% Done</span>
          </div>

          {/* Stepper Icons (Responsive Grid) */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {MASCOT_STAGES.map((s, idx) => {
              const isPassed = idx <= currentMascotStageIndex;
              const isCurrent = idx === currentMascotStageIndex;
              return (
                <div 
                  key={s.name}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-[var(--bg-card)] border-[var(--primary)] shadow-sm scale-105 ring-2 ring-[var(--primary)]/20'
                      : isPassed
                      ? 'bg-[var(--primary-light)] border-[var(--primary)]/40 text-[var(--primary)]'
                      : 'bg-[var(--bg-card)] border-[var(--border)] opacity-35 grayscale'
                  }`}
                >
                  <span className="text-xl sm:text-2xl select-none">{s.emoji}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-main)] mt-0.5 truncate max-w-full">
                    {s.name}
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-[var(--text-muted)]">
                    {s.minPct}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Connected Growth Progress Line */}
          <div className="w-full bg-[var(--border)] h-2 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </div>

      {/* 2. Responsive 2-Column: Priority Missions (Left) + Focus Dial (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Priority Missions */}
        <div className="lg:col-span-7 clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)]">
                  <Target className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                  Priority Missions (Rule of 3)
                </h2>
              </div>

              <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-text)]">
                {completedTasks}/{tasks.length}
              </span>
            </div>

            {/* Task Cards */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)]">
                  No priority missions set for today.
                </div>
              ) : (
                tasks.map((task) => {
                  const linkedGoal = goals.find(g => g.id === task.goalId);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-[var(--bg-card-subtle)] border-[var(--border)] opacity-60'
                          : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--primary)] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={() => togglePriorityTask(task.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 active:scale-95 ${
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
                          
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {linkedGoal && (
                              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary-text)] bg-[var(--primary-light)] px-1.5 py-0.2 rounded truncate max-w-[120px]">
                                {linkedGoal.icon} {linkedGoal.title}
                              </span>
                            )}
                            <span className="text-[9px] sm:text-[10px] font-bold text-amber-500">
                              +{task.xpValue} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        {!task.completed && (
                          <button
                            onClick={() => {
                              setTimerTaskTitle(task.title);
                              setIsTimerRunning(true);
                              sounds.playTaskPop();
                            }}
                            className="px-2 py-1 rounded-lg bg-[var(--primary-light)] text-[var(--primary-text)] hover:opacity-80 text-[10px] sm:text-[11px] font-bold transition-opacity"
                            title="Start timer with this task"
                          >
                            Focus ⏱️
                          </button>
                        )}
                        <button
                          onClick={() => deletePriorityTask(task.id)}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
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

          {/* Quick Add Mission (Mobile-Friendly Input) */}
          <form onSubmit={handleAddTask} className="pt-2 border-t border-[var(--border)] flex flex-wrap sm:flex-nowrap items-center gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add priority task..."
              className="flex-1 min-w-[150px] px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            />
            {goals.length > 0 && (
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="px-2 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-[var(--border)] text-[var(--text-main)] focus:outline-none max-w-[110px]"
              >
                <option value="">No goal</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.icon} {g.title.slice(0, 10)}..</option>
                ))}
              </select>
            )}
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="p-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 disabled:opacity-40 text-white font-bold transition-opacity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Focus Dial */}
        <div className="lg:col-span-5 clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)] flex flex-col justify-between text-center space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Focus Room</span>
              </span>
              <span className="text-[var(--text-main)] font-black">
                {todayFocusMinutes}m / {targetMinutes}m Today
              </span>
            </div>

            {/* Duration Presets */}
            <div className="grid grid-cols-3 gap-1.5 my-2.5">
              {[15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTimerDuration(mins);
                    setTimerSecondsLeft(mins * 60);
                    setIsTimerRunning(false);
                    sounds.playTap();
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                    timerDuration === mins
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-card-subtle)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Big Digits Display */}
            <div className="my-3 py-4 sm:py-5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)]">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[var(--text-main)]">
                {formattedTimer}
              </div>
              <div className="text-[11px] sm:text-xs font-bold text-[var(--primary)] mt-1 flex items-center justify-center gap-1">
                {isTimerRunning ? '🔥 Focus In Progress' : 'Ready to begin'}
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
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setTimerSecondsLeft(timerDuration * 60);
                setIsTimerRunning(false);
                sounds.playTap();
              }}
              className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] transition-colors active:scale-95"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(!isTimerRunning);
                sounds.playTaskPop();
              }}
              className="flex-1 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
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

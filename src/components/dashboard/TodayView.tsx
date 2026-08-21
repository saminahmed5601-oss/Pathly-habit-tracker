'use client';

import React, { useState } from 'react';
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
  CheckCircle2,
  Heart,
  Target
} from 'lucide-react';

interface TodayViewProps {
  onOpenMorning: () => void;
  onOpenEvening: () => void;
}

export function TodayView({ onOpenMorning, onOpenEvening }: TodayViewProps) {
  const { dailyPlan, focusLogs, profile, goals, togglePriorityTask, addPriorityTask, deletePriorityTask, recordFocusSession } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');

  // Built-in Clean Focus Timer state
  const [timerDuration, setTimerDuration] = useState(25); // mins
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerTaskTitle, setTimerTaskTitle] = useState('');

  React.useEffect(() => {
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

  // Mascot status
  const getMascot = (pct: number) => {
    if (pct >= 100) return { emoji: '🌸', name: 'Radiant Bloom', desc: 'All daily missions conquered! Great consistency.' };
    if (pct >= 66) return { emoji: '🌺', name: 'Budding Flower', desc: 'More than half way done. Keep the flow!' };
    if (pct >= 33) return { emoji: '🌿', name: 'Flourishing Sapling', desc: 'Good progress made today!' };
    return { emoji: '🌱', name: 'Fresh Sproutling', desc: 'Ready for today\'s focus. Pick your top tasks!' };
  };

  const mascot = getMascot(progressPercent);

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
      
      {/* 1. Calm Hero Overview Card */}
      <div className="clean-card p-6 sm:p-7 bg-white dark:bg-[#151C28] flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Mascot & Today's Message */}
        <div className="flex items-start sm:items-center gap-4">
          <div 
            onClick={() => sounds.playTaskPop()}
            className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-3xl shrink-0 cursor-pointer hover:scale-105 transition-transform select-none"
            title="Click for cheer"
          >
            {mascot.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-slate-500">
                {mascot.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              Good day, {profile.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
              {mascot.desc}
            </p>
          </div>
        </div>

        {/* Right: Quick Daily Stats & Ritual Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-center sm:text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Today&apos;s Progress</div>
            <div className="text-lg font-black text-slate-900 dark:text-white">
              {completedTasks} / {tasks.length} <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">({progressPercent}%)</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
              ⏱️ {todayFocusMinutes}m / {targetMinutes}m focused
            </div>
          </div>

          <div className="flex sm:flex-col gap-2">
            <button
              onClick={onOpenMorning}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-bold transition-colors"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Sunrise Plan</span>
            </button>

            <button
              onClick={onOpenEvening}
              className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900 text-xs font-bold transition-colors"
            >
              <Moon className="w-3.5 h-3.5 text-purple-500" />
              <span>Sunset Review</span>
            </button>
          </div>
        </div>

      </div>

      {/* 2. Main 2-Column Section: Priority Missions (Left) + Clean Focus Timer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 cols): Rule of 3 Priority Tasks */}
        <div className="lg:col-span-8 clean-card p-6 bg-white dark:bg-[#151C28] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Today&apos;s Priority Missions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Rule of 3: Complete these to win today
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {completedTasks}/{tasks.length} Done
              </span>
            </div>

            {/* Gratitude quote if exists */}
            {dailyPlan.gratitudeNote && (
              <div className="mb-4 px-3.5 py-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0" />
                <span className="italic truncate">&ldquo;{dailyPlan.gratitudeNote}&rdquo;</span>
              </div>
            )}

            {/* Tasks list */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
                  No priority missions for today yet. Add one below!
                </div>
              ) : (
                tasks.map((task) => {
                  const linkedGoal = goals.find(g => g.id === task.goalId);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-slate-50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-400'
                          : 'bg-white dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-700 hover:border-emerald-400'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => togglePriorityTask(task.id)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all ${
                            task.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <span
                            onClick={() => togglePriorityTask(task.id)}
                            className={`text-xs sm:text-sm font-semibold block truncate cursor-pointer select-none ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {task.title}
                          </span>
                          
                          <div className="flex items-center gap-2 mt-0.5">
                            {linkedGoal && (
                              <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                                {linkedGoal.icon} {linkedGoal.title.slice(0, 20)}...
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
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
                            className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[11px] font-bold transition-colors"
                            title="Start focus timer with this task"
                          >
                            Focus ⏱️
                          </button>
                        )}
                        <button
                          onClick={() => deletePriorityTask(task.id)}
                          className="p-1 rounded-lg text-slate-300 hover:text-red-500 transition-colors"
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

          {/* Inline Add Task Form */}
          <form onSubmit={handleAddTask} className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add another daily priority..."
              className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            {goals.length > 0 && (
              <select
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
                className="px-2 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none max-w-[120px]"
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
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column (4 cols): Embedded Clean Focus Timer */}
        <div className="lg:col-span-4 clean-card p-6 bg-white dark:bg-[#151C28] flex flex-col justify-between text-center space-y-4">
          <div>
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Deep Focus Timer</span>
            </div>

            {/* Presets */}
            <div className="flex justify-center gap-1.5 mb-4">
              {[15, 25, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTimerDuration(mins);
                    setTimerSecondsLeft(mins * 60);
                    setIsTimerRunning(false);
                    sounds.playTap();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    timerDuration === mins
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Big Clean Timer Display */}
            <div className="my-3 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
              <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                {formattedTimer}
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {isTimerRunning ? '🔥 Session in Progress' : 'Ready to Focus'}
              </div>
            </div>

            {/* Task title label */}
            <input
              type="text"
              value={timerTaskTitle}
              onChange={(e) => setTimerTaskTitle(e.target.value)}
              placeholder="What are you focusing on?"
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none text-center"
            />
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                setTimerSecondsLeft(timerDuration * 60);
                setIsTimerRunning(false);
                sounds.playTap();
              }}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(!isTimerRunning);
                sounds.playTaskPop();
              }}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
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

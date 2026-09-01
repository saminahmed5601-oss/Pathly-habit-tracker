'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { sounds } from '@/lib/sounds';
import { GrowthTerrariumCard } from './GrowthTerrariumCard';
import { AmbientSoundMixerDrawer } from '@/components/focus/AmbientSoundMixerDrawer';
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
  Target,
  Sparkles,
  Flame,
  CheckCircle2,
  Heart,
  Sliders,
  Timer,
  Maximize2,
  Minimize2,
  Volume2,
  Wand2,
  Crown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { getLocalDateString } from '@/lib/dateUtils';

interface TodayViewProps {
  onOpenMorning: () => void;
  onOpenEvening: () => void;
  onOpenZenSanctuary?: () => void;
}

export function TodayView({ onOpenMorning, onOpenEvening, onOpenZenSanctuary }: TodayViewProps) {
  const { 
    dailyPlan, 
    focusLogs, 
    profile, 
    goals, 
    togglePriorityTask, 
    addPriorityTask, 
    deletePriorityTask, 
    recordFocusSession 
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState<number>(30);
  const [isMustWinTask, setIsMustWinTask] = useState(false);
  const [showCustomTaskTime, setShowCustomTaskTime] = useState(false);
  const [customTaskMinutesInput, setCustomTaskMinutesInput] = useState('30');
  const [taskFilter, setTaskFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showSoundMixer, setShowSoundMixer] = useState(false);

  // Live Real-Time Clock
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentSeconds, setCurrentSeconds] = useState<string>('00');
  const [currentPeriod, setCurrentPeriod] = useState<string>('');
  const [is24Hour, setIs24Hour] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      if (is24Hour) {
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        setCurrentTime(`${h}:${m}`);
        setCurrentSeconds(s);
        setCurrentPeriod('24H');
      } else {
        let h = now.getHours();
        const period = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        setCurrentTime(`${h}:${m}`);
        setCurrentSeconds(s);
        setCurrentPeriod(period);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [is24Hour]);

  // Built-in Focus Timer State
  const [timerDuration, setTimerDuration] = useState<number>(25);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerTaskTitle, setTimerTaskTitle] = useState('');
  const [showCustomTimerInput, setShowCustomTimerInput] = useState(false);
  const [customTimerMinutesInput, setCustomTimerMinutesInput] = useState('25');
  const [isZenMode, setIsZenMode] = useState(false);

  // Global hotkey 'F' for Zen focus mode
  useEffect(() => {
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
  }, []);

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

  const todayStr = getLocalDateString();
  const todayFocusMinutes = useMemo(() => {
    return focusLogs
      .filter(log => log.date === todayStr)
      .reduce((acc, log) => acc + log.durationMinutes, 0);
  }, [focusLogs, todayStr]);

  const targetMinutes = dailyPlan.targetFocusMinutes || 120;
  const tasks = useMemo(() => dailyPlan.priorityTasks || [], [dailyPlan.priorityTasks]);
  const completedTasks = tasks.filter(t => t.completed).length;

  // Multi-Factor Daily Growth Vitality Calculation
  const progressPercent = useMemo(() => {
    // 1. Task contribution: up to 45% (15% per task up to 3 tasks)
    const taskScore = tasks.length > 0
      ? (completedTasks / Math.max(tasks.length, 3)) * 45
      : 0;

    // 2. Focus Time contribution: up to 35%
    const focusRatio = Math.min(1, todayFocusMinutes / (targetMinutes || 120));
    const focusScore = focusRatio * 35;

    // 3. Morning Kickoff: 10%
    const morningScore = dailyPlan.morningCompleted ? 10 : 0;

    // 4. Evening Reflection: 10%
    const eveningScore = dailyPlan.eveningCompleted ? 10 : 0;

    return Math.min(100, Math.round(taskScore + focusScore + morningScore + eveningScore));
  }, [tasks.length, completedTasks, todayFocusMinutes, targetMinutes, dailyPlan.morningCompleted, dailyPlan.eveningCompleted]);

  // Dynamic Greeting
  const greetingInfo = useMemo(() => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good morning';
    let icon = '☀️';
    if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good afternoon';
      icon = '⚡';
    } else if (hour >= 17) {
      timeGreeting = 'Good evening';
      icon = '🌙';
    }
    return { timeGreeting, icon };
  }, []);

  const filteredTasks = useMemo(() => {
    if (taskFilter === 'active') return tasks.filter(t => !t.completed);
    if (taskFilter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }, [tasks, taskFilter]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const finalMinutes = showCustomTaskTime ? (parseInt(customTaskMinutesInput, 10) || 30) : newTaskMinutes;
    addPriorityTask(newTaskTitle.trim(), selectedGoalId || undefined, finalMinutes, isMustWinTask);
    setNewTaskTitle('');
    setSelectedGoalId('');
    setIsMustWinTask(false);
    sounds.playTap();
  };

  // Inline AI Task Decomposition Helpers
  const handleAIBreakdown = () => {
    if (!newTaskTitle.trim()) {
      setNewTaskTitle('Build responsive web landing page');
    }
    const current = newTaskTitle.trim() || 'Build responsive web landing page';
    const subTasks = [
      `1. Design clean UI structure for ${current.slice(0, 20)}`,
      `2. Implement core components & states`,
      `3. Polish responsiveness & test animations`,
    ];
    subTasks.forEach((sub, idx) => {
      addPriorityTask(sub, selectedGoalId || undefined, 25, idx === 0);
    });
    setNewTaskTitle('');
    sounds.playLevelUp();
  };

  const handleAIEstimate = () => {
    const title = newTaskTitle.toLowerCase();
    let estimate = 25;
    if (title.includes('build') || title.includes('create') || title.includes('refactor') || title.includes('study')) {
      estimate = 45;
    } else if (title.includes('quick') || title.includes('email') || title.includes('check') || title.includes('fix')) {
      estimate = 15;
    }
    setNewTaskMinutes(estimate);
    setShowCustomTaskTime(false);
    sounds.playTaskPop();
  };

  const handleApplyCustomTimer = (mins: number) => {
    const validMins = Math.max(1, Math.min(360, mins || 25));
    setTimerDuration(validMins);
    setTimerSecondsLeft(validMins * 60);
    setIsTimerRunning(false);
    setShowCustomTimerInput(false);
    sounds.playTap();
  };

  const handleStartTaskFocus = (title: string, estimatedMinutes?: number) => {
    const duration = estimatedMinutes || 25;
    setTimerDuration(duration);
    setTimerSecondsLeft(duration * 60);
    setTimerTaskTitle(title);
    setIsTimerRunning(true);
    sounds.playFocusStart();
  };

  const timerMin = Math.floor(timerSecondsLeft / 60);
  const timerSec = timerSecondsLeft % 60;
  const formattedTimer = `${String(timerMin).padStart(2, '0')}:${String(timerSec).padStart(2, '0')}`;

  const totalTimerSeconds = timerDuration * 60;
  const timerRatio = Math.max(0, Math.min(1, timerSecondsLeft / (totalTimerSeconds || 1)));
  const strokeDasharray = 2 * Math.PI * 88; // radius 88
  const strokeDashoffset = strokeDasharray * (1 - timerRatio);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* 1. Header Salutation Bar & Real-Time Aesthetic Clock */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Salutation & Streak Flame */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 flex items-center gap-1">
              <Flame className="w-3 h-3 fill-orange-500 text-orange-500" />
              <span>{profile.streakDays}d Streak Active</span>
            </span>
          </div>
          <h1 className="text-lg sm:text-2xl font-black text-[var(--text-main)] flex items-center gap-1.5 mt-0.5">
            <span>{greetingInfo.timeGreeting}, {profile.name || 'Friend'}</span>
            <span>{greetingInfo.icon}</span>
          </h1>
        </div>

        {/* Right: Live Digital Clock & Ritual Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          
          {/* Real-time Aesthetic Glassmorphic Clock */}
          <div 
            onClick={() => setIs24Hour(!is24Hour)}
            className="px-3.5 py-2 rounded-2xl bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] shadow-xs flex items-center gap-2 cursor-pointer hover:border-[var(--primary)] transition-all select-none group"
            title="Click to toggle 12H / 24H Clock"
          >
            <Clock className="w-4 h-4 text-[var(--primary)] group-hover:rotate-12 transition-transform shrink-0" />
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-black font-mono tracking-tight text-[var(--text-main)]">
                {currentTime || '12:00'}
              </span>
              <span className="text-[10px] font-mono text-[var(--primary)] font-bold">
                :{currentSeconds}
              </span>
              <span className="text-[9px] font-black text-[var(--text-muted)] ml-0.5">
                {currentPeriod}
              </span>
            </div>
          </div>

          {/* Quick Sunrise / Sunset Ritual Triggers */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenMorning}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                dailyPlan.morningCompleted
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 active:scale-98 text-amber-600 dark:text-amber-400 border border-amber-500/30'
              }`}
              title="Sunrise Morning Intent (Hotkeys: 'M')"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Sunrise</span>
              {dailyPlan.morningCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
            </button>

            <button
              onClick={onOpenEvening}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                dailyPlan.eveningCompleted
                  ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/40'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 active:scale-98 text-purple-600 dark:text-purple-400 border border-purple-500/30'
              }`}
              title="Sunset Evening Wind-Down (Hotkeys: 'E')"
            >
              <Moon className="w-4 h-4 text-purple-500" />
              <span className="hidden sm:inline">Sunset</span>
              {dailyPlan.eveningCompleted && <CheckCircle2 className="w-3 h-3 text-purple-400" />}
            </button>

            {onOpenZenSanctuary && (
              <button
                onClick={onOpenZenSanctuary}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs bg-teal-500/10 hover:bg-teal-500/20 active:scale-98 text-teal-600 dark:text-teal-400 border border-teal-500/30"
                title="Zen Sanctuary & Daily Oracle (Hotkeys: 'Z')"
              >
                <span>🧘</span>
                <span className="hidden sm:inline">Sanctuary</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Intention Pill (if completed morning kickoff) */}
      {dailyPlan.gratitudeNote && (
        <div className="p-3 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center gap-2.5 text-xs font-medium text-[var(--primary-text)] animate-fadeIn">
          <Heart className="w-4 h-4 text-rose-500 shrink-0 fill-rose-500" />
          <span className="truncate">
            <strong>Morning Affirmation:</strong> &ldquo;{dailyPlan.gratitudeNote}&rdquo;
          </span>
        </div>
      )}

      {/* 2. Living Growth Terrarium Card */}
      <GrowthTerrariumCard
        progressPercent={progressPercent}
        todayFocusMinutes={todayFocusMinutes}
        completedTasks={completedTasks}
        totalTasks={tasks.length}
      />

      {/* 3. 2-Column Focus Engine: Daily Missions (Left) + Circular Focus Dial (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column: Daily Missions (Rule of 3 with #1 Must-Win distinction) */}
        <div className="lg:col-span-7 clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary-text)]">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
                    Daily Missions (Rule of 3)
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Pick 1 high-leverage Must-Win + 2 supporting sprints
                  </p>
                </div>
              </div>

              {/* Task Filter Chips */}
              <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-xl border border-black/[0.04] dark:border-white/[0.06] text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setTaskFilter('all')}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    taskFilter === 'all' ? 'bg-[var(--primary)] text-white shadow-2xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('active')}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    taskFilter === 'active' ? 'bg-[var(--primary)] text-white shadow-2xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Active ({tasks.filter(t => !t.completed).length})
                </button>
                <button
                  type="button"
                  onClick={() => setTaskFilter('completed')}
                  className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                    taskFilter === 'completed' ? 'bg-[var(--primary)] text-white shadow-2xs' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Done ({completedTasks})
                </button>
              </div>
            </div>

            {/* Task Cards List */}
            <div className="space-y-2">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 rounded-2xl border border-dashed border-[var(--border)] text-xs text-[var(--text-muted)] bg-[var(--bg-card-subtle)]/50">
                  <div className="text-2xl mb-1.5">☀️</div>
                  <p className="font-bold text-[var(--text-main)] mb-1">
                    {taskFilter === 'completed' ? 'No completed missions yet' : 'All clear right now!'}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">
                    {taskFilter === 'completed' 
                      ? 'Check off an active mission to feed your living terrarium!'
                      : 'Click Sunrise to set your top 3 daily missions or type one below!'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, idx) => {
                  const linkedGoal = goals.find(g => g.id === task.goalId);
                  const isFirstMustWin = task.isMustWin || idx === 0;

                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        task.completed
                          ? 'bg-[var(--bg-card-subtle)] border-black/[0.04] dark:border-white/[0.04] opacity-60'
                          : isFirstMustWin
                          ? 'bg-amber-500/[0.04] border-amber-500/30 hover:border-amber-500/60 shadow-xs ring-1 ring-amber-500/20'
                          : 'bg-[var(--bg-card)] border-black/[0.05] dark:border-white/[0.07] hover:border-[var(--primary)] shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        
                        {/* Checkbox */}
                        <button
                          onClick={() => {
                            togglePriorityTask(task.id);
                            if (!task.completed) sounds.playTaskPop();
                          }}
                          className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer ${
                            task.completed
                              ? 'bg-[var(--primary)] text-white shadow-xs'
                              : 'border-2 border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-card)]'
                          }`}
                        >
                          {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isFirstMustWin && !task.completed && (
                              <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center gap-0.5 shrink-0">
                                <Crown className="w-2.5 h-2.5 text-amber-500" />
                                <span>#1 Must-Win</span>
                              </span>
                            )}
                            <span
                              onClick={() => {
                                togglePriorityTask(task.id);
                                if (!task.completed) sounds.playTaskPop();
                              }}
                              className={`text-xs sm:text-sm font-bold block truncate cursor-pointer select-none ${
                                task.completed ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-main)]'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {linkedGoal && (
                              <span className="text-[9px] sm:text-[10px] font-bold text-[var(--primary-text)] bg-[var(--primary-light)] px-1.5 py-0.2 rounded truncate max-w-[120px]">
                                {linkedGoal.icon} {linkedGoal.title}
                              </span>
                            )}
                            <span className="text-[9px] sm:text-[10px] font-black text-amber-500">
                              +{task.xpValue} XP
                            </span>
                            {task.estimatedMinutes && (
                              <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] font-bold bg-black/[0.03] dark:bg-white/[0.05] px-1.5 py-0.2 rounded border border-black/[0.04] dark:border-white/[0.06] flex items-center gap-0.5">
                                <Timer className="w-2.5 h-2.5" />
                                <span>{task.estimatedMinutes}m</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        {!task.completed && (
                          <button
                            onClick={() => handleStartTaskFocus(task.title, task.estimatedMinutes)}
                            className="px-2.5 py-1 rounded-xl bg-[var(--primary-light)] text-[var(--primary-text)] hover:opacity-85 text-[10px] sm:text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1 shadow-2xs cursor-pointer"
                            title={`Start ${task.estimatedMinutes || 25}m timer for this mission`}
                          >
                            <span>Focus</span>
                            <span>⏱️</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            deletePriorityTask(task.id);
                            sounds.playTap();
                          }}
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-red-500 transition-colors"
                          title="Delete mission"
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

          {/* Quick Add Mission Form with Contextual Inline AI actions */}
          <div className="pt-2 border-t border-[var(--border)] space-y-2">
            
            {/* Inline AI Quick Prompts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
              <span className="text-[var(--text-muted)] flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span>AI Assist:</span>
              </span>
              <button
                type="button"
                onClick={handleAIBreakdown}
                className="px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                title="Decompose current mission into 3 actionable steps"
              >
                ✨ Break into 3 sub-tasks
              </button>
              <button
                type="button"
                onClick={handleAIEstimate}
                className="px-2 py-0.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-300 border border-teal-500/20 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                title="AI estimates focus duration"
              >
                ✨ Estimate focus time
              </button>
            </div>

            <form onSubmit={handleAddTask} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add daily mission (e.g. Implement user dashboard)..."
                className="flex-1 min-w-[150px] px-3.5 py-2.5 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
              />
              {goals.length > 0 && (
                <select
                  value={selectedGoalId}
                  onChange={(e) => setSelectedGoalId(e.target.value)}
                  className="px-2.5 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-[var(--text-main)] focus:outline-none max-w-[110px]"
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
                className="p-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 disabled:opacity-40 text-white font-bold transition-opacity shadow-xs cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Duration Selector & Must-Win Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-[var(--text-muted)] pt-1">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsMustWinTask(!isMustWinTask)}
                  className={`px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                    isMustWinTask
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xs font-black'
                      : 'bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:text-amber-500'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  <span>Set as #1 Must-Win</span>
                </button>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto">
                {[15, 25, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => {
                      setNewTaskMinutes(mins);
                      setShowCustomTaskTime(false);
                      sounds.playTap();
                    }}
                    className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      !showCustomTaskTime && newTaskMinutes === mins
                        ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs'
                        : 'bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setShowCustomTaskTime(!showCustomTaskTime);
                    sounds.playTap();
                  }}
                  className={`px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                    showCustomTaskTime
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)] shadow-2xs'
                      : 'bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  <Sliders className="w-2.5 h-2.5" />
                  <span>{showCustomTaskTime ? `${customTaskMinutesInput}m` : 'Custom'}</span>
                </button>
              </div>
            </div>

            {/* Custom Minutes Input Drawer */}
            {showCustomTaskTime && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] animate-fadeIn">
                <span className="text-[11px] font-bold text-[var(--text-muted)]">Custom Duration:</span>
                <input
                  type="number"
                  min="1"
                  max="360"
                  value={customTaskMinutesInput}
                  onChange={(e) => setCustomTaskMinutesInput(e.target.value)}
                  className="w-16 px-2 py-1 rounded-lg text-xs bg-[var(--bg-card)] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-main)] font-bold text-center focus:outline-none focus:border-[var(--primary)]"
                />
                <span className="text-[11px] font-bold text-[var(--text-muted)]">minutes</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sleek Circular Focus Dial & Ambient Sound Mixer */}
        <div className="lg:col-span-5 clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-black/[0.04] dark:border-white/[0.06] flex flex-col justify-between text-center space-y-4">
          <div>
            
            {/* Header: Focus Dial + Ambient Sound Mixer Drawer & Zen Mode buttons */}
            <div className="flex items-center justify-between text-xs font-bold text-[var(--text-muted)] pb-2 border-b border-[var(--border)]">
              <span className="flex items-center gap-1.5 font-black text-[var(--text-main)]">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Focus Dial</span>
              </span>

              <div className="flex items-center gap-1.5">
                {/* Sound Mixer Drawer Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowSoundMixer(true);
                    sounds.playTap();
                  }}
                  className="px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-2xs"
                  title="Open Ambient Sound Mixer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Sound Mixer</span>
                </button>

                {/* Zen Fullscreen Mode Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setIsZenMode(!isZenMode);
                    sounds.playTap();
                  }}
                  className="p-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-black/[0.04] dark:border-white/[0.06] transition-colors active:scale-95"
                  title="Zen Mode (Hotkey: 'F')"
                >
                  {isZenMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Duration Presets Bar */}
            <div className="grid grid-cols-5 gap-1.5 my-2.5">
              {[15, 25, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    setTimerDuration(mins);
                    setTimerSecondsLeft(mins * 60);
                    setIsTimerRunning(false);
                    setShowCustomTimerInput(false);
                    sounds.playTap();
                  }}
                  className={`py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 cursor-pointer ${
                    !showCustomTimerInput && timerDuration === mins
                      ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs font-black'
                      : 'bg-[var(--bg-card-subtle)] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {mins}m
                </button>
              ))}

              <button
                onClick={() => {
                  setShowCustomTimerInput(!showCustomTimerInput);
                  sounds.playTap();
                }}
                className={`py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 flex items-center justify-center gap-1 cursor-pointer ${
                  showCustomTimerInput
                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs font-black'
                    : 'bg-[var(--bg-card-subtle)] border-black/[0.04] dark:border-white/[0.06] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
                title="Set Custom Minutes"
              >
                <Sliders className="w-3 h-3" />
                <span>Set</span>
              </button>
            </div>

            {/* Custom Minutes Input Drawer */}
            {showCustomTimerInput && (
              <div className="mb-2 p-2.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2 animate-fadeIn">
                <span className="text-xs font-bold text-[var(--text-muted)]">Custom Time:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="360"
                    value={customTimerMinutesInput}
                    onChange={(e) => setCustomTimerMinutesInput(e.target.value)}
                    className="w-16 px-2 py-1 rounded-xl text-xs bg-[var(--bg-card)] border border-black/[0.08] dark:border-white/[0.1] text-[var(--text-main)] font-black text-center focus:outline-none focus:border-[var(--primary)]"
                  />
                  <span className="text-xs font-bold text-[var(--text-muted)]">mins</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyCustomTimer(parseInt(customTimerMinutesInput, 10))}
                  className="px-3 py-1 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  Apply
                </button>
              </div>
            )}

            {/* Circular Countdown Progress Ring */}
            <div className="relative flex items-center justify-center my-2">
              <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                
                {/* SVG Progress Arc Clock */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    className="text-black/[0.04] dark:text-white/[0.06]"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    className="text-[var(--primary)] transition-all duration-500 ease-linear"
                    strokeWidth="9"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>

                {/* Inner Face */}
                <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                  <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-[var(--text-main)]">
                    {formattedTimer}
                  </div>
                  <div className="text-[11px] font-bold text-[var(--primary)] mt-1 flex items-center justify-center gap-1">
                    {isTimerRunning ? (
                      <>
                        <Flame className="w-3 h-3 fill-orange-500 text-orange-500 animate-flame" />
                        <span>Focusing...</span>
                      </>
                    ) : (
                      <span>Ready ({timerDuration}m session)</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-semibold mt-0.5">
                    {todayFocusMinutes}m / {targetMinutes}m Logged Today
                  </div>
                </div>

              </div>
            </div>

            {/* Active task label */}
            <input
              type="text"
              value={timerTaskTitle}
              onChange={(e) => setTimerTaskTitle(e.target.value)}
              placeholder="What are you focusing on right now?"
              className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-card-subtle)] border border-black/[0.06] dark:border-white/[0.08] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none text-center font-medium"
            />

          </div>

          {/* Dial Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setTimerSecondsLeft(timerDuration * 60);
                setIsTimerRunning(false);
                sounds.playTap();
              }}
              className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-black/[0.06] dark:border-white/[0.08] transition-colors active:scale-95 cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (!isTimerRunning) {
                  sounds.playFocusStart();
                } else {
                  sounds.playTap();
                }
                setIsTimerRunning(!isTimerRunning);
              }}
              className="flex-1 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
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

      {/* Ambient Sound Mixer Drawer Modal */}
      <AmbientSoundMixerDrawer
        isOpen={showSoundMixer}
        onClose={() => setShowSoundMixer(false)}
      />

      {/* Zen Full-Screen Mode Overlay */}
      {isZenMode && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 bg-black/95 backdrop-blur-2xl text-white animate-fadeIn">
          
          {/* Zen Top Header */}
          <div className="w-full max-w-4xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧘</span>
              <span className="font-mono text-sm font-bold text-emerald-400">Zen Focus Room</span>
            </div>
            <button
              onClick={() => setIsZenMode(false)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit Zen (Esc / F)</span>
            </button>
          </div>

          {/* Zen Center Breathing Dial */}
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  className="text-white/10"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  className="text-emerald-400 transition-all duration-500 ease-linear"
                  strokeWidth="7"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl sm:text-6xl font-mono font-black tracking-tight">
                  {formattedTimer}
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-2">
                  {isTimerRunning ? 'Flow In Progress' : 'Paused'}
                </div>
              </div>
            </div>

            <div className="text-sm sm:text-base font-bold text-slate-300 max-w-md">
              {timerTaskTitle ? `Focusing on: "${timerTaskTitle}"` : 'Deep Work & Calm Clarity'}
            </div>
          </div>

          {/* Zen Bottom Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSoundMixer(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
              <span>Adjust Sounds</span>
            </button>

            <button
              onClick={() => {
                if (!isTimerRunning) sounds.playFocusStart();
                else sounds.playTap();
                setIsTimerRunning(!isTimerRunning);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isTimerRunning ? 'Pause' : 'Resume'}</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

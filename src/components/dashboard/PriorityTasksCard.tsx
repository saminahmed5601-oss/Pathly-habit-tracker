'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Check, Plus, Trash2, Sparkles, Heart, Target } from 'lucide-react';

interface PriorityTasksCardProps {
  onOpenMorning: () => void;
  onOpenFocusWithTask: (taskTitle: string, goalId?: string) => void;
}

export function PriorityTasksCard({ onOpenMorning, onOpenFocusWithTask }: PriorityTasksCardProps) {
  const { dailyPlan, togglePriorityTask, addPriorityTask, deletePriorityTask, goals } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addPriorityTask(newTaskTitle, selectedGoalId || undefined, 30);
    setNewTaskTitle('');
    setSelectedGoalId('');
  };

  const tasks = dailyPlan.priorityTasks || [];
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-white/10 shadow-sm flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Today&apos;s Priority Missions
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold">
                  {completedCount}/{tasks.length}
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Rule of 3: Focus on high-impact wins today
              </p>
            </div>
          </div>

          <button
            onClick={onOpenMorning}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Edit Daily Plan
          </button>
        </div>

        {/* Gratitude / Morning note if present */}
        {dailyPlan.gratitudeNote && (
          <div className="mb-4 px-3.5 py-2.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 fill-rose-500" />
            <span className="italic truncate">&ldquo;{dailyPlan.gratitudeNote}&rdquo;</span>
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-2.5">
          {tasks.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-400 text-xs">
              No tasks set for today yet. Use Sunrise Ritual or add one below!
            </div>
          ) : (
            tasks.map((task) => {
              const linkedGoal = goals.find(g => g.id === task.goalId);
              return (
                <div
                  key={task.id}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-zinc-400'
                      : 'bg-zinc-50/80 dark:bg-zinc-800/50 border-zinc-200/70 dark:border-zinc-700/60 hover:border-emerald-300 dark:hover:border-emerald-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Checkbox button */}
                    <button
                      onClick={() => togglePriorityTask(task.id)}
                      className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-emerald-500 text-white shadow-xs scale-105'
                          : 'border-2 border-zinc-300 dark:border-zinc-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-sm font-semibold block truncate cursor-pointer select-none ${
                          task.completed
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-800 dark:text-zinc-200'
                        }`}
                        onClick={() => togglePriorityTask(task.id)}
                      >
                        {task.title}
                      </span>

                      <div className="flex items-center gap-2 mt-0.5">
                        {linkedGoal && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-700 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/60 px-2 py-0.5 rounded-md">
                            <span>{linkedGoal.icon}</span>
                            <span className="truncate max-w-[120px]">{linkedGoal.title}</span>
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          +{task.xpValue} XP
                        </span>
                        {task.estimatedMinutes && (
                          <span className="text-[10px] text-zinc-400">
                            ~{task.estimatedMinutes}m
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {!task.completed && (
                      <button
                        onClick={() => onOpenFocusWithTask(task.title, task.goalId)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-200 text-[11px] font-bold transition-all shadow-2xs"
                        title="Start timer with this task"
                      >
                        Focus ⏱️
                      </button>
                    )}
                    <button
                      onClick={() => deletePriorityTask(task.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete task"
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

      {/* Quick Add Form */}
      <form onSubmit={handleAddTask} className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add another daily priority..."
            className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          {goals.length > 0 && (
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="px-2.5 py-2.5 rounded-xl text-xs bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="">No goal</option>
              {goals.map(g => (
                <option key={g.id} value={g.id}>
                  {g.icon} {g.title.slice(0, 15)}...
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold transition-all"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MilestoneItem } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Calendar,
  Layers,
  Award,
  AlertCircle
} from 'lucide-react';

interface MilestoneGoalListProps {
  onOpenNewGoal: () => void;
  onOpenFocusWithGoal: (goalId: string, goalTitle: string) => void;
}

export function MilestoneGoalList({ onOpenNewGoal, onOpenFocusWithGoal }: MilestoneGoalListProps) {
  const { goals, requestCompleteMilestone, uncompleteMilestone, deleteGoal } = useApp();
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({
    'goal-web-dev': true, // default expand the primary web dev goal
  });

  const toggleExpand = (goalId: string) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
  };

  const handleMilestoneClick = (goalId: string, milestone: MilestoneItem) => {
    if (milestone.isCompleted) {
      if (confirm(`Uncheck milestone #${milestone.order} "${milestone.title}"?`)) {
        uncompleteMilestone(goalId, milestone.id);
      }
    } else {
      // Trigger anti-cheat verification or direct completion
      requestCompleteMilestone(goalId, milestone);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-500" />
            Long-Term Milestones & Courses
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Track multi-step bootcamps and journeys with custom starting offsets & anti-cheat protection
          </p>
        </div>

        <button
          onClick={onOpenNewGoal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Journey</span>
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 rounded-3xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 p-8">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No active milestone journeys yet!</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Create your first milestone tracker (like your 12-milestone Web Dev course) and set your custom starting point.
          </p>
          <button
            onClick={onOpenNewGoal}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Create First Milestone Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const isExpanded = !!expandedGoals[goal.id];
            const completedCount = goal.milestones.filter(m => m.isCompleted).length;
            const progressPercent = Math.round((completedCount / goal.totalMilestones) * 100);
            const isFinished = completedCount >= goal.totalMilestones;

            // Offset info
            const offsetCount = goal.startingOffset || 0;

            return (
              <div
                key={goal.id}
                className="rounded-3xl bg-white dark:bg-zinc-900 border border-amber-900/10 dark:border-white/10 shadow-sm overflow-hidden transition-all hover:border-emerald-300 dark:hover:border-emerald-700/60"
              >
                {/* Goal Top Header Card */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    {/* Icon & Title */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${goal.color || 'from-emerald-400 to-teal-500'} flex items-center justify-center text-2xl shadow-sm shrink-0`}>
                        {goal.icon || '🎯'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                            {goal.title}
                          </h3>
                          {isFinished ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2.5 py-0.5 rounded-full">
                              <Award className="w-3.5 h-3.5 text-amber-500" /> Completed!
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full capitalize">
                              {goal.category}
                            </span>
                          )}
                        </div>

                        {goal.description && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress Stats & Actions */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                          {completedCount} <span className="text-xs font-normal text-zinc-400">/ {goal.totalMilestones}</span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {progressPercent}% Done
                        </div>
                      </div>

                      {!isFinished && (
                        <button
                          onClick={() => onOpenFocusWithGoal(goal.id, goal.title)}
                          className="px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-bold text-xs transition-colors border border-teal-200 dark:border-teal-800 shadow-2xs"
                          title="Start timer for this journey"
                        >
                          Focus ⏱️
                        </button>
                      )}

                      <button
                        onClick={() => toggleExpand(goal.id)}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors"
                        title={isExpanded ? "Collapse milestones" : "Expand milestones"}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${goal.title}"?`)) {
                            deleteGoal(goal.id);
                          }
                        }}
                        className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Delete goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar with Offset Visual Segment */}
                  <div className="mt-4">
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5 relative">
                      <div
                        className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1.5 font-medium">
                      {offsetCount > 0 && (
                        <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                          🎯 Started from milestone {offsetCount} (no restart)
                        </span>
                      )}
                      {goal.targetDate && (
                        <span className="flex items-center gap-1 ml-auto">
                          <Calendar className="w-3 h-3" /> Target: {goal.targetDate}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Milestones Stepper / Grid */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="flex items-center justify-between mb-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      <span>Milestones Roadmap</span>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Click milestone to update (Anti-cheat protected)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          onClick={() => handleMilestoneClick(goal.id, milestone)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                            milestone.isCompleted
                              ? milestone.wasInitialOffset
                                ? 'bg-teal-50/80 dark:bg-teal-950/30 border-teal-200 dark:border-teal-900/50 text-teal-900 dark:text-teal-200'
                                : 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                              : 'bg-white dark:bg-zinc-800/70 border-zinc-200/80 dark:border-zinc-700/80 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-xs'
                          }`}
                        >
                          <div className="mt-0.5">
                            {milestone.isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-zinc-400 dark:text-zinc-500">
                                #{milestone.order}
                              </span>
                              <span className="text-xs font-bold truncate">
                                {milestone.title}
                              </span>
                            </div>

                            {milestone.wasInitialOffset && (
                              <span className="inline-block mt-0.5 text-[9px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-100 dark:bg-teal-900/60 px-1.5 py-0.2 rounded-sm">
                                Initial Offset Baseline
                              </span>
                            )}

                            {milestone.proofNote && !milestone.wasInitialOffset && (
                              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 italic mt-0.5 line-clamp-1">
                                &ldquo;{milestone.proofNote}&rdquo;
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

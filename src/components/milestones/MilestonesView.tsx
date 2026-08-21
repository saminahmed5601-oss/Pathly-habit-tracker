'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Goal, MilestoneItem } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  Calendar, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles
} from 'lucide-react';

interface MilestonesViewProps {
  onOpenNewGoal: () => void;
}

export function MilestonesView({ onOpenNewGoal }: MilestonesViewProps) {
  const { goals, requestCompleteMilestone, uncompleteMilestone, deleteGoal } = useApp();
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({
    'goal-web-dev': true,
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
      requestCompleteMilestone(goalId, milestone);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Long-Term Milestones & Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track multi-step courses with custom starting offsets and anti-cheat proof of work
          </p>
        </div>

        <button
          onClick={onOpenNewGoal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Journey</span>
        </button>
      </div>

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <div className="clean-card p-12 text-center bg-white dark:bg-[#151C28]">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No active milestone journeys yet!</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Create your first milestone course (e.g. 12-milestone Web Dev) and set where you want to start from.
          </p>
          <button
            onClick={onOpenNewGoal}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Create First Journey
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const isExpanded = expandedGoals[goal.id] !== false; // default expanded
            const completedCount = goal.milestones.filter(m => m.isCompleted).length;
            const progressPercent = Math.round((completedCount / goal.totalMilestones) * 100);
            const isFinished = completedCount >= goal.totalMilestones;
            const offsetCount = goal.startingOffset || 0;

            return (
              <div
                key={goal.id}
                className="clean-card bg-white dark:bg-[#151C28] overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-2xl shrink-0">
                        {goal.icon || '💻'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                            {goal.title}
                          </h2>
                          {isFinished ? (
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" /> Completed!
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full capitalize">
                              {goal.category}
                            </span>
                          )}
                        </div>

                        {goal.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Progress numbers & toggles */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          {completedCount} <span className="text-xs font-normal text-slate-400">/ {goal.totalMilestones}</span>
                        </div>
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {progressPercent}% Done
                        </div>
                      </div>

                      <button
                        onClick={() => toggleExpand(goal.id)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${goal.title}"?`)) deleteGoal(goal.id);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                      {offsetCount > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          🎯 Started from milestone #{offsetCount} (no restart)
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

                {/* Milestones Grid */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>Milestones Roadmap ({goal.milestones.length} Steps)</span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Proof-of-work protected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          onClick={() => handleMilestoneClick(goal.id, milestone)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                            milestone.isCompleted
                              ? milestone.wasInitialOffset
                                ? 'bg-slate-100/80 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          <div className="mt-0.5">
                            {milestone.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400">
                                #{milestone.order}
                              </span>
                              <span className="text-xs font-bold truncate">
                                {milestone.title}
                              </span>
                            </div>

                            {milestone.wasInitialOffset && (
                              <span className="inline-block mt-0.5 text-[9px] font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 rounded">
                                Initial Offset
                              </span>
                            )}

                            {milestone.proofNote && !milestone.wasInitialOffset && (
                              <p className="text-[10px] text-slate-500 italic mt-0.5 line-clamp-1">
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

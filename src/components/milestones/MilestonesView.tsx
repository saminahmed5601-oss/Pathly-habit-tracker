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
  Sparkles,
  ArrowRight
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
          <h1 className="text-xl sm:text-2xl font-black text-[var(--text-main)]">
            Milestone Journeys
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Track multi-step courses with custom starting points
          </p>
        </div>

        <button
          onClick={onOpenNewGoal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs sm:text-sm shadow-xs transition-opacity self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Journey</span>
        </button>
      </div>

      {/* Goal Cards */}
      {goals.length === 0 ? (
        <div className="clean-card p-12 text-center bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="text-4xl mb-2">🎯</div>
          <h2 className="text-base font-bold text-[var(--text-main)]">No active journeys yet!</h2>
          <button
            onClick={onOpenNewGoal}
            className="mt-4 px-4 py-2 rounded-xl bg-[var(--primary)] text-white font-bold text-xs"
          >
            Create First Journey
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const isExpanded = expandedGoals[goal.id] !== false;
            const completedCount = goal.milestones.filter(m => m.isCompleted).length;
            const progressPercent = Math.round((completedCount / goal.totalMilestones) * 100);
            const isFinished = completedCount >= goal.totalMilestones;
            const offsetCount = goal.startingOffset || 0;

            // Find next incomplete milestone
            const nextMilestone = goal.milestones.find(m => !m.isCompleted);

            return (
              <div
                key={goal.id}
                className="clean-card bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden"
              >
                {/* Header */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center text-2xl shrink-0">
                        {goal.icon || '💻'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-base sm:text-lg font-black text-[var(--text-main)] truncate">
                            {goal.title}
                          </h2>
                          {isFinished && (
                            <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" /> Completed!
                            </span>
                          )}
                        </div>

                        {/* Visual Step Counter Pill */}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-[var(--primary)]">
                            {completedCount} of {goal.totalMilestones} Milestones
                          </span>
                          {offsetCount > 0 && (
                            <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-card-subtle)] px-2 py-0.2 rounded border border-[var(--border)]">
                              Started at #{offsetCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress numbers & toggles */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="text-right">
                        <div className="text-xl font-black text-[var(--text-main)]">
                          {progressPercent}%
                        </div>
                      </div>

                      <button
                        onClick={() => toggleExpand(goal.id)}
                        className="p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete "${goal.title}"?`)) deleteGoal(goal.id);
                        }}
                        className="p-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Visual Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-[var(--border)] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[var(--primary)] h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Step Highlight Banner */}
                  {nextMilestone && (
                    <div 
                      onClick={() => handleMilestoneClick(goal.id, nextMilestone)}
                      className="mt-4 p-3 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)]/30 flex items-center justify-between cursor-pointer hover:border-[var(--primary)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[var(--primary)] uppercase tracking-wider">
                          Next Up:
                        </span>
                        <span className="text-xs font-bold text-[var(--text-main)]">
                          #{nextMilestone.order} {nextMilestone.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1">
                        Complete <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Milestones Visual Grid */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-[var(--border)] bg-[var(--bg-card-subtle)]">
                    <div className="flex items-center justify-between mb-3 text-xs font-bold text-[var(--text-muted)]">
                      <span>All Steps</span>
                      <span className="text-[11px] text-[var(--primary)] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Pacing Guard Active
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
                                ? 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)]'
                                : 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary-text)] font-semibold'
                              : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--primary)]'
                          }`}
                        >
                          <div className="mt-0.5">
                            {milestone.isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-[var(--primary)] shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black text-[var(--text-muted)]">
                                #{milestone.order}
                              </span>
                              <span className="text-xs font-bold truncate">
                                {milestone.title}
                              </span>
                            </div>

                            {milestone.wasInitialOffset && (
                              <span className="inline-block mt-0.5 text-[9px] font-bold text-[var(--text-muted)] bg-[var(--border)] px-1.5 py-0.2 rounded">
                                Starting Offset
                              </span>
                            )}

                            {milestone.proofNote && !milestone.wasInitialOffset && (
                              <p className="text-[10px] text-[var(--text-muted)] italic mt-0.5 line-clamp-1">
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

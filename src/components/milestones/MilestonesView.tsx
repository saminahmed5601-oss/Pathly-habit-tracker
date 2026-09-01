'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { MilestoneItem } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Plus, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Award,
  ArrowRight,
  Search,
  BookOpen,
  FileText
} from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface MilestonesViewProps {
  onOpenNewGoal: () => void;
}

export function MilestonesView({ onOpenNewGoal }: MilestonesViewProps) {
  const { goals, requestCompleteMilestone, uncompleteMilestone, deleteGoal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({
    'goal-web-dev': true,
  });

  const categories = useMemo(() => {
    const set = new Set<string>();
    goals.forEach(g => {
      if (g.category) set.add(g.category);
    });
    return ['all', ...Array.from(set)];
  }, [goals]);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      const matchSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.milestones.some(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCat = selectedCategory === 'all' || g.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [goals, searchQuery, selectedCategory]);

  const toggleExpand = (goalId: string) => {
    setExpandedGoals(prev => ({
      ...prev,
      [goalId]: !prev[goalId]
    }));
    sounds.playTap();
  };

  const handleMilestoneClick = (goalId: string, milestone: MilestoneItem) => {
    if (milestone.isCompleted) {
      if (confirm(`Uncheck milestone #${milestone.order} "${milestone.title}"?`)) {
        uncompleteMilestone(goalId, milestone.id);
        sounds.playTap();
      }
    } else {
      requestCompleteMilestone(goalId, milestone);
    }
  };

  const totalStepsCompleted = goals.reduce((acc, g) => acc + g.milestones.filter(m => m.isCompleted).length, 0);
  const totalStepsAll = goals.reduce((acc, g) => acc + g.totalMilestones, 0);
  const totalPercent = totalStepsAll > 0 ? Math.round((totalStepsCompleted / totalStepsAll) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-[var(--text-main)]">
              Milestone Journeys
            </h1>
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-text)]">
              {totalStepsCompleted}/{totalStepsAll} Steps ({totalPercent}%)
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-[var(--text-muted)] mt-0.5">
            Structured step-by-step masteries with anti-cheat pacing protection
          </p>
        </div>

        <button
          onClick={() => {
            onOpenNewGoal();
            sounds.playTap();
          }}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:opacity-90 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-xs transition-all w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Journey</span>
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      {goals.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journeys or milestone steps..."
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {categories.length > 1 && (
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {cat === 'all' ? 'All Journeys' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Goal Cards */}
      {filteredGoals.length === 0 ? (
        <div className="clean-card p-8 sm:p-12 text-center bg-[var(--bg-card)] border border-[var(--border)]">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)] mb-1">
            {goals.length === 0 ? 'No active journeys yet!' : 'No matching journeys found'}
          </h2>
          <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto mb-4">
            {goals.length === 0 
              ? 'Create your first milestone journey (e.g. Web Dev 100, Fitness Blueprint, DSA Mastery). You can set custom starting offsets anytime!'
              : 'Try clearing your search query or category filter.'}
          </p>
          <button
            onClick={() => {
              if (goals.length === 0) onOpenNewGoal();
              else { setSearchQuery(''); setSelectedCategory('all'); }
              sounds.playTap();
            }}
            className="px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white font-bold text-xs shadow-xs active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            {goals.length === 0 ? (
              <>
                <Plus className="w-4 h-4" />
                <span>Create First Journey</span>
              </>
            ) : (
              <span>Clear Filter</span>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredGoals.map((goal) => {
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
                className="clean-card bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden transition-all hover:border-[var(--border)]/80"
              >
                {/* Header */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)] flex items-center justify-center text-xl sm:text-2xl shrink-0">
                        {goal.icon || '💻'}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="text-sm sm:text-lg font-black text-[var(--text-main)] truncate">
                            {goal.title}
                          </h2>
                          {isFinished && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.2 rounded-full flex items-center gap-1">
                              <Award className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>

                        {/* Step Counter & Category */}
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs font-bold text-[var(--primary)]">
                            {completedCount}/{goal.totalMilestones} Steps
                          </span>
                          {goal.category && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-card-subtle)] px-1.5 py-0.2 rounded border border-[var(--border)]">
                              {goal.category}
                            </span>
                          )}
                          {offsetCount > 0 && (
                            <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 bg-slate-500/10 px-1.5 py-0.2 rounded">
                              Started @ #{offsetCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Percentage & Expand */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-base sm:text-xl font-black text-[var(--text-main)]">
                          {progressPercent}%
                        </div>
                      </div>

                      <button
                        onClick={() => toggleExpand(goal.id)}
                        className="p-1.5 sm:p-2 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border)] transition-colors active:scale-95"
                        title={isExpanded ? 'Collapse milestones' : 'Expand milestones'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete journey "${goal.title}"?`)) {
                            deleteGoal(goal.id);
                            sounds.playTap();
                          }
                        }}
                        className="p-1.5 sm:p-2 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors active:scale-95"
                        title="Delete Journey"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-[var(--border)] h-2 sm:h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[var(--primary)] to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Step Highlight Banner */}
                  {nextMilestone && (
                    <div 
                      onClick={() => handleMilestoneClick(goal.id, nextMilestone)}
                      className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-xl bg-[var(--primary-light)] border border-[var(--primary)]/30 flex items-center justify-between cursor-pointer hover:border-[var(--primary)] active:scale-98 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] sm:text-xs font-black text-[var(--primary)] uppercase tracking-wider shrink-0 flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" /> Next:
                        </span>
                        <span className="text-xs font-bold text-[var(--text-main)] truncate">
                          #{nextMilestone.order} {nextMilestone.title}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1 shrink-0 ml-2">
                        Complete <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Milestones Grid */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-3 border-t border-[var(--border)] bg-[var(--bg-card-subtle)]">
                    <div className="flex items-center justify-between mb-2.5 text-xs font-bold text-[var(--text-muted)]">
                      <span>Milestone Curriculum ({goal.milestones.length} Units)</span>
                      <span className="text-[10px] sm:text-[11px] text-[var(--primary)] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Anti-Cheat Pacing Guard
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {goal.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          onClick={() => handleMilestoneClick(goal.id, milestone)}
                          className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-1 active:scale-98 ${
                            milestone.isCompleted
                              ? milestone.wasInitialOffset
                                ? 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)] opacity-70'
                                : 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary-text)] font-semibold shadow-2xs'
                              : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--primary)] shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 shrink-0">
                              {milestone.isCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                              ) : (
                                <Circle className="w-4 h-4 text-[var(--text-muted)]" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold block truncate">
                                #{milestone.order} {milestone.title}
                              </span>
                              {milestone.wasInitialOffset && (
                                <span className="text-[9px] text-[var(--text-muted)] block">
                                  Pre-completed (Offset)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Proof note preview if recorded */}
                          {milestone.proofNote && (
                            <div className="mt-1 px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[var(--border)]/40 text-[10px] text-[var(--text-muted)] truncate flex items-center gap-1">
                              <FileText className="w-3 h-3 text-[var(--primary)] shrink-0" />
                              <span className="truncate">&ldquo;{milestone.proofNote}&rdquo;</span>
                            </div>
                          )}
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

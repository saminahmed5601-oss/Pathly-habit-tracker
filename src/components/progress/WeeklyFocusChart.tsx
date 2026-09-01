'use client';

import React from 'react';
import { DayBarData } from '@/lib/progressUtils';
import { formatMinutes } from '@/lib/dateUtils';
import { BarChart3, Sparkles } from 'lucide-react';

interface WeeklyFocusChartProps {
  data: DayBarData[];
  onSelectDate?: (dateStr: string) => void;
  selectedDate?: string;
}

export function WeeklyFocusChart({ data, onSelectDate, selectedDate }: WeeklyFocusChartProps) {
  const totalMinutes = data.reduce((acc, d) => acc + d.focusMinutes, 0);
  const avgMinutes = Math.round(totalMinutes / 7);
  const targetsMet = data.filter(d => d.focusMinutes >= d.targetMinutes && d.targetMinutes > 0).length;

  const maxMinutesInWeek = Math.max(...data.map(d => d.focusMinutes), 120);

  return (
    <div className="clean-card p-4 sm:p-6 bg-[var(--bg-card)] border border-[var(--border)] relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary-text)]">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
              Weekly Focus Momentum
            </h2>
            <p className="text-[11px] sm:text-xs text-[var(--text-muted)]">
              Last 7 days compared against your daily targets
            </p>
          </div>
        </div>

        {/* Quick Mini Pills */}
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border)]">
            Total: <strong className="text-[var(--primary)]">{formatMinutes(totalMinutes)}</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-card-subtle)] text-[var(--text-main)] border border-[var(--border)]">
            Avg: <strong className="text-[var(--primary)]">{avgMinutes}m/d</strong>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            {targetsMet}/7 Days Met
          </span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="pt-4 pb-2">
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44 sm:h-52 px-2 border-b border-[var(--border)]">
          {data.map((day) => {
            const heightPercent = Math.min(100, Math.max(8, Math.round((day.focusMinutes / maxMinutesInWeek) * 100)));
            const isSelected = selectedDate === day.fullDate;
            const isTargetMet = day.focusMinutes >= day.targetMinutes;

            return (
              <button
                key={day.fullDate}
                type="button"
                onClick={() => onSelectDate?.(day.fullDate)}
                className="group relative flex flex-col items-center h-full justify-end cursor-pointer focus:outline-none"
              >
                {/* Floating Value on Hover / Selected */}
                <div className={`text-[10px] sm:text-xs font-bold mb-1.5 transition-all duration-200 ${
                  isSelected || day.isToday
                    ? 'text-[var(--primary)] scale-105'
                    : 'text-[var(--text-muted)] group-hover:text-[var(--text-main)]'
                }`}>
                  {day.focusMinutes > 0 ? `${day.focusMinutes}m` : '0m'}
                </div>

                {/* Animated Vertical Bar */}
                <div className="w-full max-w-[36px] bg-[var(--bg-card-subtle)] rounded-t-xl overflow-hidden relative h-32 sm:h-36 flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 relative ${
                      isSelected
                        ? 'bg-[var(--primary)] ring-2 ring-[var(--primary)] shadow-md'
                        : isTargetMet
                        ? 'bg-emerald-500 dark:bg-emerald-400 group-hover:opacity-90'
                        : day.focusMinutes > 0
                        ? 'bg-teal-500/80 dark:bg-teal-400/80 group-hover:opacity-90'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {isTargetMet && (
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] text-white">
                        ✓
                      </div>
                    )}
                  </div>
                </div>

                {/* Day Label */}
                <div className="mt-2 text-center">
                  <div className={`text-[11px] sm:text-xs font-bold tracking-tight ${
                    day.isToday
                      ? 'text-[var(--primary)] font-black'
                      : isSelected
                      ? 'text-[var(--text-main)]'
                      : 'text-[var(--text-muted)]'
                  }`}>
                    {day.dayName}
                  </div>
                  {day.isToday && (
                    <div className="text-[9px] font-black text-[var(--primary)] uppercase tracking-wider">
                      Today
                    </div>
                  )}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center pointer-events-none whitespace-nowrap bg-slate-900 text-white text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-lg">
                  <span>{day.fullDate}</span>
                  <span className="text-emerald-400 font-bold">{day.focusMinutes}m • {day.tasksCompleted} tasks</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-muted)]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Target Met ({'>='} 120m)
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500/80 inline-block" />
            Focused Time
          </span>
        </div>
        <div className="flex items-center gap-1 font-semibold text-[var(--text-main)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Click any bar to inspect daily breakdown</span>
        </div>
      </div>

    </div>
  );
}

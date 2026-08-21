'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { GoalCategory } from '@/types';
import { X, Sparkles, Sliders, Layers } from 'lucide-react';

interface NewGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_OPTIONS: { id: GoalCategory; label: string; icon: string }[] = [
  { id: 'coding', label: 'Coding', icon: '💻' },
  { id: 'study', label: 'Study', icon: '📚' },
  { id: 'fitness', label: 'Fitness', icon: '🏃' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
];

const COLOR_OPTIONS = [
  { id: 'from-emerald-400 to-teal-500', name: 'Emerald', bg: 'bg-emerald-500' },
  { id: 'from-amber-400 to-orange-500', name: 'Amber', bg: 'bg-amber-500' },
  { id: 'from-purple-400 to-indigo-500', name: 'Purple', bg: 'bg-purple-500' },
  { id: 'from-rose-400 to-pink-500', name: 'Rose', bg: 'bg-rose-500' },
  { id: 'from-blue-400 to-cyan-500', name: 'Blue', bg: 'bg-blue-500' },
];

const ICON_OPTIONS = ['💻', '📚', '🎯', '🚀', '📖', '🏃', '🎨', '🧠', '⚡', '🌟'];

export function NewGoalModal({ isOpen, onClose }: NewGoalModalProps) {
  const { createGoal } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('coding');
  const [totalMilestones, setTotalMilestones] = useState(10);
  const [startingOffset, setStartingOffset] = useState(0);
  const [color, setColor] = useState(COLOR_OPTIONS[0].id);
  const [icon, setIcon] = useState('🎯');
  const [targetDate, setTargetDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createGoal({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      totalMilestones: Number(totalMilestones),
      startingOffset: Number(startingOffset),
      color,
      icon,
      targetDate: targetDate || undefined,
    });

    onClose();
    setTitle('');
    setDescription('');
  };

  const previewPercent = Math.round((startingOffset / Math.max(1, totalMilestones)) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg clean-card p-6 sm:p-7 bg-[var(--bg-card)] border border-[var(--border)] shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[var(--text-main)]">
              Create New Journey
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Set milestones & starting offset
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full-Stack Web Development Course"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs font-bold text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    category === cat.id
                      ? 'bg-[var(--primary-light)] border-[var(--primary)] text-[var(--primary-text)] font-black'
                      : 'bg-[var(--bg-card-subtle)] border-[var(--border)] text-[var(--text-muted)]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Total Milestones & Starting Offset */}
          <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border)] space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-[var(--text-main)] mb-1">
                <span>Total Milestones</span>
                <span className="text-[var(--primary)] font-black">{totalMilestones} Steps</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                value={totalMilestones}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTotalMilestones(val);
                  if (startingOffset > val) setStartingOffset(val);
                }}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
            </div>

            {/* Starting Offset Feature */}
            <div>
              <div className="flex justify-between text-xs font-bold text-[var(--text-main)] mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-[var(--primary)]" />
                  Starting Offset (Completed Before)
                </span>
                <span className="text-[var(--primary)] font-black">
                  {startingOffset} / {totalMilestones} ({previewPercent}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={totalMilestones}
                value={startingOffset}
                onChange={(e) => setStartingOffset(Number(e.target.value))}
                className="w-full accent-[var(--primary)] cursor-pointer"
              />
              <p className="text-[11px] text-[var(--text-muted)] mt-1 font-medium">
                🎯 Starts immediately at milestone #{startingOffset} without restarting from 0!
              </p>
            </div>
          </div>

          {/* Icon & Color */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1">
                Emoji Icon
              </label>
              <div className="flex flex-wrap gap-1">
                {ICON_OPTIONS.map((ico) => (
                  <button
                    type="button"
                    key={ico}
                    onClick={() => setIcon(ico)}
                    className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${
                      icon === ico
                        ? 'bg-[var(--primary-light)] border-2 border-[var(--primary)] scale-105'
                        : 'bg-[var(--bg-card-subtle)]'
                    }`}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white font-bold text-xs shadow-xs transition-opacity"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Journey (+30 XP)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

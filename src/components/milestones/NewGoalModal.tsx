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
  { id: 'coding', label: 'Coding / Web Dev', icon: '💻' },
  { id: 'study', label: 'Study / Academics', icon: '📚' },
  { id: 'fitness', label: 'Fitness & Health', icon: '🏃' },
  { id: 'reading', label: 'Reading & Books', icon: '📖' },
  { id: 'career', label: 'Career & Projects', icon: '💼' },
  { id: 'creative', label: 'Creative Skills', icon: '🎨' },
];

const COLOR_OPTIONS = [
  { id: 'from-emerald-400 to-teal-500', name: 'Emerald Wave', bg: 'bg-emerald-500' },
  { id: 'from-amber-400 to-orange-500', name: 'Warm Amber', bg: 'bg-amber-500' },
  { id: 'from-purple-400 to-indigo-500', name: 'Lavender Night', bg: 'bg-purple-500' },
  { id: 'from-rose-400 to-pink-500', name: 'Rose Petal', bg: 'bg-rose-500' },
  { id: 'from-blue-400 to-cyan-500', name: 'Ocean Cyan', bg: 'bg-blue-500' },
];

const ICON_OPTIONS = ['💻', '📚', '🎯', '🚀', '📖', '🏃', '🎨', '🧠', '⚡', '🌟', '💼', '🌸'];

export function NewGoalModal({ isOpen, onClose }: NewGoalModalProps) {
  const { createGoal } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('coding');
  const [totalMilestones, setTotalMilestones] = useState(12);
  const [startingOffset, setStartingOffset] = useState(3);
  const [color, setColor] = useState(COLOR_OPTIONS[0].id);
  const [icon, setIcon] = useState('💻');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Create New Journey
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Set your total milestones & jump right in where you left off
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Goal / Course Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Full-Stack Web Development Course"
              className="w-full px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    category === cat.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                      : 'bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Total Milestones & Starting Offset */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-4">
            
            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                <span>Total Milestones</span>
                <span className="text-emerald-600 dark:text-emerald-400">{totalMilestones} Milestones</span>
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
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Starting Offset Feature */}
            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-1">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-teal-500" />
                  Starting Offset (Already Completed)
                </span>
                <span className="text-teal-600 dark:text-teal-400">
                  {startingOffset} / {totalMilestones} ({previewPercent}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={totalMilestones}
                value={startingOffset}
                onChange={(e) => setStartingOffset(Number(e.target.value))}
                className="w-full accent-teal-500 cursor-pointer"
              />
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                🎯 <strong>No restarting needed!</strong> If you already finished {startingOffset} milestones before using Pathly, your journey will start with {startingOffset} milestones marked done!
              </p>
            </div>

          </div>

          {/* Icon & Theme Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Emoji Icon
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ICON_OPTIONS.map((ico) => (
                  <button
                    type="button"
                    key={ico}
                    onClick={() => setIcon(ico)}
                    className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                      icon === ico
                        ? 'bg-emerald-100 dark:bg-emerald-900 border-2 border-emerald-500 scale-105'
                        : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200'
                    }`}
                  >
                    {ico}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
                Color Gradient
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_OPTIONS.map((col) => (
                  <button
                    type="button"
                    key={col.id}
                    onClick={() => setColor(col.id)}
                    className={`w-8 h-8 rounded-xl ${col.bg} transition-all ${
                      color === col.id ? 'ring-3 ring-offset-2 ring-emerald-500 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Target Completion Date */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Target Finish Date (Optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plant This Journey (+30 XP)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

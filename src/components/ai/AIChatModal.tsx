'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { processAIChatMessage, ChatMessage, ActionSuggested } from '@/lib/aiAssistant';
import { sounds } from '@/lib/sounds';
import { 
  Sparkles, 
  X, 
  ArrowRight,
  Trash2,
  Zap,
  Coffee,
  Sprout,
  Send,
  Mic,
  Volume2,
  CheckCircle2,
  Clock,
  Flame,
  Leaf
} from 'lucide-react';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFocus: () => void;
  onOpenMorning: () => void;
  onOpenZenSanctuary?: () => void;
}

export function AIChatModal({ 
  isOpen, 
  onClose, 
  onOpenFocus, 
  onOpenMorning,
  onOpenZenSanctuary
}: AIChatModalProps) {
  const { dailyPlan, goals, profile, focusLogs, addPriorityTask } = useApp();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [inputVal, setInputVal] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const todayFocusMinutes = useMemo(() => {
    return focusLogs.reduce((acc, l) => acc + l.durationMinutes, 0);
  }, [focusLogs]);

  const targetMinutes = dailyPlan.targetFocusMinutes || 120;
  const pendingTasks = (dailyPlan.priorityTasks || []).filter(t => !t.completed);
  const totalTasksCount = dailyPlan.priorityTasks?.length || 3;
  const energyLabel = dailyPlan.energyRating 
    ? `${dailyPlan.energyRating}/5 Energy` 
    : 'High Flow';

  const welcomeMessage = useMemo<ChatMessage>(() => {
    const greeting = new Date().getHours() < 12 
      ? 'Good morning' 
      : new Date().getHours() < 18 
      ? 'Good afternoon' 
      : 'Good evening';
    
    return {
      id: 'welcome-concierge',
      sender: 'assistant',
      text: `${greeting}, **${profile.name || 'Friend'}**.\n\nYou have logged **${todayFocusMinutes}m** of your **${targetMinutes}m** target today with **${pendingTasks.length} missions** remaining.\n\nShall we deconstruct your next priority mission or queue your next 25-minute deep focus block?`,
      timestamp: 'Active Sync',
    };
  }, [profile.name, todayFocusMinutes, targetMinutes, pendingTasks.length]);

  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isThinking, setIsThinking] = useState(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 150);
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleSendMessage = useCallback((messageText: string) => {
    if (!messageText.trim()) return;

    setMessages(prev => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: messageText,
        timestamp: 'Just now',
      };
      return [...prev, userMsg];
    });

    setInputVal('');
    sounds.playTap();
    setIsThinking(true);

    setTimeout(() => {
      const response = processAIChatMessage(
        messageText,
        {
          dailyPlan,
          goals,
          profile,
          focusLogs,
          todayFocusMinutes,
        },
        (taskTitle, estimatedMins) => {
          addPriorityTask(taskTitle, undefined, estimatedMins);
        }
      );

      setMessages(prev => [...prev, response]);
      setIsThinking(false);
      sounds.playTaskPop();
    }, 450);
  }, [dailyPlan, goals, profile, focusLogs, todayFocusMinutes, addPriorityTask]);

  // Smart Action Card 1: Deconstruct Next Mission into 3 sprints
  const handleDeconstructNextMission = () => {
    const nextTask = pendingTasks[0];
    if (!nextTask) {
      handleSendMessage("Break down my next big goal into 3 actionable 25-minute sprints");
      return;
    }

    const title = nextTask.title;
    sounds.playTap();
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: `⚡ Deconstruct mission: "${title}"`,
        timestamp: 'Just now',
      }
    ]);

    setIsThinking(true);
    setTimeout(() => {
      addPriorityTask(`1. Outline & setup: ${title}`, undefined, 25);
      addPriorityTask(`2. Core execution: ${title}`, undefined, 25);
      addPriorityTask(`3. Polish & review: ${title}`, undefined, 15);

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `⚡ **Mission Deconstructed into 3 Focused Sprints:**\n\nI have structured **"${title}"** into your daily plan:\n1. ⏳ **Outline & setup** (25m, +40 XP)\n2. ⏳ **Core execution** (25m, +40 XP)\n3. ⏳ **Polish & review** (15m, +30 XP)\n\nReady to begin Sprint 1?`,
          timestamp: 'Just now',
          actionSuggested: {
            type: 'open_focus',
            label: 'Start Sprint 1 (25m) ⏱️',
          }
        }
      ]);
      setIsThinking(false);
      sounds.playTaskPop();
    }, 500);
  };

  // Smart Action Card 2: Optimize Daily Schedule
  const handleOptimizeSchedule = () => {
    sounds.playTap();
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: '🌿 Optimize my daily focus schedule',
        timestamp: 'Just now',
      }
    ]);

    setIsThinking(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: `🌿 **Schedule Sequenced for Bio-Rhythm Peak:**\n\n- **Block 1 (Deep Work):** Conquer your #1 Must-Win mission while cognitive bandwidth is freshest.\n- **Block 2 (Rhythm):** 25-minute execution sprint paired with Ambient Lofi chords.\n- **Block 3 (Restoration):** Sunset reflection + 5m breathing matrix.\n\nYou are on pace for a complete blooming day!`,
          timestamp: 'Just now',
        }
      ]);
      setIsThinking(false);
      sounds.playTaskPop();
    }, 500);
  };

  // Smart Action Card 3: 5m Mindful Breath
  const handleStartBreathing = () => {
    sounds.playSingingBowl();
    if (onOpenZenSanctuary) {
      onClose();
      onOpenZenSanctuary();
    } else {
      handleSendMessage("Guide me through a 5-minute calm breathing exercise");
    }
  };

  const handleActionClick = useCallback((action: ActionSuggested) => {
    if (action.type === 'open_focus') {
      onClose();
      onOpenFocus();
    } else if (action.type === 'open_morning') {
      onClose();
      onOpenMorning();
    }
  }, [onClose, onOpenFocus, onOpenMorning]);

  const handleClearChat = useCallback(() => {
    setMessages([welcomeMessage]);
    sounds.playTap();
  }, [welcomeMessage]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
          
          {/* Backdrop with Spring Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Ambient Glowing Halo Blur Behind Modal */}
          <div className="absolute w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Main Glassmorphic Modal with Spring Physics */}
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-2xl h-[90vh] max-h-[740px] rounded-3xl bg-[#FAFAF9]/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-stone-200/80 dark:border-white/[0.08] shadow-2xl flex flex-col overflow-hidden z-10"
          >
            
            {/* 1. Editorial Header ("Pathly Concierge") */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200/60 dark:border-white/[0.06] bg-white/50 dark:bg-stone-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-sm ring-1 ring-emerald-400/30">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-stone-900 dark:text-stone-100 tracking-tight">
                      Pathly Concierge
                    </h2>
                    <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Context Sync</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Executive task deconstruction, schedule optimization, and rhythm pacing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                  title="Reset Conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Top Dynamic Context Strip */}
            <div className="px-5 py-2.5 bg-stone-100/70 dark:bg-stone-950/60 border-b border-stone-200/50 dark:border-white/[0.04] flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 overflow-x-auto gap-4">
              <div className="flex items-center gap-4 text-[11px] font-bold whitespace-nowrap">
                <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{todayFocusMinutes}m / {targetMinutes}m Focus</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>{pendingTasks.length} of {totalTasksCount} Missions Left</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{energyLabel}</span>
                </span>
              </div>

              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest hidden sm:inline">
                Lv. {profile.level} Explorer
              </span>
            </div>

            {/* 3. Action Deck (Suggested Action Bento Row) */}
            <div className="px-5 py-3 bg-white/40 dark:bg-stone-900/40 border-b border-stone-200/40 dark:border-white/[0.04] grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDeconstructNextMission}
                className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 hover:bg-emerald-50 dark:hover:bg-stone-750 border border-stone-200/80 dark:border-white/[0.06] hover:border-emerald-500/40 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 dark:text-emerald-400">
                  <Zap className="w-3.5 h-3.5 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span>Deconstruct Mission</span>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                  Breaks task into 3x 25m sprints
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleOptimizeSchedule}
                className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 hover:bg-teal-50 dark:hover:bg-stone-750 border border-stone-200/80 dark:border-white/[0.06] hover:border-teal-500/40 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-teal-700 dark:text-teal-400">
                  <Sprout className="w-3.5 h-3.5 text-teal-500 group-hover:scale-110 transition-transform" />
                  <span>Optimize Schedule</span>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                  Aligns tasks with energy curve
                </p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleStartBreathing}
                className="p-2.5 rounded-2xl bg-white dark:bg-stone-800/80 hover:bg-purple-50 dark:hover:bg-stone-750 border border-stone-200/80 dark:border-white/[0.06] hover:border-purple-500/40 text-left transition-all group cursor-pointer shadow-2xs"
              >
                <div className="flex items-center gap-1.5 text-xs font-black text-purple-700 dark:text-purple-400">
                  <Coffee className="w-3.5 h-3.5 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>5m Mindful Breath</span>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                  432Hz harmonic reset &amp; flow
                </p>
              </motion.button>

            </div>

            {/* 4. Conversational Dialogue Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="max-w-[88%] sm:max-w-[78%] space-y-1.5">
                      <div
                        className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-tr-xs shadow-md font-medium'
                            : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200/70 dark:border-white/[0.06] rounded-tl-xs shadow-xs'
                        }`}
                      >
                        {msg.text}

                        {msg.actionSuggested && (
                          <div className="mt-3 pt-2.5 border-t border-stone-200/50 dark:border-white/[0.06]">
                            <button
                              type="button"
                              onClick={() => handleActionClick(msg.actionSuggested!)}
                              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black shadow-xs transition-all cursor-pointer"
                            >
                              <span>{msg.actionSuggested.label || 'Execute Action'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className={`text-[10px] text-stone-400 px-1 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-2xl bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-200 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {profile.avatarId ? '👤' : '✨'}
                      </div>
                    )}
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex gap-3 justify-start items-center text-xs text-stone-500 font-bold animate-pulse">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200/70 dark:border-white/[0.06] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Concierge is synchronizing your workflow...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 5. Command Bar Input Footer */}
            <div className="p-4 sm:p-5 border-t border-stone-200/60 dark:border-white/[0.06] bg-white/70 dark:bg-stone-900/70">
              
              {/* Voice Wave Visualizer indicator (when mic is active) */}
              {isVoiceActive && (
                <div className="mb-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300 animate-pulse">
                  <div className="flex items-center gap-2 font-bold">
                    <Volume2 className="w-4 h-4 text-emerald-500 animate-bounce" />
                    <span>Listening... Speak your command</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="w-1 h-5 bg-emerald-500 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputVal);
                }}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-100 dark:bg-stone-800/90 border border-stone-200/80 dark:border-white/[0.08] shadow-inner focus-within:ring-2 focus-within:ring-emerald-500/40 transition-all"
              >
                {/* Voice mic toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceActive(!isVoiceActive);
                    sounds.playTap();
                  }}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isVoiceActive
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                  }`}
                  title="Toggle Audio / Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask concierge, schedule sprint, add reminder..."
                  className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none font-medium"
                />

                {/* Submit Action Arrow */}
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className={`p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer ${
                    inputVal.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                      : 'text-stone-400 opacity-40 cursor-not-allowed'
                  }`}
                  title="Submit command (Enter)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

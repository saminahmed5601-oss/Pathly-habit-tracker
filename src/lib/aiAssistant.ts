import { DailyPlan, Goal, UserProfile, FocusSessionLog } from '@/types';
import { formatMinutes } from './dateUtils';

export interface ActionSuggested {
  type: 'add_task' | 'open_focus' | 'open_morning';
  data?: Record<string, unknown>;
  label?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionSuggested?: ActionSuggested;
}

export interface AIContext {
  dailyPlan: DailyPlan;
  goals: Goal[];
  profile: UserProfile;
  focusLogs: FocusSessionLog[];
  todayFocusMinutes: number;
}

/**
 * Checks if query is on-topic (tasks, habits, focus, reminders, goals, or Pathly app).
 */
export function isPathlyTopic(query: string): boolean {
  const q = query.toLowerCase();
  const allowedKeywords = [
    'task', 'todo', 'plan', 'focus', 'goal', 'habit', 'milestone', 
    'reminder', 'streak', 'shield', 'xp', 'level', 'routine', 'morning', 
    'evening', 'pomodoro', 'work', 'study', 'productivity', 'today', 
    'progress', 'schedule', 'time', 'buddy', 'friend', 'pathly', 'badge',
    'timer', 'break', 'prioritize', 'start', 'add', 'done', 'complete'
  ];

  // If query is short greeting or check
  if (q.length < 25 && /^(hi|hello|hey|help|what can you do|who are you|status|summary)/i.test(q.trim())) {
    return true;
  }

  return allowedKeywords.some(k => q.includes(k));
}

/**
 * Analyzes the user's prompt against active tasks and returns a specialized assistant response.
 */
export function processAIChatMessage(
  userQuery: string,
  context: AIContext,
  onAddTask?: (title: string, estimatedMinutes?: number) => void
): ChatMessage {
  const q = userQuery.trim().toLowerCase();
  const { dailyPlan, goals, profile, todayFocusMinutes } = context;
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Off-topic Guardrail
  if (!isPathlyTopic(userQuery)) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `I am your **Pathly Task & Habit Companion**! 🎯\n\nI am exclusively dedicated to helping you manage your daily tasks, habits, focus sessions, reminders, and journeys in Pathly.\n\nAsk me about:\n- 📋 Your scheduled tasks & reminders for today\n- ⏱️ Your focus progress & remaining target minutes\n- ➕ Adding new tasks or reminders (e.g. *"Remind me to study math for 45m"*)\n- 🏆 Your streak, streak shields, and XP level\n- 💡 Actionable breakdown for any difficult milestone!`,
      timestamp: now,
    };
  }

  // 2. Add task or reminder intent
  const addTaskMatch = userQuery.match(/(?:add|remind me to|create task|schedule|new task)\s*(?:to|:)?\s*(.+)/i);
  if (addTaskMatch && addTaskMatch[1]) {
    const rawTask = addTaskMatch[1].trim();
    let taskTitle = rawTask;
    let mins = 30;

    const timeMatch = rawTask.match(/(.+?)(?:\s+for\s+(\d+)\s*(?:m|min|mins|minutes)?)$/i);
    if (timeMatch) {
      taskTitle = timeMatch[1].trim();
      mins = parseInt(timeMatch[2], 10) || 30;
    }

    if (onAddTask) {
      onAddTask(taskTitle, mins);
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `✅ **Task Added to Today's Plan!**\n\n🎯 **"${taskTitle}"** (~${mins} mins)\n\nI've scheduled this into your priority list. You will earn +40 XP upon checking it off. Would you like to start a focus timer for it now?`,
      timestamp: now,
      actionSuggested: {
        type: 'open_focus',
        data: { taskTitle, durationMinutes: mins },
        label: `Start ${mins}m Focus Session ⏱️`,
      }
    };
  }

  // 3. Task & Plan status queries
  if (q.includes('task') || q.includes('todo') || q.includes('plan') || q.includes('schedule') || q.includes('today') || q.includes('what should i do')) {
    const tasks = dailyPlan.priorityTasks || [];
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    if (tasks.length === 0) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `☀️ You haven't set up any priority tasks for today yet!\n\nUse your **Sunrise Morning Kickoff** ritual or tell me *"Add task: [your task title]"* to get started and earn +60 kickoff XP!`,
        timestamp: now,
        actionSuggested: {
          type: 'open_morning',
          label: 'Start Morning Kickoff 🌅',
        }
      };
    }

    let response = `📋 **Today's Task Briefing** (${completedTasks.length}/${tasks.length} Completed):\n\n`;

    if (pendingTasks.length > 0) {
      response += `**Remaining Priority Missions:**\n`;
      pendingTasks.forEach((t, i) => {
        response += `${i + 1}. ⏳ **${t.title}** (~${t.estimatedMinutes || 30}m, +${t.xpValue} XP)\n`;
      });
      response += `\n💡 *Tip: Tackle **"${pendingTasks[0].title}"** first to build high momentum!*`;
    } else {
      response += `🎉 **All priority tasks for today are completed!** Outstanding discipline!\n\nTake time for your **Sunset Reflection** to lock in your streak and earn +80 XP.`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: response,
      timestamp: now,
    };
  }

  // 4. Focus & Timer queries
  if (q.includes('focus') || q.includes('timer') || q.includes('minutes') || q.includes('hour') || q.includes('target')) {
    const target = dailyPlan.targetFocusMinutes || 120;
    const remaining = Math.max(0, target - todayFocusMinutes);
    const pct = Math.min(100, Math.round((todayFocusMinutes / target) * 100));

    let focusMsg = `⏱️ **Focus Progress Today**:\n\n- **Logged Time:** ${formatMinutes(todayFocusMinutes)}\n- **Daily Target:** ${formatMinutes(target)} (${pct}% completed)\n- **Remaining:** ${remaining > 0 ? `${formatMinutes(remaining)} to hit your target` : '🎯 Target Met! Excellent work!'}\n\n`;

    if (remaining > 0) {
      focusMsg += `Would you like to jump into the **Focus Room** for a 25-minute Pomodoro block with gentle ambient soundscapes?`;
    } else {
      focusMsg += `You have exceeded today's focus goal! Keep the flow going or take a well-deserved rest.`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: focusMsg,
      timestamp: now,
      actionSuggested: {
        type: 'open_focus',
        label: 'Open Focus Room 🧘',
      }
    };
  }

  // 5. Goals & Milestones queries
  if (q.includes('goal') || q.includes('milestone') || q.includes('journey')) {
    if (goals.length === 0) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `You don't have any active goal journeys created yet.\n\nCreate a new journey (e.g. *Learn React*, *Fitness 100 Days*, *DSA Mastery*) to organize your milestones!`,
        timestamp: now,
      };
    }

    let goalsSummary = `🏆 **Active Goal Journeys (${goals.length}):**\n\n`;
    goals.forEach((g) => {
      const done = g.milestones.filter(m => m.isCompleted).length;
      const total = g.milestones.length;
      const pct = Math.round((done / total) * 100);
      const nextMs = g.milestones.find(m => !m.isCompleted);

      goalsSummary += `• ${g.icon} **${g.title}**: ${done}/${total} milestones (${pct}%)\n`;
      if (nextMs) {
        goalsSummary += `   👉 Next: *${nextMs.title}*\n`;
      }
    });

    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: goalsSummary,
      timestamp: now,
    };
  }

  // 6. Streak, Shields & Gamification
  if (q.includes('streak') || q.includes('shield') || q.includes('level') || q.includes('xp') || q.includes('rank')) {
    const shields = profile.streakShields || 0;
    return {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: `🔥 **Your Gamification Profile**:\n\n- **Active Streak:** ${profile.streakDays} days (Best: ${profile.bestStreak}d)\n- **Streak Shields:** 🛡️ ${shields} available ${shields > 0 ? '(Streak is protected!)' : '(Get 1 in Trophy Case for 150 XP)'}\n- **Level:** Lv. ${profile.level} (${profile.currentXP}/${profile.nextLevelXP} XP)\n\nKeep completing daily tasks and focus sessions to unlock your next rank tier!`,
      timestamp: now,
    };
  }

  // Default Assistant Greeting & Recommendations
  return {
    id: `ai-${Date.now()}`,
    sender: 'assistant',
    text: `Hello! I am your **Pathly Productivity Assistant** 🤖\n\nHere is your quick status right now:\n- **Today's Focus:** ${formatMinutes(todayFocusMinutes)} / ${formatMinutes(dailyPlan.targetFocusMinutes || 120)}\n- **Tasks Remaining:** ${dailyPlan.priorityTasks.filter(t => !t.completed).length} pending\n- **Streak:** 🔥 ${profile.streakDays} days (${profile.streakShields || 0} shields)\n\nHow can I help you today? You can ask me to summarize your tasks, schedule a new reminder, or start a deep focus session!`,
    timestamp: now,
  };
}

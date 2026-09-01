'use client';

import React from 'react';
import { TabType } from './Navbar';
import { Sun, Target, TrendingUp, Users, Award } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import { useApp } from '@/context/AppContext';

interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const { incomingRequests } = useApp();

  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Sun, color: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'milestones' as TabType, label: 'Milestones', icon: Target, color: 'text-teal-600 dark:text-teal-400' },
    { id: 'progress' as TabType, label: 'Progress', icon: TrendingUp, color: 'text-cyan-600 dark:text-cyan-400' },
    { id: 'friends' as TabType, label: 'Buddies', icon: Users, color: 'text-purple-600 dark:text-purple-400', badge: incomingRequests.length },
    { id: 'achievements' as TabType, label: 'Trophies', icon: Award, color: 'text-amber-600 dark:text-amber-400' },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    sounds.playTap();
  };

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-2xl border-t border-black/[0.04] dark:border-white/[0.06] px-2 py-1 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-colors shadow-lg shadow-black/5"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all select-none cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-black/[0.04] dark:bg-white/[0.06] font-black ' + tab.color
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                
                {/* Active Glowing Dot */}
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current" />
                )}

                {/* Badge Notification */}
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-purple-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

'use client';

import React from 'react';
import { TabType } from './Navbar';
import { Sun, Target, Users, Award } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function MobileBottomNav({ activeTab, setActiveTab }: MobileBottomNavProps) {
  const tabs = [
    { id: 'today' as TabType, label: 'Today', icon: Sun, color: 'text-[var(--primary)]' },
    { id: 'milestones' as TabType, label: 'Milestones', icon: Target, color: 'text-[var(--primary)]' },
    { id: 'friends' as TabType, label: 'Buddies', icon: Users, color: 'text-purple-500' },
    { id: 'achievements' as TabType, label: 'Trophies', icon: Award, color: 'text-amber-500' },
  ];

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
    sounds.playTap();
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border)] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-colors">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-[var(--bg-card-subtle)] font-bold ' + tab.color
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

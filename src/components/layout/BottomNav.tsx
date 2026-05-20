/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Radio, ShieldAlert, Award, MessageSquare, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Feed', icon: Radio },
    { id: 'predict', label: 'Predict', icon: Award },
    { id: 'polls', label: 'Polls', icon: ShieldAlert },
    { id: 'fanzone', label: 'Chat', icon: MessageSquare },
    { id: 'stats', label: 'Stats', icon: BarChart3 }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/90 backdrop-blur-xl border-t border-white/10 px-2 py-1 flex items-center justify-around shadow-2xl safe-bottom">
      {tabs.map(t => {
        const Icon = t.icon;
        const isActive = currentTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setCurrentTab(t.id)}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all relative cursor-pointer"
          >
            {isActive && (
              <span className="absolute inset-0 bg-white/5 rounded-xl border border-white/5 -z-10" />
            )}
            <Icon className={`w-5 h-5 transition-all ${
              isActive 
                ? 'text-[var(--team-primary)] scale-110 drop-shadow-[0_0_8px_rgba(255,203,5,0.4)]' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`} />
            <span className={`text-[10px] mt-0.5 tracking-tight font-medium ${
              isActive ? 'text-[var(--team-primary)] font-bold' : 'text-zinc-500'
            }`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

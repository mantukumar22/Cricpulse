/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { MATCHES_SCHEDULE } from '../../data/mock-match';
import { TEAMS } from '../../data/mock-teams';
import { Trophy, Flame, ChevronDown, Radio, RefreshCw } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    activeMatchId,
    setActiveMatchId,
    match,
    userPoints,
    userStreak,
    isSimulating,
    toggleSimulation,
    resetAllStats
  } = useMatch();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const activeSchedule = MATCHES_SCHEDULE.find(m => m.id === activeMatchId) || MATCHES_SCHEDULE[0];

  const handleMatchSelect = (matchId: string) => {
    setActiveMatchId(matchId);
    setDropdownOpen(false);
  };

  const tabs = [
    { id: 'dashboard', label: 'Match Feed' },
    { id: 'predict', label: 'Predictions' },
    { id: 'polls', label: 'Polls & Cheers' },
    { id: 'fanzone', label: 'Fan Zone' },
    { id: 'stats', label: 'Analytics' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0A0C10]/80 backdrop-blur-md border-b border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand logo & Match selector dropdown */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Elegant CricPulse Box Icon from Sleek Interface Theme */}
            <div className="w-10 h-10 bg-[#FFCB05] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,203,5,0.3)] shrink-0 select-none">
              <div className="text-black font-black text-xl italic font-display">CP</div>
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-xl text-white block leading-none">
                Cric<span className="text-[#FFCB05]">Pulse</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 mt-1 block leading-none">
                IPL Fan Hub
              </span>
            </div>

            {/* Red Live Pulse Badge from Sleek Interface HTML */}
            <div className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">Live</span>
            </div>
          </div>

          {/* Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-200 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <span className="font-semibold text-white">
                {activeSchedule.homeTeam} vs {activeSchedule.awayTeam}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                activeSchedule.status === 'live'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : activeSchedule.status === 'finished'
                  ? 'bg-zinc-500/20 text-zinc-400'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}>
                {activeSchedule.status}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 md:left-0 mt-2 w-72 rounded-xl bg-zinc-950/95 border border-white/15 shadow-2xl p-2 backdrop-blur-xl z-[999]">
                <div className="text-[9px] font-mono text-zinc-500 px-3 py-1 uppercase tracking-widest border-b border-white/5 mb-1">
                  Select Active Match
                </div>
                {MATCHES_SCHEDULE.map(m => (
                  <button
                    key={m.id}
                    onClick={() => handleMatchSelect(m.id)}
                    className={`w-full text-left p-2.5 rounded-lg hover:bg-white/5 transition-all flex items-center justify-between cursor-pointer ${
                      activeMatchId === m.id ? 'bg-white/10 font-bold border border-white/10' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{m.homeTeam} vs {m.awayTeam}</span>
                        <span className={`text-[8px] uppercase font-mono px-1 rounded ${
                          m.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 truncate max-w-[210px]">{m.venue}</div>
                    </div>
                    <div className="text-[9px] font-mono font-bold text-zinc-500 whitespace-nowrap">
                      {m.homeTeam === 'CSK' ? '💛' : m.homeTeam === 'RCB' ? '❤️' : m.homeTeam === 'KKR' ? '💜' : m.homeTeam === 'GT' ? '💙' : m.homeTeam === 'SRH' ? '🧡' : '⚡'}
                    </div>
                  </button>
                ))}
                
                <div className="border-t border-white/5 mt-1 pt-1 flex justify-between px-2">
                  <button 
                    onClick={() => { resetAllStats(); setDropdownOpen(false); }}
                    className="flex items-center gap-1 text-[9px] text-zinc-500 hover:text-zinc-300 py-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset User stats
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Desktop Inline) */}
        <div className="hidden lg:flex items-center gap-6">
          {tabs.map(t => {
            const isActive = currentTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setCurrentTab(t.id)}
                className={`text-sm font-semibold uppercase tracking-wider relative py-1 cursor-pointer transition-all ${
                  isActive 
                    ? 'text-[#FFCB05] font-extrabold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#FFCB05] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* User stats widget & profile avatar */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {/* Simulation controller */}
          {match && match.status === 'live' && (
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 pl-2.5 pr-1.5 py-1 rounded-full text-xs">
              <span className="flex h-2 w-2 relative">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-red-400' : 'bg-zinc-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isSimulating ? 'bg-red-500' : 'bg-zinc-500'}`}></span>
              </span>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                {isSimulating ? 'Simulating' : 'Paused'}
              </span>
              <button
                onClick={toggleSimulation}
                className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase transition-all border border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white cursor-pointer ml-1"
              >
                {isSimulating ? 'Pause' : 'Start'}
              </button>
            </div>
          )}

          {/* Points */}
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(255,203,5,0.05)]">
            <Radio className="w-3.5 h-3.5 text-[#FFCB05]" />
            <span className="text-xs text-zinc-400 font-medium">Points:</span>
            <span className="text-xs font-mono font-extrabold text-[#FFCB05]">{userPoints}</span>
          </div>

          {/* Streak */}
          {userStreak > 0 && (
            <div className="flex items-center gap-1 bg-red-500/15 border border-red-500/30 px-3 py-1.5 rounded-full animate-bounce">
              <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span className="text-xs font-mono font-black text-red-400">{userStreak} Streak</span>
            </div>
          )}

          {/* User Profile display info (Viewing as Yash_FanCSK) */}
          <div className="flex items-center gap-2.5 border-l border-white/10 pl-3.5">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] text-slate-500 uppercase font-black leading-none mb-0.5">Viewing as</p>
              <p className="text-xs text-white font-bold leading-none">Yash_FanCSK</p>
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-[#FFCB05] p-0.5 shrink-0 select-none">
              <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-[#FFCB05] font-display">
                YF
              </div>
            </div>
          </div>
        </div>

      </div>
    </nav>
  );
};

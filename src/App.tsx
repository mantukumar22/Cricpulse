/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MatchProvider, useMatch } from './contexts/MatchContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { LiveScoreCard } from './components/dashboard/LiveScoreCard';
import { LiveAICommentary } from './components/dashboard/LiveAICommentary';
import { BallByBall } from './components/dashboard/BallByBall';
import { MatchMoments } from './components/dashboard/MatchMoments';
import { PredictionGames } from './components/predict/PredictionGames';
import { PollsAndReactions } from './components/polls/PollsAndReactions';
import { FanZoneChat } from './components/fanzone/FanZoneChat';
import { StatsDashboard } from './components/stats/StatsDashboard';
import { Flame, Trophy, Info, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Lightweight, responsive CSS falling particles overlay
const ConfettiRain: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {Array.from({ length: 45 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const duration = 2.5 + Math.random() * 2.5;
        const size = Math.floor(Math.random() * 4) + 6; // 6px to 10px
        const shape = Math.random() < 0.5 ? 'rounded-full' : 'rounded-sm';
        const colors = [
          'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)]',
          'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]',
          'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]',
          'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]',
          'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
          'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <div
            key={i}
            className={`absolute top-0 animate-[fall_linear_infinite] ${shape} ${color}`}
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        );
      })}
    </div>
  );
};

// Internal Page Navigator Container
const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const {
    toast,
    setToast,
    showConfetti,
    setShowConfetti
  } = useMatch();

  // Handle Confetti Timeout
  useEffect(() => {
    if (showConfetti) {
      const t = setTimeout(() => {
        setShowConfetti(false);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [showConfetti, setShowConfetti]);

  // Handle Toast Timeout
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [toast, setToast]);

  // Toggle visible view
  const renderTabContent = () => {
    switch (currentTab) {
      case 'predict':
        return <PredictionGames />;
      case 'polls':
        return <PollsAndReactions />;
      case 'fanzone':
        return <FanZoneChat />;
      case 'stats':
        return <StatsDashboard />;
      case 'dashboard':
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <LiveScoreCard />
              <LiveAICommentary />
              <BallByBall />
            </div>
            <div className="h-fit">
              <MatchMoments />
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0C10] text-[#F3F4F6] flex flex-col pb-24 md:pb-12 lg:pb-16">
      
      {/* Top Header Selector and Stats */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main viewport Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 md:py-8 overflow-hidden">
        
        {/* Dynamic Content Frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Bottom Info Rail from Sleek Interface Theme */}
      <footer className="hidden md:flex h-10 bg-slate-950/80 border-t border-white/10 items-center px-6 justify-between text-[10px] font-bold shrink-0 fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md">
        <div className="flex gap-6 items-center text-slate-500">
          <span className="text-[#FFCB05] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFCB05] animate-pulse"></span>
            ● LIVE CONNECTED
          </span>
          <span className="font-mono">LATENCY: 142ms</span>
          <span className="font-mono">STREAM SYNC: AUTO</span>
        </div>
        <div className="flex gap-4">
          <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white font-mono">MI REVIEWS: 1 LEFT</span>
          <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white font-mono">CSK REVIEWS: 2 LEFT</span>
        </div>
      </footer>

      {/* Mobile Anchor Navigation */}
      <BottomNav currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Dynamic Celebration Showers */}
      {showConfetti && <ConfettiRain />}

      {/* Global alert notifications (Toast) */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-12 left-4 right-4 md:left-auto md:right-5 md:w-96 z-[99999] animate-slide-down">
          <div className={`p-4 rounded-xl border shadow-2xl flex items-start gap-3 backdrop-blur-xl ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300'
              : toast.type === 'error'
              ? 'bg-red-950/95 border-red-500/30 text-red-300'
              : 'bg-zinc-950/95 border-white/10 text-zinc-300'
          }`}>
            <div className="pt-0.5 shrink-0">
              {toast.type === 'success' ? (
                <Trophy className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'error' ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <Info className="w-5 h-5 text-[var(--team-primary)]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

    </main>
  );
};

export default function App() {
  return (
    <MatchProvider>
      <MainLayout />
    </MatchProvider>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { Sparkle, RefreshCw } from 'lucide-react';

export const BallByBall: React.FC = () => {
  const { match } = useMatch();

  if (!match || match.status !== 'live') return null;

  // Render ball item based on dynamic colors
  const getBallStyle = (ball: string) => {
    if (ball.includes('W')) {
      return {
        bg: 'bg-red-500 text-white border-red-400 font-black scale-105 shadow-md shadow-red-500/20',
        label: 'W'
      };
    }
    if (ball.includes('6')) {
      return {
        bg: 'bg-orange-500 text-white border-orange-400 font-extrabold scale-102 shadow-sm shadow-orange-500/10',
        label: '6'
      };
    }
    if (ball.includes('4')) {
      return {
        bg: 'bg-yellow-500 text-black border-yellow-300 font-black scale-101 shadow-sm shadow-yellow-500/15',
        label: '4'
      };
    }
    if (ball === '0') {
      return {
        bg: 'bg-zinc-800/60 text-zinc-500 border-white/5 font-semibold',
        label: '•'
      };
    }
    if (ball.includes('wd') || ball.includes('nb')) {
      return {
        bg: 'bg-purple-950 text-purple-300 border-purple-800/40 text-[10px] font-bold',
        label: ball
      };
    }
    return {
      bg: 'bg-blue-950/60 text-blue-300 border-blue-800/20 font-bold',
      label: ball
    };
  };

  const ballCount = match.recentBalls.length;

  return (
    <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-4 mb-6">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <Sparkle className="w-4 h-4 text-[var(--team-primary)]" />
          <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">This Over Timeline</span>
          <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-0.5 rounded">
            Over {match.oversCompleted}
          </span>
        </div>
        <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 uppercase select-none">
          {ballCount === 0 ? 'Bowler walking to run-up...' : `${ballCount} balls bowled`}
        </div>
      </div>

      {/* Row of balls */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-1">
        
        {/* Placeholder if empty */}
        {ballCount === 0 && (
          <div className="flex items-center justify-center gap-2 w-full py-4 bg-black/10 rounded-xl border border-dashed border-white/5 text-zinc-500 text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--opp-primary)]" />
            <span>Over started. Bowler ready to run up...</span>
          </div>
        )}

        {/* List of balls */}
        {match.recentBalls.map((ballVal, index) => {
          const style = getBallStyle(ballVal);
          const isLatest = index === ballCount - 1;

          return (
            <div 
              key={`${ballVal}-${index}`} 
              className="flex flex-col items-center gap-1 relative"
            >
              <div 
                className={`
                  w-10 h-10 rounded-full border flex items-center justify-center text-xs transition-all duration-300
                  ${style.bg}
                  ${isLatest ? 'ring-2 ring-[var(--team-primary)] ring-offset-2 ring-offset-zinc-950 animate-[pulse_1s_infinite]' : ''}
                `}
              >
                {style.label}
              </div>
              <span className="text-[8px] font-mono text-zinc-650 tracking-tighter">
                Ball {index + 1}
              </span>

              {/* Glowing dot for highlights */}
              {isLatest && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--team-accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--team-accent)]"></span>
                </span>
              )}
            </div>
          );
        })}

        {/* Remaining empty outlines */}
        {ballCount > 0 && ballCount < 6 && (
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-zinc-800" />
            {Array.from({ length: 6 - ballCount }).map((_, i) => (
              <div 
                key={i} 
                className="w-10 h-10 rounded-full border border-dashed border-white/5 flex items-center justify-center text-[10px] text-zinc-500 select-none font-mono"
              >
                {ballCount + i + 1}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

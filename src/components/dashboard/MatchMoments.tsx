/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { MatchMoment } from '../../types';
import { Sparkles, MessageCircle, Flame, Target, Star, Volume2 } from 'lucide-react';

export const MatchMoments: React.FC = () => {
  const { moments } = useMatch();

  const getMomentIcon = (type: MatchMoment['type']) => {
    switch (type) {
      case 'wicket':
        return <Target className="w-4 h-4 text-red-500" />;
      case 'six':
        return <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />;
      case 'four':
        return <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" />;
      case 'milestone':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Volume2 className="w-4 h-4 text-blue-400" />;
    }
  };

  const getMomentBadgeColor = (type: MatchMoment['type']) => {
    switch (type) {
      case 'wicket':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'six':
        return 'bg-orange-500/10 border-orange-500/10 text-orange-400';
      case 'four':
        return 'bg-yellow-500/10 border-yellow-500/10 text-yellow-400';
      case 'milestone':
        return 'bg-purple-500/10 border-purple-500/10 text-purple-400';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Title */}
      <div className="flex items-center gap-1.5 px-1 py-0.5">
        <Sparkles className="w-4.5 h-4.5 text-[var(--team-accent)]" />
        <h4 className="font-bold text-white text-sm uppercase tracking-wide">Key Match Moments</h4>
      </div>

      {moments.length === 0 ? (
        <div className="text-center py-10 bg-black/20 border border-dashed border-white/5 rounded-2xl text-zinc-500 text-xs">
          Match is underway. Key boundaries and wickets will be log details here!
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
          {moments.map(m => (
            <div
              key={m.id}
              className="bg-zinc-950/45 hover:bg-zinc-900/50 border border-white/5 rounded-xl p-3.5 transition-all flex gap-3 relative overflow-hidden"
            >
              {/* Colored left strip */}
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${
                m.type === 'wicket' ? 'bg-red-500' : m.type === 'six' ? 'bg-orange-500' : m.type === 'four' ? 'bg-yellow-500' : 'bg-zinc-700'
              }`} />

              <div className="pt-0.5 shrink-0">
                <div className={`p-2 rounded-lg border flex items-center justify-center ${getMomentBadgeColor(m.type)}`}>
                  {getMomentIcon(m.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2.5 mb-1 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-xs tracking-tight">
                      {m.title}
                    </span>
                    <span className="text-[9px] font-mono bg-white/5 border border-white/5 text-zinc-400 px-1.5 py-0.5 rounded">
                      Over {m.over}.{m.ball}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {m.timestamp}
                  </span>
                </div>

                <p className="text-zinc-400 text-xs leading-relaxed mb-2.5">
                  {m.desc}
                </p>

                {/* Reaction badge */}
                <div className="flex items-center gap-2.5 font-mono text-[10px] text-zinc-500">
                  <button className="flex items-center gap-1 bg-white/3 border border-white/5 px-2.5 py-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer">
                    🔥 Cheer Pulse
                  </button>
                  <span className="text-[9px] text-zinc-650">•</span>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-zinc-600" />
                    <span>{m.reactionCount} fan reactions</span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

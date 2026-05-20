/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { getTeamTheme } from '../../data/mock-teams';
import { GlassCard } from '../ui/GlassCard';
import { Flame, HelpCircle, Heart, Users2, ShieldQuestion, Send } from 'lucide-react';

export const PollsAndReactions: React.FC = () => {
  const {
    match,
    polls,
    submitVote,
    supportSplit,
    userPoints
  } = useMatch();

  const [reactionsCounts, setReactionsCounts] = useState<{ [emoji: string]: number }>({
    '🔥': 148,
    '👏': 92,
    '🎉': 240,
    '😱': 56,
    '💪': 105
  });

  const [activeFloatingEmojis, setActiveFloatingEmojis] = useState<{ id: number; symbol: string; left: number }[]>([]);

  if (!match) return null;

  const homeTheme = getTeamTheme(match.homeTeam);
  const awayTheme = getTeamTheme(match.awayTeam);

  // Trigger floating emoji animation
  const handleEmojiReact = (symbol: string) => {
    // Increment reactions stats
    setReactionsCounts(prev => ({ ...prev, [symbol]: prev[symbol] + 1 }));

    // Spawn a physical symbol with random horizontal coordinate
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 80) + 10; // offset percentage
    setActiveFloatingEmojis(prev => [...prev, { id, symbol, left }]);

    // Remove emoji after anim finishes
    setTimeout(() => {
      setActiveFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 1800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative">
      
      {/* Floating canvas containers for reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {activeFloatingEmojis.map(e => (
          <span
            key={e.id}
            className="absolute bottom-10 text-3xl transition-all duration-1000 animate-float-fade"
            style={{ 
              left: `${e.left}%`,
            }}
          >
            {e.symbol}
          </span>
        ))}
      </div>

      {/* left 2 cols: Supportive ratio & Active Polls */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        
        {/* Support Split Gauge Panel */}
        <GlassCard className="border border-white/5 relative overflow-hidden bg-gradient-to-r from-zinc-950 via-zinc-950 to-black">
          <div className="flex items-center gap-2 mb-4">
            <Users2 className="w-4.5 h-4.5 text-[var(--team-primary)]" />
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">Live Audience Support Split</h4>
          </div>

          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: homeTheme.primary }} />
              <span className="text-xs font-black text-white">{homeTheme.shortName} Fans</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white text-right">{awayTheme.shortName} Fans</span>
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: awayTheme.primary }} />
            </div>
          </div>

          {/* Double-sided Progress Meter */}
          <div className="w-full h-4 rounded-full bg-zinc-900 border border-white/5 overflow-hidden flex shadow-inner">
            <div 
              className="h-full duration-500 transition-all shadow-[inset_-10px_0_10px_rgba(0,0,0,0.3)]"
              style={{
                backgroundColor: homeTheme.primary,
                width: `${supportSplit[match.homeTeam]}%`
              }}
            />
            <div 
              className="h-full duration-500 transition-all"
              style={{
                backgroundColor: awayTheme.primary,
                width: `${supportSplit[match.awayTeam]}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono font-bold mt-2 font-mono">
            <span style={{ color: homeTheme.primary }}>{supportSplit[match.homeTeam]}% Support</span>
            <span className="text-zinc-650">•</span>
            <span style={{ color: awayTheme.primary }}>{supportSplit[match.awayTeam]}% Support</span>
          </div>
        </GlassCard>

        {/* Live Contextual Polls list */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 px-0.5">
            <ShieldQuestion className="w-4.5 h-4.5 text-yellow-500" />
            <h4 className="font-black text-white text-xs uppercase tracking-wider">Live Fan Opinion Polls</h4>
          </div>

          {polls.length === 0 ? (
            <div className="text-center py-8 bg-zinc-900/10 border border-dashed border-white/5 rounded-2xl text-zinc-550 text-xs">
              No active polls. New poll questions trigger here automatically based on match progressions.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {polls.map(poll => {
                const isVoted = poll.userVoteIndex !== undefined;

                return (
                  <GlassCard 
                    key={poll.id} 
                    className="border border-white/5 bg-zinc-950/40 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold tracking-wider text-yellow-400 bg-yellow-400/10 uppercase">
                        {isVoted ? 'Voted' : 'Active Poll'}
                      </span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {poll.totalVotes} entries
                      </span>
                    </div>

                    <h5 className="font-bold text-white text-sm leading-snug mb-4">
                      {poll.question}
                    </h5>

                    {/* Options list */}
                    <div className="flex flex-col gap-2">
                      {poll.options.map((opt, oIdx) => {
                        const optVotesCount = poll.votes[oIdx];
                        const percentage = poll.totalVotes > 0 
                          ? Math.round((optVotesCount / poll.totalVotes) * 100) 
                          : 0;

                        if (isVoted) {
                          const userSelected = poll.userVoteIndex === oIdx;
                          return (
                            <div 
                              key={opt}
                              className={`relative overflow-hidden rounded-xl border p-3 flex items-center justify-between text-xs font-medium ${
                                userSelected 
                                  ? 'border-[var(--team-primary)] bg-black/50' 
                                  : 'border-white/5 bg-black/20'
                              }`}
                            >
                              {/* Slid-in progress loader */}
                              <div 
                                className="absolute left-0 top-0 bottom-0 -z-10 bg-[var(--team-primary-alpha)] transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              />
                              <span className="font-bold text-zinc-200">
                                {opt} {userSelected && '🗳️'}
                              </span>
                              <span className="font-mono font-extrabold text-zinc-400">
                                {percentage}% ({optVotesCount} votes)
                              </span>
                            </div>
                          );
                        }

                        // Unvoted state (clickable buttons)
                        return (
                          <button
                            key={opt}
                            onClick={() => submitVote(poll.id, oIdx)}
                            className="w-full text-left px-4 py-2.5 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 font-semibold text-xs text-zinc-200 hover:text-white transition-all cursor-pointer hover:border-[var(--team-primary)]/40 hover:translate-x-1"
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!isVoted ? (
                      <p className="text-[10px] text-zinc-650 font-mono text-center mt-3 mt-4">
                        🗳️ Voting awards you <strong className="text-[var(--team-primary)] font-bold">+20 Points</strong> to use for prediction games!
                      </p>
                    ) : (
                      <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-zinc-400 border-t border-white/5 pt-2 flex-wrap">
                        <span>Poll closes automatically soon</span>
                        <span className="bg-emerald-500/10 text-emerald-400 px-1.5 rounded">Engaged</span>
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Right 1 col: Interactive emoji reactions deck */}
      <GlassCard className="border border-white/5 bg-zinc-950/80 h-fit">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5 justify-between">
          <div className="flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-orange-500" />
            <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Stadium Cheers</h4>
          </div>
          <span className="text-[8px] font-mono bg-white/5 px-2 py-0.5 rounded uppercase tracking-wider text-zinc-500">
            Click to cheer
          </span>
        </div>

        <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
          Tap visual emoji controllers below to send stadium sound cheers! This spikes the fan excitement and spawns live elements on-screen!
        </p>

        {/* Emojis rows */}
        <div className="flex flex-col gap-3">
          {[
            { tag: '🔥', text: 'Hot Boundary', desc: 'Sixes and boundaries' },
            { tag: '👏', text: 'Appreciation Clap', desc: 'Good timing shots' },
            { tag: '🎉', text: 'Stadium Celebrate', desc: 'Dhoni entry and milestones' },
            { tag: '😱', text: 'Stunned Shock', desc: 'Controversial wickets' },
            { tag: '💪', text: 'Paltan Power Cheer', desc: 'Bumper overs' }
          ].map(emoji => (
            <button
              key={emoji.tag}
              onClick={() => handleEmojiReact(emoji.tag)}
              className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-black/45 hover:bg-black/80 hover:border-white/10 transition-all text-left cursor-pointer group active:scale-95"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl group-hover:scale-130 transition-transform duration-300 block">
                  {emoji.tag}
                </span>
                <div>
                  <span className="text-xs font-bold text-zinc-200 block">{emoji.text}</span>
                  <span className="text-[9px] text-zinc-650">{emoji.desc}</span>
                </div>
              </div>

              {/* Counts display */}
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-zinc-400 block group-hover:text-yellow-400 transition-colors">
                  {reactionsCounts[emoji.tag]}
                </span>
                <span className="text-[8px] font-mono font-medium text-zinc-550 uppercase">Clicks</span>
              </div>
            </button>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};

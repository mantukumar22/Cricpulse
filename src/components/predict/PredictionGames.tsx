/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { GlassCard } from '../ui/GlassCard';
import { Award, Flame, User, CheckCircle2, XCircle, ChevronRight, HelpCircle, Trophy } from 'lucide-react';

export const PredictionGames: React.FC = () => {
  const {
    match,
    predictions,
    submitPrediction,
    userPoints,
    userStreak,
    isSimulating
  } = useMatch();

  const [activeTab, setActiveTab] = useState<'ball' | 'over' | 'match'>('ball');
  const [selectedBallGuess, setSelectedBallGuess] = useState<string>('');
  const [overRunsGuess, setOverRunsGuess] = useState<number>(8);
  const [seriesWinner, setSeriesWinner] = useState<string>('');

  // Sample Leaderboard Players alongside User points
  const leaderboardPlayers = [
    { username: 'Dhoni_Therapy', points: 640, streak: 3, avatarColor: 'bg-yellow-500' },
    { username: 'PaltanCaptain', points: 510, streak: 5, avatarColor: 'bg-blue-500' },
    { username: 'You (PaltanFan)', points: userPoints, streak: userStreak, avatarColor: 'bg-gradient-to-r from-yellow-400 to-red-500', isUser: true },
    { username: 'KohliIsKing_18', points: 410, streak: 0, avatarColor: 'bg-red-500' },
    { username: 'Russell_Muscle', points: 380, streak: 1, avatarColor: 'bg-purple-500' },
    { username: 'SkyHigh360', points: 310, streak: 0, avatarColor: 'bg-blue-400' }
  ].sort((a, b) => b.points - a.points);

  const getRankEmoji = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return `#${rank + 1}`;
  };

  const handlePredictBall = (guess: string) => {
    setSelectedBallGuess(guess);
    submitPrediction(guess, 'ball', '');
  };

  const handlePredictOver = () => {
    submitPrediction(`${overRunsGuess} runs`, 'over', `Over ${match ? match.oversCompleted + 1 : 'Next'}`);
  };

  const handlePredictMatch = (winner: string) => {
    setSeriesWinner(winner);
    submitPrediction(`Winner: ${winner}`, 'match', 'Match Winner Match outcome');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Play Controls panel (Left 2 cols) */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        
        {/* Tab filters */}
        <div className="flex bg-zinc-950/60 border border-white/5 p-1 rounded-xl w-full">
          <button
            onClick={() => setActiveTab('ball')}
            className={`flex-1 py-2 text-center text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'ball' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            🎯 Next Ball
          </button>
          <button
            onClick={() => setActiveTab('over')}
            className={`flex-1 py-2 text-center text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'over' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            ⏱️ Over Predictor
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`flex-1 py-2 text-center text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'match' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            🏆 Match Odds
          </button>
        </div>

        {/* TAB 1: Next Ball Predictor */}
        {activeTab === 'ball' && (
          <GlassCard className="border border-white/5 select-none hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="font-extrabold text-white text-base">Next Ball: What happens?</h4>
                <p className="text-zinc-400 text-xs mt-1">
                  Predict the upcoming ball. Cost: <strong className="text-yellow-400 font-mono">15 pts</strong> per guess. Correct guesses pay big dividends!
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                Live In-play
              </span>
            </div>

            {match && match.status !== 'live' ? (
              <div className="text-center py-8 bg-zinc-900/20 border border-dashed border-white/5 rounded-xl text-zinc-500 text-xs text-center">
                Next Ball Predictor is active only during LIVE play matches.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                {[
                  { value: 'Dot', odds: '1.4x', icon: '•', desc: 'Dot ball', points: '+30 pts', style: 'border-white/10 hover:border-zinc-400' },
                  { value: 'Runs', odds: '1.8x', icon: '1-2', desc: 'Single/Double', points: '+30 pts', style: 'border-blue-500/20 hover:border-blue-400' },
                  { value: '4', odds: '3.5x', icon: '4', desc: 'Four boundary', points: '+80 pts', style: 'border-yellow-500/20 hover:border-yellow-400' },
                  { value: '6', odds: '6.0x', icon: '6', desc: 'Six boundary', points: '+120 pts', style: 'border-orange-500/20 hover:border-orange-400' },
                  { value: 'Wicket', odds: '8.5x', icon: 'W', desc: 'Wicket falls', points: '+100 pts', style: 'border-red-500/20 hover:border-red-400' },
                  { value: 'Boundary', odds: '2.5x', icon: '4/6', desc: 'Any Boundary', points: '+50 pts', style: 'border-emerald-500/20 hover:border-emerald-400' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handlePredictBall(opt.value)}
                    disabled={userPoints < 15}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all bg-black/40 hover:bg-black/60 group cursor-pointer active:scale-97 disabled:opacity-45 disabled:pointer-events-none ${opt.style}`}
                  >
                    <span className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center font-bold text-xs text-white mb-2 font-mono">
                      {opt.icon}
                    </span>
                    <span className="text-xs font-bold text-white block">{opt.value}</span>
                    <span className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</span>
                    <div className="flex items-center justify-between gap-2.5 w-full mt-2.5 pt-2 border-t border-white/5 text-[9px] font-mono">
                      <span className="text-zinc-500">Odds: {opt.odds}</span>
                      <span className="text-yellow-400 font-bold">{opt.points}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="text-[10px] text-zinc-500 font-mono text-center select-none bg-black/15 py-2 rounded-lg">
              🎯 Locked predictions evaluate automatically the instant the next ball outcome is simulated in real-time.
            </div>
          </GlassCard>
        )}

        {/* TAB 2: Over Predictor */}
        {activeTab === 'over' && (
          <GlassCard className="border border-white/5 select-none active:border-white/10 transition-colors">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="font-extrabold text-white text-base">Over Predictor: Runs Target</h4>
                <p className="text-zinc-400 text-xs mt-1">
                  Predict total runs conceded/scored in the upcoming over. Cost: <strong className="text-yellow-400 font-mono">30 pts</strong>.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
                Active In-Play
              </span>
            </div>

            <div className="bg-black/30 border border-white/5 p-4 rounded-xl flex flex-col items-center mb-5">
              <span className="text-zinc-500 text-xs mb-1 uppercase font-mono">Your prediction for next Over runs</span>
              <div className="flex items-baseline gap-1.5 mb-6">
                <span className="text-4xl font-extrabold text-[var(--team-primary)] font-mono">{overRunsGuess}</span>
                <span className="text-zinc-400 text-sm font-semibold">runs</span>
              </div>

              {/* Slider runs */}
              <input 
                type="range"
                min="0"
                max="24"
                step="1"
                value={overRunsGuess}
                onChange={(e) => setOverRunsGuess(parseInt(e.target.value, 10))}
                className="w-full accent-[var(--team-primary)] bg-zinc-800 rounded-lg cursor-pointer h-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--team-primary)]"
              />
              <div className="flex items-center justify-between w-full mt-2.5 text-[10px] font-mono text-zinc-500">
                <span>0 runs • Maiden</span>
                <span>8 runs • Avg</span>
                <span>24 runs+ • carnage</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePredictOver}
                disabled={userPoints < 30}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--team-primary)] to-[var(--team-accent)] text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-45 disabled:pointer-events-none transition-all cursor-pointer"
              >
                Lock In Over Bet (30 pts)
              </button>
            </div>
          </GlassCard>
        )}

        {/* TAB 3: Pre-Match / Winner Odds */}
        {activeTab === 'match' && (
          <GlassCard className="border border-white/5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h4 className="font-extrabold text-white text-base">Pre-Match Overall Odds</h4>
                <p className="text-zinc-400 text-xs mt-1">
                  Predict series or match outcomes before final conclusion. Cost: <strong className="text-yellow-400 font-mono">50 pts</strong>. Correct payouts: <strong className="text-emerald-400">+250 pts</strong>!
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded">
                Season Series
              </span>
            </div>

            {match && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div className="border border-white/5 rounded-xl p-4 bg-black/40 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-zinc-300 text-xs uppercase font-mono tracking-wide mb-2">Match Winner Outright</h5>
                    <p className="text-zinc-500 text-[10px]">Select who will win this encounter outright.</p>
                  </div>
                  <div className="flex gap-2.5 mt-4">
                    <button 
                      onClick={() => handlePredictMatch(match.homeTeam)}
                      disabled={userPoints < 50}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[var(--team-primary)]/10 to-[var(--team-primary)]/20 hover:from-[var(--team-primary)]/20 hover:to-[var(--team-primary)]/30 border border-[var(--team-primary)]/20 text-xs text-white font-bold transition-all cursor-pointer"
                    >
                      {match.homeTeam} (1.68x)
                    </button>
                    <button 
                      onClick={() => handlePredictMatch(match.awayTeam)}
                      disabled={userPoints < 50}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[var(--opp-primary)]/10 to-[var(--opp-primary)]/20 hover:from-[var(--opp-primary)]/10 hover:to-[var(--opp-primary)]/30 border border-[var(--opp-primary)]/20 text-xs text-white font-bold transition-all cursor-pointer"
                    >
                      {match.awayTeam} (2.12x)
                    </button>
                  </div>
                </div>

                <div className="border border-white/5 rounded-xl p-4 bg-black/40 flex flex-col justify-between">
                  <div>
                    <h5 className="font-bold text-zinc-300 text-xs uppercase font-mono mb-2">Batter of the Encounter</h5>
                    <p className="text-zinc-500 text-[10px]">Select batsman to score highest total runs today.</p>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-4">
                    <button 
                      onClick={() => handlePredictMatch('Ruturaj Gaikwad')}
                      disabled={userPoints < 50}
                      className="text-left px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between cursor-pointer"
                    >
                      <span>Ruturaj Gaikwad (CSK)</span>
                      <span className="font-mono font-bold text-yellow-500">3.4x odds</span>
                    </button>
                    <button 
                      onClick={() => handlePredictMatch('Rohit Sharma')}
                      disabled={userPoints < 50}
                      className="text-left px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between cursor-pointer"
                    >
                      <span>Rohit Sharma (MI)</span>
                      <span className="font-mono font-bold text-yellow-500">4.1x odds</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        )}

        {/* Prediction lock-ins history list */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <Award className="w-4.5 h-4.5 text-yellow-400" />
            <h4 className="font-black text-white text-xs uppercase tracking-wider">Your Pending Prediction Bets</h4>
          </div>

          {predictions.length === 0 ? (
            <div className="text-center py-6 bg-zinc-900/15 border border-dashed border-white/5 rounded-2xl text-zinc-550 text-xs select-none">
              No locked predictions yet. Place predictions above to start accumulating points!
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 max-h-[190px] overflow-y-auto pr-1">
              {predictions.map(p => (
                <div
                  key={p.id}
                  className="bg-black/30 border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${
                      p.status === 'correct' 
                        ? 'bg-emerald-500/10 text-emerald-400' 
                        : p.status === 'incorrect' 
                        ? 'bg-red-500/10 text-red-400' 
                        : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      {p.status === 'correct' ? <CheckCircle2 className="w-4 h-4" /> : p.status === 'incorrect' ? <XCircle className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white uppercase">{p.type} Prediction</span>
                        <span className="text-[10px] font-mono bg-white/5 text-zinc-500 px-1.5 py-0.5 rounded">
                          {p.targetValue}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 mt-0.5 block">
                        Your Choice: <strong className="text-white">{p.predictionValue}</strong>
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                      p.status === 'correct' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : p.status === 'incorrect' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/15 animate-shake' 
                        : 'bg-zinc-900 text-zinc-400'
                    }`}>
                      {p.status === 'correct' ? `+${p.pointsEarned} pts` : p.status === 'incorrect' ? 'Wrong' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Real-time Leaders points Dashboard (Right 1 col) */}
      <GlassCard className="border border-white/5 h-fit pb-4 bg-gradient-to-br from-zinc-950 to-zinc-900">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
          <Trophy className="w-4.5 h-4.5 text-yellow-400" />
          <h4 className="font-extrabold text-white text-sm uppercase tracking-wide">Live Fan Leaderboard</h4>
        </div>

        <div className="flex flex-col gap-2">
          {leaderboardPlayers.map((player, idx) => (
            <div
              key={player.username}
              className={`flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                player.isUser 
                  ? 'bg-zinc-800/80 border-yellow-500-20 ring-1 ring-yellow-500/30' 
                  : 'bg-black/30 border-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono text-xs font-bold text-zinc-500 w-5 shrink-0 block text-center">
                  {getRankEmoji(idx)}
                </span>
                
                {/* Avatar color bubble */}
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-black font-sans uppercase ${player.avatarColor}`}>
                  {player.username.substring(0, 2)}
                </div>

                <div className="min-w-0 pr-1">
                  <span className={`text-xs block truncate ${player.isUser ? 'font-bold text-yellow-400' : 'text-zinc-300'}`}>
                    {player.username}
                  </span>
                  {player.streak > 0 && (
                    <span className="inline-flex items-center gap-0.5 text-[8px] font-mono text-red-400 font-bold bg-red-500/10 px-1 rounded">
                      <Flame className="w-2.5 h-2.5 text-red-500 fill-red-500" />
                      {player.streak} streak
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-zinc-200">
                  {player.points} <span className="text-[10px] text-zinc-500 font-normal">pts</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};

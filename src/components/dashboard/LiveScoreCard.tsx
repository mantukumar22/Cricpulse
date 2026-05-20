/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { getTeamTheme, TEAMS } from '../../data/mock-teams';
import { GlassCard } from '../ui/GlassCard';
import { 
  Zap, 
  Circle, 
  FastForward, 
  Play, 
  Pause, 
  ChevronRight, 
  MapPin, 
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Award,
  BookOpen,
  X
} from 'lucide-react';

export const LiveScoreCard: React.FC = () => {
  const { 
    match, 
    isSimulating, 
    toggleSimulation, 
    triggerNextBallManual, 
    simulationSpeed, 
    setSimulationSpeed,
    startMatchLive
  } = useMatch();

  const [countdown, setCountdown] = useState({ h: 1, m: 6, s: 33 });
  const [showSquads, setShowSquads] = useState(false);
  const [apiError, setApiError] = useState<{ key: string; message: string; route: string } | null>(null);
  const [checkingApi, setCheckingApi] = useState(false);

  // Live real-time countdown ticker to 7:30 PM IST (14:00 UTC)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Target today's 14:00 UTC (7:30 PM IST)
      const target = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 14, 0, 0));
      let diffMs = target.getTime() - now.getTime();
      
      // If 7:30 PM IST of today has already elapsed, calculate for tomorrow's 7:30 PM IST
      if (diffMs < 0) {
        target.setUTCDate(target.getUTCDate() + 1);
        diffMs = target.getTime() - now.getTime();
      }

      const totalSecs = Math.max(0, Math.floor(diffMs / 1000));
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      
      setCountdown({ h, m, s });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Run dynamic verification to catch API configuration exceptions on-demand
  const verifyAPIIntegrity = async () => {
    setCheckingApi(true);
    try {
      const response = await fetch("/api/cricket/matches");
      const data = await response.json();
      if (data.status === "failure" || data.error || (data.status !== "success" && data.message)) {
        setApiError({
          key: data.errorKey || "ERR_CRICKET_API_KEY_LIMIT",
          message: data.message || data.error || "Cricket Data API exceeded its threshold limit. Please verify your CRICKET_API_KEY value inside the settings panel.",
          route: "/api/cricket/matches"
        });
      } else {
        setApiError(null);
      }
    } catch (err: any) {
      setApiError({
        key: "ERR_CONNECTION_REFUSED_EXPRESS",
        message: err.message || "Failed to successfully connect to Express proxy backend on route /api/cricket/matches.",
        route: "/api/cricket/matches"
      });
    } finally {
      setCheckingApi(false);
    }
  };

  useEffect(() => {
    verifyAPIIntegrity();
  }, []);

  if (!match) return null;

  const homeTheme = getTeamTheme(match.homeTeam);
  const awayTheme = getTeamTheme(match.awayTeam);
  const battingTheme = getTeamTheme(match.battingTeam);
  const bowlingTheme = getTeamTheme(match.bowlingTeam);

  // Calculate current and target run rates
  const currentOverFloat = match.oversCompleted + (match.ballsCurrentOver / 6);
  const crr = currentOverFloat > 0 
    ? parseFloat((match.runs / currentOverFloat).toFixed(2)) 
    : 0.00;

  const rrr = match.target 
    ? parseFloat(((match.target - match.runs) / (20 - currentOverFloat) * 6).toFixed(2)) 
    : 8.45; // Simulated fallback

  // Render Upcoming State
  if (match.status === 'upcoming') {
    return (
      <div className="flex flex-col gap-5">
        {/* Dynamic API Integrity / Connection Exception Banner */}
        {apiError && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-950/40 via-red-900/10 to-black/80 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-down">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-wider bg-red-900/40 px-2 py-0.5 rounded border border-red-500/20">
                    {apiError.key}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">Route: {apiError.route}</span>
                </div>
                <p className="text-zinc-300 text-xs mt-1.5 leading-relaxed leading-normal">
                  {apiError.message}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={verifyAPIIntegrity}
                disabled={checkingApi}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-zinc-300 border border-white/5 uppercase tracking-wider cursor-pointer whitespace-nowrap active:scale-95 transition-all disabled:opacity-50"
              >
                {checkingApi ? "Tuning..." : "Retry Call"}
              </button>
              <button 
                onClick={() => setApiError(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <GlassCard className="overflow-hidden border border-white/10 relative p-6 mb-1 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black/90">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />
          
          <div className="flex flex-col items-center text-center py-4 relative z-10 animate-fade-in">
            <span className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-extrabold tracking-widest text-[#FFCB05] border border-yellow-500/30 bg-yellow-500/5 uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
              Match Starts Soon
            </span>

            {/* Countdown Widget */}
            <div className="mb-8 flex flex-col items-center">
              <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-widest mb-2.5">Kickoff Countdown</span>
              <div className="flex gap-2 items-center font-mono">
                <div className="bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-center shadow-2xl min-w-[62px]">
                  <span className="text-2xl font-black text-white block leading-none">{String(countdown.h).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mt-1">Hrs</span>
                </div>
                <span className="text-zinc-700 font-bold text-xl">:</span>
                <div className="bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-center shadow-2xl min-w-[62px]">
                  <span className="text-2xl font-black text-white block leading-none">{String(countdown.m).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mt-1">Min</span>
                </div>
                <span className="text-zinc-700 font-bold text-xl">:</span>
                <div className="bg-zinc-950 border border-white/5 rounded-xl px-4 py-2.5 text-center shadow-2xl min-w-[62px]">
                  <span className="text-2xl font-black text-yellow-500 block leading-none animate-pulse">{String(countdown.s).padStart(2, '0')}</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold block mt-1">Sec</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 md:gap-14 w-full max-w-lg mb-8">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-xl transition-all border border-white/15 hover:scale-105" 
                  style={{ backgroundColor: homeTheme.primary, color: '#000', boxShadow: `0 0 20px ${homeTheme.primary}20` }}
                >
                  {match.homeTeam}
                </div>
                <span className="font-bold text-white text-base mt-3 leading-tight">{homeTheme.name}</span>
                <span className="text-zinc-500 text-[10px] font-mono uppercase bg-white/2 border border-white/5 rounded px-2 py-0.5 mt-1.5">Host Club</span>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-850 border border-white/10 flex items-center justify-center text-zinc-400 font-black text-xs shadow-xl">
                  VS
                </div>
                <div className="h-10 w-[1px] bg-gradient-to-b from-zinc-805 to-transparent mt-2"></div>
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-xl border border-white/15 hover:scale-105" 
                  style={{ backgroundColor: awayTheme.primary, color: '#000', boxShadow: `0 0 20px ${awayTheme.primary}20` }}
                >
                  {match.awayTeam}
                </div>
                <span className="font-bold text-white text-base mt-3 leading-tight">{awayTheme.name}</span>
                <span className="text-zinc-500 text-[10px] font-mono uppercase bg-white/2 border border-white/5 rounded px-2 py-0.5 mt-1.5">Challenger</span>
              </div>
            </div>

            {/* Stadium Pitch, Weather conditions & Head-to-Head details row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl bg-black/40 border border-white/5 p-4 rounded-xl text-left text-zinc-300 text-xs mb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">🟢 Pitch Report</span>
                <span className="font-bold text-zinc-100 flex items-center gap-1.5 text-[11px]">
                  Flat Batsman Beauty
                </span>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  M. Chinnaswamy turf offers quick outfield and massive boundaries. Elite pacers strike early.
                </p>
              </div>
              <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">🌤️ Weather Sync</span>
                <span className="font-bold text-zinc-100 text-[11px]">28°C • Clear Sky</span>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Low wind speeds. Humidity is around 42% ensuring dry pitch play with minor dew in later overs.
                </p>
              </div>
              <div className="space-y-1 border-t md:border-t-0 md:border-l border-white/5 pt-3 md:pt-0 md:pl-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">📊 Head To Head (H2H)</span>
                <span className="font-bold text-zinc-100 text-[11px]">{match.homeTeam} 3 - 3 {match.awayTeam}</span>
                <p className="text-[10px] text-zinc-400 leading-snug">
                  Perfect tie over the last 6 fixtures. Deeply contested rivalry between both powerhouses!
                </p>
              </div>
            </div>

            <div className="border-t border-white/5 pt-5 w-full max-w-md">
              <div className="flex items-center justify-center gap-1.5 text-zinc-400 text-xs mb-2">
                <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                <span>{match.venue}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-zinc-300 text-sm font-semibold">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Today • {match.dateTime}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 items-center justify-center">
              {/* Commence Trigger to push match live and active scorecard! */}
              {startMatchLive && (
                <button 
                  onClick={startMatchLive}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-xl shadow-yellow-500/20 flex items-center gap-2 border-t border-white/20 font-sans"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  🎙️ Start Match Live
                </button>
              )}

              <button 
                onClick={() => setShowSquads(!showSquads)}
                className="px-5 py-3 rounded-xl border border-white/10 text-white font-bold text-xs uppercase hover:bg-white/5 transition-all cursor-pointer flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                {showSquads ? "Hide Field Lineups" : "View Field Lineups"}
              </button>
            </div>

            {/* Field squads drawer */}
            {showSquads && (
              <div className="w-full max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5 text-left animate-fade-in">
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-white block mb-2.5 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#EC1C24] inline-block" />
                    {match.homeTeam} Probable XI
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-400 font-mono">
                    {TEAMS[match.homeTeam]?.players.map((p, index) => (
                      <li key={p} className="flex justify-between border-b border-white/5 py-1 last:border-0 pl-1">
                        <span>{p}</span>
                        <span className="text-[10px] text-zinc-600">{index < 5 ? "Batsman" : index < 7 ? "All Rounder" : "Bowler"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/5">
                  <span className="text-xs font-bold text-white block mb-2.5 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-[#3A225D] inline-block" />
                    {match.awayTeam} Probable XI
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-400 font-mono">
                    {TEAMS[match.awayTeam]?.players.map((p, index) => (
                      <li key={p} className="flex justify-between border-b border-white/5 py-1 last:border-0 pl-1">
                        <span>{p}</span>
                        <span className="text-[10px] text-zinc-600">{index < 5 ? "Batsman" : index < 7 ? "All Rounder" : "Bowler"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </GlassCard>
      </div>
    );
  }

  // Render Finished State
  if (match.status === 'finished') {
    return (
      <GlassCard className="overflow-hidden border border-white/10 relative p-6 mb-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black/90">
        <div className="flex flex-col items-center text-center py-4 relative z-10">
          <span className="px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-zinc-400 border border-zinc-800 bg-zinc-900/50 uppercase mb-4">
            Match Finished
          </span>
          
          <h3 className="font-black text-white text-lg tracking-tight mb-2">GT won by 8 runs</h3>
          <p className="text-xs text-zinc-400 mb-6 max-w-md">{match.venue}</p>

          <div className="flex items-center justify-center gap-10 w-full max-w-sm mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-xl">{match.homeTeam}</span>
                <span className="text-zinc-400 text-sm">176/6</span>
              </div>
              <span className="text-[10px] text-zinc-500">20.0 Overs</span>
            </div>
            <div className="w-[1px] h-8 bg-zinc-800" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-white text-xl">{match.awayTeam}</span>
                <span className="text-zinc-400 text-sm">168/10</span>
              </div>
              <span className="text-[10px] text-zinc-500 text-red-400 font-bold font-mono">ALL OUT</span>
            </div>
          </div>

          <span className="text-xs text-zinc-400">🏆 Player of the Match: <strong className="text-white">Rashid Khan (GT)</strong> — 3/21 & 24(11)</span>
        </div>
      </GlassCard>
    );
  }

  // Render LIVE scorecard
  return (
    <div className="flex flex-col gap-5">
      {/* Dynamic API Integrity / Connection Exception Banner */}
      {apiError && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-gradient-to-r from-red-950/40 via-red-900/10 to-black/80 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-down">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-extrabold text-red-400 uppercase tracking-wider bg-red-900/40 px-2 py-0.5 rounded border border-red-500/20">
                  {apiError.key}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Route: {apiError.route}</span>
              </div>
              <p className="text-zinc-300 text-xs mt-1.5 leading-relaxed leading-normal">
                {apiError.message}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={verifyAPIIntegrity}
              disabled={checkingApi}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-zinc-300 border border-white/5 uppercase tracking-wider cursor-pointer whitespace-nowrap active:scale-95 transition-all disabled:opacity-50"
            >
              {checkingApi ? "Tuning..." : "Retry Call"}
            </button>
            <button 
              onClick={() => setApiError(null)}
              className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <GlassCard className="relative overflow-hidden border border-white/10 p-0 mb-6 bg-gradient-to-br from-zinc-950 via-zinc-950 to-black/95">
      {/* Dynamic Team Neon Glow Overlay */}
      <div 
        className="absolute top-0 right-0 w-80 h-40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-30" 
        style={{ backgroundColor: battingTheme.primary }}
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20 opacity-15"
        style={{ backgroundColor: bowlingTheme.primary }}
      />

      {/* Main Score Board Row */}
      <div className="p-5 md:p-6 pb-4 border-b border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Batting Team Progress */}
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-extrabold text-lg md:text-2xl shadow-xl transition-all scale-102 border border-white/10" 
              style={{ backgroundColor: battingTheme.primary, color: '#000' }}
            >
              {match.battingTeam}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl md:text-5xl font-black tracking-tighter text-white">
                  {match.runs}/{match.wickets}
                </span>
                <span className="text-zinc-400 font-mono text-sm md:text-lg">
                  ({match.oversCompleted}.{match.ballsCurrentOver} ov)
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-1.5 w-1.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Target: {match.target || '185'} vs {match.bowlingTeam}
                </span>
              </div>
            </div>
          </div>

          {/* CRR / RRR rates info */}
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900/60 border border-white/5 px-4 py-2 rounded-xl text-center flex-1 md:flex-initial min-w-[75px]">
              <span className="block text-[9px] uppercase font-mono tracking-wider text-zinc-500">Run Rate</span>
              <span className="text-sm font-semibold font-mono text-white">{crr}</span>
            </div>
            <div className="bg-zinc-900/60 border border-white/5 px-4 py-2 rounded-xl text-center flex-1 md:flex-initial min-w-[75px]">
              <span className="block text-[9px] uppercase font-mono tracking-wider text-zinc-500">Req. Rate</span>
              <span className="text-sm font-semibold font-mono text-yellow-500">{rrr}</span>
            </div>

            {/* Manual Speed Switch buttons */}
            <div className="hidden sm:flex flex-col border border-white/5 p-1 rounded-xl bg-black/40 text-[9px] font-mono text-zinc-500">
              <span className="text-center pb-0.5 leading-none">Speed</span>
              <div className="flex gap-1">
                <button 
                  onClick={() => setSimulationSpeed(2)} 
                  className={`px-1 rounded cursor-pointer ${simulationSpeed === 2 ? 'bg-zinc-800 text-white font-bold' : ''}`}
                >
                  ⚡Fast
                </button>
                <button 
                  onClick={() => setSimulationSpeed(5)} 
                  className={`px-1 rounded cursor-pointer ${simulationSpeed === 5 ? 'bg-zinc-800 text-white font-bold' : ''}`}
                >
                  6s
                </button>
                <button 
                  onClick={() => setSimulationSpeed(12)} 
                  className={`px-1 rounded cursor-pointer ${simulationSpeed === 12 ? 'bg-zinc-800 text-white font-bold' : ''}`}
                >
                  12s
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic target math ribbon */}
        <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs text-yellow-400 font-semibold font-sans">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-yellow-400 stroke-none" />
            CSK leads with explosive power in Chidambaram Stadium.
          </span>
          <span className="text-[10px] font-mono bg-yellow-500/15 text-yellow-200 px-2 py-0.5 rounded uppercase">
            In-Play Live
          </span>
        </div>
      </div>

      {/* Active Batters & Bowler row */}
      <div className="p-4 md:p-5 bg-white/2 flex flex-col md:flex-row gap-5">
        
        {/* Batsmen active cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
          {match.batsmen.map((batsman, idx) => {
            const isStrike = idx === 0;
            return (
              <div 
                key={batsman.name || idx}
                className={`p-3 rounded-xl border transition-all ${
                  isStrike 
                    ? 'bg-gradient-to-r from-zinc-900 to-black border-[var(--team-primary)] shadow-[var(--team-primary-alpha)]' 
                    : 'bg-black/30 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isStrike && <Circle className="w-2.5 h-2.5 fill-[var(--team-primary)] stroke-none animate-pulse shrink-0" />}
                    <span className={`text-xs font-bold leading-tight truncate ${isStrike ? 'text-white' : 'text-zinc-400'}`}>
                      {batsman.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-semibold px-1 rounded uppercase ${isStrike ? 'bg-[var(--team-primary)] text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                    {isStrike ? 'Strike' : 'Batting'}
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-md font-black font-mono ${isStrike ? 'text-white font-extrabold' : 'text-zinc-400'}`}>
                      {batsman.runs}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-500 font-mono">
                      ({batsman.balls}b)
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[10px] font-mono text-zinc-500">
                    <span>SR: <strong className={isStrike ? 'text-zinc-200' : 'text-zinc-500'}>{batsman.strikeRate}</strong></span>
                    <span>4s/6s: <strong className={isStrike ? 'text-zinc-200' : 'text-zinc-500'}>{batsman.fours}/{batsman.sixes}</strong></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Bowler cell */}
        <div className="bg-black/50 border border-white/5 p-3 rounded-xl min-w-[210px] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-zinc-500">Current Bowler</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--opp-primary)]"></span>
          </div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-xs font-bold text-zinc-200 truncate pr-2">{match.bowler?.name}</span>
            <span className="text-xs font-black font-mono text-zinc-300">
              {match.bowler?.wickets}-{match.bowler?.runsConceded || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-1.5">
            <span>Overs: <strong className="text-zinc-300 font-bold">{match.bowler?.overs}</strong></span>
            <span>Econ: <strong className="text-zinc-300 font-bold">{match.bowler?.economy}</strong></span>
          </div>
        </div>

      </div>

      {/* Manual Quick Simulation Controls for interactive engagement */}
      <div className="bg-zinc-950/80 px-4 py-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1 select-none">
          🕹️ Real-time Engine
          <span className="text-zinc-600">|</span>
          Adjust speed or manually bowl balls
        </span>
        <div className="flex items-center gap-2">
          {/* play pause */}
          <button 
            onClick={toggleSimulation}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 active:scale-95 text-[10px] font-bold text-zinc-300 transition-all cursor-pointer"
          >
            {isSimulating ? <Pause className="w-3 h-3 text-red-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
            {isSimulating ? 'Pause Match' : 'Simulate Match'}
          </button>
          
          {/* Manual ball */}
          <button 
            onClick={triggerNextBallManual}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-500 text-black font-extrabold text-[10px] uppercase shadow-lg shadow-yellow-500/10 active:scale-95 transition-all cursor-pointer hover:bg-yellow-400"
          >
            <FastForward className="w-3 h-3 text-black" />
            Bowl Ball
          </button>
        </div>
      </div>

    </GlassCard>
  </div>
);
};

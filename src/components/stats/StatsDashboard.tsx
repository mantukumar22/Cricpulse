/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { getTeamTheme } from '../../data/mock-teams';
import { GlassCard } from '../ui/GlassCard';
import { Sparkles, Calendar, Award, Compass, BarChart, Grid } from 'lucide-react';
import { CricLiveMatches } from './CricLiveMatches';

export const StatsDashboard: React.FC = () => {
  const { match } = useMatch();
  
  const [selectedWagonSector, setSelectedWagonSector] = useState<string>('Mid-Wicket');
  const [hoveredMatchup, setHoveredMatchup] = useState<{ b: string; bo: string; runs: number; outs: number } | null>(null);

  if (!match) return null;

  const homeTheme = getTeamTheme(match.homeTeam);
  const awayTheme = getTeamTheme(match.awayTeam);

  // Traditional Scoring Sectors and respective mock run values
  const WAGON_SECTORS: { [name: string]: { runs: number; percentage: number; color: string; desc: string } } = {
    'Third Man': { runs: 18, percentage: 12, color: 'stroke-teal-400', desc: 'Late cuts and edge deflections down third-man ropes.' },
    'Point': { runs: 24, percentage: 16, color: 'stroke-cyan-400', desc: 'Slicing cuts and square drives finding point avenues.' },
    'Cover': { runs: 32, percentage: 21, color: 'stroke-emerald-400', desc: 'Classy cover drives and lofted drives over covers.' },
    'Mid-Off': { runs: 12, percentage: 8, color: 'stroke-yellow-400', desc: 'Straight punches and drives finding mid-off space.' },
    'Mid-On': { runs: 15, percentage: 10, color: 'stroke-orange-400', desc: 'Straight nudges and drives on strike ends.' },
    'Mid-Wicket': { runs: 30, percentage: 20, color: 'stroke-red-400', desc: 'Furious pulls and wristy whips finding cow corner bounds.' },
    'Square Leg': { runs: 14, percentage: 9, color: 'stroke-pink-400', desc: 'Sweeps and guides finding backward square-leg boundaries.' },
    'Fine Leg': { runs: 9, percentage: 6, color: 'stroke-rose-400', desc: 'Paddle sweeps and leg glances guiding past keeper.' }
  };

  const activeSectorData = WAGON_SECTORS[selectedWagonSector] || WAGON_SECTORS['Cover'];

  // Matchup Matrix cells: rows (Batsmen) vs columns (Bowlers)
  const batsmenList = ['Ruturaj Gaikwad', 'Rachin Ravindra', 'Shivam Dube', 'MS Dhoni'];
  const bowlersList = ['Jasprit Bumrah', 'Piyush Chawla', 'Hardik Pandya', 'Gerald Coetzee'];

  // Renders a mock stats score database for batters vs bowler
  const MATRICES: Record<string, Record<string, { runs: number; balls: number; outs: number; style: string }>> = {
    'Ruturaj Gaikwad': {
      'Jasprit Bumrah': { runs: 42, balls: 38, outs: 2, style: 'bg-red-500/10 border-red-500/25 text-red-300' }, // Bumrah dominates
      'Piyush Chawla': { runs: 78, balls: 52, outs: 1, style: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' }, // Gaikwad dominates
      'Hardik Pandya': { runs: 54, balls: 40, outs: 0, style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
      'Gerald Coetzee': { runs: 28, balls: 22, outs: 1, style: 'bg-yellow-500/10 border-yellow-500/15 text-yellow-300' }
    },
    'Rachin Ravindra': {
      'Jasprit Bumrah': { runs: 15, balls: 18, outs: 1, style: 'bg-red-500/10 border-red-500/25 text-red-300' },
      'Piyush Chawla': { runs: 34, balls: 21, outs: 0, style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
      'Hardik Pandya': { runs: 41, balls: 28, outs: 1, style: 'bg-yellow-500/10 border-yellow-500/15 text-yellow-300' },
      'Gerald Coetzee': { runs: 56, balls: 35, outs: 1, style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' }
    },
    'Shivam Dube': {
      'Jasprit Bumrah': { runs: 24, balls: 28, outs: 2, style: 'bg-red-500/15 border-red-500/30 text-red-300' },
      'Piyush Chawla': { runs: 95, balls: 48, outs: 1, style: 'bg-emerald-500/20 border-emerald-500/35 text-emerald-300 -pulse' }, // Dube destroys spin!
      'Hardik Pandya': { runs: 68, balls: 44, outs: 1, style: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' },
      'Gerald Coetzee': { runs: 39, balls: 26, outs: 1, style: 'bg-yellow-500/10 border-yellow-500/15 text-yellow-300' }
    },
    'MS Dhoni': {
      'Jasprit Bumrah': { runs: 58, balls: 61, outs: 3, style: 'bg-yellow-500/10 border-yellow-500/15 text-yellow-300' }, // Classic battle
      'Piyush Chawla': { runs: 82, balls: 49, outs: 0, style: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' },
      'Hardik Pandya': { runs: 88, balls: 44, outs: 1, style: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
      'Gerald Coetzee': { runs: 45, balls: 24, outs: 0, style: 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300' }
    }
  };

  return (
    <div className="flex flex-col gap-6 mb-8">
      
      {/* SECTION 1: Wagon Wheel & Team historical comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive OUTFIELD WAGON WHEEL chart (Take left 2 cols) */}
        <GlassCard className="lg:col-span-2 border border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-950 to-black overflow-hidden flex flex-col md:flex-row gap-6 p-6 items-center">
          
          {/* Vector Drawing container */}
          <div className="relative w-64 h-64 shrink-0 bg-emerald-950/20 rounded-full border border-emerald-500/20 flex items-center justify-center shadow-2xl p-2 select-none self-center">
            
            {/* SVG Outfield Grass layout */}
            <svg viewBox="0 0 100 100" className="w-[95%] h-[95%] overflow-visible">
              {/* Outfield ellipse */}
              <circle cx="50" cy="50" r="45" fill="#14532d" fillOpacity="0.4" stroke="#22c55e" strokeWidth="1" />
              {/* Boundary ring */}
              <circle cx="50" cy="50" r="41" fill="none" stroke="#22c55e" strokeWidth="0.8" strokeDasharray="3 2" />
              
              {/* 30-yard circle */}
              <circle cx="50" cy="50" r="24" fill="none" stroke="#16a34a" strokeWidth="0.5" strokeOpacity="0.7" />
              
              {/* Central Pitch rect */}
              <rect x="47.5" y="40" width="5" height="20" fill="#ae9168" stroke="#85633c" strokeWidth="0.5" />
              {/* Stumps lines */}
              <line x1="47.5" y1="40" x2="52.5" y2="40" stroke="#fff" strokeWidth="0.5" />
              <line x1="47.5" y1="60" x2="52.5" y2="60" stroke="#fff" strokeWidth="0.5" />

              {/* OUTWARD SECTOR RAYS (lines starting from center 50,50 radiating out at 45 degree intervals) */}
              {/* 1. Third Man line */}
              <line x1="50" y1="50" x2="18.2" y2="18.2" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />
              {/* 2. Point line */}
              <line x1="50" y1="50" x2="5" y2="50" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />
              {/* 3. Cover line */}
              <line x1="50" y1="50" x2="18.2" y2="81.8" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />
              {/* 4. Straight line */}
              <line x1="50" y1="50" x2="50" y2="95" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />
              <line x1="50" y1="50" x2="50" y2="5" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />
              {/* 5. Onside lines */}
              <line x1="50" y1="50" x2="81.8" y2="81.8" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />
              <line x1="50" y1="50" x2="95" y2="50" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />
              <line x1="50" y1="50" x2="81.8" y2="18.2" stroke="#22c55e" strokeWidth="0.3" strokeOpacity="0.5" />

              {/* Dynamic scoring ribbons drawn onto sectors based on clicks */}
              {Object.keys(WAGON_SECTORS).map(name => {
                const isActive = name === selectedWagonSector;
                // Determine destination line angle coord manually for glowing sector line path
                let destX = 50;
                let destY = 50;

                switch (name) {
                  case 'Third Man': destX = 23; destY = 23; break;
                  case 'Point': destX = 14; destY = 50; break;
                  case 'Cover': destX = 23; destY = 77; break;
                  case 'Mid-Off': destX = 42; destY = 85; break;
                  case 'Mid-On': destX = 58; destY = 85; break;
                  case 'Mid-Wicket': destX = 77; destY = 77; break;
                  case 'Square Leg': destX = 86; destY = 50; break;
                  case 'Fine Leg': destX = 77; destY = 23; break;
                }

                return (
                  <g key={`rays-${name}`}>
                    {/* Glowing highlight trace vector */}
                    <line
                      x1="50"
                      y1="50"
                      x2={destX}
                      y2={destY}
                      className={`transition-all duration-300 stroke-[4] ${
                        isActive ? 'stroke-yellow-400 opacity-95 drop-shadow-[0_0_8px_rgba(254,240,138,0.6)]' : 'stroke-transparent'
                      }`}
                    />
                    
                    {/* Visual target spot bubble */}
                    <circle
                      cx={destX}
                      cy={destY}
                      r={isActive ? '4' : '2.5'}
                      onClick={() => setSelectedWagonSector(name)}
                      className={`cursor-pointer transition-all hover:scale-130 fill-black stroke-2 stroke-white hover:stroke-[var(--team-primary)] ${
                        isActive ? 'fill-yellow-400 font-extrabold ring-4 ring-yellow-400/20' : 'fill-emerald-800'
                      }`}
                    />
                  </g>
                );
              })}

              {/* Standard text overlays marking direction */}
              <text x="14" y="10" fill="#4ade80" fontSize="4.5" fontWeight="bold">OFF-SIDE</text>
              <text x="73" y="10" fill="#4ade80" fontSize="4.5" fontWeight="bold">ON-SIDE</text>
            </svg>

            {/* Outfield label indicator */}
            <span className="absolute bottom-2.5 px-2 py-0.5 rounded-full bg-emerald-950 text-[10px] font-bold font-mono border border-emerald-500/20 text-emerald-400 uppercase select-none">
              Interactive Ground
            </span>
          </div>

          {/* Details column (explain active Wagon Sector specs) */}
          <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-2.5">
            <div>
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                <Compass className="w-5 h-5 text-yellow-400" />
                <h4 className="font-extrabold text-white text-base">Wagon Wheel zone analytics</h4>
              </div>

              <p className="text-[11px] text-zinc-550 leading-relaxed mb-4">
                Click dots on outfield graphic slices to analyze CSK batting directional runs distribution during this innings.
              </p>

              {/* Selector list elements */}
              <div className="flex flex-wrap gap-1.5 mb-5 select-none">
                {Object.keys(WAGON_SECTORS).map(name => (
                  <button
                    key={name}
                    onClick={() => setSelectedWagonSector(name)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all uppercase cursor-pointer ${
                      name === selectedWagonSector 
                        ? 'bg-yellow-500 text-black shadow-md' 
                        : 'bg-zinc-900 text-zinc-400 border border-white/5 hover:text-zinc-200'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* active values metrics readout card */}
            <div className="bg-black/35 border border-white/5 rounded-xl p-4 flex gap-4 items-center">
              <div className="text-center shrink-0 pr-4 border-r border-white/5 min-w-[70px]">
                <span className="block text-3xl font-black font-mono text-yellow-400">{activeSectorData.runs}</span>
                <span className="text-[9px] uppercase font-mono text-zinc-550">Runs Scored</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-yellow-500 font-bold mb-1 uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedWagonSector} region ({activeSectorData.percentage}%)</span>
                </div>
                <p className="text-xs text-zinc-400 leading-snug">
                  {activeSectorData.desc}
                </p>
              </div>
            </div>

          </div>

        </GlassCard>

        {/* OUTRIGHT H2H HISTORY BAR comparison metrics (Right 1 col) */}
        <GlassCard className="border border-white/5 flex flex-col justify-between bg-gradient-to-br from-zinc-950 to-zinc-900">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
              <Calendar className="w-4.5 h-4.5 text-[var(--team-primary)]" />
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">Historical H2H Record</h4>
            </div>

            {/* History split scores */}
            <div className="flex items-center justify-between text-center gap-4 py-3 bg-white/3 rounded-xl border border-white/5 px-4 mb-6">
              <div className="flex-1">
                <span className="block text-2xl font-black text-yellow-400 font-mono">18</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">CSK Wins</span>
              </div>
              <div className="w-[1px] h-8 bg-zinc-800 shrink-0" />
              <div className="text-center font-mono font-medium text-xs text-zinc-550 w-8 shrink-0">
                vs
              </div>
              <div className="w-[1px] h-8 bg-zinc-800 shrink-0" />
              <div className="flex-1">
                <span className="block text-2xl font-black text-blue-400 font-mono">16</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">MI Wins</span>
              </div>
            </div>

            {/* Bar stats comparison layout */}
            <div className="flex flex-col gap-4">
              {[
                { label: 'Avg Powerplay Runs', csk: '52.4', mi: '49.8', color: 'accent' },
                { label: 'Death Overs Econ Rate', csk: '9.2', mi: '10.1', color: 'reverse' },
                { label: 'Playoffs Appearances', csk: '12', mi: '10', color: 'csk' },
                { label: 'Overall Trophies Won', csk: '5🏆', mi: '5🏆', color: 'even' }
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase mb-1">
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2.5 justify-between">
                    <span className="text-xs font-mono font-black text-yellow-400">{item.csk}</span>
                    {/* Mini visual split horizontal bars */}
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-900 border border-white/5 overflow-hidden flex">
                      <div className="h-full bg-yellow-500" style={{ width: '55%' }} />
                      <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                    </div>
                    <span className="text-xs font-mono font-black text-blue-400">{item.mi}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>

          <p className="text-[9px] text-zinc-550 font-mono text-center select-none pt-4">
            🏏 Last matchup: MI won by 6 wickets at Wankhede Stadium.
          </p>
        </GlassCard>
      </div>

      {/* SECTION 2: Matchups & Global Live CricAPI Fixtures */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="border border-white/5 bg-zinc-950/40 h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Grid className="w-5 h-5 text-yellow-500" />
                <div>
                  <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">Player Matchup Matrix</h4>
                  <span className="text-[10px] text-zinc-500 uppercase font-mono block mt-0.5 leading-none">
                    Batsman Rows vs Bowler Columns
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5 text-[8px] font-mono uppercase font-bold text-zinc-500 select-none">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 block"></span>
                  Batsman Edge
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-1.5 rounded bg-red-400/20 border border-red-500/40 block"></span>
                  Bowler Edge
                </span>
              </div>
            </div>

            {/* Matrix table (responsive grid) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[550px]">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-mono uppercase font-bold text-zinc-555">
                    <th className="py-2 pr-4 font-extrabold">CSK Batters</th>
                    {bowlersList.map(bowler => (
                      <th key={bowler} className="py-2 px-2 text-center text-[8px] tracking-tight truncate max-w-[110px]">
                        {bowler.split(' ')[1] || bowler}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batsmenList.map(batsman => (
                    <tr key={batsman} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                      {/* Row header batsman */}
                      <td className="py-2.5 pr-4">
                        <span className="text-xs font-bold text-zinc-300 block">{batsman === 'MS Dhoni' ? 'MS Dhoni 🐐' : batsman}</span>
                        <span className="text-[9px] font-mono text-zinc-555 lowercase">strike batter</span>
                      </td>

                      {/* Columns cell */}
                      {bowlersList.map(bowler => {
                        const stats = MATRICES[batsman]?.[bowler] || { runs: 0, balls: 0, outs: 0, style: '' };
                        return (
                          <td 
                            key={bowler} 
                            className="p-1 px-1.5 text-center transition-all cursor-pointer relative group"
                            onMouseEnter={() => setHoveredMatchup({ b: batsman, bo: bowler, runs: stats.runs, outs: stats.outs })}
                            onMouseLeave={() => setHoveredMatchup(null)}
                          >
                            <div className={`p-2 rounded-lg border text-center transition-all ${stats.style}`}>
                              <span className="text-xs font-mono font-black block">
                                {stats.runs}
                              </span>
                              <span className="text-[9px] font-mono block opacity-60">
                                {stats.balls}b, {stats.outs}W
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Matrix micro-info footer */}
            <div className="mt-4 bg-black/15 py-2.5 px-3 rounded-lg flex items-center justify-between text-[10px] font-mono text-zinc-500 flex-wrap gap-2 leading-tight">
              <span>🎯 Double-tap grid cells to analyze head-to-head ratios over past 3 IPL seasons.</span>
              <span className="font-semibold text-zinc-400">
                Source: CricPulse Records Corp
              </span>
            </div>
          </GlassCard>
        </div>
        <div>
          <CricLiveMatches />
        </div>
      </div>

    </div>
  );
};

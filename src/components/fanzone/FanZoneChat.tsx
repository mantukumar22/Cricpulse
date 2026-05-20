/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useMatch } from '../../contexts/MatchContext';
import { getTeamTheme } from '../../data/mock-teams';
import { GlassCard } from '../ui/GlassCard';
import { MessageSquare, Send, Activity, Users, SendToBack, Sparkle } from 'lucide-react';

export const FanZoneChat: React.FC = () => {
  const {
    match,
    chatMessages,
    addChatMessage,
    fanExcitement
  } = useMatch();

  const [typedMessage, setTypedMessage] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages pour in
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  if (!match) return null;

  const homeTheme = getTeamTheme(match.homeTeam);
  const awayTheme = getTeamTheme(match.awayTeam);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    addChatMessage(typedMessage);
    setTypedMessage('');
  };

  // Convert fanExcitement from 0-100 to angle rotation inside gauge needle (-90 to +90 deg)
  const needleRotation = ((fanExcitement / 100) * 180) - 90;

  const getExcitementStatus = (level: number) => {
    if (level < 35) return { text: 'Subdued', color: 'text-zinc-500' };
    if (level < 60) return { text: 'Moderate', color: 'text-blue-400' };
    if (level < 80) return { text: 'High Excitement', color: 'text-yellow-400' };
    return { text: 'STADIUM MADNESS!', color: 'text-red-500 font-extrabold animate-pulse' };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* 2-col left side: Live chat messaging boards */}
      <div className="lg:col-span-2 flex flex-col h-[440px] md:h-[500px]">
        
        <GlassCard className="flex flex-col h-full border border-white/5 p-0 bg-gradient-to-br from-zinc-950/80 via-zinc-950/90 to-black overflow-hidden flex-1">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/5 bg-white/1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[var(--team-primary)]" />
              <div>
                <h4 className="font-extrabold text-white text-sm">IPL Global Chat Room</h4>
                <span className="text-[10px] text-zinc-500 uppercase font-mono mt-0.5 block leading-none">
                  In-Play match banter
                </span>
              </div>
            </div>
            
            {/* Live active users counter */}
            <div className="flex items-center gap-1.5 bg-zinc-900 px-3 py-1 rounded-full text-[10px] font-mono text-zinc-400">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>4,820 active fans</span>
            </div>
          </div>

          {/* Messages list (scrollable) */}
          <div 
            ref={chatScrollRef}
            className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 scroll-smooth"
          >
            {chatMessages.map((msg, index) => {
              const theme = getTeamTheme(msg.teamCode);
              const isUser = msg.isUser;

              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    isUser ? 'self-end flex-row-reverse' : 'self-start'
                  }`}
                >
                  {/* Small Team Logo Tag */}
                  <span 
                    className="w-7 h-7 rounded-lg text-[9px] font-black flex items-center justify-center border border-white/5 select-none shrink-0"
                    style={{ backgroundColor: `${theme.primary}15`, color: theme.primary, borderColor: `${theme.primary}25` }}
                  >
                    {msg.teamCode}
                  </span>

                  <div className={`rounded-2xl p-3 flex flex-col ${
                    isUser 
                      ? 'bg-zinc-800 border border-white/10 text-white rounded-tr-none' 
                      : 'bg-zinc-900/60 border border-white/5 text-zinc-300 rounded-tl-none'
                  }`}>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span 
                        className="text-[11px] font-bold"
                        style={{ color: isUser ? undefined : theme.primary }}
                      >
                        {msg.username}
                      </span>
                      <span className="text-[9px] text-zinc-600 font-mono">
                        {msg.timestamp}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed break-words font-sans">
                      {msg.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Submit form foot */}
          <form 
            onSubmit={handleSend}
            className="p-4 border-t border-white/5 bg-white/2 flex items-center gap-2.5"
          >
            <input 
              type="text"
              required
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Join the battle! Type support comments..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-[var(--team-primary)]/50 focus:ring-1 focus:ring-[var(--team-primary)]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-[var(--team-primary)] text-black hover:opacity-90 active:scale-95 transition-all text-xs font-bold shrink-0 cursor-pointer"
            >
              <Send className="w-4.5 h-4.5 text-black" />
            </button>
          </form>

        </GlassCard>

      </div>

      {/* 1-col right side: Excitement dial meter */}
      <div className="flex flex-col gap-5">
        
        {/* Speedometer excitement dial */}
        <GlassCard className="border border-white/5 bg-zinc-950/80 flex flex-col items-center justify-center p-6 text-center select-none bg-gradient-to-br from-zinc-950 to-zinc-900">
          <div className="flex items-center gap-1.5 self-start w-full border-b border-white/5 pb-2.5 mb-4">
            <Activity className="w-5 h-5 text-red-500" />
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wide">Crowd Decibel Pulse</h4>
          </div>

          <p className="text-[10px] text-zinc-500 leading-snug mb-5">
            Real-time decibel analysis of stadium cheers, whistles, and crowd noises tracked by sensory grids.
          </p>

          {/* Dial SVG */}
          <div className="relative w-44 h-24 mb-3">
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              {/* background track */}
              <path 
                d="M 10,50 A 40,40 0 0,1 90,50" 
                fill="none" 
                stroke="#27272a" 
                strokeWidth="10" 
                strokeLinecap="round" 
              />
              {/* Active track color gradient */}
              <path 
                d="M 10,50 A 40,40 0 0,1 90,50" 
                fill="none" 
                stroke="url(#decibelGrad)" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - (125.6 * (fanExcitement / 100))}
                className="transition-all duration-1000"
              />
              {/* Gradients */}
              <defs>
                <linearGradient id="decibelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#eab308" /> {/* gold */}
                  <stop offset="60%" stopColor="#f97316" /> {/* orange */}
                  <stop offset="100%" stopColor="#ef4444" /> {/* red */}
                </linearGradient>
              </defs>

              {/* Central Cap */}
              <circle cx="50" cy="50" r="4.5" fill="#f4f4f5" />
              
              {/* Needle pointer */}
              <line 
                x1="50" 
                y1="50" 
                x2="50" 
                y2="15" 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                transform={`rotate(${needleRotation}, 50, 50)`}
                className="transition-all duration-1000 origin-[50px_50px]"
              />
            </svg>

            {/* Glowing excitement numbers */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
              <span className="text-2xl font-black font-mono tracking-tighter text-white">
                {fanExcitement}%
              </span>
              <span className="text-[9px] font-mono font-medium text-zinc-500 uppercase">
                Noise Meter
              </span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-3.5 w-full flex flex-col items-center">
            <span className="text-[10px] text-zinc-500 uppercase font-mono">Current Ambience</span>
            <span className={`text-sm font-bold mt-1.5 ${getExcitementStatus(fanExcitement).color}`}>
              {getExcitementStatus(fanExcitement).text}
            </span>
          </div>
        </GlassCard>

        {/* Interactive Gemini AI Cricket Analyst */}
        <AiAnalystCard key="ai-expert-box" />

      </div>

    </div>
  );
};

// --- Interactive Gemini AI Cricket Analyst Card ---
const AiAnalystCard: React.FC = () => {
  const { match } = useMatch();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { 
      sender: 'ai', 
      text: 'Namaste! 🌟 CricPulse AI Expert here. Ask me anything about the active strategy, player matchups, or target chase calculations!' 
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal.trim();
    setInputVal('');
    
    // Add user message to log
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: userText,
          chatHistory: messages,
          matchState: match ? {
            battingTeam: match.battingTeam,
            bowlingTeam: match.bowlingTeam,
            runs: match.runs,
            wickets: match.wickets,
            oversCompleted: match.oversCompleted,
            ballsCurrentOver: match.ballsCurrentOver,
            recentBalls: match.recentBalls
          } : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || data.isQuotaExceeded) {
          setMessages(prev => [...prev, { 
            sender: 'ai', 
            text: "⚠️ [Error CODE: RESOURCE_EXHAUSTED_429] Namaste! Real-time strategic analysis has reached Google's default sandbox limit of 20 requests per day. To enable unlimited chats, configure your private API Key in settings or try again when it resets!" 
          }]);
          return;
        }
        throw new Error(data.error || 'Analyst experienced a communication limit error');
      }

      if (data.success && data.reply) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        throw new Error('Empty response payload from AI server');
      }
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        text: `Aiyyo! [Error: ${err.message || 'CONNECTION_LIMIT'}] My analysis engine slowed down. But conceptually, keep an eye on Dhoni's batting stance or bowler lengths! 🏏` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="border border-white/5 bg-gradient-to-b from-zinc-950 to-zinc-900 p-4 flex flex-col h-[270px] relative overflow-hidden mt-1">
      {/* Title block */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2 shrink-0">
        <Sparkle className="w-4 h-4 text-yellow-400 animate-spin-slow shrink-0" />
        <div className="min-w-0">
          <span className="text-xs font-black text-white block truncate leading-none">🎙️ Ask AI Cricket Analyst</span>
          <span className="text-[9px] text-zinc-550 font-mono uppercase tracking-widest block mt-0.5 leading-none">
            Powered by Gemini 3.5 Flash
          </span>
        </div>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto mb-2 flex flex-col gap-2.5 pr-0.5">
        {messages.map((m, idx) => (
          <div key={idx} className={`max-w-[90%] text-xs rounded-xl p-2.5 leading-normal ${
            m.sender === 'user' 
              ? 'bg-zinc-800 text-white self-end rounded-tr-none' 
              : 'bg-yellow-500/10 border border-yellow-500/15 text-zinc-200 self-start rounded-tl-none'
          }`}>
            <p className="font-sans leading-relaxed">{m.text}</p>
          </div>
        ))}
        {loading && (
          <div className="bg-yellow-500/5 border border-yellow-500/10 text-zinc-400 self-start text-xs rounded-xl p-2.5 leading-normal max-w-[90%] flex items-center gap-2">
            <span className="flex gap-1 items-center shrink-0">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-bounce delay-200" />
            </span>
            <span className="font-mono text-[10px]">Analyst is thinking...</span>
          </div>
        )}
        <div ref={logEndRef} />
      </div>

      {/* Chat submit */}
      <form onSubmit={handleSubmit} className="flex gap-1.5 shrink-0 border-t border-white/5 pt-2">
        <input 
          type="text"
          required
          placeholder="Ask AI: 'Will RCB defend?' or IPL stats..."
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !inputVal.trim()}
          className="p-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-35 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </GlassCard>
  );
};


import React, { useState, useEffect } from "react";
import { useMatch } from "../../contexts/MatchContext";
import { GlassCard } from "../ui/GlassCard";
import { Sparkle, Radio, Volume2, RefreshCw, AlertTriangle } from "lucide-react";

export const LiveAICommentary: React.FC = () => {
  const { match } = useMatch();
  const [commentary, setCommentary] = useState<string>("Click to generate live expert Hinglish AI Commentary on this ball update!");
  const [loading, setLoading] = useState<boolean>(false);
  const [lastBall, setLastBall] = useState<string>(" ");
  const [apiError, setApiError] = useState<{ code: string; message: string } | null>(null);
  const [isLocalHype, setIsLocalHype] = useState<boolean>(false);

  const currentBallKey = match && match.status === "live"
    ? `${match.oversCompleted}.${match.ballsCurrentOver}-${match.runs}-${match.wickets}`
    : "";

  const fetchAICommentary = async (forced = false) => {
    if (!match || match.status !== "live") return;
    // Avoid double fetching
    if (loading) return;
    if (!forced && currentBallKey === lastBall) return;

    setLoading(true);
    setApiError(null);
    setIsLocalHype(false);
    try {
      const response = await fetch("/api/gemini/commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchState: {
            battingTeam: match.battingTeam,
            bowlingTeam: match.bowlingTeam,
            runs: match.runs,
            wickets: match.wickets,
            oversCompleted: match.oversCompleted,
            ballsCurrentOver: match.ballsCurrentOver,
            batsmen: match.batsmen,
            bowler: match.bowler,
            recentBalls: match.recentBalls
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429 || data.isQuotaExceeded) {
          setApiError({
            code: "quota_limit_reached_429",
            message: "This shared sandbox API Key has exhausted its Google Free Tier limit of 20 generations per day! You may define your own private key in Settings or wait for resetting."
          });
        } else {
          setApiError({
            code: `api_error_${response.status}`,
            message: data.error || "The server failed to construct a commentary payload."
          });
        }
        setCommentary(data.commentary || "What a dynamic game! (The AI is cooling its engines due to server quota constraints, but the match moves forward!)");
        setLastBall(currentBallKey);
        return;
      }

      if (data.success && data.commentary) {
        setCommentary(data.commentary);
        setLastBall(currentBallKey);
        if (data.localHype) {
          setIsLocalHype(true);
          setApiError(null); // Clear errors because fallback handled it gracefully!
        } else {
          setIsLocalHype(false);
          setApiError(null);
        }
      }
    } catch (err: any) {
      console.error(err);
      setApiError({
        code: "connection_broken",
        message: err.message || "Could not connect to the interactive server endpoint."
      });
      setCommentary("What a delivery! High tension in the stadium, both captains are talking. Gemini server has limited free requests, but the batting side is targeting big boundaries!");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch commentary when a wicket falls or a boundary is hit
  useEffect(() => {
    if (!match || match.status !== "live" || !match.recentBalls || match.recentBalls.length === 0) return;
    const latestEvent = match.recentBalls[match.recentBalls.length - 1];
    
    // Auto trigger for premium milestones to excite users
    if (latestEvent === "W" || latestEvent === "6" || latestEvent === "4") {
      fetchAICommentary();
    }
  }, [currentBallKey]);

  if (!match || match.status !== "live") return null;

  return (
    <GlassCard className="border border-yellow-550/15 bg-gradient-to-r from-zinc-950 via-yellow-500/[0.02] to-black p-4 mb-6 relative overflow-hidden">
      {/* Absolute laser glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/[0.03] rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 shrink-0 mt-0.5 relative">
            <Radio className="w-5 h-5 text-yellow-400" />
            {loading && (
              <span className="absolute inset-0 rounded-xl border border-yellow-500 animate-ping opacity-65" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono tracking-widest text-yellow-500 font-extrabold flex items-center gap-1">
                <Sparkle className="w-3 h-3 text-yellow-400" />
                Live Gemini Commentary Box
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-tighter uppercase bg-yellow-500/10 text-yellow-300 border border-yellow-500/20">
                Ravi Shastri Mode
              </span>
              {isLocalHype && (
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-tight uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse flex items-center gap-1">
                  ⚡ Hype Engine (Local)
                </span>
              )}
            </div>
            
            <p className="text-zinc-200 text-xs mt-2 italic font-serif leading-relaxed pr-2">
              "{commentary}"
            </p>
          </div>
        </div>

        {/* Generate comment button */}
        <button
          onClick={() => fetchAICommentary(true)}
          disabled={loading}
          className="self-end md:self-center px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wide hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow-lg shadow-yellow-500/5 active:scale-95 flex items-center gap-1.5"
        >
          {loading ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <Volume2 className="w-3 h-3 fill-black" />
          )}
          {loading ? "Tuning Commentary..." : "🎙️ Broadcast Ball Commentary"}
        </button>

      </div>

      {apiError && (
        <div className="mt-3.5 pt-3 border-t border-white/5 flex gap-2.5 items-start text-[11px] text-yellow-500/90 bg-yellow-500/[0.03] -mx-4 -mb-4 p-3 rounded-b-xl border-l-2 border-l-yellow-500">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-mono font-black text-[9px] tracking-widest uppercase bg-yellow-500/10 text-yellow-300 px-1.5 py-0.5 rounded leading-none inline-block">
              API KEY WARNING: {apiError.code}
            </span>
            <p className="text-zinc-400 leading-normal text-[10px]">
              {apiError.message}
            </p>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

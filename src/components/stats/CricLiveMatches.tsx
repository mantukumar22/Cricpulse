import React, { useState, useEffect } from "react";
import { useMatch } from "../../contexts/MatchContext";
import { GlassCard } from "../ui/GlassCard";
import { Globe, RefreshCw, Trophy, Calendar, Zap, AlertTriangle } from "lucide-react";

interface CricMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  teams: string[];
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  series_id?: string;
  live?: boolean;
}

export const CricLiveMatches: React.FC = () => {
  const { setToast } = useMatch();
  const [matches, setMatches] = useState<CricMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/cricket/matches");
        if (!response.ok) {
          throw new Error("Cricket Data Server experienced issues");
        }
        const data = await response.json();
        
        if (data.status === "success" && Array.isArray(data.data)) {
          if (active) {
            setMatches(data.data);
          }
        } else if (data.status === "failure") {
          throw new Error(data.message || "API rate limit exceeded or invalid response");
        } else {
          setMatches([]);
        }
      } catch (err: any) {
        console.error("API error:", err.message);
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchMatches();
    return () => {
      active = false;
    };
  }, [refreshKey]);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
    if (setToast) {
      setToast({ message: "🔄 Fetching latest real-world CricAPI fixtures...", type: "info" });
    }
  };

  return (
    <GlassCard className="border border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-950 to-black p-5">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#FFCB05] animate-pulse" />
          <div>
            <h4 className="font-extrabold text-white text-sm">Real-World Global Matches</h4>
            <span className="text-[10px] text-zinc-550 uppercase font-mono mt-0.5 block leading-none">
              Live from Cricket Data API
            </span>
          </div>
        </div>
        <button
          onClick={triggerRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 disabled:opacity-50 transition-colors cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FFCB05]" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#FFCB05]/30 border-t-[#FFCB05] animate-spin" />
          <p className="text-xs text-zinc-400 font-mono">Syncing with CricAPI feed...</p>
        </div>
      ) : error ? (
        <div className="py-6 px-4 bg-red-950/20 border border-red-500/10 rounded-xl flex flex-col items-center justify-center text-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-400" />
          <p className="text-xs text-red-300 font-medium">Unable to load CricAPI data</p>
          <p className="text-[10px] text-zinc-500 max-w-xs">{error}</p>
          <button
            onClick={triggerRefresh}
            className="mt-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] text-zinc-300 font-semibold uppercase rounded-lg border border-white/5 transition-all cursor-pointer"
          >
            Retry Fetch
          </button>
        </div>
      ) : matches.length === 0 ? (
        <div className="py-8 text-center text-zinc-500 text-xs">
          No live international matches running at this second. Check back later!
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-1">
          {matches.slice(0, 8).map((m) => {
            const isLive = m.status && (m.status.toLowerCase().includes("live") || m.status.toLowerCase().includes("need") || m.status.toLowerCase().includes("won") || m.status.toLowerCase().includes("toss") || m.status.toLowerCase().includes("bat"));
            const hasScores = m.score && m.score.length > 0;
            return (
              <div
                key={m.id}
                className="p-3.5 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-400">
                      {m.matchType ? m.matchType.toUpperCase() : "Live Match"}
                    </span>
                    <h5 className="font-bold text-white text-xs mt-1.5 truncate leading-snug">
                      {m.name}
                    </h5>
                  </div>
                  {isLive && (
                    <span className="shrink-0 flex items-center gap-1 bg-red-600/15 border border-red-500/30 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase animate-pulse">
                      In-Play
                    </span>
                  )}
                </div>

                {hasScores && m.score ? (
                  <div className="bg-black/40 border border-white/5 rounded-lg p-2 flex flex-col gap-1.5 text-xs text-zinc-300">
                    {m.score.map((sc, scIdx) => (
                      <div key={scIdx} className="flex justify-between font-mono text-[11px]">
                        <span className="text-zinc-400 truncate max-w-[170px]">{sc.inning}</span>
                        <span className="font-bold text-white">
                          {sc.r}/{sc.w} <span className="text-[9px] text-zinc-500">({sc.o}o)</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                  <span className="font-sans font-medium text-emerald-400">{m.status}</span>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 pt-1.5 border-t border-white/5">
                  <span className="truncate max-w-[160px]">{m.venue}</span>
                  <span>{m.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

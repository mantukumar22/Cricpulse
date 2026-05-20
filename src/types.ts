/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Team {
  code: string;
  name: string;
  shortName: string;
  primary: string;
  secondary: string;
  accent: string;
  players: string[];
}

export interface PlayerStats {
  name: string;
  isBatsman: boolean;
  // Batting stats
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  // Bowling stats
  overs?: number;
  maidens?: number;
  runsConceded?: number;
  wickets?: number;
  economy?: number;
}

export interface BallOutcome {
  runs: number;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
  isExtra: boolean;
  extraType?: 'wd' | 'nb' | 'lb' | 'b';
  display: string; // What's displayed in UI, e.g. "6", "W", "1wd", "4", "0"
  description: string;
}

export interface MatchMoment {
  id: string;
  over: number;
  ball: number;
  type: 'wicket' | 'six' | 'four' | 'milestone' | 'timeout' | 'info';
  title: string;
  desc: string;
  timestamp: string;
  reactionCount: number;
}

export interface Prediction {
  id: string;
  type: 'ball' | 'over' | 'match';
  targetValue: string; // Ball details, targeted runs etc
  predictionValue: string; // User's choice
  status: 'pending' | 'correct' | 'incorrect';
  pointsEarned?: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  teamCode: string; // Dynamic coloring based on team allegiance
  text: string;
  timestamp: string;
  isUser?: boolean;
}

export interface LivePoll {
  id: string;
  question: string;
  options: string[];
  votes: number[];
  active: boolean;
  timeRemaining: number; // in seconds
  totalVotes: number;
  userVoteIndex?: number;
}

export interface Match {
  id: string;
  homeTeam: string; // e.g. "CSK"
  awayTeam: string; // e.g. "MI"
  status: 'upcoming' | 'live' | 'finished';
  venue: string;
  dateTime: string;
  target?: number;
  oversTotal: number;
  currentInnings: 1 | 2;
  oversCompleted: number;
  ballsCurrentOver: number;
  battingTeam: string;
  bowlingTeam: string;
  runs: number;
  wickets: number;
  recentBalls: string[]; // e.g. ["4", "1", "W", "6", "0"] for the current over
  batsmen: PlayerStats[]; // exactly two active batsmen (first strike, second non-strike)
  bowler: PlayerStats; // active bowler
  scorecard: {
    batting: { [playerName: string]: PlayerStats };
    bowling: { [playerName: string]: PlayerStats };
  };
}

export interface MatchState {
  match: Match;
  moments: MatchMoment[];
  chatMessages: ChatMessage[];
  polls: LivePoll[];
  predictions: Prediction[];
  userPoints: number;
  userStreak: number;
  fanExcitement: number; // 0-100 gauge scale
  supportSplit: { [teamCode: string]: number }; // percentage support
}

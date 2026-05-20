/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Match, MatchMoment, ChatMessage, LivePoll, Prediction, Team, PlayerStats, BallOutcome } from '../types';
import { TEAMS, getTeamTheme } from '../data/mock-teams';
import { createDefaultScorecard, INITIAL_CHAT, INITIAL_MOMENTS, INITIAL_POLLS } from '../data/mock-match';

interface MatchContextType {
  activeMatchId: string;
  setActiveMatchId: (id: string) => void;
  match: Match | null;
  moments: MatchMoment[];
  chatMessages: ChatMessage[];
  polls: LivePoll[];
  predictions: Prediction[];
  userPoints: number;
  userStreak: number;
  fanExcitement: number;
  supportSplit: { [teamCode: string]: number };
  isSimulating: boolean;
  simulationSpeed: number; // in seconds
  setSimulationSpeed: (speed: number) => void;
  toggleSimulation: () => void;
  triggerNextBallManual: () => void;
  submitPrediction: (guess: string, predictType: 'ball' | 'over' | 'match', target: string) => void;
  submitVote: (pollId: string, optionIndex: number) => void;
  addChatMessage: (text: string) => void;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  setToast: (toast: any) => void;
  resetAllStats: () => void;
  showConfetti: boolean;
  setShowConfetti: (show: boolean) => void;
  startMatchLive: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

// Banter and comments database for simulation
const FAN_NAMES_CSK = ['Mahi_Mahi_7', 'WhistlePoduOfficial', 'AnbuDenYellow', 'SuperKingGiri', 'YellowSena', 'Thala_Cult', 'Gaikwad_CoverDrive', 'Jaddu_Sir_38', 'DhoniIsTheWay'];
const FAN_NAMES_MI = ['PaltanCaptain', 'Rohit45_Fanatic', 'Jasprit_Yorker', 'SkyHigh360', 'WankhedeRoar', 'PaltanArmy', 'BumrahSwinger', 'MumbaiChakka', 'Nita_SuperFan'];

const COMMENTS_SIX = [
  'UNBELIEVABLE SHOT! Deep into the stands! 🚀🔥',
  'CHAKKAAA! That made a wonderful sound off the bat! 💛💙',
  'OMG! He launched that 110 meters. Out of the cricket stadium!',
  'Vintage cricket hitting! Absolute dominance!',
  'Take a bow! Pure muscle power and timing! 🏏',
  'The bowler has absolutely no answers to that hitting!'
];

const COMMENTS_FOUR = [
  'Gorgeous boundary! Finds the gap flawlessly! 👏',
  'Classic cover drive! High-class batsmanship!',
  'Smashed that through backward point! No chance for outfield!',
  'Boundary! Elegant timing and placement.',
  'FOUR runs! Down the track and powered past mid-on!'
];

const COMMENTS_WICKET = [
  'OUTTTTTT! Holy cow, what a delivery! 🎯😱',
  'CLEAN BOWLED! The stumps are flying everywhere!',
  'YESSS! Massive breakthrough! Game-changer right here!',
  'Oh no, what a terrible shot selection. Big blow to the chasing side!',
  'Excellent catch at slip! Beautiful fielding, sensational reflexes.'
];

const COMMENTS_NEUTRAL = [
  'Good defensive stroke. Keeps the crease solid.',
  'Squeezes it details to deep midwicket for a single.',
  'Quick brace, excellent running between the wickets.',
  'Fast bouncer, well blocked by the batsman.',
  'Dot ball, pressure piling up heavily now.'
];

export const MatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMatchId, setActiveMatchId] = useState<string>('match-1');
  const [match, setMatch] = useState<Match | null>(null);
  const [moments, setMoments] = useState<MatchMoment[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [polls, setPolls] = useState<LivePoll[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [userPoints, setUserPoints] = useState<number>(() => {
    const saved = localStorage.getItem('cricpulse_user_points');
    return saved ? parseInt(saved, 10) : 350;
  });
  const [userStreak, setUserStreak] = useState<number>(0);
  const [fanExcitement, setFanExcitement] = useState<number>(65);
  const [supportSplit, setSupportSplit] = useState<{ [teamCode: string]: number }>({ CSK: 58, MI: 42 });
  
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(5); // seconds per ball
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const battingRosterIndex = useRef<number>(4); // keeps index of next batsman in roster to play
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize selected match
  useEffect(() => {
    // Save points to storage if changed
    localStorage.setItem('cricpulse_user_points', userPoints.toString());
  }, [userPoints]);

  useEffect(() => {
    if (activeMatchId === 'match-1') {
      const kkrMi = createDefaultScorecard('KKR', 'MI');
      
      // Determine if match hour is currently active: approx 13:00 to 20:59 UTC
      const utcHours = new Date().getUTCHours();
      const isMatchHours = utcHours >= 13 && utcHours < 21;

      if (isMatchHours) {
        // Automatically start the match as live!
        kkrMi.status = 'live';
        setMatch(kkrMi);
        setMoments(INITIAL_MOMENTS);
        setChatMessages(INITIAL_CHAT);
        setPolls(INITIAL_POLLS);
        setSupportSplit({ KKR: 55, MI: 45 });
        setIsSimulating(true);
      } else {
        // Standard pre-match upcoming setup
        kkrMi.runs = 0;
        kkrMi.wickets = 0;
        kkrMi.oversCompleted = 0;
        kkrMi.ballsCurrentOver = 0;
        kkrMi.recentBalls = [];
        // Empty batting/bowl stats for upcoming
        Object.keys(kkrMi.scorecard.batting).forEach(k => {
          kkrMi.scorecard.batting[k].runs = 0;
          kkrMi.scorecard.batting[k].balls = 0;
          kkrMi.scorecard.batting[k].fours = 0;
          kkrMi.scorecard.batting[k].sixes = 0;
          kkrMi.scorecard.batting[k].strikeRate = 0;
        });
        Object.keys(kkrMi.scorecard.bowling).forEach(k => {
          kkrMi.scorecard.bowling[k].overs = 0;
          kkrMi.scorecard.bowling[k].runsConceded = 0;
          kkrMi.scorecard.bowling[k].wickets = 0;
          kkrMi.scorecard.bowling[k].economy = 0;
        });
        setMatch(kkrMi);
        setMoments([
          {
            id: 'prematch-moment-1-kkr',
            over: 0,
            ball: 0,
            type: 'info',
            title: 'Squads Prepared!',
            desc: 'KKR and MI lineups lock in. The ground crew at Eden Gardens reports a hard, high-scoring surface!',
            timestamp: '18:15',
            reactionCount: 450
          }
        ]);
        setChatMessages(INITIAL_CHAT);
        setPolls(INITIAL_POLLS);
        setSupportSplit({ KKR: 55, MI: 45 });
        setIsSimulating(false);
      }
      battingRosterIndex.current = 4;
    } else if (activeMatchId === 'match-2') {
      // Upcoming match RCB vs CSK
      const rcbCsk = createDefaultScorecard('RCB', 'CSK');
      rcbCsk.status = 'upcoming';
      rcbCsk.runs = 0;
      rcbCsk.wickets = 0;
      rcbCsk.oversCompleted = 0;
      rcbCsk.ballsCurrentOver = 0;
      rcbCsk.recentBalls = [];
      // Empty batting/bowl stats for upcoming
      Object.keys(rcbCsk.scorecard.batting).forEach(k => {
        rcbCsk.scorecard.batting[k].runs = 0;
        rcbCsk.scorecard.batting[k].balls = 0;
        rcbCsk.scorecard.batting[k].fours = 0;
        rcbCsk.scorecard.batting[k].sixes = 0;
        rcbCsk.scorecard.batting[k].strikeRate = 0;
      });
      Object.keys(rcbCsk.scorecard.bowling).forEach(k => {
        rcbCsk.scorecard.bowling[k].overs = 0;
        rcbCsk.scorecard.bowling[k].runsConceded = 0;
        rcbCsk.scorecard.bowling[k].wickets = 0;
        rcbCsk.scorecard.bowling[k].economy = 0;
      });
      setMatch(rcbCsk);
      setMoments([
        {
          id: 'prematch-moment-1-rcb',
          over: 0,
          ball: 0,
          type: 'info',
          title: 'Squads Prepared!',
          desc: 'RCB and CSK lineups lock in. The ground crew reports a flat, hard surface high on runs!',
          timestamp: '11:15',
          reactionCount: 120
        }
      ]);
      setChatMessages([
        {
          id: 'chat-idx-1',
          username: 'KohliIsKing_18',
          teamCode: 'RCB',
          text: 'EE SALA CUP NAMDE! Bold red flags high today! ❤️🏆',
          timestamp: '11:20'
        },
        {
          id: 'chat-idx-2',
          username: 'Thalapathy_Fans',
          teamCode: 'CSK',
          text: 'Whistle Podu and yellow flags represent Chennai Super Kings! Let\'s go guys! 💛',
          timestamp: '11:25'
        }
      ]);
      setPolls([
        {
          id: 'poll-rcb-1',
          question: 'Who will win the opening toss?',
          options: ['RCB', 'CSK'],
          votes: [740, 410],
          active: true,
          timeRemaining: 1500,
          totalVotes: 1150
        }
      ]);
      setSupportSplit({ RCB: 64, CSK: 36 });
    } else if (activeMatchId === 'match-3') {
      // Finished match
      const gtRr = createDefaultScorecard('GT', 'RR');
      gtRr.status = 'finished';
      gtRr.runs = 176;
      gtRr.wickets = 6;
      gtRr.oversCompleted = 20;
      gtRr.ballsCurrentOver = 0;
      gtRr.recentBalls = ['1', '0', 'W', '4', '1', '2'];
      setMatch(gtRr);
      setMoments([
        {
          id: 'finished-moment-1',
          over: 20,
          ball: 6,
          type: 'info',
          title: 'Gujarat Titans secured victory!',
          desc: 'Titans bowlers pull off a dramatic defense, bowling Rajasthan Royals out for 168. GT wins by 8 runs.',
          timestamp: 'Yesterday',
          reactionCount: 4200
        }
      ]);
      setChatMessages([
        {
          id: 'chat-gt-1',
          username: 'Gill_Command',
          teamCode: 'GT',
          text: 'AAVA DE! Splendid tactical victory for Shubman Gill\'s titans!',
          timestamp: 'Yesterday'
        }
      ]);
      setPolls([]);
      setSupportSplit({ GT: 45, RR: 55 });
    } else {
      setMatch(null);
    }
  }, [activeMatchId]);

  // Dynamic colors injection on DOM
  useEffect(() => {
    if (!match) return;

    const battingTheme = getTeamTheme(match.battingTeam);
    const bowlingTheme = getTeamTheme(match.bowlingTeam);

    // Apply color values to CSS global scope
    const root = document.documentElement;
    root.style.setProperty('--team-primary', battingTheme.primary);
    root.style.setProperty('--team-secondary', battingTheme.secondary);
    root.style.setProperty('--team-accent', battingTheme.accent);

    root.style.setProperty('--opp-primary', bowlingTheme.primary);
    root.style.setProperty('--opp-secondary', bowlingTheme.secondary);
    root.style.setProperty('--opp-accent', bowlingTheme.accent);

    // Alpha versions of primary for backgrounds
    root.style.setProperty('--team-primary-alpha', `${battingTheme.primary}25`);
    root.style.setProperty('--opp-primary-alpha', `${bowlingTheme.primary}25`);
  }, [match]);

  // Helper function to return a random item from an array
  const getRandomItem = <T,>(arr: T[]): T => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  // Simulate single Ball outcome
  const simulateBall = () => {
    if (!match || match.status !== 'live') return;

    const batTeam = TEAMS[match.battingTeam];
    const bowlTeam = TEAMS[match.bowlingTeam];

    // Strike batsman & Bowler
    const strikeBatsmanRef = match.batsmen[0];
    const nonStrikeBatsmanRef = match.batsmen[1];
    const activeBowlerRef = match.bowler;

    if (!strikeBatsmanRef || !nonStrikeBatsmanRef || !activeBowlerRef) return;

    // Ball probability generator
    // Outcome: 0, 1, 2, 4, 6, W, wd, nb
    const roll = Math.random() * 100;
    let outcome: BallOutcome;

    if (roll < 32) {
      outcome = { runs: 0, isWicket: false, isExtra: false, display: '0', description: 'Good defensive block.' };
    } else if (roll < 66) {
      outcome = { runs: 1, isWicket: false, isExtra: false, display: '1', description: 'Placed into deep space for a single.' };
    } else if (roll < 73) {
      outcome = { runs: 2, isWicket: false, isExtra: false, display: '2', description: 'Driven with force, quick running earns two.' };
    } else if (roll < 83) {
      outcome = { runs: 4, isWicket: false, isExtra: true, extraType: 'wd', display: '1wd', description: 'Wide ball down down leg-side.' } ;
      // Note: we can adjust wide probability. Let's make wide or check next rules
    } else if (roll < 89) {
      const sixSmashed = Math.random() < 0.35;
      if (sixSmashed) {
        outcome = { runs: 6, isWicket: false, isExtra: false, display: '6', description: `BOOM! Smashed over ropes! What a monstrous strike by ${strikeBatsmanRef.name}.` };
      } else {
        outcome = { runs: 4, isWicket: false, isExtra: false, display: '4', description: `CRACKED! Glorious boundary driven through sweet cover by ${strikeBatsmanRef.name}.` };
      }
    } else {
      // Wicket
      const types: Array<'bowled' | 'caught' | 'lbw' | 'runout'> = ['caught', 'bowled', 'lbw', 'runout'];
      const wt = getRandomItem(types);
      outcome = {
        runs: 0,
        isWicket: true,
        wicketType: wt,
        isExtra: false,
        display: 'W',
        description: `WICKET! ${strikeBatsmanRef.name} gets dismissed! ${wt === 'caught' ? 'Super catch' : wt === 'bowled' ? 'Stumps smashed' : 'Plumb in front lbw'} by ${activeBowlerRef.name}.`
      };
    }

    // Now update state
    setMatch(prevMatch => {
      if (!prevMatch) return null;

      const updated = { ...prevMatch };
      const battingScore = { ...updated.scorecard.batting };
      const bowlingScore = { ...updated.scorecard.bowling };

      let runsScored = outcome.runs;
      let extraRuns = 0;
      let earnsExtraBall = false;

      // Handle Extra cases
      if (outcome.isExtra) {
        earnsExtraBall = true;
        extraRuns = 1; // wide is 1 extra
        runsScored = 0; // batsman doesn't get runs
      }

      // 1. Update Match Score totals
      updated.runs += (runsScored + extraRuns);

      // 2. Manage Batman Stats on Strike
      const strikeName = strikeBatsmanRef.name;
      const updatedStrike = { ...battingScore[strikeName] };

      if (!outcome.isExtra) {
        updatedStrike.balls += 1;
        updatedStrike.runs += runsScored;
        if (runsScored === 4) updatedStrike.fours += 1;
        if (runsScored === 6) updatedStrike.sixes += 1;
        updatedStrike.strikeRate = Math.round((updatedStrike.runs / updatedStrike.balls) * 100);
      }
      battingScore[strikeName] = updatedStrike;

      // 3. Manage Bowler stats
      const bowlerName = activeBowlerRef.name;
      const updatedBowler = { ...bowlingScore[bowlerName] };
      
      updatedBowler.runsConceded = (updatedBowler.runsConceded || 0) + runsScored + extraRuns;
      if (!outcome.isExtra) {
        // Increment balls
        const totalBalls = (typeof updatedBowler.overs === 'number' ? Math.floor(updatedBowler.overs) * 6 + Math.round((updatedBowler.overs % 1) * 10) : 0) + 1;
        const completeOvers = Math.floor(totalBalls / 6);
        const overFrac = totalBalls % 6;
        updatedBowler.overs = completeOvers + overFrac / 10;
        updatedBowler.economy = parseFloat(( (updatedBowler.runsConceded / (totalBalls / 6)) ).toFixed(2));
      }
      
      if (outcome.isWicket) {
        updatedBowler.wickets = (updatedBowler.wickets || 0) + 1;
      }
      bowlingScore[bowlerName] = updatedBowler;

      // Swap batsmen arrays or batsman replacement
      let batsmenList = [...updated.batsmen];
      let newWickets = updated.wickets;

      if (outcome.isWicket) {
        newWickets += 1;
        updated.wickets = newWickets;

        // Batsman dismissed
        if (newWickets >= 10) {
          // Innings finish
          updated.status = 'finished';
          setIsSimulating(false);
          setToast({ message: 'First innings concluded! Innings completed.', type: 'info' });
        } else {
          // Bring on replacement
          const nextIndex = battingRosterIndex.current;
          const nextPlayerName = batTeam.players[nextIndex];
          
          if (nextPlayerName) {
            battingRosterIndex.current += 1;
            const newBatsman: PlayerStats = {
              name: nextPlayerName,
              isBatsman: true,
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0
            };
            battingScore[nextPlayerName] = newBatsman;
            
            // Strike batsman departs, replaced
            batsmenList[0] = newBatsman;
            setToast({ message: `WICKET! ${strikePlayerBanterName(strikeName)} departs. ${nextPlayerName} steps in!`, type: 'error' });
          }
        }
      } else {
        // Runs scored, update list value references
        batsmenList[0] = updatedStrike;
      }

      // 4. Swap strike on odd runs
      if (runsScored === 1 || runsScored === 3) {
        const temp = batsmenList[0];
        batsmenList[0] = batsmenList[1];
        batsmenList[1] = temp;
      }

      // 5. Bookkeep Overs
      let currentBallsArray = [...updated.recentBalls];
      currentBallsArray.push(outcome.display);

      if (!earnsExtraBall) {
        updated.ballsCurrentOver += 1;
        
        // Wrap Over ends
        if (updated.ballsCurrentOver === 6) {
          updated.oversCompleted += 1;
          updated.ballsCurrentOver = 0;
          updated.recentBalls = []; // Reset over array
          
          // Swap strike ends for next over
          const temp = batsmenList[0];
          batsmenList[0] = batsmenList[1];
          batsmenList[1] = temp;

          // Select another bowler randomly
          const bowlingSquad = bowlTeam.players.slice(6); // bowlers indexes
          const availableBowlers = bowlingSquad.filter(p => p !== bowlerName);
          const nextBowlerName = getRandomItem(availableBowlers) || bowlingSquad[0];

          if (!bowlingScore[nextBowlerName]) {
            bowlingScore[nextBowlerName] = {
              name: nextBowlerName,
              isBatsman: false,
              overs: 0,
              maidens: 0,
              runsConceded: 0,
              wickets: 0,
              economy: 0
            };
          }
          updated.bowler = bowlingScore[nextBowlerName];
          setToast({ message: `Over complete! ${nextBowlerName} is ready to bowl next.`, type: 'info' });
        } else {
          updated.recentBalls = currentBallsArray;
        }
      } else {
        updated.recentBalls = currentBallsArray;
      }

      updated.batsmen = batsmenList as [PlayerStats, PlayerStats];
      updated.scorecard = { batting: battingScore as any, bowling: bowlingScore as any };

      // Make sure we update bowler stats values inside scoreboard
      updated.bowler = bowlingScore[updated.bowler.name];

      return updated;
    });

    // Match Moment creation based on score
    setMatch(updatedMatch => {
      if (!updatedMatch) return null;

      // Handle custom match moment triggers
      if (outcome.display === '6' || outcome.display === '4' || outcome.display === 'W') {
        const momentType = outcome.display === 'W' ? 'wicket' : outcome.display === '6' ? 'six' : 'four';
        const momentTitle = outcome.display === 'W' ? 'Wicket Falls!' : outcome.display === '6' ? 'MASSIVE SIX!' : 'Terrific Boundary!';
        
        const newMoment: MatchMoment = {
          id: `moment-${Date.now()}-${Math.random()}`,
          over: updatedMatch.oversCompleted,
          ball: updatedMatch.ballsCurrentOver,
          type: momentType,
          title: momentTitle,
          desc: outcome.description,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reactionCount: Math.round(100 + Math.random() * 500)
        };
        
        setMoments(prev => [newMoment, ...prev]);

        // Fan excitement spike
        setFanExcitement(95);

        // Auto reaction bubbles
        const reactionsPool = outcome.display === '6' ? COMMENTS_SIX : outcome.display === '4' ? COMMENTS_FOUR : COMMENTS_WICKET;
        const fansPool = match.battingTeam === 'CSK' ? (outcome.display === 'W' ? FAN_NAMES_MI : FAN_NAMES_CSK) : (outcome.display === 'W' ? FAN_NAMES_CSK : FAN_NAMES_MI);
        
        const randomFan = getRandomItem(fansPool);
        const randomComment = getRandomItem(reactionsPool);

        const sideTeam = outcome.display === 'W' ? match.bowlingTeam : match.battingTeam;

        const liveChatMessage: ChatMessage = {
          id: `chat-${Date.now()}-${Math.random()}`,
          username: randomFan,
          teamCode: sideTeam,
          text: randomComment,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [liveChatMessage, ...prev]);
      } else {
        // Mild decay of excitement back to 50s range
        setFanExcitement(prev => Math.max(50, prev - 3));

        // Occasional regular chatter
        if (Math.random() < 0.4) {
          const side = Math.random() < 0.5 ? match.battingTeam : match.bowlingTeam;
          const fans = side === 'CSK' ? FAN_NAMES_CSK : FAN_NAMES_MI;
          const liveChatMessage: ChatMessage = {
            id: `chat-${Date.now()}-${Math.random()}`,
            username: getRandomItem(fans),
            teamCode: side,
            text: getRandomItem(COMMENTS_NEUTRAL),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setChatMessages(prev => [liveChatMessage, ...prev]);
        }
      }

      // Check current predictions correctness evaluation
      setPredictions(prevPredicts => {
        return prevPredicts.map(pred => {
          if (pred.status !== 'pending' || pred.type !== 'ball') return pred;

          // Check if prediction is correct
          // Target matches format 'outcome:...'
          const guessVal = pred.predictionValue; // e.g. "6", "W", "Dot", "Boundary"
          let isCorrect = false;
          let earned = 0;

          const isDot = outcome.display === '0';
          const isSingle = outcome.display === '1' || outcome.display === '2';
          const isFour = outcome.display === '4';
          const isSix = outcome.display === '6';
          const isWicket = outcome.display === 'W';
          const isBoundary = isFour || isSix;

          if (guessVal === '6' && isSix) isCorrect = true;
          if (guessVal === '4' && isFour) isCorrect = true;
          if (guessVal === 'Wicket' && isWicket) isCorrect = true;
          if (guessVal === 'Boundary' && isBoundary) isCorrect = true;
          if (guessVal === 'Dot' && isDot) isCorrect = true;
          if (guessVal === 'Runs' && isSingle) isCorrect = true;

          if (isCorrect) {
            earned = guessVal === '6' ? 120 : guessVal === 'Wicket' ? 100 : guessVal === '4' ? 80 : 30;
            setUserPoints(pts => pts + earned);
            setUserStreak(stk => stk + 1);
            setShowConfetti(true);
            setToast({ message: `🎯 Correct Prediction! Earned +${earned} Points! 🔥 Streak: ${userStreak + 1}`, type: 'success' });
            return { ...pred, status: 'correct', pointsEarned: earned };
          } else {
            setUserStreak(0);
            return { ...pred, status: 'incorrect', pointsEarned: 0 };
          }
        });
      });

      // Periodically update polls votes dynamically
      setPolls(prevPolls => {
        return prevPolls.map(poll => {
          if (!poll.active) return poll;
          
          // Random additions to represent live traffic
          const updatedVotes = [...poll.votes];
          const optIndex = Math.floor(Math.random() * poll.options.length);
          updatedVotes[optIndex] += Math.floor(Math.random() * 8) + 1;

          const remaining = Math.max(0, poll.timeRemaining - 5);
          return {
            ...poll,
            votes: updatedVotes,
            totalVotes: updatedVotes.reduce((a, b) => a + b, 0),
            timeRemaining: remaining,
            active: remaining > 0
          };
        });
      });

      return updatedMatch;
    });
  };

  const strikePlayerBanterName = (full: string) => {
    return full.split(' ')[0] || full;
  };

  // Switch simulation on/off
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    setToast({ message: isSimulating ? 'Match ticker paused.' : 'Live Match ticker resumed!', type: 'info' });
  };

  // Fast forward trigger button
  const triggerNextBallManual = () => {
    simulateBall();
    setToast({ message: '⚡ Simulated next ball in-play!', type: 'success' });
  };

  // Prediction Submit
  const submitPrediction = (guess: string, predictType: 'ball' | 'over' | 'match', target: string) => {
    // Dedect points threshold
    const cost = predictType === 'ball' ? 15 : predictType === 'over' ? 30 : 50;
    if (userPoints < cost) {
      setToast({ message: '🚫 Insufficient Points. Vote in polls or chat to earn more!', type: 'error' });
      return;
    }

    const nextBallsOver = match ? `${match.oversCompleted}.${match.ballsCurrentOver + 1}` : 'N/A';

    const newPred: Prediction = {
      id: `${Date.now()}-${Math.random()}`,
      type: predictType,
      targetValue: predictType === 'ball' ? `Over ${nextBallsOver}` : target,
      predictionValue: guess,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setUserPoints(prev => prev - cost);
    setPredictions(prev => [newPred, ...prev]);
    setToast({ message: `🚀 Prediction locked in for ${cost} points. Good luck!`, type: 'success' });
  };

  // Poll Choice Submit
  const submitVote = (pollId: string, optionIndex: number) => {
    setPolls(prev => {
      return prev.map(p => {
        if (p.id !== pollId) return p;
        if (p.userVoteIndex !== undefined) return p; // already voted
        
        const nextVotes = [...p.votes];
        nextVotes[optionIndex] += 1;
        setUserPoints(pts => pts + 20); // Reward active participant engagement! Excellent nudge!

        // Adjust support split ratio slightly matching selection bias
        if (match) {
          const side = getTeamTheme(match.homeTeam).code;
          const away = getTeamTheme(match.awayTeam).code;
          setSupportSplit(cur => {
            const ratio = optionIndex === 0 ? 1 : -1;
            const currentSideVal = cur[side] !== undefined ? cur[side] : 50;
            const updatedSide = Math.min(85, Math.max(15, currentSideVal + ratio * 2));
            return {
              [side]: updatedSide,
              [away]: 100 - updatedSide
            };
          });
        }

        setToast({ message: '🗳️ Vote counted! Engaging rewards +20 Points granted.', type: 'success' });
        return {
          ...p,
          votes: nextVotes,
          totalVotes: p.totalVotes + 1,
          userVoteIndex: optionIndex
        };
      });
    });
  };

  // Add Chat msg manually
  const addChatMessage = (text: string) => {
    if (!text.trim() || !match) return;

    const userMsg: ChatMessage = {
      id: `user-chat-${Date.now()}`,
      username: 'You (PaltanFan)',
      teamCode: match.homeTeam,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true
    };

    setChatMessages(prev => [userMsg, ...prev]);
    setUserPoints(pts => pts + 10); // Reward active chatting/bantering!
    setToast({ message: '💬 Message broadcast! Engagement bonus +10 Points granted.', type: 'info' });
  };

  // Reset metrics
  const resetAllStats = () => {
    setUserPoints(500);
    setUserStreak(0);
    setPredictions([]);
    setToast({ message: '🔄 Reset prediction profiles & scorecard histories.', type: 'info' });
  };

  // Start upcoming match live instantly
  const startMatchLive = () => {
    if (match) {
      if (activeMatchId === 'match-1') {
        const liveKkrMi = createDefaultScorecard('KKR', 'MI');
        setMatch(liveKkrMi);
        setMoments(INITIAL_MOMENTS);
      } else if (activeMatchId === 'match-2') {
        const liveRcbCsk = createDefaultScorecard('RCB', 'CSK');
        setMatch(liveRcbCsk);
        setMoments([
          {
            id: 'moment-rcb-live-1',
            over: 1,
            ball: 1,
            type: 'info',
            title: 'Match Commenced!',
            desc: 'RCB won the toss and elected to field first. CSK batsmen are heading out to the crease!',
            timestamp: '19:30',
            reactionCount: 520
          }
        ]);
      } else {
        setMatch(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'live' as const
          };
        });
      }
      setIsSimulating(true);
      setToast({ message: '🏏 Game commenced! Toss concluded and match is live-in-play!', type: 'success' });
    }
  };

  // Simulation timer loop
  useEffect(() => {
    if (isSimulating && match && match.status === 'live') {
      simulationTimerRef.current = setInterval(() => {
        simulateBall();
      }, simulationSpeed * 1000);
    }

    return () => {
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
    };
  }, [isSimulating, match, simulationSpeed]);

  return (
    <MatchContext.Provider
      value={{
        activeMatchId,
        setActiveMatchId,
        match,
        moments,
        chatMessages,
        polls,
        predictions,
        userPoints,
        userStreak,
        fanExcitement,
        supportSplit,
        isSimulating,
        simulationSpeed,
        setSimulationSpeed,
        toggleSimulation,
        triggerNextBallManual,
        submitPrediction,
        submitVote,
        addChatMessage,
        toast,
        setToast,
        resetAllStats,
        showConfetti,
        setShowConfetti,
        startMatchLive
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used inside a MatchProvider');
  }
  return context;
};

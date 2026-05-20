/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Match, MatchMoment, ChatMessage, LivePoll, Team } from '../types';
import { TEAMS } from './mock-teams';

// Generates an initial clean match scorecard for a given batting and bowling team
export function createDefaultScorecard(battingTeamCode: string, bowlingTeamCode: string): Match {
  const batTeam = TEAMS[battingTeamCode];
  const bowlTeam = TEAMS[bowlingTeamCode];

  const battingScorecard: { [name: string]: any } = {};
  batTeam.players.forEach((player, index) => {
    battingScorecard[player] = {
      name: player,
      isBatsman: true,
      runs: index === 0 ? 42 : index === 1 ? 56 : index === 2 ? 15 : index === 3 ? 8 : 0,
      balls: index === 0 ? 28 : index === 1 ? 36 : index === 2 ? 11 : index === 3 ? 6 : 0,
      fours: index === 0 ? 4 : index === 1 ? 5 : index === 2 ? 1 : index === 3 ? 1 : 0,
      sixes: index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 0 : index === 3 ? 0 : 0,
      strikeRate: index < 4 ? Math.round(( (index === 0 ? 42 : index === 1 ? 56 : index === 2 ? 15 : 8) / (index === 0 ? 28 : index === 1 ? 36 : index === 2 ? 11 : 6) ) * 100) : 0
    };
  });

  const bowlingScorecard: { [name: string]: any } = {};
  bowlTeam.players.slice(7).forEach((player, index) => {
    bowlingScorecard[player] = {
      name: player,
      isBatsman: false,
      overs: index === 0 ? 3 : index === 1 ? 3 : index === 2 ? 3 : index === 3 ? 1 : 0,
      maidens: 0,
      runsConceded: index === 0 ? 28 : index === 1 ? 19 : index === 2 ? 34 : index === 3 ? 12 : 0,
      wickets: index === 0 ? 1 : index === 1 ? 1 : index === 2 ? 0 : index === 3 ? 0 : 0,
      economy: index === 0 ? 9.3 : index === 1 ? 6.3 : index === 2 ? 11.3 : index === 3 ? 12.0 : 0
    };
  });

  // Current batsmen on fold
  const activeBatsman1 = battingScorecard[batTeam.players[2]]; // index 2 is on strike
  const activeBatsman2 = battingScorecard[batTeam.players[3]]; // index 3 is non-strike
  const activeBowler = bowlingScorecard[bowlTeam.players[8]]; // bowler on strike

  return {
    id: `ipl-live-${battingTeamCode.toLowerCase()}-${bowlingTeamCode.toLowerCase()}`,
    homeTeam: battingTeamCode,
    awayTeam: bowlingTeamCode,
    status: 'live',
    venue: battingTeamCode === 'KKR' ? 'Eden Gardens, Kolkata' : battingTeamCode === 'CSK' ? 'MA Chidambaram Stadium, Chennai' : battingTeamCode === 'RCB' ? 'M. Chinnaswamy Stadium, Bengaluru' : 'Wankhede Stadium, Mumbai',
    dateTime: 'Today, 7:30 PM',
    oversTotal: 20,
    currentInnings: 1,
    oversCompleted: 15,
    ballsCurrentOver: 4,
    runs: 138,
    wickets: 2,
    battingTeam: battingTeamCode,
    bowlingTeam: bowlingTeamCode,
    recentBalls: ['1', '4', 'W', '6'],
    batsmen: [activeBatsman1, activeBatsman2],
    bowler: activeBowler,
    scorecard: {
      batting: battingScorecard as any,
      bowling: bowlingScorecard as any
    }
  };
}

export const MATCHES_SCHEDULE = [
  {
    id: 'match-1',
    homeTeam: 'KKR',
    awayTeam: 'MI',
    status: 'upcoming' as 'live' | 'upcoming' | 'finished',
    venue: 'Eden Gardens, Kolkata',
    time: 'Tonight, 7:30 PM',
    desc: 'The fierce battle of champions: Shreyas Iyer\'s Knight Riders host Hardik Pandya\'s Mumbai Indians at the legendary Eden Gardens.'
  },
  {
    id: 'match-2',
    homeTeam: 'RCB',
    awayTeam: 'CSK',
    status: 'upcoming' as 'live' | 'upcoming' | 'finished',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    time: 'Tomorrow, 7:30 PM',
    desc: 'Royal rivals: Kohli and Challengers prep to face the legendary Yellow Army.'
  },
  {
    id: 'match-3',
    homeTeam: 'GT',
    awayTeam: 'RR',
    status: 'finished' as 'live' | 'upcoming' | 'finished',
    venue: 'Narendra Modi Stadium, Ahmedabad',
    time: 'Yesterday',
    desc: 'Thriller clash: Titans managed to restrict Royals and secure a heroic 8 runs victory!'
  },
  {
    id: 'match-4',
    homeTeam: 'SRH',
    awayTeam: 'DC',
    status: 'upcoming' as 'live' | 'upcoming' | 'finished',
    venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad',
    time: 'May 22, 7:30 PM',
    desc: 'Power hitters showdown: Sunrisers ready their aggressive batting squad against Rishabh Pant\'s Capitals.'
  }
];

export const INITIAL_MOMENTS: MatchMoment[] = [
  {
    id: 'moment-1',
    over: 1,
    ball: 1,
    type: 'info',
    title: 'Match Commenced!',
    desc: 'KKR won the toss and elected to bat first on a solid batting surface at Eden Gardens.',
    timestamp: '19:30',
    reactionCount: 245
  },
  {
    id: 'moment-2',
    over: 4,
    ball: 2,
    type: 'four',
    title: 'Flawless Boundary by Phil Salt!',
    desc: 'Phil Salt lofts a full delivery from Bumrah delicately over the cover region.',
    timestamp: '19:48',
    reactionCount: 940
  },
  {
    id: 'moment-3',
    over: 7,
    ball: 5,
    type: 'wicket',
    title: 'Sunil Narine Bowled!',
    desc: 'Piyush Chawla beats the defense with a turning leg break! Narine departs at 32.',
    timestamp: '20:02',
    reactionCount: 1520
  },
  {
    id: 'moment-4',
    over: 12,
    ball: 3,
    type: 'six',
    title: 'Rinku Smashes a Massive Six!',
    desc: 'Rinku Singh clears his front leg and sends the ball into the Eden Gardens crowd! 102 meters!',
    timestamp: '20:25',
    reactionCount: 2200
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'chat-1',
    username: 'Korbo_Lorbo_Jeetbo',
    teamCode: 'KKR',
    text: 'Ami KKR! Purple storm is arriving in Eden Gardens! Let\'s go guys! 💜🏆',
    timestamp: '19:28'
  },
  {
    id: 'chat-2',
    username: 'MI_Paltan_45',
    teamCode: 'MI',
    text: 'Blue is the color! Bumrah ready to rip through the KKR top order today!',
    timestamp: '19:30'
  },
  {
    id: 'chat-3',
    username: 'Rinku_Cult_45',
    teamCode: 'KKR',
    text: 'Phil Salt looking very solid today, gorgeous timings.',
    timestamp: '19:42'
  },
  {
    id: 'chat-4',
    username: 'Rohit_Goat45',
    teamCode: 'MI',
    text: 'Nice bowling Piyush chacha! First breakthrough for MI!',
    timestamp: '20:03'
  },
  {
    id: 'chat-5',
    username: 'King_Russell_Power',
    teamCode: 'KKR',
    text: 'Waiting for Andre Dre-Russ to arrive. Eden Gardens is going to go crazy!',
    timestamp: '20:10'
  }
];

export const INITIAL_POLLS: LivePoll[] = [
  {
    id: 'poll-1',
    question: 'How many runs will Kolkata Knight Riders score in their first innings?',
    options: ['Under 160', '161 - 180', '181 - 200', '200+'],
    votes: [120, 480, 750, 310],
    active: true,
    timeRemaining: 180,
    totalVotes: 1660
  },
  {
    id: 'poll-2',
    question: 'Who will be the highest wicket-taker for Mumbai Indians tonight?',
    options: ['Jasprit Bumrah', 'Gerald Coetzee', 'Piyush Chawla', 'Hardik Pandya'],
    votes: [920, 240, 150, 80],
    active: true,
    timeRemaining: 300,
    totalVotes: 1390
  }
];

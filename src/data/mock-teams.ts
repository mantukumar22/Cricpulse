/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Team } from '../types';

export const TEAMS: Record<string, Team> = {
  CSK: {
    code: 'CSK',
    name: 'Chennai Super Kings',
    shortName: 'Super Kings',
    primary: '#FFCB05', // Gold
    secondary: '#0081E9', // Blue
    accent: '#FF6B00', // Orange
    players: [
      'Ruturaj Gaikwad',
      'Rachin Ravindra',
      'Shivam Dube',
      'Ravindra Jadeja',
      'MS Dhoni',
      'Daryl Mitchell',
      'Sameer Rizvi',
      'Shardul Thakur',
      'Maheesh Theekshana',
      'Matheesha Pathirana',
      'Tushar Deshpande'
    ]
  },
  MI: {
    code: 'MI',
    name: 'Mumbai Indians',
    shortName: 'Indians',
    primary: '#004BA0', // Blue
    secondary: '#D4AF37', // Gold
    accent: '#FFFFFF', // White
    players: [
      'Rohit Sharma',
      'Ishan Kishan',
      'Suryakumar Yadav',
      'Tilak Varma',
      'Hardik Pandya',
      'Tim David',
      'Romario Shepherd',
      'Gerald Coetzee',
      'Jasprit Bumrah',
      'Piyush Chawla',
      'Akash Madhwal'
    ]
  },
  RCB: {
    code: 'RCB',
    name: 'Royal Challengers Bengaluru',
    shortName: 'Challengers',
    primary: '#EC1C24', // Red
    secondary: '#2B2B2B', // Dark Grey/Black
    accent: '#CFB53B', // Metallic Gold
    players: [
      'Virat Kohli',
      'Faf du Plessis',
      'Rajat Patidar',
      'Cameron Green',
      'Glenn Maxwell',
      'Dinesh Karthik',
      'Mahipal Lomror',
      'Karn Sharma',
      'Mohammed Siraj',
      'Yash Dayal',
      'Lockie Ferguson'
    ]
  },
  KKR: {
    code: 'KKR',
    name: 'Kolkata Knight Riders',
    shortName: 'Knight Riders',
    primary: '#3A225D', // Purple
    secondary: '#FFD700', // Gold
    accent: '#FFFFFF', // White
    players: [
      'Phil Salt',
      'Sunil Narine',
      'Venkatesh Iyer',
      'Shreyas Iyer',
      'Rinku Singh',
      'Andre Russell',
      'Ramandeep Singh',
      'Mitchell Starc',
      'Harshit Rana',
      'Varun Chakaravarthy',
      'Vaibhav Arora'
    ]
  },
  DC: {
    code: 'DC',
    name: 'Delhi Capitals',
    shortName: 'Capitals',
    primary: '#004C93', // Blue
    secondary: '#EF1B23', // Red
    accent: '#FFFFFF', // White
    players: [
      'David Warner',
      'Prithvi Shaw',
      'Jake Fraser-McGurk',
      'Rishabh Pant',
      'Tristan Stubbs',
      'Axar Patel',
      'Abishek Porel',
      'Kuldeep Yadav',
      'Khaleel Ahmed',
      'Mukesh Kumar',
      'Anrich Nortje'
    ]
  },
  PBKS: {
    code: 'PBKS',
    name: 'Punjab Kings',
    shortName: 'Kings',
    primary: '#ED1B24', // Red
    secondary: '#A7A9AC', // Silver
    accent: '#DCDDDF', // Light Silver
    players: [
      'Shikhar Dhawan',
      'Jonny Bairstow',
      'Prabhsimran Singh',
      'Sam Curran',
      'Liam Livingstone',
      'Jitesh Sharma',
      'Shashank Singh',
      'Ashutosh Sharma',
      'Harpreet Brar',
      'Harshal Patel',
      'Kagiso Rabada'
    ]
  },
  RR: {
    code: 'RR',
    name: 'Rajasthan Royals',
    shortName: 'Royals',
    primary: '#EA1A85', // Pink
    secondary: '#254AA5', // Royal Blue
    accent: '#FFFFFF', // White
    players: [
      'Yashasvi Jaiswal',
      'Jos Buttler',
      'Sanju Samson',
      'Riyan Parag',
      'Dhruv Jurel',
      'Shimron Hetmyer',
      'Ravichandran Ashwin',
      'Trent Boult',
      'Avesh Khan',
      'Yuzvendra Chahal',
      'Sandeep Sharma'
    ]
  },
  SRH: {
    code: 'SRH',
    name: 'Sunrisers Hyderabad',
    shortName: 'Sunrisers',
    primary: '#FF822A', // Orange
    secondary: '#000000', // Black
    accent: '#FFFFFF', // White
    players: [
      'Travis Head',
      'Abhishek Sharma',
      'Heinrich Klaasen',
      'Aiden Markram',
      'Nitish Kumar Reddy',
      'Abdul Samad',
      'Shahbaz Ahmed',
      'Pat Cummins',
      'Bhuvneshwar Kumar',
      'Mayank Markande',
      'T Natarajan'
    ]
  },
  GT: {
    code: 'GT',
    name: 'Gujarat Titans',
    shortName: 'Titans',
    primary: '#1B2133', // Navy Blue
    secondary: '#A0D2F0', // Sky Blue
    accent: '#FFD700', // Gold
    players: [
      'Shubman Gill',
      'Wriddhiman Saha',
      'Sai Sudharsan',
      'David Miller',
      'Vijay Shankar',
      'Rahul Tewatia',
      'Rashid Khan',
      'Noor Ahmad',
      'Mohit Sharma',
      'Umesh Yadav',
      'Spencer Johnson'
    ]
  },
  LSG: {
    code: 'LSG',
    name: 'Lucknow Super Giants',
    shortName: 'Super Giants',
    primary: '#A72056', // Maroon
    secondary: '#59C5E5', // Cyan
    accent: '#FFFFFF', // White
    players: [
      'KL Rahul',
      'Quinton de Kock',
      'Marcus Stoinis',
      'Nicholas Pooran',
      'Ayush Badoni',
      'Deepak Hooda',
      'Krunal Pandya',
      'Ravi Bishnoi',
      'Mohsin Khan',
      'Mayank Yadav',
      'Yash Thakur'
    ]
  }
};

/**
 * Returns theme colors and names for a given team code,
 * defaulting to CSK if not found.
 */
export function getTeamTheme(teamCode: string) {
  return TEAMS[teamCode] || TEAMS.CSK;
}

// Add these types and functions to your utils.ts file

// Types
import type { IPlayer } from '~/data/players';

type TeamData = {
  team1: IPlayer[];
  team2: IPlayer[];
};

type BallAction = {
  type: 'run' | 'wide' | 'noBall' | 'wicket' | 'byes' | 'legByes';
  runs: number;
  batsman?: string;
  bowler?: string;
  timestamp: number;
  // Add more specific fields as needed
};

type InningsData = {
  team: 'team1' | 'team2';
  actions: BallAction[];
  totalRuns: number;
  wickets: number;
  overs: number;
  ballsInOver: number;
};

type MatchData = {
  teams: TeamData;
  innings: {
    innings1: InningsData;
    innings2?: InningsData;
  };
  matchId: string;
  seriesName: string;
  createdAt: number;
  updatedAt: number;
};

// Local Storage Keys
const STORAGE_KEYS = {
  MATCH_PREFIX: 'match_',
  SERIES_PREFIX: 'series_',
} as const;

// Local Storage Utility
const storage = {
  // Get item from localStorage with type safety
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item from localStorage: ${error}`);
      return null;
    }
  },

  // Set item in localStorage
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item in localStorage: ${error}`);
    }
  },

  // Remove item from localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item from localStorage: ${error}`);
    }
  },
};

// Match Data Management
export const matchStorage = {
  // Save match data
  saveMatch: (matchData: Omit<MatchData, 'createdAt' | 'updatedAt'>): void => {
    const now = Date.now();
    const data: MatchData = {
      ...matchData,
      createdAt: now,
      updatedAt: now,
    };
    storage.set(`${STORAGE_KEYS.MATCH_PREFIX}${matchData.matchId}`, data);
  },

  // Get match data by ID
  getMatch: (matchId: string): MatchData | null => {
    return storage.get<MatchData>(`${STORAGE_KEYS.MATCH_PREFIX}${matchId}`);
  },

  // Update innings data
  updateInnings: (
    matchId: string,
    inningsKey: 'innings1' | 'innings2',
    updateFn: (innings: InningsData) => InningsData
  ): void => {
    const match = matchStorage.getMatch(matchId);
    if (!match) return;

    const updatedMatch = {
      ...match,
      innings: {
        ...match.innings,
        [inningsKey]: updateFn(match.innings[inningsKey] as InningsData),
      },
      updatedAt: Date.now(),
    };

    storage.set(`${STORAGE_KEYS.MATCH_PREFIX}${matchId}`, updatedMatch);
  },

  // Add a ball action to an innings
  addBallAction: (
    matchId: string,
    inningsKey: 'innings1' | 'innings2',
    action: Omit<BallAction, 'timestamp'>
  ): void => {
    matchStorage.updateInnings(matchId, inningsKey, (innings) => {
      const newAction: BallAction = {
        ...action,
        timestamp: Date.now(),
      };

      // Update runs and wickets
      const updatedRuns = innings.totalRuns + action.runs;
      const updatedWickets = action.type === 'wicket' ? innings.wickets + 1 : innings.wickets;

      // Update balls and overs
      let updatedBalls = innings.ballsInOver;
      let updatedOvers = innings.overs;

      // Only increment balls for valid deliveries (not wides or no-balls)
      if (!['wide', 'noBall'].includes(action.type)) {
        updatedBalls++;
        if (updatedBalls >= 6) {
          updatedBalls = 0;
          updatedOvers++;
        }
      }

      return {
        ...innings,
        actions: [...innings.actions, newAction],
        totalRuns: updatedRuns,
        wickets: updatedWickets,
        overs: updatedOvers,
        ballsInOver: updatedBalls,
      };
    });
  },

  // Get all matches in a series
  getSeriesMatches: (seriesName: string): MatchData[] => {
    const matches: MatchData[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEYS.MATCH_PREFIX)) {
        const match = storage.get<MatchData>(key);
        if (match && match.seriesName === seriesName) {
          matches.push(match);
        }
      }
    }

    return matches.sort((a, b) => b.updatedAt - a.updatedAt);
  },

  // Initialize a new match
  initializeMatch: (seriesName: string, teams: TeamData): string => {
    const matchId = `match_${Date.now()}`;
    const now = Date.now();

    const newMatch: MatchData = {
      matchId,
      seriesName,
      teams,
      innings: {
        innings1: {
          team: 'team1',
          actions: [],
          totalRuns: 0,
          wickets: 0,
          overs: 0,
          ballsInOver: 0,
        },
        // innings2 will be added when the first innings is complete
      },
      createdAt: now,
      updatedAt: now,
    };

    storage.set(`${STORAGE_KEYS.MATCH_PREFIX}${matchId}`, newMatch);
    return matchId;
  },
};

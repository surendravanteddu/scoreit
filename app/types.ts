export interface IBallHistory {
  type: 'run' | 'wide' | 'noBall' | 'wicket';
  runs: number;
  ballNumber: number;
  overNumber: number;
  batsman?: string;
  bowler?: string;
}

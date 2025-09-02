import type { IPlayer } from '~/data/players';

// Helper function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Function to distribute players by role
const distributePlayersByRole = (players: IPlayer[], playersCount: number) => {
  const batters = players.filter((p) => p.role === 'Batter');
  const allRounders = players.filter((p) => p.role === 'All-Rounder');
  const bowlers = players.filter((p) => p.role === 'Bowler');

  // Calculate required number of each role (rounding to ensure we don't exceed team size)
  const battersCount = Math.round(playersCount * 0.5);
  const allRoundersCount = Math.round(playersCount * 0.2);
  const bowlersCount = playersCount - battersCount - allRoundersCount;

  // Shuffle each role array
  const shuffledBatters = shuffleArray(batters);
  const shuffledAllRounders = shuffleArray(allRounders);
  const shuffledBowlers = shuffleArray(bowlers);

  // Take required number of players from each role
  return [
    ...shuffledBatters.slice(0, battersCount),
    ...shuffledAllRounders.slice(0, allRoundersCount),
    ...shuffledBowlers.slice(0, bowlersCount),
  ];
};

export const teamsSelector = (
  playersCountPerTeam: number,
  allPlayers: IPlayer[] = []
): { team1: IPlayer[]; team2: IPlayer[] } => {
  // Create a copy of all players and shuffle them
  const shuffledPlayers = shuffleArray([...allPlayers]);

  // Create team1 with required distribution
  const team1 = distributePlayersByRole(shuffledPlayers, playersCountPerTeam);

  // Remove team1 players from the pool
  const remainingPlayers = shuffledPlayers.filter(
    (player) => !team1.some((p) => p.name === player.name)
  );

  // Create team2 from remaining players with same distribution
  const team2 = distributePlayersByRole(remainingPlayers, playersCountPerTeam);

  return { team1, team2 };
};

import { GameState } from '@game/models';

/**
 * Get all player IDs from the game state
 */
export function getAllPlayerIds(G: GameState): string[] {
  return Object.keys(G.players);
}

/**
 * Get the total number of players in the game
 */
export function getPlayerCount(G: GameState): number {
  return Object.keys(G.players).length;
}

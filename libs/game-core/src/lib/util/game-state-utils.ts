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

/**
 * Check if a player is eliminated (life <= 0)
 */
export function isPlayerEliminated(G: GameState, playerId: string): boolean {
  const playerState = G.players[playerId];
  return !playerState || playerState.resources.life <= 0;
}

/**
 * Get all player IDs that are still alive (life > 0)
 */
export function getAlivePlayers(G: GameState): string[] {
  return Object.entries(G.players)
    .filter(([, playerState]) => playerState.resources.life > 0)
    .map(([playerId]) => playerId);
}

/**
 * Check if the game has ended and return the winner if there is one.
 * A game ends when only one player remains alive.
 * Returns the winner's player ID if the game has ended, undefined otherwise.
 */
export function checkGameEnd(G: GameState): { winner: string } | undefined {
  const alivePlayers = getAlivePlayers(G);
  
  if (alivePlayers.length === 1) {
    return { winner: alivePlayers[0] };
  }
  
  return undefined;
}

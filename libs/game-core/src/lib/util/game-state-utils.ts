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
 * Draw a card from the player's deck to their hand.
 * Returns true if a card was drawn, false if the deck is empty.
 */
export function drawCardToHand(G: GameState, playerId: string): boolean {
  const playerState = G.players[playerId];

  if (!playerState || playerState.zones.deck.entityIds.length === 0) {
    return false;
  }

  const drawnCardId = playerState.zones.deck.entityIds[0];
  playerState.zones.deck.entityIds = playerState.zones.deck.entityIds.slice(1);
  playerState.zones.hand.entityIds.push(drawnCardId);

  return true;
}

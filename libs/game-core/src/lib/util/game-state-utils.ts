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
 * Check if a player is eliminated (life <= 0).
 * Returns true if the player doesn't exist or has 0 or less life.
 */
export function isPlayerEliminated(G: GameState, playerId: string): boolean {
  const playerState = G.players[playerId];
  if (!playerState) {
    // Non-existent players are treated as eliminated for safety
    return true;
  }
  return playerState.resources.life <= 0;
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

/**
 * Draws a card from a player's deck and adds it to their hand.
 * Does nothing if the deck is empty.
 *
 * @param G - The game state
 * @param playerId - The ID of the player drawing the card
 */
export function drawCardForPlayer(G: GameState, playerId: string): void {
  const playerState = G.players[playerId];

  // Check if there are cards in the deck to draw
  if (playerState.zones.deck.entityIds.length === 0) {
    return;
  }

  // Remove the top card from the deck
  const drawnEntityId = playerState.zones.deck.entityIds.shift();

  if (drawnEntityId) {
    // Add the card to the player's hand
    playerState.zones.hand.entityIds.push(drawnEntityId);
  }
}

/**
 * Discards a card from a player's hand to their graveyard.
 *
 * @param G - The game state
 * @param playerId - The ID of the player discarding the card
 * @param entityId - The ID of the entity (card) to discard
 * @returns true if the card was successfully discarded, false if the card was not in hand
 */
export function discardCardForPlayer(
  G: GameState,
  playerId: string,
  entityId: string
): boolean {
  const playerState = G.players[playerId];

  // Verify the card is in the player's hand
  const cardIndex = playerState.zones.hand.entityIds.indexOf(entityId);
  if (cardIndex === -1) {
    return false;
  }

  // Remove the card from hand
  playerState.zones.hand.entityIds.splice(cardIndex, 1);

  // Add the card to graveyard
  playerState.zones.graveyard.entityIds.push(entityId);

  return true;
}

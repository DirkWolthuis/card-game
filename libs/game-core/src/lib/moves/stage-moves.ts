import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { drawCardToHand } from '../util/game-state-utils';

/**
 * Draw a card from the player's deck to their hand.
 * This move is used during the start stage of a turn.
 */
export const drawCard: Move<GameState> = ({ G, playerID }) => {
  const success = drawCardToHand(G, playerID);
  if (!success) {
    return INVALID_MOVE;
  }
  return G;
};

/**
 * Discard a card from the player's hand.
 * This move is used during the end stage of a turn when the player has more than 7 cards.
 * Placeholder implementation - will be expanded in future.
 */
export const discardCard: Move<GameState> = (
  { G, playerID },
  entityId: string
) => {
  const playerState = G.players[playerID];

  if (!playerState) {
    return INVALID_MOVE;
  }

  const handEntityIds = playerState.zones.hand.entityIds;

  // Validate that the card is in hand
  const cardIndex = handEntityIds.indexOf(entityId);
  if (cardIndex === -1) {
    return INVALID_MOVE;
  }

  // Remove from hand
  playerState.zones.hand.entityIds = handEntityIds.filter(
    (id) => id !== entityId
  );

  // Add to graveyard
  playerState.zones.graveyard.entityIds.push(entityId);

  return G;
};

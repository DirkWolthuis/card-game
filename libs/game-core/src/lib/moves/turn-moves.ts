import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { discardCardForPlayer } from '../util/game-state-utils';

/**
 * Discards a card from the player's hand to the graveyard.
 * Used during the end stage when the player has more than 7 cards.
 *
 * @param entityId - The ID of the entity (card) to discard from hand
 */
export const discardFromHand: Move<GameState> = (
  { G, playerID },
  entityId: string
) => {
  const success = discardCardForPlayer(G, playerID, entityId);
  if (!success) {
    return INVALID_MOVE;
  }
  return G;
};

import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import {
  drawCardForPlayer,
  discardCardForPlayer,
} from '../util/game-state-utils';

export const endTurn: Move<GameState> = ({ G, events }) => {
  events.endTurn();
  return G;
};

/**
 * Draws a card from the player's deck and adds it to their hand.
 * Used during the start stage of a turn.
 */
export const drawCard: Move<GameState> = ({ G, playerID }) => {
  drawCardForPlayer(G, playerID);
  return G;
};

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

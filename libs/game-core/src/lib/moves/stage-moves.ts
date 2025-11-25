import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

/**
 * Draw a card from the player's deck to their hand.
 * This move is used during the start stage of a turn.
 */
export const drawCard: Move<GameState> = ({ G, playerID }) => {
  const playerState = G.players[playerID];

  if (!playerState) {
    return INVALID_MOVE;
  }

  const deckEntityIds = playerState.zones.deck.entityIds;

  // Cannot draw if deck is empty
  if (deckEntityIds.length === 0) {
    return INVALID_MOVE;
  }

  // Draw the top card from the deck (first element)
  const drawnCardId = deckEntityIds[0];

  // Remove from deck
  playerState.zones.deck.entityIds = deckEntityIds.slice(1);

  // Add to hand
  playerState.zones.hand.entityIds.push(drawnCardId);

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

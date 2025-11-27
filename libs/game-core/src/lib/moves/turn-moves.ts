import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

export const endTurn: Move<GameState> = ({ G, events }) => {
  events.endTurn();
  return G;
};

/**
 * Draws a card from the player's deck and adds it to their hand.
 * Used during the start stage of a turn.
 */
export const drawCard: Move<GameState> = ({ G, playerID }) => {
  const playerState = G.players[playerID];

  // Check if there are cards in the deck to draw
  if (playerState.zones.deck.entityIds.length === 0) {
    // No cards to draw - the game continues without drawing
    return G;
  }

  // Remove the top card from the deck
  const drawnEntityId = playerState.zones.deck.entityIds.shift();

  if (drawnEntityId) {
    // Add the card to the player's hand
    playerState.zones.hand.entityIds.push(drawnEntityId);
  }

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
  const playerState = G.players[playerID];

  // Verify the card is in the player's hand
  const cardIndex = playerState.zones.hand.entityIds.indexOf(entityId);
  if (cardIndex === -1) {
    return INVALID_MOVE;
  }

  // Remove the card from hand
  playerState.zones.hand.entityIds.splice(cardIndex, 1);

  // Add the card to graveyard
  playerState.zones.graveyard.entityIds.push(entityId);

  return G;
};

import { getCardById } from '@game/data';
import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

/**
 * Pitches a card from the player's hand to generate mana.
 * The card is moved to the pitch zone and its pitch value is added to the player's mana pool.
 * Pitching can only be done on the player's own turn and does not start a chain.
 *
 * @param entityId - The ID of the entity (card) to pitch from hand
 */
export const pitchCard: Move<GameState> = (
  { G, playerID },
  entityId: string
) => {
  const playerState = G.players[playerID];
  
  // Verify card is in hand
  const cardInHand = playerState.zones.hand.entityIds.find(
    (handEntityId) => handEntityId === entityId
  );
  
  if (!cardInHand) {
    return INVALID_MOVE;
  }
  
  // Get the card to find its pitch value
  const entity = playerState.entities[entityId];
  if (!entity) {
    return INVALID_MOVE;
  }
  
  const card = getCardById(entity.cardId);
  if (!card) {
    return INVALID_MOVE;
  }
  
  // Remove card from hand
  playerState.zones.hand.entityIds = playerState.zones.hand.entityIds.filter(
    (handEntityId) => handEntityId !== entityId
  );
  
  // Add card to pitch zone
  playerState.zones.pitch.entityIds.push(entityId);
  
  // Add pitch value to mana pool
  playerState.resources.mana += card.pitchValue;
  
  return G;
};

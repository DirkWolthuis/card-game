import { getCardById } from '@game/data';
import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';
import { INVALID_MOVE } from 'boardgame.io/core';

export const playCardFromHand: Move<GameState> = (
  { G, ctx, playerID },
  entityId: string
) => {
  const playerState = G.players[playerID];
  const hasCardInHand = playerState.zones.hand.entityIds.find(
    (handEntityId) => handEntityId === entityId
  );
  const cardId = playerState.entities[entityId]?.cardId;

  const card = getCardById(cardId);
  if (!card) {
    return INVALID_MOVE;
  }

  if (hasCardInHand && card) {
    // resolve effects
    card.effects.forEach((effect) => executeEffect(G, ctx, effect));
  }

  // Remove card from hand
  playerState.zones.hand.entityIds = playerState.zones.hand.entityIds.filter(
    (handEntityId) => handEntityId !== entityId
  );

  return G;
};

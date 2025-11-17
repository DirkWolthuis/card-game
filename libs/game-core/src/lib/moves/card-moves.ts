import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';
import { getCardById } from '@game/data';

export const playCardFromHand: Move<GameState> = (
  { G, ctx, playerID },
  cardId
) => {
  console.log('PLAY_CARD_MOVE', cardId);
  // find card in hand
  const hand = G.zones[playerID].hand;
  const hasCardInHand = !!hand.cardIds.find(
    (handCardId) => handCardId === cardId
  );
  const card = getCardById(cardId);

  console.log('Debug', G, card);

  if (hasCardInHand && card) {
    // resolve effects
    const states = card.effects.forEach((effect) =>
      executeEffect(G, ctx, effect)
    );
    console.log('new states', states);
  }

  return G;
};

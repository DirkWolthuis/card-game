import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { discardCardForPlayer } from '../util/game-state-utils';

/** Maximum hand size - players must discard down to this limit at end of turn */
const MAX_HAND_SIZE = 7;

/**
 * Ends the current player's turn.
 * If the player has more than 7 cards, transitions to end stage for discarding.
 * Otherwise, ends the turn directly.
 */
export const endTurn: Move<GameState> = ({ G, events, ctx }) => {
  const currentPlayerId = ctx.currentPlayer;
  const playerState = G.players[currentPlayerId];

  // Check if player needs to discard
  if (playerState.zones.hand.entityIds.length > MAX_HAND_SIZE) {
    // Transition to end stage for discarding
    events.setActivePlayers({ currentPlayer: 'endStage' });
  } else {
    // No discarding needed, end the turn directly
    events.endTurn();
  }
  return G;
};

/**
 * Discards a card from the player's hand to the graveyard.
 * Used during the end stage when the player has more than 7 cards.
 * Automatically ends the turn when hand size reaches 7 or below.
 *
 * @param entityId - The ID of the entity (card) to discard from hand
 */
export const discardFromHand: Move<GameState> = (
  { G, playerID, events },
  entityId: string
) => {
  const success = discardCardForPlayer(G, playerID, entityId);
  if (!success) {
    return INVALID_MOVE;
  }

  // Check if we can end the turn now
  const playerState = G.players[playerID];
  if (playerState.zones.hand.entityIds.length <= MAX_HAND_SIZE) {
    events.endTurn();
  }

  return G;
};

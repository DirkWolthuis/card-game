import { Move } from 'boardgame.io';
import { GameState } from '@game/models';
import { INVALID_MOVE } from 'boardgame.io/core';
import {
  hasActiveChain,
  passPriority as passPriorityOnChain,
  resolveChain,
  isChainLocked,
} from '../chain/chain-manager';

/**
 * Pass priority on the active chain.
 * When all players pass consecutively, the chain locks and resolves in LIFO order.
 */
export const passPriority: Move<GameState> = ({ G, ctx, playerID, events }) => {
  // Must have an active chain to pass priority
  if (!hasActiveChain(G)) {
    return INVALID_MOVE;
  }

  // Pass priority for this player
  passPriorityOnChain(G, playerID, ctx);

  // If the chain is now locked, resolve it immediately
  if (isChainLocked(G)) {
    resolveChain(G, ctx);
    // Return all players to main stage after chain resolution
    events?.setActivePlayers({ currentPlayer: 'mainStage' });
  }

  return G;
};

import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import {
  passPriority as passPriorityUtil,
  resolveChain,
  hasActiveChain,
} from '../chain/chain-utils';

/**
 * Handles a player passing priority during chain building.
 * If both players pass consecutively, the chain locks and resolves.
 */
export const passPriority: Move<GameState> = ({ G, ctx, playerID }) => {
  // Check if there's an active chain
  if (!hasActiveChain(G)) {
    return INVALID_MOVE;
  }

  const chain = G.chain!;

  // Check if it's this player's priority
  if (chain.priorityPlayer !== playerID) {
    return INVALID_MOVE;
  }

  // Pass priority
  const shouldLock = passPriorityUtil(chain, ctx);

  // If chain is locked, resolve it
  if (shouldLock) {
    resolveChain(G, ctx);
  }

  return G;
};

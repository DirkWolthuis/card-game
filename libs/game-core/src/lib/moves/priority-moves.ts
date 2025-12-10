import { GameState, ActionType, PassPriorityAction } from '@game/models';
import { Move } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import {
  validateAction,
  passPriority as passPriorityUtil,
} from '../actions/action-validation';
import { createPassPriorityContext } from '../actions/action-context';

/**
 * Move to pass priority to the opponent.
 * This is used in the chain system to allow players to respond to actions.
 * When both players pass consecutively, the chain locks and resolves.
 */
export const passPriority: Move<GameState> = ({ G, ctx, playerID }) => {
  const action: PassPriorityAction = {
    type: ActionType.PASS_PRIORITY,
    playerId: playerID,
  };

  const actionContext = createPassPriorityContext();
  
  // Validate the action
  const validationResult = validateAction(action, actionContext.costs, G, ctx);
  if (!validationResult.valid) {
    return INVALID_MOVE;
  }

  // Pass priority to the next player
  passPriorityUtil(G, ctx);

  return G;
};

import {
  Action,
  CheckResult,
  Cost,
  CostType,
  GameState,
  PlayerId,
} from '@game/models';
import { Ctx } from 'boardgame.io';

/**
 * Checks if a player is allowed to take an action.
 * This validates both boardgame.io's turn system and the custom priority system.
 * 
 * @param action - The action being attempted
 * @param G - Current game state
 * @param ctx - boardgame.io context
 * @returns CheckResult indicating if the player can act
 */
export function checkPlayerPriority(
  action: Action,
  G: GameState,
  ctx: Ctx
): CheckResult {
  const { playerId } = action;

  // During setup phase, all players can act on their setup
  if (ctx.phase === 'setup') {
    return { valid: true };
  }

  // Check if it's the player's turn (boardgame.io level)
  if (ctx.currentPlayer !== playerId) {
    return {
      valid: false,
      error: 'Not your turn',
    };
  }

  // If custom priority system is active, check priority
  if (G.priority) {
    if (G.priority.currentPriorityPlayer !== playerId) {
      return {
        valid: false,
        error: 'You do not have priority',
      };
    }
  }

  return { valid: true };
}

/**
 * Validates whether a player can pay the required costs for an action.
 * 
 * @param costs - Array of costs required for the action
 * @param G - Current game state
 * @param playerId - The player attempting to pay costs
 * @returns CheckResult indicating if costs can be paid
 */
export function checkCosts(
  costs: Cost[],
  G: GameState,
  playerId: PlayerId
): CheckResult {
  const playerState = G.players[playerId];

  if (!playerState) {
    return {
      valid: false,
      error: 'Invalid player',
    };
  }

  for (const cost of costs) {
    switch (cost.type) {
      case CostType.MANA: {
        if (playerState.resources.mana < cost.amount) {
          return {
            valid: false,
            error: `Insufficient mana (need ${cost.amount}, have ${playerState.resources.mana})`,
          };
        }
        break;
      }
      case CostType.TAP: {
        // TAP cost validation - not yet implemented
        // Would check if entities exist and are untapped
        return {
          valid: false,
          error: 'Tap costs not yet implemented',
        };
      }
      case CostType.SACRIFICE: {
        // SACRIFICE cost validation - not yet implemented
        // Would check if entities exist and can be sacrificed
        return {
          valid: false,
          error: 'Sacrifice costs not yet implemented',
        };
      }
    }
  }

  return { valid: true };
}

/**
 * Pays the costs for an action, modifying the game state.
 * This should only be called after checkCosts has validated that costs can be paid.
 * 
 * @param costs - Array of costs to pay
 * @param G - Current game state (will be modified)
 * @param playerId - The player paying the costs
 */
export function payCosts(
  costs: Cost[],
  G: GameState,
  playerId: PlayerId
): void {
  const playerState = G.players[playerId];

  for (const cost of costs) {
    switch (cost.type) {
      case CostType.MANA: {
        playerState.resources.mana -= cost.amount;
        break;
      }
      case CostType.TAP: {
        // TAP cost payment - not yet implemented
        break;
      }
      case CostType.SACRIFICE: {
        // SACRIFICE cost payment - not yet implemented
        break;
      }
    }
  }
}

/**
 * Validates that an action can be performed based on all checks.
 * This is the main entry point for action validation.
 * 
 * @param action - The action to validate
 * @param costs - Costs required for the action
 * @param G - Current game state
 * @param ctx - boardgame.io context
 * @returns CheckResult indicating if the action is valid
 */
export function validateAction(
  action: Action,
  costs: Cost[],
  G: GameState,
  ctx: Ctx
): CheckResult {
  // Check 1: Does the player have priority?
  const priorityCheck = checkPlayerPriority(action, G, ctx);
  if (!priorityCheck.valid) {
    return priorityCheck;
  }

  // Check 2: Can the player pay the costs?
  const costCheck = checkCosts(costs, G, action.playerId);
  if (!costCheck.valid) {
    return costCheck;
  }

  // All checks passed
  return { valid: true };
}

/**
 * Passes priority to the next player.
 * Increments consecutive passes counter for chain locking.
 * 
 * @param G - Current game state (will be modified)
 * @param ctx - boardgame.io context
 */
export function passPriority(G: GameState, ctx: Ctx): void {
  if (!G.priority) {
    // Initialize priority system if not active
    G.priority = {
      currentPriorityPlayer: ctx.currentPlayer,
      consecutivePasses: 0,
    };
  }

  // Increment consecutive passes
  G.priority.consecutivePasses++;

  // Switch priority to next player
  // For 2 players, this toggles between '0' and '1'
  const currentIndex = ctx.playOrder.indexOf(G.priority.currentPriorityPlayer);
  const nextIndex = (currentIndex + 1) % ctx.numPlayers;
  G.priority.currentPriorityPlayer = ctx.playOrder[nextIndex];
}

/**
 * Resets the consecutive pass counter when an action is added to the chain.
 * 
 * @param G - Current game state (will be modified)
 */
export function resetConsecutivePasses(G: GameState): void {
  if (G.priority) {
    G.priority.consecutivePasses = 0;
  }
}

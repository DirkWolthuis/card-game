import { GameState, Ability, TargetType } from '@game/models';
import { Ctx } from 'boardgame.io';

/**
 * Result of an action validation check
 */
export interface ValidationResult {
  /** Whether the action is valid */
  valid: boolean;
  /** Error message if invalid */
  error?: string;
}

/**
 * Context for action validation
 */
export interface ActionContext {
  gameState: GameState;
  ctx: Ctx;
  playerID: string;
}

/**
 * A composable validation check for actions
 */
export type ActionCheck = (context: ActionContext) => ValidationResult;

/**
 * Validates that a player has priority to take an action.
 * Currently checks if the player is the current player in their main stage.
 * This can be extended to support more complex priority systems for chains.
 */
export const checkPlayerPriority: ActionCheck = ({ ctx, playerID }) => {
  if (ctx.currentPlayer !== playerID) {
    return {
      valid: false,
      error: 'Player does not have priority',
    };
  }

  return { valid: true };
};

/**
 * Validates that the player has enough resources to pay a cost
 */
export const checkResourcesForCost = (
  requiredMana: number
): ActionCheck => {
  return ({ gameState, playerID }) => {
    const playerState = gameState.players[playerID];
    
    if (playerState.resources.mana < requiredMana) {
      return {
        valid: false,
        error: `Insufficient mana. Required: ${requiredMana}, Available: ${playerState.resources.mana}`,
      };
    }

    return { valid: true };
  };
};

/**
 * Checks if an ability requires target selection
 */
export const checkRequiresTargetSelection = (ability: Ability): boolean => {
  // Check if any effects in the ability need target selection
  return ability.effects.some((effect) => {
    return (
      effect.target === TargetType.PLAYER || 
      effect.target === TargetType.OPPONENT
    );
  });
};

/**
 * Runs a sequence of validation checks.
 * Returns the first failure, or success if all checks pass.
 */
export const runChecks = (
  checks: ActionCheck[],
  context: ActionContext
): ValidationResult => {
  for (const check of checks) {
    const result = check(context);
    if (!result.valid) {
      return result;
    }
  }

  return { valid: true };
};

/**
 * Success result constant
 */
export const SUCCESS: ValidationResult = { valid: true };

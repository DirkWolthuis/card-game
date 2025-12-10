import { getCardById } from '@game/data';
import {
  ActionContext,
  ActionType,
  Cost,
  CostType,
  GameState,
  PlayCardAction,
  EntityId,
} from '@game/models';
import { needsTargetSelection } from '../effects/target-utils';

/**
 * Creates an action context for playing a card.
 * This determines the costs and effects for the action.
 * 
 * @param action - The play card action
 * @param G - Current game state
 * @returns ActionContext with costs and effects, or undefined if card not found
 */
export function createPlayCardContext(
  action: PlayCardAction,
  G: GameState
): ActionContext | undefined {
  const playerState = G.players[action.playerId];
  const entity = playerState?.entities[action.entityId];
  
  if (!entity) {
    return undefined;
  }

  const card = getCardById(entity.cardId);
  if (!card) {
    return undefined;
  }

  // Build costs - playing a card costs mana
  const costs: Cost[] = [];
  if (card.manaCost > 0) {
    costs.push({
      type: CostType.MANA,
      amount: card.manaCost,
    });
  }

  // Determine if target selection is required for any effect
  const requiresTargetSelection = card.effects.some(needsTargetSelection);

  return {
    costs,
    effects: card.effects,
    requiresTargetSelection,
  };
}

/**
 * Creates an action context for ending turn.
 * End turn has no costs or effects at the action level.
 * 
 * @returns ActionContext with empty costs and effects
 */
export function createEndTurnContext(): ActionContext {
  return {
    costs: [],
    effects: [],
    requiresTargetSelection: false,
  };
}

/**
 * Creates an action context for passing priority.
 * Passing priority has no costs or effects.
 * 
 * @returns ActionContext with empty costs and effects
 */
export function createPassPriorityContext(): ActionContext {
  return {
    costs: [],
    effects: [],
    requiresTargetSelection: false,
  };
}

/**
 * Creates an action context for any action type.
 * This is the main entry point for building action contexts.
 * 
 * @param action - The action to create context for
 * @param G - Current game state
 * @returns ActionContext or undefined if context cannot be created
 */
export function createActionContext(
  action: { type: ActionType; entityId?: EntityId; playerId: string },
  G: GameState
): ActionContext | undefined {
  switch (action.type) {
    case ActionType.PLAY_CARD:
      if (!action.entityId) return undefined;
      return createPlayCardContext(
        { type: ActionType.PLAY_CARD, playerId: action.playerId, entityId: action.entityId },
        G
      );
    case ActionType.END_TURN:
      return createEndTurnContext();
    case ActionType.PASS_PRIORITY:
      return createPassPriorityContext();
    case ActionType.ACTIVATE_ABILITY:
      // Not yet implemented
      return undefined;
    case ActionType.ATTACK:
      // Not yet implemented
      return undefined;
    default:
      return undefined;
  }
}

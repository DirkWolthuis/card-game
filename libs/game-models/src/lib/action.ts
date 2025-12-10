import { Effect } from './effect';
import { PlayerId } from './player';
import { EntityId } from './entity';

/**
 * Types of actions that players can take in the game.
 * Each action corresponds to a game move as defined in the game design.
 */
export enum ActionType {
  /** Playing a card from hand */
  PLAY_CARD = 'PLAY_CARD',
  /** Activating an ability of a card on the battlefield */
  ACTIVATE_ABILITY = 'ACTIVATE_ABILITY',
  /** Activating the attack ability of a unit */
  ATTACK = 'ATTACK',
  /** Passing priority to the opponent */
  PASS_PRIORITY = 'PASS_PRIORITY',
  /** Ending the current turn */
  END_TURN = 'END_TURN',
}

/**
 * Base interface for all actions.
 * Actions represent player intentions that must be validated before execution.
 */
export interface BaseAction {
  /** The type of action being performed */
  type: ActionType;
  /** The player taking the action */
  playerId: PlayerId;
}

/**
 * Action to play a card from hand.
 */
export interface PlayCardAction extends BaseAction {
  type: ActionType.PLAY_CARD;
  /** The entity ID of the card being played */
  entityId: EntityId;
}

/**
 * Action to activate an ability.
 * Note: Ability system not yet implemented - this is a placeholder.
 */
export interface ActivateAbilityAction extends BaseAction {
  type: ActionType.ACTIVATE_ABILITY;
  /** The entity ID of the card whose ability is being activated */
  entityId: EntityId;
  /** Index of the ability to activate (cards can have multiple abilities) */
  abilityIndex: number;
}

/**
 * Action to attack with a unit.
 * Note: Combat system not yet implemented - this is a placeholder.
 */
export interface AttackAction extends BaseAction {
  type: ActionType.ATTACK;
  /** The entity ID of the attacking unit */
  attackerEntityId: EntityId;
  /** The player being attacked */
  targetPlayerId: PlayerId;
}

/**
 * Action to pass priority.
 * Used in the chain system to allow the opponent to respond.
 */
export interface PassPriorityAction extends BaseAction {
  type: ActionType.PASS_PRIORITY;
}

/**
 * Action to end the current turn.
 */
export interface EndTurnAction extends BaseAction {
  type: ActionType.END_TURN;
}

/**
 * Union type of all possible actions.
 */
export type Action =
  | PlayCardAction
  | ActivateAbilityAction
  | AttackAction
  | PassPriorityAction
  | EndTurnAction;

/**
 * Types of costs that can be required to perform an action.
 */
export enum CostType {
  /** Mana cost - requires spending mana from the mana pool */
  MANA = 'MANA',
  /** Tap cost - requires tapping a card (not yet implemented) */
  TAP = 'TAP',
  /** Sacrifice cost - requires sacrificing a card (not yet implemented) */
  SACRIFICE = 'SACRIFICE',
}

/**
 * Base interface for costs.
 */
export interface BaseCost {
  type: CostType;
}

/**
 * Mana cost - requires the player to have sufficient mana.
 */
export interface ManaCost extends BaseCost {
  type: CostType.MANA;
  /** Amount of mana required */
  amount: number;
}

/**
 * Tap cost - requires tapping a card.
 * Note: Tapping system not yet implemented - this is a placeholder.
 */
export interface TapCost extends BaseCost {
  type: CostType.TAP;
  /** Entity IDs of cards to tap */
  entityIds: EntityId[];
}

/**
 * Sacrifice cost - requires sacrificing cards.
 * Note: Sacrifice system not yet implemented - this is a placeholder.
 */
export interface SacrificeCost extends BaseCost {
  type: CostType.SACRIFICE;
  /** Entity IDs of cards to sacrifice */
  entityIds: EntityId[];
}

/**
 * Union type of all possible costs.
 */
export type Cost = ManaCost | TapCost | SacrificeCost;

/**
 * Result of a check or validation.
 */
export interface CheckResult {
  /** Whether the check passed */
  valid: boolean;
  /** Optional error message if the check failed */
  error?: string;
}

/**
 * Context information for action execution.
 * Contains all necessary state and effects to execute an action.
 */
export interface ActionContext {
  /** Costs that must be paid to perform the action */
  costs: Cost[];
  /** Effects that will be executed after costs are paid */
  effects: Effect[];
  /** Whether target selection is required before execution */
  requiresTargetSelection: boolean;
}

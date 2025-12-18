import { Effect } from './effect';

/**
 * Ability types define how and when an ability can be used
 */
export enum AbilityType {
  /** Ability that can be activated by paying a cost */
  ACTIVATED = 'ACTIVATED',
  /** Ability that automatically triggers when a specific event occurs */
  TRIGGERED = 'TRIGGERED',
  /** Ability that continuously affects the game state */
  STATIC = 'STATIC',
  /** Ability that can respond to actions (to be implemented later) */
  REACTION = 'REACTION',
}

/**
 * Base interface for all abilities.
 * An ability wraps one or more effects and defines when/how they can be used.
 */
interface BaseAbility {
  type: AbilityType;
  /** Human-readable description of what the ability does */
  description: string;
  /** Effects that occur when this ability resolves */
  effects: Effect[];
}

/**
 * Cost that must be paid to activate an ability.
 * Currently supports mana cost, can be extended for other costs (tap, discard, etc.)
 */
export interface AbilityCost {
  /** Mana that must be paid */
  mana?: number;
  // Future: tap?, discard?, sacrifice?, etc.
}

/**
 * Activated ability - can be activated by a player by paying a cost.
 * Notation: {cost}: {effect}
 * Example: "{2 mana}: Deal 2 damage to target opponent"
 */
export interface ActivatedAbility extends BaseAbility {
  type: AbilityType.ACTIVATED;
  /** Cost that must be paid to activate this ability */
  cost: AbilityCost;
}

/**
 * Triggered ability - automatically activates when a specific event occurs.
 * Example: "When this unit enters the battlefield, deal 1 damage to opponent"
 * 
 * Note: Trigger conditions are not yet fully implemented - this is a placeholder
 * for the future system. Currently, triggered abilities are executed when the
 * card is played.
 */
export interface TriggeredAbility extends BaseAbility {
  type: AbilityType.TRIGGERED;
  // Future: trigger condition (e.g., 'onEnterBattlefield', 'onDeath', etc.)
}

/**
 * Static ability - continuously affects the game while the card is in play.
 * Example: "All your units get +1 power"
 * 
 * Note: Static abilities are not yet fully implemented. This is a placeholder
 * for future implementation of continuous effects.
 */
export interface StaticAbility extends BaseAbility {
  type: AbilityType.STATIC;
  // Future: condition for when the ability is active
}

/**
 * Reaction ability - can respond to actions (to be implemented later).
 * Example: "When an opponent plays a spell, counter that spell"
 */
export interface ReactionAbility extends BaseAbility {
  type: AbilityType.REACTION;
  // Future: reaction trigger and conditions
}

/**
 * Union type of all ability types
 */
export type Ability =
  | ActivatedAbility
  | TriggeredAbility
  | StaticAbility
  | ReactionAbility;

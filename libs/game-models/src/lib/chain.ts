import { PlayerId } from './player';
import { EntityId } from './entity';
import { Effect } from './effect';

/**
 * Represents an action that has been added to the chain.
 * Each action contains the effects to be executed and the player who initiated it.
 */
export interface ChainAction {
  id: string; // Unique identifier for this chain action
  playerId: PlayerId; // Player who initiated the action
  entityId?: EntityId; // Entity (card) that created this action, if applicable
  effects: Effect[]; // Effects to execute when this action resolves
  targetPlayerId?: PlayerId; // Target player for the effects (if applicable)
  countered: boolean; // Whether this action has been countered and won't resolve
}

/**
 * The chain tracks all actions waiting to resolve and manages priority.
 */
export interface Chain {
  actions: ChainAction[]; // Stack of actions (last added resolves first - LIFO)
  priorityPlayer: PlayerId | null; // Player who currently has priority
  consecutivePasses: number; // Track consecutive priority passes (chain locks at 2)
  isLocked: boolean; // Whether the chain is locked (no more actions can be added)
  isResolving: boolean; // Whether the chain is currently resolving
}

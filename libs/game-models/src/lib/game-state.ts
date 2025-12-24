import { Entity, EntityId } from './entity';
import { PlayerId } from './player';
import { Zones } from './zone';
import { Effect } from './effect';
import { Ability } from './ability';

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  pendingTargetSelection?: PendingTargetSelection;
  setupData?: SetupData;
  chain?: ChainState;
}

/**
 * Represents the state of an active chain.
 * The chain contains actions/abilities that will resolve in LIFO order.
 */
export interface ChainState {
  /** Array of links on the chain, ordered from first to last added */
  links: ChainLink[];
  /** Track consecutive passes by player ID - used to detect chain lock */
  consecutivePasses: Record<PlayerId, boolean>;
  /** Whether the chain is locked (no more actions can be added) */
  isLocked: boolean;
  /** Index of the next link to resolve (used during resolution) */
  resolutionIndex?: number;
}

/**
 * Represents a single action/ability on the chain.
 * Each link contains the ability to be resolved and its context.
 */
export interface ChainLink {
  /** The ability that was added to the chain */
  ability: Ability;
  /** ID of the player who added this link */
  playerId: PlayerId;
  /** All effects from the ability */
  effects: Effect[];
  /** Selected targets for effects that need targeting */
  selectedTargets?: Record<number, string>;
}

/**
 * Setup data for the pre-game phase where players select their names and decks
 */
export interface SetupData {
  playerSetup: Record<PlayerId, PlayerSetup>;
}

export interface PlayerSetup {
  name?: string;
  selectedDeckIds: string[]; // Array of 2 deck IDs
  isReady: boolean;
}

/**
 * Tracks the state of target selection during ability/effect resolution.
 * All targets must be selected before any effects resolve.
 */
export interface PendingTargetSelection {
  /** The source ability being resolved */
  sourceAbility: Ability;
  /** All effects from the ability that will be executed after targets are collected */
  allEffects: Effect[];
  /** Indices of effects in allEffects that need target selection, in order */
  effectIndicesNeedingTargets: number[];
  /** Map of effect index in allEffects to selected target player ID */
  selectedTargets: Record<number, string>;
  /** If true, this targeting is for adding to chain (not immediate resolution) */
  isForChain?: boolean;
  /** Player ID who initiated the pending action that will be added to the chain */
  chainPlayerId?: string;
}

export interface PlayerState {
  resources: Resources;
  zones: Zones;
  entities: Record<EntityId, Entity>;
}

export interface Resources {
  life: number;
  mana: number; // Available mana from pitched cards
}

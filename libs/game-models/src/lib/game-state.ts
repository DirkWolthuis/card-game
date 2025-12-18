import { Entity, EntityId } from './entity';
import { PlayerId } from './player';
import { Zones } from './zone';
import { Effect } from './effect';
import { Ability } from './ability';

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  pendingTargetSelection?: PendingTargetSelection;
  setupData?: SetupData;
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
  /** Effects that need target selection, in order */
  effectsNeedingTargets: Effect[];
  /** Map of effect index to selected target player ID */
  selectedTargets: Record<number, string>;
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

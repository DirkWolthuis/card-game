import { Entity, EntityId } from './entity';
import { PlayerId } from './player';
import { Zones } from './zone';
import { Effect } from './effect';

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
 * Tracks the state of target selection during card effect resolution.
 * When a card has multiple effects and one requires a target, the game pauses
 * to allow the player to select a target before continuing with remaining effects.
 */
export interface PendingTargetSelection {
  /** The current effect waiting for a target to be selected */
  effect: Effect;
  /** Remaining effects from the same card that will be executed after the current effect is resolved */
  remainingEffects: Effect[];
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

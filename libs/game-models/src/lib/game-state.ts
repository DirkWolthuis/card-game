import { Entity, EntityId } from './entity';
import { PlayerId } from './player';
import { Zones } from './zone';
import { Effect } from './effect';

export interface GameState {
  players: Record<PlayerId, PlayerState>;
  pendingTargetSelection?: PendingTargetSelection;
}

export interface PendingTargetSelection {
  effect: Effect;
  remainingEffects: Effect[];
}

export interface PlayerState {
  resources: Resources;
  zones: Zones;
  entities: Record<EntityId, Entity>;
}

export interface Resources {
  life: number;
}

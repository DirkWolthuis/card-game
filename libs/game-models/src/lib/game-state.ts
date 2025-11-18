import { Entity, EntityId } from './entity';
import { PlayerId } from './player';
import { Zones } from './zone';

export interface GameState {
  players: Record<PlayerId, PlayerState>;
}

export interface PlayerState {
  resources: Resources;
  zones: Zones;
  entities: Record<EntityId, Entity>;
}

export interface Resources {
  life: number;
}

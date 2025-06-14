import { System } from '../event-bus/store';
import { DamageSystem } from './damage.system';
import { PlayCardSystem } from './play-card.system';
import { PlayerInputSystem } from './player-input.system';

export const systems: System[] = [
  DamageSystem,
  PlayCardSystem,
  PlayerInputSystem,
];

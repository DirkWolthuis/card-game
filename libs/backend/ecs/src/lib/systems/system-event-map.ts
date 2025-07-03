import { GameEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { setupGameSystem } from './setup-game';
import { setupDeckSystem } from './setup-deck';

export const SystemEventMap = new Map<
  GameEvent['type'],
  GameSystem<GameEvent>[]
>([
  ['INTERNAL::SETUP_GAME', [setupGameSystem]],
  ['INTERNAL::SETUP_DECK', [setupDeckSystem]],
]);

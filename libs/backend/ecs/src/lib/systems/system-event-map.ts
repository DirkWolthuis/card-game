import { GameEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { setupGameSystem } from './setup-game';

export const SystemEventMap = new Map<GameEvent['type'], GameSystem[]>([
  ['INTERNAL::SETUP_GAME', [setupGameSystem]],
]);

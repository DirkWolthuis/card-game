import { GameEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { setupGameSystem } from './setup-game';
import { createCardEntities } from './create-card-entities';
import { createCardCollections } from './setup-card-collections';

export const SystemEventMap = new Map<
  GameEvent['type'],
  GameSystem<GameEvent>[]
>([
  ['INTERNAL::SETUP_GAME', [setupGameSystem]],
  ['INTERNAL::CREATE_CARD_ENTITIES', [createCardEntities]],
  ['INTERNAL::CREATE_CARD_COLLECTIONS', [createCardCollections]],
]);

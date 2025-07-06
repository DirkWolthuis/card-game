import { CreateCardCollectionsEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';

export const createCardCollections: GameSystem<
  CreateCardCollectionsEvent
> = async (event, world, engine) => {};

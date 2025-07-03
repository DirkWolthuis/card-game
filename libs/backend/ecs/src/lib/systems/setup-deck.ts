import { SetupDeckEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { deckBlueprints } from '@loe/shared/game-blueprints';

export const setupDeckSystem: GameSystem<SetupDeckEvent> = async (
  event,
  world,
  engine
) => {
  const deck = deckBlueprints.get(event.payload.deckId);
  let newEvents: SetupDeckEvent[] = [];

  engine.addEvents(newEvents);
};

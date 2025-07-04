import { SetupDeckEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { cardBlueprints, deckBlueprints } from '@loe/shared/game-blueprints';
import { addEntity } from 'bitecs';
import { createCardComponents } from '../utils/component.util';

export const setupDeckSystem: GameSystem<SetupDeckEvent> = async (
  event,
  world,
  engine
) => {
  const deck = deckBlueprints.get(event.payload.deckId);
  if (!deck) {
    console.error(`Deck with ID ${event.payload.deckId} not found.`);
    return;
  }
  deck.forEach((cardId) => {
    const cardBlueprint = cardBlueprints.get(cardId);
    const cardEntity = addEntity(world);
    createCardComponents(cardEntity, world, cardBlueprint);
  });
};

import { CreateCardEntitiesEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { cardBlueprints, deckBlueprints } from '@loe/shared/game-blueprints';
import { addEntity } from 'bitecs';
import { createCardComponents } from '../utils/component.util';

export const createCardEntities: GameSystem<CreateCardEntitiesEvent> = async (
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
    console.log(`Creating entity for card ID: ${cardId}`);
    const cardBlueprint = cardBlueprints.get(cardId);
    if (!cardBlueprint) {
      console.error(`Card blueprint with ID ${cardId} not found.`);
      return;
    }
    const cardEntity = addEntity(world);
    createCardComponents(cardEntity, world, cardBlueprint);
  });
};

import { SetupDeckEvent, UnitCard } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { cardBlueprints, deckBlueprints } from '@loe/shared/game-blueprints';
import { addComponent, addEntity } from 'bitecs';
import { CardDataComponent } from '../components/card-data';
import { isUnitCard } from '@loe/shared/game-utils';
import { UnitAttributesComponent } from '../components/unit-attributes';

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
    addComponent(world, CardDataComponent, cardEntity);
    CardDataComponent.cardId[cardEntity] = cardId;
    if (isUnitCard(cardBlueprint)) {
      addComponent(world, UnitAttributesComponent, cardEntity);
      UnitAttributesComponent.speed[cardEntity] = (
        cardBlueprint as UnitCard
      ).speed;
      UnitAttributesComponent.health[cardEntity] = (
        cardBlueprint as UnitCard
      ).health;
      UnitAttributesComponent.resistance[cardEntity] = (
        cardBlueprint as UnitCard
      ).resistance;
      UnitAttributesComponent.power[cardEntity] = (
        cardBlueprint as UnitCard
      ).power;
    }
  });
};

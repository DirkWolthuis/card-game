import {
  AbilityBlueprint,
  AbillityType,
  CardBlueprint,
  UnitCard,
} from '@loe/shared/game-types';
import { IWorld, addComponent, addEntity } from 'bitecs';
import { CardDataComponent } from '../components/card-data';
import { UnitAttributesComponent } from '../components/unit-attributes';
import { isUnitCard } from '@loe/shared/game-utils';
import { abilityBlueprints } from '@loe/shared/game-blueprints';
import {
  AbilityDataComponent,
  ActionAbilityTag,
  AuraAbilityTag,
  ReactionAbilityTag,
  TriggeredAbilityTag,
} from '../components/ability';

export const createCardComponents = (
  cardEntity: number,
  world: IWorld,
  cardBlueprint: CardBlueprint
): void => {
  addComponent(world, CardDataComponent, cardEntity);
  CardDataComponent.cardId[cardEntity] = cardBlueprint.id;
  if (isUnitCard(cardBlueprint)) {
    createUnitComponents(cardEntity, world, cardBlueprint as UnitCard);
  }
  cardBlueprint.abilityIds.forEach((abilityId) => {
    const abilityEntity = addEntity(world);
    const abilityBlueprint = abilityBlueprints.get(abilityId);
    createAbilityComponents(abilityEntity, world, abilityBlueprint, cardEntity);
  });
};

const createUnitComponents = (
  unitEntity: number,
  world: IWorld,
  unitBlueprint: UnitCard
): void => {
  addComponent(world, UnitAttributesComponent, unitEntity);
  UnitAttributesComponent.speed[unitEntity] = unitBlueprint.speed;
  UnitAttributesComponent.health[unitEntity] = unitBlueprint.health;
  UnitAttributesComponent.resistance[unitEntity] = unitBlueprint.resistance;
  UnitAttributesComponent.power[unitEntity] = unitBlueprint.power;
};

const createAbilityComponents = (
  abilityEntity: number,
  world: IWorld,
  abilityBlueprint: AbilityBlueprint,
  cardEntity: number
): void => {
  addComponent(world, AbilityDataComponent, abilityEntity);
  AbilityDataComponent.cardEntity[abilityEntity] = cardEntity;
  AbilityDataComponent.abilityBlueprintId[abilityEntity] = abilityBlueprint.id;
  switch (abilityBlueprint.type) {
    case AbillityType.ACTION:
      addComponent(world, ActionAbilityTag, abilityEntity);
      break;
    case AbillityType.REACTION:
      addComponent(world, ReactionAbilityTag, abilityEntity);
      break;
    case AbillityType.TRIGGERED:
      addComponent(world, TriggeredAbilityTag, abilityEntity);
      break;
    case AbillityType.AURA:
      addComponent(world, AuraAbilityTag, abilityEntity);
      break;
  }
};

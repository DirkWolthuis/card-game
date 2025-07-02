import { Ability } from './ability.model';

export type CardBlueprint = NonUnitCard | UnitCard;

interface NonUnitCard extends CardAttributes, Abilities {
  cardType: Exclude<
    CardType,
    CardType.TROOP | CardType.CAPTAIN | CardType.LEADER
  >;
}

interface UnitCard extends CardAttributes, Abilities {
  cardType: CardType.TROOP | CardType.CAPTAIN | CardType.LEADER;
  speed: number;
  health: number;
  resistance: number;
  power: number;
}

interface Abilities {
  abilities?: Ability[];
}

export interface CardAttributes {
  id: number;
  manaCost: number;
  cardName: string;
  descriptionText: string;
  keywords: CardKeyword[];
  cardType: CardType;
}

export enum CardType {
  TROOP,
  CAPTAIN,
  LEADER,
  RITUAL,
  REACTION,
  BLITZ,
  RIFT,
  BOONS,
  RELICS,
}

export enum CardKeyword {
  ATTACKER,
  BLOCKER,
  DUALIST,
}

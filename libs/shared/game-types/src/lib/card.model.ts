export type CardBlueprint = NonUnitCard | UnitCard;

export interface NonUnitCard extends CardAttributes, Abilities {
  cardType: Exclude<
    CardType,
    CardType.TROOP | CardType.CAPTAIN | CardType.LEADER
  >;
}

export interface UnitCard extends CardAttributes, Abilities {
  cardType: CardType.TROOP | CardType.CAPTAIN | CardType.LEADER;
  speed: number;
  health: number;
  resistance: number;
  power: number;
}

interface Abilities {
  abilityIds?: number[];
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

import { CardBlueprint, CardKeyword, CardType } from '@loe/shared/game-types';

export const cardBlueprints = new Map<number, CardBlueprint>([
  [
    1,
    {
      id: 1,
      cardName: 'Zombie',
      descriptionText: 'A mindless undead creature.',
      manaCost: 2,
      keywords: [CardKeyword.ATTACKER],
      cardType: CardType.TROOP,
      abilityIds: [],
      speed: 2,
      health: 1,
      resistance: 2,
      power: 1,
    },
  ],
  [
    2,
    {
      id: 2,
      cardName: 'Counter ritual',
      descriptionText: 'Counter target ritual.',
      manaCost: 2,
      keywords: [],
      cardType: CardType.REACTION,
      abilityIds: [1],
    },
  ],
  [
    3,
    {
      id: 3,
      cardName: 'Knight',
      descriptionText: 'A noble knight',
      manaCost: 2,
      keywords: [CardKeyword.ATTACKER, CardKeyword.BLOCKER],
      cardType: CardType.TROOP,
      abilityIds: [],
      speed: 1,
      health: 2,
      resistance: 2,
      power: 2,
    },
  ],
]);

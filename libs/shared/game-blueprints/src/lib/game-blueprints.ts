import {
  AbillityType,
  CardBlueprint,
  CardKeyword,
  CardType,
  EffectType,
  TriggerType,
} from '@loe/shared/game-types';
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
      abilities: [],
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
      abilities: [
        {
          description: 'Counter target ritual',
          type: AbillityType.REACTION,
          trigger: [TriggerType.RITUAL_ENTERS_STACK],
          effect: {
            type: EffectType.COUNTER_RITUAL,
          },
        },
      ],
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
      abilities: [],
      speed: 1,
      health: 2,
      resistance: 2,
      power: 2,
    },
  ],
]);

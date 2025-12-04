import { Card, CardType, EffectType, TargetType, TroopType } from '@game/models';

export const getAllCards = (): Card[] => {
  return CARD_DATABASE;
};

export const getCardById = (cardId: string): Card | undefined => {
  return CARD_DATABASE.find((card) => card.id === cardId);
};

const CARD_DATABASE: Card[] = [
  {
    id: 'aaaa',
    displayText: 'Deal 2 damage to opponent',
    name: 'Firebolt',
    cardType: CardType.SPELL,
    cost: 2,
    pitchValue: 1,
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
    ],
  },
  {
    id: 'bbb',
    displayText: 'Heal yourself for 2 health',
    name: 'Divine Touch',
    cardType: CardType.SPELL,
    cost: 2,
    pitchValue: 1,
    effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 2 }],
  },
  {
    id: 'cccc',
    displayText: 'Deal massive damage to opponent',
    name: 'Annihilate',
    cardType: CardType.SPELL,
    cost: 8,
    pitchValue: 3,
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 999 },
    ],
  },
  {
    id: 'dddd',
    displayText: 'Deal 20 damage to opponent',
    name: 'Meteor Strike',
    cardType: CardType.SPELL,
    cost: 6,
    pitchValue: 2,
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 20 },
    ],
  },
  {
    id: 'leader-001',
    displayText: 'Zombie Leader - Can attack with up to 3 Zombies',
    name: 'Necromancer Lord',
    cardType: CardType.LEADER,
    cost: 4,
    pitchValue: 2,
    attack: 3,
    health: 5,
    troopType: TroopType.ZOMBIE,
    troopLimit: 3,
    effects: [],
  },
  {
    id: 'troop-001',
    displayText: 'A risen corpse ready to serve',
    name: 'Zombie Warrior',
    cardType: CardType.TROOP,
    cost: 2,
    pitchValue: 1,
    attack: 2,
    health: 2,
    troopType: TroopType.ZOMBIE,
    effects: [],
  },
];

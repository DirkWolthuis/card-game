import { Card, CardType, EffectType, TargetType } from '@game/models';

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
    type: CardType.SPELL,
    pitchValue: 1,
    manaCost: 1,
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
    ],
  },
  {
    id: 'bbb',
    displayText: 'Heal yourself for 2 health',
    name: 'Divine touch',
    type: CardType.SPELL,
    pitchValue: 2,
    manaCost: 2,
    effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 2 }],
  },
  {
    id: 'cccc',
    displayText: 'Kill opponent',
    name: 'Kill',
    type: CardType.SPELL,
    pitchValue: 3,
    manaCost: 5,
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 999 },
    ],
  },
  {
    id: 'dddd',
    displayText: 'Deal 20 damage to opponent',
    name: '20 Damage Spell',
    type: CardType.SPELL,
    pitchValue: 2,
    manaCost: 3,
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 20 },
    ],
  },
  {
    id: 'leader-1',
    displayText: 'A powerful leader unit',
    name: 'Knight Commander',
    type: CardType.LEADER,
    pitchValue: 2,
    manaCost: 3,
    effects: [],
    unitStats: {
      power: 3,
      resistance: 1,
      health: 3,
    },
  },
  {
    id: 'troop-1',
    displayText: 'A basic troop unit',
    name: 'Foot Soldier',
    type: CardType.TROOP,
    pitchValue: 1,
    manaCost: 1,
    effects: [],
    unitStats: {
      power: 2,
      resistance: 0,
      health: 1,
    },
  },
];

import { Card, EffectType, TargetType } from '@game/models';

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
    pitchValue: 2,
    manaCost: 2,
    effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 2 }],
  },
  {
    id: 'cccc',
    displayText: 'Kill opponent',
    name: 'Kill',
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
    pitchValue: 2,
    manaCost: 3,
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 20 },
    ],
  },
];

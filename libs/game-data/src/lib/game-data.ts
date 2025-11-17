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
    effects: [
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
      { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 4 },
    ],
  },
  {
    id: 'bbb',
    displayText: 'Heal yourself for 2 health',
    name: 'Divine touch',
    effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 2 }],
  },
];

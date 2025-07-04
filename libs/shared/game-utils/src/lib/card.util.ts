import { CardBlueprint, CardType } from '@loe/shared/game-types';
export const isUnitCard = (card: CardBlueprint): boolean => {
  return (
    card.cardType === CardType.TROOP ||
    card.cardType === CardType.CAPTAIN ||
    card.cardType === CardType.LEADER
  );
};

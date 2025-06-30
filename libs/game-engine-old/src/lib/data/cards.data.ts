import { CardType } from '../models/card-type.model';

export const cardsData = [
  {
    id: 'card-1',
    cardAttributes: {
      manaValue: 1,
      cardName: 'Zombie',
      descriptionText: 'A basic zombie card',
      keywords: ['Zombie', 'Undead', 'Unit', 'Troop'],
      cardType: CardType.TROOP,
    },
    unitAttributes: {
      speed: 1,
      health: 3,
      power: 1,
      toughness: 1,
    },
  },
  {
    id: 'card-2',
    cardAttributes: {
      manaValue: 1,
      cardName: 'Knight',
      descriptionText: 'A Knight',
      keywords: ['Knight', 'Soldier', 'Unit', 'Troop'],
      cardType: CardType.TROOP,
    },
    unitAttributes: {
      speed: 1,
      health: 2,
      power: 1,
      toughness: 2,
    },
  },
];

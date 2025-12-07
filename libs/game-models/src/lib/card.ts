import { Effect } from './effect';

export type CardId = string;

export interface Card {
  id: CardId;
  name: string;
  displayText: string;
  effects: Effect[];
  pitchValue: number; // 1, 2, or 3 - mana value when pitched
  manaCost: number; // Mana cost required to play the card
}

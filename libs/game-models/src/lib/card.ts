import { Effect } from './effect';

export type CardId = string;

export interface Card {
  id: CardId;
  name: string;
  displayText: string;
  effects: Effect[];
}

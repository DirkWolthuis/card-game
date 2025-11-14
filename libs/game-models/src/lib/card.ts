import { Effect } from './effect';

export interface Card {
  id: string;
  name: string;
  displayText: string;
  effects: Effect[];
}

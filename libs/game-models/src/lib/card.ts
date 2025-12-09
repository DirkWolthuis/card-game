import { Effect } from './effect';

export type CardId = string;

export enum CardType {
  SPELL = 'SPELL',
  UNIT = 'UNIT',
  LEADER = 'LEADER',
  TROOP = 'TROOP',
  REACTION = 'REACTION',
}

export enum ActionSpeed {
  NORMAL = 'NORMAL',
  REACTION = 'REACTION',
}

export interface UnitStats {
  power: number; // Offensive strength; determines damage dealt in combat
  resistance: number; // Defensive stat; reduces incoming damage
  health: number; // Life total; when reduced to 0, the unit is destroyed
}

export interface Card {
  id: CardId;
  name: string;
  displayText: string;
  types: CardType[]; // Array of types - a card can have multiple types (e.g., UNIT and LEADER)
  effects: Effect[];
  pitchValue: number; // 1, 2, or 3 - mana value when pitched
  manaCost: number; // Mana cost required to play the card
  unitStats?: UnitStats; // Only present for unit types (UNIT, LEADER, TROOP)
  speed?: ActionSpeed; // Speed at which the card/action can be played. Defaults to NORMAL if not specified.
}

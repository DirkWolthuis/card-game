import { Effect } from './effect';

export type CardId = string;

/**
 * Card types as defined in the game design document.
 * - Leader: Only one Leader may attack per turn, damage is permanent
 * - Troop: Join attacking Leaders or block attackers, damage resets at end of turn
 * - Spell: Instant effects that go to graveyard after use
 * - Resource: Cards that provide materials, subjects, or influence
 */
export enum CardType {
  LEADER = 'leader',
  TROOP = 'troop',
  SPELL = 'spell',
  RESOURCE = 'resource',
}

/**
 * Troop types that can join a Leader's attack.
 * Leaders have a keyword like "Leader - Zombie (5)" indicating which troops can join.
 */
export enum TroopType {
  ZOMBIE = 'zombie',
  SOLDIER = 'soldier',
  KNIGHT = 'knight',
  MAGE = 'mage',
}

/**
 * Resource types used for additional costs on powerful cards.
 */
export enum ResourceType {
  SUBJECTS = 'subjects',
  MATERIALS = 'materials',
  INFLUENCE = 'influence',
}

export interface Card {
  id: CardId;
  name: string;
  displayText: string;
  effects: Effect[];

  /**
   * Type of card (Leader, Troop, Spell, Resource)
   */
  cardType: CardType;

  /**
   * Mana cost to play the card
   */
  cost: number;

  /**
   * Pitch value (1-3) - mana generated when card is played face-down for mana
   */
  pitchValue: 1 | 2 | 3;

  /**
   * Attack power (for Leaders and Troops)
   */
  attack?: number;

  /**
   * Health/defense value (for Leaders and Troops)
   */
  health?: number;

  /**
   * For Leaders: which troop type can join their attack
   */
  troopType?: TroopType;

  /**
   * For Leaders: maximum number of troops that can join (X in "Leader - Type (X)")
   */
  troopLimit?: number;

  /**
   * For Resource cards: what type of resource they provide
   */
  resourceType?: ResourceType;

  /**
   * Placeholder for card art URL/path
   */
  artUrl?: string;
}

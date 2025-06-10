// Types for core game entities
export type CardType = 'unit' | 'spell' | 'rift' | 'boon' | 'relic';
export type UnitType = 'troop' | 'captain' | 'leader';
export type SpellType = 'ritual' | 'reaction' | 'blitz';

export interface Card {
  id: string;
  name: string;
  manaCost: number;
  type: CardType;
  // For units and spells, use subtypes
  unitType?: UnitType;
  spellType?: SpellType;
  // For permanent cards
  isPermanent?: boolean;
}

export interface Unit extends Card {
  type: 'unit';
  unitType: UnitType;
  speed: number;
  health: number;
  resistance: number;
  power: number;
  actionTokens: number;
  // Add more as needed
}

export interface Player {
  id: string;
  name: string;
  health: number;
  mana: number;
  hand: Card[];
  deck: Card[];
  graveyard: Card[];
  battlefield: Unit[];
  supportLane: Unit[];
  commander: Unit;
  // Add more as needed
}

export interface CombatAction {
  attackerId: string;
  blockerId?: string;
  damageAssigned?: number;
}

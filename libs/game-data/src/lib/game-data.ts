import {
  Card,
  CardType,
  EffectType,
  TargetType,
  PreconstructedDeck,
  AbilityType,
} from '@game/models';
import { getEnvVar } from '@game/core';

export const getAllCards = (): Card[] => {
  return CARD_DATABASE;
};

export const getCardById = (cardId: string): Card | undefined => {
  return CARD_DATABASE.find((card) => card.id === cardId);
};

export const getAllPreconstructedDecks = (): PreconstructedDeck[] => {
  return PRECONSTRUCTED_DECKS;
};

/**
 * Get all preconstructed decks available for selection.
 * In E2E mode (VITE_E2E_MODE=true), includes the E2E test deck.
 * Otherwise, filters out the E2E test deck from the list.
 */
export const getSelectablePreconstructedDecks = (): PreconstructedDeck[] => {
  const isE2EMode = getEnvVar('VITE_E2E_MODE') === 'true';
  
  if (isE2EMode) {
    return PRECONSTRUCTED_DECKS;
  }
  
  // Filter out the E2E test deck in non-E2E mode
  return PRECONSTRUCTED_DECKS.filter(deck => deck.id !== 'e2e-test-deck');
};

export const getPreconstructedDeckById = (
  deckId: string
): PreconstructedDeck | undefined => {
  return PRECONSTRUCTED_DECKS.find((deck) => deck.id === deckId);
};

const CARD_DATABASE: Card[] = [
  {
    id: 'aaaa',
    displayText: 'Deal 2 damage to opponent',
    name: 'Firebolt',
    types: [CardType.SPELL],
    pitchValue: 1,
    manaCost: 1,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Deal 2 damage to opponent',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      },
    ],
  },
  {
    id: 'bbb',
    displayText: 'Heal yourself for 2 health',
    name: 'Divine touch',
    types: [CardType.SPELL],
    pitchValue: 2,
    manaCost: 2,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 2 health',
        effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 2 }],
      },
    ],
  },
  {
    id: 'cccc',
    displayText: 'Kill opponent',
    name: 'Kill',
    types: [CardType.SPELL],
    pitchValue: 3,
    manaCost: 5,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Deal 999 damage to opponent',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 999 },
        ],
      },
    ],
  },
  {
    id: 'dddd',
    displayText: 'Deal 20 damage to opponent',
    name: '20 Damage Spell',
    types: [CardType.SPELL],
    pitchValue: 2,
    manaCost: 3,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Deal 20 damage to opponent',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 20 },
        ],
      },
    ],
  },
  {
    id: 'leader-1',
    displayText: 'A powerful leader unit',
    name: 'Knight Commander',
    types: [CardType.UNIT, CardType.LEADER],
    pitchValue: 2,
    manaCost: 3,
    abilities: [],
    unitStats: {
      power: 3,
      resistance: 1,
      health: 3,
    },
  },
  {
    id: 'troop-1',
    displayText: 'A basic troop unit',
    name: 'Foot Soldier',
    types: [CardType.UNIT, CardType.TROOP],
    pitchValue: 1,
    manaCost: 1,
    abilities: [],
    unitStats: {
      power: 2,
      resistance: 0,
      health: 1,
    },
  },
  // Additional cards for deck variety
  {
    id: 'spell-1',
    displayText: 'Deal 3 damage to opponent',
    name: 'Lightning Bolt',
    types: [CardType.SPELL],
    pitchValue: 1,
    manaCost: 2,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Deal 3 damage to opponent',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 3 },
        ],
      },
    ],
  },
  {
    id: 'spell-2',
    displayText: 'Heal yourself for 3 health',
    name: 'Healing Word',
    types: [CardType.SPELL],
    pitchValue: 1,
    manaCost: 1,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 3 health',
        effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 3 }],
      },
    ],
  },
  {
    id: 'spell-3',
    displayText: 'Deal 5 damage to opponent',
    name: 'Fireball',
    types: [CardType.SPELL],
    pitchValue: 2,
    manaCost: 3,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Deal 5 damage to opponent',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 5 },
        ],
      },
    ],
  },
  {
    id: 'spell-4',
    displayText: 'Heal yourself for 5 health',
    name: 'Greater Heal',
    types: [CardType.SPELL],
    pitchValue: 2,
    manaCost: 3,
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 5 health',
        effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 5 }],
      },
    ],
  },
  {
    id: 'troop-2',
    displayText: 'A swift archer troop',
    name: 'Archer',
    types: [CardType.UNIT, CardType.TROOP],
    pitchValue: 1,
    manaCost: 2,
    abilities: [],
    unitStats: {
      power: 3,
      resistance: 0,
      health: 1,
    },
  },
  {
    id: 'troop-3',
    displayText: 'A defensive shield bearer',
    name: 'Shield Bearer',
    types: [CardType.UNIT, CardType.TROOP],
    pitchValue: 2,
    manaCost: 2,
    abilities: [],
    unitStats: {
      power: 1,
      resistance: 2,
      health: 1,
    },
  },
  {
    id: 'leader-2',
    displayText: 'A defensive leader',
    name: 'Guard Captain',
    types: [CardType.UNIT, CardType.LEADER],
    pitchValue: 2,
    manaCost: 4,
    abilities: [],
    unitStats: {
      power: 2,
      resistance: 2,
      health: 4,
    },
  },
  {
    id: 'leader-3',
    displayText: 'An aggressive leader',
    name: 'Warlord',
    types: [CardType.UNIT, CardType.LEADER],
    pitchValue: 3,
    manaCost: 5,
    abilities: [],
    unitStats: {
      power: 5,
      resistance: 1,
      health: 3,
    },
  },
  {
    id: 'troop-4',
    displayText: 'A heavy infantry troop',
    name: 'Heavy Infantry',
    types: [CardType.UNIT, CardType.TROOP],
    pitchValue: 2,
    manaCost: 3,
    abilities: [],
    unitStats: {
      power: 3,
      resistance: 1,
      health: 1,
    },
  },
  // Cards with target selection for E2E testing
  {
    id: 'spell-target-any',
    displayText: 'Deal 4 damage to any player',
    name: 'Targeted Strike',
    types: [CardType.SPELL],
    pitchValue: 2,
    manaCost: 0, // Set to 0 for easy E2E testing without needing to pitch
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Deal 4 damage to any player',
        effects: [
          { target: TargetType.PLAYER, type: EffectType.DEAL_DAMAGE, value: 4 },
        ],
      },
    ],
  },
  {
    id: 'spell-target-opponent',
    displayText: 'Deal 6 damage to target opponent',
    name: 'Direct Assault',
    types: [CardType.SPELL],
    pitchValue: 3,
    manaCost: 0, // Set to 0 for easy E2E testing without needing to pitch
    abilities: [
      {
        type: AbilityType.TRIGGERED,
        description: 'Deal 6 damage to target opponent',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 6 },
        ],
      },
    ],
  },
];

const PRECONSTRUCTED_DECKS: PreconstructedDeck[] = [
  {
    id: 'aggro-red',
    name: 'Aggressive Red',
    description: 'Fast-paced deck focused on dealing direct damage',
    cardIds: [
      'aaaa',
      'aaaa',
      'aaaa',
      'spell-1',
      'spell-1',
      'spell-1',
      'spell-3',
      'spell-3',
      'troop-1',
      'troop-1',
      'troop-1',
      'troop-1',
      'troop-2',
      'troop-2',
      'troop-2',
      'leader-1',
      'leader-1',
      'leader-3',
      'dddd',
      'dddd',
    ],
  },
  {
    id: 'control-white',
    name: 'Control White',
    description: 'Defensive deck focused on healing and controlling the board',
    cardIds: [
      'bbb',
      'bbb',
      'bbb',
      'spell-2',
      'spell-2',
      'spell-2',
      'spell-4',
      'spell-4',
      'troop-3',
      'troop-3',
      'troop-3',
      'troop-3',
      'troop-4',
      'troop-4',
      'leader-2',
      'leader-2',
      'leader-1',
      'aaaa',
      'aaaa',
      'cccc',
    ],
  },
  {
    id: 'balanced-green',
    name: 'Balanced Green',
    description: 'Well-rounded deck with a mix of offense and defense',
    cardIds: [
      'aaaa',
      'aaaa',
      'bbb',
      'bbb',
      'spell-1',
      'spell-1',
      'spell-2',
      'spell-2',
      'troop-1',
      'troop-1',
      'troop-2',
      'troop-2',
      'troop-3',
      'troop-3',
      'leader-1',
      'leader-1',
      'leader-2',
      'spell-3',
      'spell-4',
      'troop-4',
    ],
  },
  {
    id: 'combo-blue',
    name: 'Combo Blue',
    description: 'Strategic deck focused on powerful combinations',
    cardIds: [
      'spell-1',
      'spell-1',
      'spell-3',
      'spell-3',
      'spell-3',
      'spell-4',
      'spell-4',
      'troop-2',
      'troop-2',
      'troop-2',
      'troop-4',
      'troop-4',
      'leader-3',
      'leader-3',
      'leader-1',
      'dddd',
      'cccc',
      'aaaa',
      'bbb',
      'bbb',
    ],
  },
  // E2E testing deck with predictable cards for target selection testing
  {
    id: 'e2e-test-deck',
    name: 'E2E Test Deck',
    description: 'Fixed deck for E2E testing with target selection and various card types',
    cardIds: [
      'spell-target-any',  // First card - costs 0, requires target selection (any player)
      'spell-target-opponent', // Second card - costs 0, requires target selection (opponent)
      'troop-1',           // Third card - unit type (troop), costs 1 mana
      'leader-1',          // Fourth card - unit type (leader), costs 3 mana
      'bbb',               // Fifth card - healing spell
      'aaaa',              // Sixth card - spell without target selection
      'spell-1',
      'spell-2',
      'troop-2',
      'troop-3',
      'leader-2',
      'spell-3',
      'spell-4',
      'troop-4',
      'spell-target-any',
      'spell-target-opponent',
      'aaaa',
      'bbb',
      'troop-1',
      'leader-1',
    ],
  },
];

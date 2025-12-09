import {
  Entity,
  EntityId,
  GameState,
  PlayerState,
  SetupData,
} from '@game/models';
import { getAllCards, getPreconstructedDeckById } from '@game/data';

const DECK_SIZE = 40;
const STARTING_HAND_SIZE = 7;

/**
 * Generate an array of cardIds for a random deck.
 */
const generateRandomDeckCardIds = (
  allCardIds: string[],
  size: number
): string[] => {
  return Array.from(
    { length: size },
    () => allCardIds[Math.floor(Math.random() * allCardIds.length)]
  );
};

/**
 * Create entities for a player's deck given cardIds.
 */
const createEntitiesForPlayer = (
  cardIds: string[],
  playerId: string
): Record<EntityId, Entity> => {
  return cardIds
    .map((cardId) => ({
      cardId,
      ownerId: playerId,
      controllerId: playerId,
      id: `${cardId}-${Math.random().toString(36).substring(2, 11)}`,
    }))
    .reduce((acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    }, {} as Record<EntityId, Entity>);
};

/**
 * Split entities into starting hand and remaining deck IDs.
 */
const splitStartingHand = (
  entities: Record<EntityId, Entity>,
  handSize: number
): { handIds: EntityId[]; deckIds: EntityId[] } => {
  const allEntityIds = Object.keys(entities);
  const handIds = allEntityIds.slice(0, handSize);
  const deckIds = allEntityIds.slice(handSize);
  return { handIds, deckIds };
};

/**
 * Build the complete PlayerState including zones and entities.
 */
const buildPlayerState = (
  playerId: string,
  allCardIds: string[]
): PlayerState => {
  const deckCardIds = generateRandomDeckCardIds(allCardIds, DECK_SIZE);
  const entities = createEntitiesForPlayer(deckCardIds, playerId);
  const { handIds, deckIds } = splitStartingHand(entities, STARTING_HAND_SIZE);

  return {
    resources: { life: 20, mana: 0 },
    zones: {
      hand: { entityIds: handIds },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [] },
      exile: { entityIds: [] },
      deck: { entityIds: deckIds },
      pitch: { entityIds: [] },
    },
    entities,
  };
};

/**
 * Build PlayerState from selected preconstructed decks
 */
export const buildPlayerStateFromDecks = (
  playerId: string,
  deckIds: string[]
): PlayerState => {
  // Combine card IDs from both selected decks
  const deckCardIds: string[] = [];
  for (const deckId of deckIds) {
    const deck = getPreconstructedDeckById(deckId);
    if (!deck) {
      throw new Error(
        `Preconstructed deck with id "${deckId}" not found for player ${playerId}`
      );
    }
    deckCardIds.push(...deck.cardIds);
  }

  const entities = createEntitiesForPlayer(deckCardIds, playerId);
  const { handIds, deckIds: remainingDeckIds } = splitStartingHand(
    entities,
    STARTING_HAND_SIZE
  );

  return {
    resources: { life: 20, mana: 0 },
    zones: {
      hand: { entityIds: handIds },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [] },
      exile: { entityIds: [] },
      deck: { entityIds: remainingDeckIds },
      pitch: { entityIds: [] },
    },
    entities,
  };
};

/**
 * Initialize setup data for pre-game phase
 */
export const initializeSetupData = (playerIds: string[]): SetupData => {
  const playerSetup = playerIds.reduce<SetupData['playerSetup']>(
    (acc, pid) => {
      acc[pid] = {
        name: undefined,
        selectedDeckIds: [],
        isReady: false,
      };
      return acc;
    },
    {}
  );

  return { playerSetup };
};

export const setupPlayersState = (playerIds: string[]): GameState => {
  const allCards = getAllCards();
  const allCardIds = allCards.map((c) => c.id);

  const players = playerIds.reduce<Record<string, PlayerState>>((acc, pid) => {
    acc[pid] = buildPlayerState(pid, allCardIds);
    return acc;
  }, {});

  return { players };
};

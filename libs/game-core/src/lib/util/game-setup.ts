import { Entity, GameState } from '@game/models';
import { getAllCards } from '@game/data';

export const setupPlayersState = (playerIds: string[]): GameState => {
  // temp: create random deck of 40 cards from card database
  const allCards = getAllCards();
  const randomDeck = Array.from(
    { length: 40 },
    () => allCards[Math.floor(Math.random() * allCards.length)].id
  );
  const entities: Record<string, Entity> = randomDeck
    .map((cardId) => ({
      cardId: cardId,
      id: `${cardId}-${Math.random().toString(36).substr(2, 9)}`,
    }))
    .reduce((acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    }, {} as Record<string, Entity>);

  // get 7 random entities for starting hand, rest go to deck
  const startingHand = Object.values(entities)
    .slice(0, 7)
    .map((entity) => entity.id);
  const deck = Object.values(entities)
    .slice(7)
    .map((entity) => entity.id);

  const players = playerIds.reduce(
    (prev, playerID) => ({
      ...prev,
      [playerID]: {
        resources: {
          life: 20,
        },
        zones: {
          hand: { entityIds: startingHand },
          battlefield: { entityIds: [] },
          graveyard: { entityIds: [] },
          exile: { entityIds: [] },
          deck: { entityIds: deck },
        },
        entities: entities,
      },
    }),
    {}
  );
  return {
    players: players,
  };
};

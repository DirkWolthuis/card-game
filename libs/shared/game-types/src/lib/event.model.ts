export type GameEvent =
  | SetupGameEvent
  | CreateCardEntitiesEvent
  | CreateCardCollectionsEvent;

export type SetupGameEvent = {
  type: 'INTERNAL::SETUP_GAME';
  payload: {
    players: {
      id: number;
      deckId: number;
    }[];
  };
};

export type CreateCardEntitiesEvent = {
  type: 'INTERNAL::CREATE_CARD_ENTITIES';
  payload: {
    playerId: number;
    deckId: number;
  };
};

export type CreateCardCollectionsEvent = {
  type: 'INTERNAL::CREATE_CARD_COLLECTIONS';
  payload: {
    playerId: number;
  };
};

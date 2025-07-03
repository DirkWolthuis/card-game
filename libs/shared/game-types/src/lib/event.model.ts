export type GameEvent = SetupGameEvent | SetupDeckEvent;

export type SetupGameEvent = {
  type: 'INTERNAL::SETUP_GAME';
  payload: {
    players: {
      id: number;
      deckId: number;
    }[];
  };
};

export type SetupDeckEvent = {
  type: 'INTERNAL::SETUP_DECK';
  payload: {
    playerId: number;
    deckId: number;
  };
};

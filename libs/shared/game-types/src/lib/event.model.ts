export type GameEvent = SetupGameEvent;

export type SetupGameEvent = {
  type: 'INTERNAL::SETUP_GAME';
  payload: {};
};

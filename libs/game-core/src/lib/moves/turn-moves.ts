import { GameState } from '@game/models';
import { Move } from 'boardgame.io';

export const endTurn: Move<GameState> = ({ G, events }) => {
  events.endTurn();
  return G;
};

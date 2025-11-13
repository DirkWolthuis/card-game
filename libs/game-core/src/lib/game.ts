// Game.ts
import type { Game, Move } from 'boardgame.io';

export interface MyGameState {
  // aka 'G', your game's state
}

const move: Move<MyGameState> = ({ G, ctx }) => {};

export const MyGame: Game<MyGameState> = {
  // ...
};

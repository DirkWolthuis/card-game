// Game.ts
import type { Game } from 'boardgame.io';
import { GameState } from '@game/models';
import { playCardFromHand } from './moves/card-moves';
import { setupPlayersState } from './util/game-setup';

export const GameEngine: Game<GameState> = {
  name: 'card-game',
  setup: ({ ctx }) => {
    return setupPlayersState(Object.keys(ctx.playOrder));
  },
  moves: {
    playCardFromHand: playCardFromHand,
  },
  minPlayers: 2,
  maxPlayers: 4,
};

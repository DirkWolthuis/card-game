// Game.ts
import type { Game } from 'boardgame.io';
import { GameState, MoveType } from '@game/models';
import { playCardFromHand } from './moves/card-moves';
import { setupPlayersState } from './util/game-setup';

export const GameEngine: Game<
  GameState,
  { playCardFromHand: typeof playCardFromHand }
> = {
  name: 'card-game',
  setup: ({ ctx }) => {
    return setupPlayersState(Object.keys(ctx.playOrder));
  },
  moves: {
    [MoveType.PLAY_CARD_FROM_HAND]: playCardFromHand,
  },
  minPlayers: 2,
  maxPlayers: 4,
};

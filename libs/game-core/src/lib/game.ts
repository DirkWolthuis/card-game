// Game.ts
import type { Game } from 'boardgame.io';
import { GameState, MoveType } from '@game/models';
import { playCardFromHand, selectTarget } from './moves/card-moves';
import { endTurn } from './moves/turn-moves';
import { setupPlayersState } from './util/game-setup';
import { checkGameEnd } from './util/game-state-utils';

export const GameEngine: Game<
  GameState,
  { 
    playCardFromHand: typeof playCardFromHand; 
    endTurn: typeof endTurn;
    selectTarget: typeof selectTarget;
  }
> = {
  name: 'card-game',
  setup: ({ ctx }) => {
    return setupPlayersState(Object.keys(ctx.playOrder));
  },
  moves: {
    [MoveType.PLAY_CARD_FROM_HAND]: playCardFromHand,
    [MoveType.END_TURN]: endTurn,
    [MoveType.SELECT_TARGET]: selectTarget,
  },
  endIf: ({ G }) => checkGameEnd(G),
  minPlayers: 2,
  maxPlayers: 4,
};

// Game.ts
import type { Game } from 'boardgame.io';
import { GameState, MoveType } from '@game/models';
import { playCardFromHand, selectTarget } from './moves/card-moves';
import { endTurn } from './moves/turn-moves';
import { setupPlayersState } from './util/game-setup';
import { checkGameEnd, isPlayerEliminated } from './util/game-state-utils';

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
  turn: {
    order: {
      first: () => 0,
      next: ({ G, ctx }) => {
        // Find the next non-eliminated player
        let nextPos = ctx.playOrderPos;
        const numPlayers = ctx.numPlayers;
        
        // Loop through all players to find the next alive player
        for (let i = 0; i < numPlayers; i++) {
          nextPos = (nextPos + 1) % numPlayers;
          const playerId = ctx.playOrder[nextPos];
          if (!isPlayerEliminated(G, playerId)) {
            return nextPos;
          }
        }
        
        // No alive players found - this is expected when the game ends.
        // The endIf hook will handle game termination before this becomes an issue.
        // Returning undefined signals boardgame.io that no next player is available.
        return undefined;
      },
    },
  },
  endIf: ({ G }) => checkGameEnd(G),
  minPlayers: 2,
  maxPlayers: 4,
};

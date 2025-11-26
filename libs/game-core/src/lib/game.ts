// Game.ts
import type { Game } from 'boardgame.io';
import { GameState, MoveType } from '@game/models';
import { playCardFromHand, selectTarget } from './moves/card-moves';
import { drawCard, discardCard } from './moves/stage-moves';
import { setupPlayersState } from './util/game-setup';
import { drawCardToHand, checkGameEnd, isPlayerEliminated } from './util/game-state-utils';

const MAX_HAND_SIZE = 7;

export const GameEngine: Game<GameState> = {
  name: 'card-game',
  setup: ({ ctx }) => {
    return setupPlayersState(Object.keys(ctx.playOrder));
  },
  phases: {
    /**
     * Start stage configuration.
     * Player draws a card automatically when the stage begins.
     * No manual moves are allowed in this stage.
     */
    start: {
      start: true,
      moves: {
        [MoveType.DRAW_CARD]: drawCard,
      },
      onBegin: ({ G, ctx, events }) => {
        // Automatically draw a card for the current player
        drawCardToHand(G, ctx.currentPlayer);
        // Automatically transition to main stage
        events.setPhase('main');
      },
    },
    /**
     * Main stage configuration.
     * Player can play cards from hand, select targets, and end their turn.
     */
    main: {
      moves: {
        [MoveType.PLAY_CARD_FROM_HAND]: playCardFromHand,
        [MoveType.SELECT_TARGET]: selectTarget,
        [MoveType.END_TURN]: {
          move: ({ G, events }) => {
            events.setPhase('end');
            return G;
          },
        },
      },
    },
    /**
     * End stage configuration.
     * Player must discard down to 7 cards if they have more.
     */
    end: {
      moves: {
        [MoveType.DISCARD_CARD]: discardCard,
      },
      endIf: ({ G, ctx }) => {
        const playerState = G.players[ctx.currentPlayer];
        return (
          playerState && playerState.zones.hand.entityIds.length <= MAX_HAND_SIZE
        );
      },
      onEnd: ({ events }) => {
        events.endTurn();
      },
      next: 'start',
    },
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

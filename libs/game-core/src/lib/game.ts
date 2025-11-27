// Game.ts
import type { Game } from 'boardgame.io';
import { GameState, MoveType } from '@game/models';
import { playCardFromHand, selectTarget } from './moves/card-moves';
import { endTurn, drawCard, discardFromHand } from './moves/turn-moves';
import { setupPlayersState } from './util/game-setup';
import { checkGameEnd, isPlayerEliminated } from './util/game-state-utils';

/** Maximum hand size - players must discard down to this limit at end of turn */
const MAX_HAND_SIZE = 7;

export const GameEngine: Game<
  GameState,
  {
    playCardFromHand: typeof playCardFromHand;
    endTurn: typeof endTurn;
    selectTarget: typeof selectTarget;
    drawCard: typeof drawCard;
    discardFromHand: typeof discardFromHand;
  }
> = {
  name: 'card-game',
  setup: ({ ctx }) => {
    return setupPlayersState(Object.keys(ctx.playOrder));
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
  phases: {
    /**
     * Start Stage: Player draws a card automatically, no manual moves allowed.
     * Transitions to main stage after drawing.
     */
    startStage: {
      start: true,
      onBegin: ({ G, ctx, events }) => {
        const currentPlayerId = ctx.currentPlayer;
        const playerState = G.players[currentPlayerId];

        // Draw a card if possible
        if (playerState.zones.deck.entityIds.length > 0) {
          const drawnEntityId = playerState.zones.deck.entityIds.shift();
          if (drawnEntityId) {
            playerState.zones.hand.entityIds.push(drawnEntityId);
          }
        }

        // Automatically transition to main stage
        events.setPhase('mainStage');
      },
      // No moves available in start stage - everything is automatic
      moves: {},
    },
    /**
     * Main Stage: Player makes their moves (play cards, use abilities, etc.)
     * Player can end their turn to transition to end stage.
     */
    mainStage: {
      moves: {
        [MoveType.PLAY_CARD_FROM_HAND]: playCardFromHand,
        [MoveType.SELECT_TARGET]: selectTarget,
        [MoveType.END_TURN]: {
          move: ({ G, events, ctx }) => {
            const currentPlayerId = ctx.currentPlayer;
            const playerState = G.players[currentPlayerId];

            // Check if player needs to discard
            if (playerState.zones.hand.entityIds.length > MAX_HAND_SIZE) {
              events.setPhase('endStage');
            } else {
              // No discarding needed, end the turn directly
              events.endTurn();
            }
            return G;
          },
        },
      },
    },
    /**
     * End Stage: Player discards down to 7 cards if over the limit.
     * Transitions to next player's turn after discarding is complete.
     */
    endStage: {
      moves: {
        [MoveType.DISCARD_FROM_HAND]: discardFromHand,
      },
      endIf: ({ G, ctx }) => {
        const currentPlayerId = ctx.currentPlayer;
        const playerState = G.players[currentPlayerId];
        // End this phase when hand size is at or below max
        return playerState.zones.hand.entityIds.length <= MAX_HAND_SIZE;
      },
      onEnd: ({ events }) => {
        // After discarding is complete, end the turn
        events.endTurn();
      },
      next: 'startStage',
    },
  },
  // Global moves that are available in all phases if not overridden
  moves: {
    [MoveType.DRAW_CARD]: drawCard,
  },
  endIf: ({ G }) => checkGameEnd(G),
  minPlayers: 2,
  maxPlayers: 4,
};

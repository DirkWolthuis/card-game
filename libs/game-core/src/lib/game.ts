// Game.ts
import type { Game } from 'boardgame.io';
import { GameState, MoveType } from '@game/models';
import { playCardFromHand, selectTarget } from './moves/card-moves';
import { pitchCard } from './moves/resource-moves';
import { setPlayerName, selectDeck, setReady } from './moves/setup-moves';
import {
  initializeSetupData,
  buildPlayerStateFromDecks,
} from './util/game-setup';
import {
  checkGameEnd,
  isPlayerEliminated,
  drawCardForPlayer,
  discardCardForPlayer,
} from './util/game-state-utils';
import { INVALID_MOVE } from 'boardgame.io/core';

/** Maximum hand size - players must discard down to this limit at end of turn */
const MAX_HAND_SIZE = 7;

export const GameEngine: Game<
  GameState,
  {
    playCardFromHand: typeof playCardFromHand;
    selectTarget: typeof selectTarget;
    pitchCard: typeof pitchCard;
    setPlayerName: typeof setPlayerName;
    selectDeck: typeof selectDeck;
    setReady: typeof setReady;
  }
> = {
  name: 'card-game',
  setup: ({ ctx }) => {
    const setupData = initializeSetupData(Object.keys(ctx.playOrder));
    return { players: {}, setupData };
  },
  phases: {
    setup: {
      start: true,
      moves: {
        [MoveType.SET_PLAYER_NAME]: setPlayerName,
        [MoveType.SELECT_DECK]: selectDeck,
        [MoveType.SET_READY]: setReady,
      },
      endIf: ({ G }) => {
        // Check if all players are ready
        if (!G.setupData) return false;

        const allReady = Object.values(G.setupData.playerSetup).every(
          (setup) => setup.isReady
        );
        return allReady;
      },
      next: 'play',
      onEnd: ({ G, ctx }) => {
        // Build player states from selected decks
        if (!G.setupData) return;

        for (const playerId of Object.keys(ctx.playOrder)) {
          const playerSetup = G.setupData.playerSetup[playerId];
          if (playerSetup.selectedDeckIds.length === 2) {
            G.players[playerId] = buildPlayerStateFromDecks(
              playerId,
              playerSetup.selectedDeckIds
            );
          }
        }
      },
    },
    play: {
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
        /**
         * Start Stage: At the beginning of each turn:
         * - Empty mana pool (reset to 0)
         * - Move all cards from pitch zone to graveyard
         * - Untap all cards (not yet implemented)
         * - Draw to 7 cards (currently draws 1 card)
         * Then transition to the main stage where the player can make moves.
         */
        onBegin: ({ G, ctx, events }) => {
          const currentPlayerId = ctx.currentPlayer;
          const playerState = G.players[currentPlayerId];

          // Empty mana pool
          playerState.resources.mana = 0;

          // Move all cards from pitch zone to graveyard
          playerState.zones.graveyard.entityIds.push(
            ...playerState.zones.pitch.entityIds
          );
          playerState.zones.pitch.entityIds = [];

          // Draw a card if possible (Start Stage - automatic, no manual moves)
          drawCardForPlayer(G, currentPlayerId);

          // Transition to main stage for player actions
          events.setActivePlayers({ currentPlayer: 'mainStage' });
        },
        stages: {
          /**
           * Main Stage: Player makes their moves (play cards, use abilities, etc.)
           * Player can end their turn to transition to end stage if needed.
           */
          mainStage: {
            moves: {
              [MoveType.PLAY_CARD_FROM_HAND]: playCardFromHand,
              [MoveType.SELECT_TARGET]: selectTarget,
              [MoveType.PITCH_CARD]: pitchCard,
              [MoveType.END_TURN]: {
                move: ({ G, events, ctx }) => {
                  const currentPlayerId = ctx.currentPlayer;
                  const playerState = G.players[currentPlayerId];

                  // Check if player needs to discard
                  if (playerState.zones.hand.entityIds.length > MAX_HAND_SIZE) {
                    // Transition to end stage for discarding
                    events.setActivePlayers({ currentPlayer: 'endStage' });
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
              [MoveType.DISCARD_FROM_HAND]: (
                { G, playerID, events },
                entityId: string
              ) => {
                const success = discardCardForPlayer(G, playerID, entityId);
                if (!success) {
                  return INVALID_MOVE;
                }

                // Check if we can end the turn now
                const playerState = G.players[playerID];
                if (playerState.zones.hand.entityIds.length <= MAX_HAND_SIZE) {
                  events.endTurn();
                }

                return G;
              },
            },
          },
        },
      },
    },
  },
  endIf: ({ G }) => checkGameEnd(G),
  minPlayers: 2,
  maxPlayers: 4,
};

// Game.ts
import type { Game } from 'boardgame.io';
import { GameState, MoveType } from '@game/models';
import { playCardFromHand, selectTarget } from './moves/card-moves';
import { pitchCard } from './moves/resource-moves';
import { endTurn, discardFromHand } from './moves/turn-moves';
import { setPlayerName, selectDeck, setReady } from './moves/setup-moves';
import { initializeSetupData } from './util/game-setup';
import {
  shouldEndSetupPhase,
  onSetupPhaseEnd,
  onTurnBegin,
} from './util/phase-utils';
import {
  checkGameEnd,
  isPlayerEliminated,
} from './util/game-state-utils';

export const GameEngine: Game<
  GameState,
  {
    playCardFromHand: typeof playCardFromHand;
    selectTarget: typeof selectTarget;
    pitchCard: typeof pitchCard;
    setPlayerName: typeof setPlayerName;
    selectDeck: typeof selectDeck;
    setReady: typeof setReady;
    endTurn: typeof endTurn;
    discardFromHand: typeof discardFromHand;
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
      endIf: shouldEndSetupPhase,
      next: 'play',
      onEnd: onSetupPhaseEnd,
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
        onBegin: onTurnBegin,
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
              [MoveType.END_TURN]: endTurn,
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
          },
        },
      },
    },
  },
  endIf: ({ G }) => checkGameEnd(G),
  minPlayers: 2,
  maxPlayers: 4,
};

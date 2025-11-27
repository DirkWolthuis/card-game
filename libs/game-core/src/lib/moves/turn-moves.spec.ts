import { discardFromHand } from './turn-moves';
import { GameState, PlayerState } from '@game/models';
import { INVALID_MOVE } from 'boardgame.io/core';
import type { FnContext } from 'boardgame.io';

// Type helper for calling move functions
const callMove = <T>(
  moveFn: unknown,
  context: Partial<FnContext<GameState>>,
  arg?: T
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (moveFn as (ctx: FnContext<GameState>, arg: T) => any)(
    context as FnContext<GameState>,
    arg as T
  );
};

describe('turn-moves', () => {
  const createPlayerState = (
    handEntityIds: string[] = [],
    deckEntityIds: string[] = [],
    graveyardEntityIds: string[] = []
  ): PlayerState => ({
    resources: { life: 20 },
    zones: {
      hand: { entityIds: [...handEntityIds] },
      deck: { entityIds: [...deckEntityIds] },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [...graveyardEntityIds] },
      exile: { entityIds: [] },
    },
    entities: {},
  });

  describe('discardFromHand', () => {
    it('should move a card from hand to graveyard', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(
            ['hand-1', 'hand-2', 'hand-3'],
            ['deck-1'],
            []
          ),
        },
      };

      const result = callMove(
        discardFromHand,
        {
          G: gameState,
          playerID: '0',
        },
        'hand-2'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-1',
        'hand-3',
      ]);
      expect(gameState.players['0'].zones.graveyard.entityIds).toEqual([
        'hand-2',
      ]);
    });

    it('should return INVALID_MOVE if card is not in hand', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1', 'hand-2'], [], []),
        },
      };

      const result = callMove(
        discardFromHand,
        {
          G: gameState,
          playerID: '0',
        },
        'non-existent'
      );

      expect(result).toBe(INVALID_MOVE);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-1',
        'hand-2',
      ]);
      expect(gameState.players['0'].zones.graveyard.entityIds).toEqual([]);
    });

    it('should discard from the correct player', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-0-1'], [], []),
          '1': createPlayerState(['hand-1-1', 'hand-1-2'], [], ['grave-1-1']),
        },
      };

      callMove(
        discardFromHand,
        {
          G: gameState,
          playerID: '1',
        },
        'hand-1-1'
      );

      // Player 0's state should be unchanged
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-0-1']);
      expect(gameState.players['0'].zones.graveyard.entityIds).toEqual([]);

      // Player 1 should have discarded
      expect(gameState.players['1'].zones.hand.entityIds).toEqual([
        'hand-1-2',
      ]);
      expect(gameState.players['1'].zones.graveyard.entityIds).toEqual([
        'grave-1-1',
        'hand-1-1',
      ]);
    });
  });
});

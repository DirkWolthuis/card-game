import { discardFromHand, endTurn } from './turn-moves';
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
    resources: { life: 20, mana: 0 },
    zones: {
      hand: { entityIds: [...handEntityIds] },
      deck: { entityIds: [...deckEntityIds] },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [...graveyardEntityIds] },
      exile: { entityIds: [] },
      pitch: { entityIds: [] },
    },
    entities: {},
  });

  describe('endTurn', () => {
    it('should end turn directly when hand size is 7 or less', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1', 'hand-2', 'hand-3'], [], []),
        },
      };

      const mockEvents = {
        endTurn: jest.fn(),
        setActivePlayers: jest.fn(),
      };

      callMove(endTurn, {
        G: gameState,
        ctx: { currentPlayer: '0' } as any,
        events: mockEvents as any,
      });

      expect(mockEvents.endTurn).toHaveBeenCalled();
      expect(mockEvents.setActivePlayers).not.toHaveBeenCalled();
    });

    it('should transition to endStage when hand size is more than 7', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(
            ['hand-1', 'hand-2', 'hand-3', 'hand-4', 'hand-5', 'hand-6', 'hand-7', 'hand-8'],
            [],
            []
          ),
        },
      };

      const mockEvents = {
        endTurn: jest.fn(),
        setActivePlayers: jest.fn(),
      };

      callMove(endTurn, {
        G: gameState,
        ctx: { currentPlayer: '0' } as any,
        events: mockEvents as any,
      });

      expect(mockEvents.setActivePlayers).toHaveBeenCalledWith({
        currentPlayer: 'endStage',
      });
      expect(mockEvents.endTurn).not.toHaveBeenCalled();
    });
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

      const mockEvents = {
        endTurn: jest.fn(),
      };

      const result = callMove(
        discardFromHand,
        {
          G: gameState,
          playerID: '0',
          events: mockEvents as any,
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
      // Should end turn since hand is now 2 cards (≤ 7)
      expect(mockEvents.endTurn).toHaveBeenCalled();
    });

    it('should end turn when hand size reaches 7 or below after discard', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(
            ['hand-1', 'hand-2', 'hand-3', 'hand-4', 'hand-5', 'hand-6', 'hand-7', 'hand-8'],
            [],
            []
          ),
        },
      };

      const mockEvents = {
        endTurn: jest.fn(),
      };

      // Discard one card, bringing hand to 7
      callMove(
        discardFromHand,
        {
          G: gameState,
          playerID: '0',
          events: mockEvents as any,
        },
        'hand-8'
      );

      expect(gameState.players['0'].zones.hand.entityIds).toHaveLength(7);
      expect(mockEvents.endTurn).toHaveBeenCalled();
    });

    it('should return INVALID_MOVE if card is not in hand', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1', 'hand-2'], [], []),
        },
      };

      const mockEvents = {
        endTurn: jest.fn(),
      };

      const result = callMove(
        discardFromHand,
        {
          G: gameState,
          playerID: '0',
          events: mockEvents as any,
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

      const mockEvents = {
        endTurn: jest.fn(),
      };

      callMove(
        discardFromHand,
        {
          G: gameState,
          playerID: '1',
          events: mockEvents as any,
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

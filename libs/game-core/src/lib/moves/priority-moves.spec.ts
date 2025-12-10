import { passPriority } from './priority-moves';
import { GameState, PlayerState } from '@game/models';
import { INVALID_MOVE } from 'boardgame.io/core';
import type { FnContext } from 'boardgame.io';

// Helper to create a basic player state
const createPlayerState = (): PlayerState => ({
  resources: { life: 20, mana: 0 },
  zones: {
    hand: { entityIds: [] },
    deck: { entityIds: [] },
    battlefield: { entityIds: [] },
    graveyard: { entityIds: [] },
    exile: { entityIds: [] },
    pitch: { entityIds: [] },
  },
  entities: {},
});

// Type helper for calling move functions
const callMove = (
  moveFn: unknown,
  context: Partial<FnContext<GameState>>
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (moveFn as (ctx: FnContext<GameState>) => any)(
    context as FnContext<GameState>
  );
};

describe('priority-moves', () => {
  describe('passPriority', () => {
    it('should initialize priority system on first pass', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const result = callMove(passPriority, {
        G: gameState,
        ctx: {
          currentPlayer: '0',
          numPlayers: 2,
          playOrder: ['0', '1'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        playerID: '0',
        events: {} as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      expect(result).toBe(gameState);
      expect(gameState.priority).toBeDefined();
      expect(gameState.priority?.currentPriorityPlayer).toBe('1');
      expect(gameState.priority?.consecutivePasses).toBe(1);
    });

    it('should switch priority to opponent', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '0',
          consecutivePasses: 0,
        },
      };

      const result = callMove(passPriority, {
        G: gameState,
        ctx: {
          currentPlayer: '0',
          numPlayers: 2,
          playOrder: ['0', '1'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        playerID: '0',
        events: {} as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      expect(result).toBe(gameState);
      expect(gameState.priority?.currentPriorityPlayer).toBe('1');
      expect(gameState.priority?.consecutivePasses).toBe(1);
    });

    it('should increment consecutive passes', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '0',
          consecutivePasses: 1,
        },
      };

      const result = callMove(passPriority, {
        G: gameState,
        ctx: {
          currentPlayer: '0',
          numPlayers: 2,
          playOrder: ['0', '1'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        playerID: '0',
        events: {} as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      expect(result).toBe(gameState);
      expect(gameState.priority?.consecutivePasses).toBe(2);
    });

    it('should not allow non-current player to pass priority', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const result = callMove(passPriority, {
        G: gameState,
        ctx: {
          currentPlayer: '0',
          numPlayers: 2,
          playOrder: ['0', '1'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        playerID: '1', // Player 1 trying to pass when it's Player 0's turn
        events: {} as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      expect(result).toBe(INVALID_MOVE);
    });

    it('should handle priority system with custom priority player', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '1',
          consecutivePasses: 0,
        },
      };

      // Player 0 is current player but Player 1 has priority
      const result = callMove(passPriority, {
        G: gameState,
        ctx: {
          currentPlayer: '0',
          numPlayers: 2,
          playOrder: ['0', '1'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
        playerID: '0',
        events: {} as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      });

      // Should fail because player 0 doesn't have priority
      expect(result).toBe(INVALID_MOVE);
    });
  });
});

import { GameEngine } from './game';
import { GameState, MoveType, PlayerState } from '@game/models';

describe('GameEngine', () => {
  const createPlayerState = (life: number): PlayerState => ({
    resources: { life },
    zones: {
      hand: { entityIds: [] },
      deck: { entityIds: [] },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [] },
      exile: { entityIds: [] },
    },
    entities: {},
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callEndIf = (gameState: GameState) => GameEngine.endIf?.({ G: gameState } as any);

  describe('endTurn move', () => {
    it('should end the current player turn', () => {
      const mockEvents = {
        endTurn: jest.fn(),
      };

      const move = GameEngine.moves?.[MoveType.END_TURN];
      expect(move).toBeDefined();

      if (move && typeof move === 'function') {
        const mockContext = {
          G: { players: {} } as GameState,
          events: mockEvents,
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        move(mockContext as any);
        expect(mockEvents.endTurn).toHaveBeenCalled();
      }
    });
  });

  describe('endIf', () => {
    it('should be defined', () => {
      expect(GameEngine.endIf).toBeDefined();
    });

    it('should return undefined when multiple players are alive', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(10),
        },
      };
      expect(callEndIf(gameState)).toBeUndefined();
    });

    it('should return winner when only one player remains alive', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(0),
        },
      };
      expect(callEndIf(gameState)).toEqual({ winner: '0' });
    });

    it('should return winner when opponent life goes below 0', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
          '1': createPlayerState(-10),
        },
      };
      expect(callEndIf(gameState)).toEqual({ winner: '0' });
    });
  });

  describe('turn order', () => {
    it('should have custom turn order defined', () => {
      expect(GameEngine.turn).toBeDefined();
      expect(GameEngine.turn?.order).toBeDefined();
      expect(GameEngine.turn?.order?.first).toBeDefined();
      expect(GameEngine.turn?.order?.next).toBeDefined();
    });

    it('should skip eliminated player and go to next alive player', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(0), // eliminated
          '2': createPlayerState(15),
        },
      };
      
      const mockCtx = {
        playOrderPos: 0,
        numPlayers: 3,
        playOrder: ['0', '1', '2'],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nextPos = GameEngine.turn?.order?.next?.({ G: gameState, ctx: mockCtx } as any);
      // From position 0 (player '0'), next should be position 2 (player '2'), skipping eliminated player '1'
      expect(nextPos).toBe(2);
    });

    it('should wrap around and skip eliminated players', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(0), // eliminated
          '2': createPlayerState(0), // eliminated
          '3': createPlayerState(10),
        },
      };
      
      const mockCtx = {
        playOrderPos: 3, // Currently player '3'
        numPlayers: 4,
        playOrder: ['0', '1', '2', '3'],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nextPos = GameEngine.turn?.order?.next?.({ G: gameState, ctx: mockCtx } as any);
      // From position 3 (player '3'), should wrap to position 0 (player '0'), skipping eliminated players
      expect(nextPos).toBe(0);
    });

    it('should return undefined if no alive players found', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(0),
          '1': createPlayerState(0),
        },
      };
      
      const mockCtx = {
        playOrderPos: 0,
        numPlayers: 2,
        playOrder: ['0', '1'],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nextPos = GameEngine.turn?.order?.next?.({ G: gameState, ctx: mockCtx } as any);
      expect(nextPos).toBeUndefined();
    });
  });
});

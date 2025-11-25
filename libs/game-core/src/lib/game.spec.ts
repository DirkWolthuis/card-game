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
      const result = GameEngine.endIf?.({ G: gameState } as Parameters<NonNullable<typeof GameEngine.endIf>>[0]);
      expect(result).toBeUndefined();
    });

    it('should return winner when only one player remains alive', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(0),
        },
      };
      const result = GameEngine.endIf?.({ G: gameState } as Parameters<NonNullable<typeof GameEngine.endIf>>[0]);
      expect(result).toEqual({ winner: '0' });
    });

    it('should return winner when opponent life goes below 0', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
          '1': createPlayerState(-10),
        },
      };
      const result = GameEngine.endIf?.({ G: gameState } as Parameters<NonNullable<typeof GameEngine.endIf>>[0]);
      expect(result).toEqual({ winner: '0' });
    });
  });
});

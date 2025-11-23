import { GameEngine } from './game';
import { GameState, MoveType } from '@game/models';

describe('GameEngine', () => {
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
});

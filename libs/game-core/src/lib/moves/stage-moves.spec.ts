import { drawCard, discardCard } from './stage-moves';
import { GameState, PlayerState } from '@game/models';
import { INVALID_MOVE } from 'boardgame.io/core';

// Helper to cast Move as a callable function
const callMove = (
  move: typeof drawCard | typeof discardCard,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...args: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (move as any)(...args);

describe('stage-moves', () => {
  describe('drawCard', () => {
    it('should draw the top card from deck to hand', () => {
      const playerState: PlayerState = {
        resources: { life: 20 },
        zones: {
          hand: { entityIds: ['hand-card1', 'hand-card2'] },
          deck: { entityIds: ['deck-card1', 'deck-card2', 'deck-card3'] },
          battlefield: { entityIds: [] },
          graveyard: { entityIds: [] },
          exile: { entityIds: [] },
        },
        entities: {},
      };

      const mockGameState: GameState = {
        players: {
          '0': playerState,
        },
      };

      const mockContext = {
        G: mockGameState,
        playerID: '0',
      };

      callMove(drawCard, mockContext);

      expect(mockGameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-card1',
        'hand-card2',
        'deck-card1',
      ]);
      expect(mockGameState.players['0'].zones.deck.entityIds).toEqual([
        'deck-card2',
        'deck-card3',
      ]);
    });

    it('should return INVALID_MOVE when deck is empty', () => {
      const playerState: PlayerState = {
        resources: { life: 20 },
        zones: {
          hand: { entityIds: ['hand-card1'] },
          deck: { entityIds: [] },
          battlefield: { entityIds: [] },
          graveyard: { entityIds: [] },
          exile: { entityIds: [] },
        },
        entities: {},
      };

      const mockGameState: GameState = {
        players: {
          '0': playerState,
        },
      };

      const mockContext = {
        G: mockGameState,
        playerID: '0',
      };

      const result = callMove(drawCard, mockContext);
      expect(result).toBe(INVALID_MOVE);
    });

    it('should return INVALID_MOVE when player does not exist', () => {
      const mockGameState: GameState = {
        players: {},
      };

      const mockContext = {
        G: mockGameState,
        playerID: 'non-existent',
      };

      const result = callMove(drawCard, mockContext);
      expect(result).toBe(INVALID_MOVE);
    });
  });

  describe('discardCard', () => {
    it('should move card from hand to graveyard', () => {
      const playerState: PlayerState = {
        resources: { life: 20 },
        zones: {
          hand: { entityIds: ['hand-card1', 'hand-card2', 'hand-card3'] },
          deck: { entityIds: [] },
          battlefield: { entityIds: [] },
          graveyard: { entityIds: [] },
          exile: { entityIds: [] },
        },
        entities: {},
      };

      const mockGameState: GameState = {
        players: {
          '0': playerState,
        },
      };

      const mockContext = {
        G: mockGameState,
        playerID: '0',
      };

      callMove(discardCard, mockContext, 'hand-card2');

      expect(mockGameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-card1',
        'hand-card3',
      ]);
      expect(mockGameState.players['0'].zones.graveyard.entityIds).toEqual([
        'hand-card2',
      ]);
    });

    it('should return INVALID_MOVE when card is not in hand', () => {
      const playerState: PlayerState = {
        resources: { life: 20 },
        zones: {
          hand: { entityIds: ['hand-card1'] },
          deck: { entityIds: [] },
          battlefield: { entityIds: [] },
          graveyard: { entityIds: [] },
          exile: { entityIds: [] },
        },
        entities: {},
      };

      const mockGameState: GameState = {
        players: {
          '0': playerState,
        },
      };

      const mockContext = {
        G: mockGameState,
        playerID: '0',
      };

      const result = callMove(discardCard, mockContext, 'non-existent-card');
      expect(result).toBe(INVALID_MOVE);
    });

    it('should return INVALID_MOVE when player does not exist', () => {
      const mockGameState: GameState = {
        players: {},
      };

      const mockContext = {
        G: mockGameState,
        playerID: 'non-existent',
      };

      const result = callMove(discardCard, mockContext, 'some-card');
      expect(result).toBe(INVALID_MOVE);
    });
  });
});

import { GameEngine } from './game';
import { GameState, MoveType, PlayerState } from '@game/models';

describe('GameEngine', () => {
  describe('phases', () => {
    it('should have start phase as the initial phase', () => {
      expect(GameEngine.phases?.['start']).toBeDefined();
      expect(GameEngine.phases?.['start']?.start).toBe(true);
    });

    it('should have main phase with playCardFromHand move', () => {
      expect(GameEngine.phases?.['main']).toBeDefined();
      expect(GameEngine.phases?.['main']?.moves?.[MoveType.PLAY_CARD_FROM_HAND]).toBeDefined();
    });

    it('should have main phase with selectTarget move', () => {
      expect(GameEngine.phases?.['main']?.moves?.[MoveType.SELECT_TARGET]).toBeDefined();
    });

    it('should have main phase with endTurn move', () => {
      expect(GameEngine.phases?.['main']?.moves?.[MoveType.END_TURN]).toBeDefined();
    });

    it('should have start phase with drawCard move', () => {
      expect(GameEngine.phases?.['start']?.moves?.[MoveType.DRAW_CARD]).toBeDefined();
    });

    it('should have end phase with discardCard move', () => {
      expect(GameEngine.phases?.['end']).toBeDefined();
      expect(GameEngine.phases?.['end']?.moves?.[MoveType.DISCARD_CARD]).toBeDefined();
    });

    it('should have end phase transition to start phase', () => {
      expect(GameEngine.phases?.['end']?.next).toBe('start');
    });
  });

  describe('endTurn move in main phase', () => {
    it('should transition to end phase when endTurn is called', () => {
      const mockEvents = {
        setPhase: jest.fn(),
      };

      const moveConfig = GameEngine.phases?.['main']?.moves?.[MoveType.END_TURN];
      expect(moveConfig).toBeDefined();

      // The endTurn move is defined as an object with a move property
      if (moveConfig && typeof moveConfig === 'object' && 'move' in moveConfig) {
        const moveFn = moveConfig.move;
        if (typeof moveFn === 'function') {
          const mockContext = {
            G: { players: {} } as GameState,
            events: mockEvents,
          };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          moveFn(mockContext as any);
          expect(mockEvents.setPhase).toHaveBeenCalledWith('end');
        }
      }
    });
  });

  describe('start phase', () => {
    it('should automatically draw a card in onBegin', () => {
      const mockEvents = {
        setPhase: jest.fn(),
      };

      const playerState: PlayerState = {
        resources: { life: 20 },
        zones: {
          hand: { entityIds: ['card1', 'card2'] },
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

      const mockCtx = {
        currentPlayer: '0',
      };

      const onBegin = GameEngine.phases?.['start']?.onBegin;
      expect(onBegin).toBeDefined();

      if (typeof onBegin === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onBegin({ G: mockGameState, ctx: mockCtx, events: mockEvents } as any);

        // Check that a card was drawn from deck to hand
        expect(mockGameState.players['0'].zones.hand.entityIds).toContain('deck-card1');
        expect(mockGameState.players['0'].zones.hand.entityIds.length).toBe(3);
        expect(mockGameState.players['0'].zones.deck.entityIds.length).toBe(2);
        expect(mockEvents.setPhase).toHaveBeenCalledWith('main');
      }
    });
  });

  describe('end phase', () => {
    it('should call endTurn in onEnd', () => {
      const mockEvents = {
        endTurn: jest.fn(),
      };

      const onEnd = GameEngine.phases?.['end']?.onEnd;
      expect(onEnd).toBeDefined();

      if (typeof onEnd === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onEnd({ events: mockEvents } as any);
        expect(mockEvents.endTurn).toHaveBeenCalled();
      }
    });

    it('should end when hand size is 7 or less', () => {
      const playerState: PlayerState = {
        resources: { life: 20 },
        zones: {
          hand: { entityIds: ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7'] },
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

      const endIf = GameEngine.phases?.['end']?.endIf;
      expect(endIf).toBeDefined();

      if (typeof endIf === 'function') {
        const result = endIf({
          G: mockGameState,
          ctx: { currentPlayer: '0' },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        expect(result).toBe(true);
      }
    });

    it('should not end when hand size is greater than 7', () => {
      const playerState: PlayerState = {
        resources: { life: 20 },
        zones: {
          hand: { entityIds: ['card1', 'card2', 'card3', 'card4', 'card5', 'card6', 'card7', 'card8'] },
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

      const endIf = GameEngine.phases?.['end']?.endIf;
      expect(endIf).toBeDefined();

      if (typeof endIf === 'function') {
        const result = endIf({
          G: mockGameState,
          ctx: { currentPlayer: '0' },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        expect(result).toBe(false);
      }
    });
  });
});

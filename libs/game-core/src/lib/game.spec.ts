import { GameEngine } from './game';
import { GameState, MoveType, PlayerState } from '@game/models';
import type { StageConfig, TurnConfig } from 'boardgame.io';

describe('GameEngine', () => {
  const createPlayerState = (
    life: number,
    handSize = 0,
    deckSize = 0
  ): PlayerState => ({
    resources: { life },
    zones: {
      hand: {
        entityIds: Array.from({ length: handSize }, (_, i) => `hand-${i}`),
      },
      deck: {
        entityIds: Array.from({ length: deckSize }, (_, i) => `deck-${i}`),
      },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [] },
      exile: { entityIds: [] },
    },
    entities: {},
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callEndIf = (gameState: GameState) =>
    GameEngine.endIf?.({ G: gameState } as any);

  describe('turn stages', () => {
    it('should have stages defined in turn config', () => {
      const turn = GameEngine.turn as TurnConfig<GameState>;
      expect(turn).toBeDefined();
      expect(turn.stages).toBeDefined();
      expect(turn.stages?.['mainStage']).toBeDefined();
      expect(turn.stages?.['endStage']).toBeDefined();
    });

    it('should have onBegin hook that draws a card and sets mainStage', () => {
      const turn = GameEngine.turn as TurnConfig<GameState>;
      expect(turn.onBegin).toBeDefined();
    });

    describe('start stage (turn.onBegin)', () => {
      it('should draw a card on turn begin', () => {
        const gameState: GameState = {
          players: {
            '0': createPlayerState(20, 5, 10),
          },
        };

        const mockEvents = {
          setActivePlayers: jest.fn(),
        };

        const turn = GameEngine.turn as TurnConfig<GameState>;
        turn.onBegin?.({
          G: gameState,
          ctx: { currentPlayer: '0' },
          events: mockEvents,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        // Should have drawn one card from deck to hand
        expect(gameState.players['0'].zones.hand.entityIds.length).toBe(6);
        expect(gameState.players['0'].zones.deck.entityIds.length).toBe(9);
        // Should transition to main stage
        expect(mockEvents.setActivePlayers).toHaveBeenCalledWith({
          currentPlayer: 'mainStage',
        });
      });

      it('should transition to mainStage even when deck is empty', () => {
        const gameState: GameState = {
          players: {
            '0': createPlayerState(20, 5, 0), // empty deck
          },
        };

        const mockEvents = {
          setActivePlayers: jest.fn(),
        };

        const turn = GameEngine.turn as TurnConfig<GameState>;
        turn.onBegin?.({
          G: gameState,
          ctx: { currentPlayer: '0' },
          events: mockEvents,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        // Hand size should remain unchanged
        expect(gameState.players['0'].zones.hand.entityIds.length).toBe(5);
        // Should still transition to main stage
        expect(mockEvents.setActivePlayers).toHaveBeenCalledWith({
          currentPlayer: 'mainStage',
        });
      });
    });

    describe('mainStage', () => {
      it('should have playCardFromHand, selectTarget, and endTurn moves', () => {
        const turn = GameEngine.turn as TurnConfig<GameState>;
        const mainStage = turn.stages?.['mainStage'] as StageConfig<GameState>;
        expect(mainStage.moves).toBeDefined();
        expect(mainStage.moves?.[MoveType.PLAY_CARD_FROM_HAND]).toBeDefined();
        expect(mainStage.moves?.[MoveType.SELECT_TARGET]).toBeDefined();
        expect(mainStage.moves?.[MoveType.END_TURN]).toBeDefined();
      });

      it('should transition to endStage when endTurn is called with more than 7 cards in hand', () => {
        const gameState: GameState = {
          players: {
            '0': createPlayerState(20, 10, 0), // 10 cards in hand
          },
        };

        const mockEvents = {
          setActivePlayers: jest.fn(),
          endTurn: jest.fn(),
        };

        const turn = GameEngine.turn as TurnConfig<GameState>;
        const mainStage = turn.stages?.['mainStage'] as StageConfig<GameState>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const endTurnMove = mainStage.moves?.[MoveType.END_TURN] as any;
        endTurnMove.move({
          G: gameState,
          ctx: { currentPlayer: '0' },
          events: mockEvents,
        });

        expect(mockEvents.setActivePlayers).toHaveBeenCalledWith({
          currentPlayer: 'endStage',
        });
        expect(mockEvents.endTurn).not.toHaveBeenCalled();
      });

      it('should end turn directly when hand size is 7 or less', () => {
        const gameState: GameState = {
          players: {
            '0': createPlayerState(20, 5, 0), // 5 cards in hand
          },
        };

        const mockEvents = {
          setActivePlayers: jest.fn(),
          endTurn: jest.fn(),
        };

        const turn = GameEngine.turn as TurnConfig<GameState>;
        const mainStage = turn.stages?.['mainStage'] as StageConfig<GameState>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const endTurnMove = mainStage.moves?.[MoveType.END_TURN] as any;
        endTurnMove.move({
          G: gameState,
          ctx: { currentPlayer: '0' },
          events: mockEvents,
        });

        expect(mockEvents.setActivePlayers).not.toHaveBeenCalled();
        expect(mockEvents.endTurn).toHaveBeenCalled();
      });
    });

    describe('endStage', () => {
      it('should only have discardFromHand move', () => {
        const turn = GameEngine.turn as TurnConfig<GameState>;
        const endStage = turn.stages?.['endStage'] as StageConfig<GameState>;
        expect(endStage.moves).toBeDefined();
        expect(endStage.moves?.[MoveType.DISCARD_FROM_HAND]).toBeDefined();
        expect(Object.keys(endStage.moves ?? {}).length).toBe(1);
      });
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
      const nextPos = GameEngine.turn?.order?.next?.({
        G: gameState,
        ctx: mockCtx,
      } as any);
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
      const nextPos = GameEngine.turn?.order?.next?.({
        G: gameState,
        ctx: mockCtx,
      } as any);
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
      const nextPos = GameEngine.turn?.order?.next?.({
        G: gameState,
        ctx: mockCtx,
      } as any);
      expect(nextPos).toBeUndefined();
    });
  });
});

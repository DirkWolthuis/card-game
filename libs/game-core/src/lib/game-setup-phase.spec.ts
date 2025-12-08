import { GameEngine } from './game';
import { GameState, MoveType } from '@game/models';
import type { PhaseConfig } from 'boardgame.io';

describe('GameEngine - Setup Phase', () => {
  describe('setup phase', () => {
    it('should have setup as start phase', () => {
      const phases = GameEngine.phases as Record<string, PhaseConfig<GameState>>;
      expect(phases['setup']).toBeDefined();
      expect(phases['setup'].start).toBe(true);
    });

    it('should have setPlayerName, selectDeck, and setReady moves', () => {
      const phases = GameEngine.phases as Record<string, PhaseConfig<GameState>>;
      const setupPhase = phases['setup'];
      expect(setupPhase.moves).toBeDefined();
      expect(setupPhase.moves?.[MoveType.SET_PLAYER_NAME]).toBeDefined();
      expect(setupPhase.moves?.[MoveType.SELECT_DECK]).toBeDefined();
      expect(setupPhase.moves?.[MoveType.SET_READY]).toBeDefined();
    });

    it('should transition to play phase when both players are ready', () => {
      const phases = GameEngine.phases as Record<string, PhaseConfig<GameState>>;
      const setupPhase = phases['setup'];

      const gameState: GameState = {
        players: {},
        setupData: {
          playerSetup: {
            '0': {
              name: 'Alice',
              selectedDeckIds: ['aggro-red', 'control-white'],
              isReady: true,
            },
            '1': {
              name: 'Bob',
              selectedDeckIds: ['balanced-green', 'combo-blue'],
              isReady: true,
            },
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shouldEnd = setupPhase.endIf?.({ G: gameState } as any);
      expect(shouldEnd).toBe(true);
    });

    it('should not transition when only one player is ready', () => {
      const phases = GameEngine.phases as Record<string, PhaseConfig<GameState>>;
      const setupPhase = phases['setup'];

      const gameState: GameState = {
        players: {},
        setupData: {
          playerSetup: {
            '0': {
              name: 'Alice',
              selectedDeckIds: ['aggro-red', 'control-white'],
              isReady: true,
            },
            '1': {
              name: 'Bob',
              selectedDeckIds: ['balanced-green', 'combo-blue'],
              isReady: false,
            },
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const shouldEnd = setupPhase.endIf?.({ G: gameState } as any);
      expect(shouldEnd).toBe(false);
    });

    it('should build player states on phase end', () => {
      const phases = GameEngine.phases as Record<string, PhaseConfig<GameState>>;
      const setupPhase = phases['setup'];

      const gameState: GameState = {
        players: {},
        setupData: {
          playerSetup: {
            '0': {
              name: 'Alice',
              selectedDeckIds: ['aggro-red', 'control-white'],
              isReady: true,
            },
            '1': {
              name: 'Bob',
              selectedDeckIds: ['balanced-green', 'combo-blue'],
              isReady: true,
            },
          },
        },
      };

      const mockCtx = {
        playOrder: ['0', '1'],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setupPhase.onEnd?.({ G: gameState, ctx: mockCtx } as any);

      // Check that players were created with proper deck sizes (2 decks * 20 cards = 40 cards)
      expect(gameState.players['0']).toBeDefined();
      expect(gameState.players['1']).toBeDefined();

      // Each player should have 7 cards in hand and 33 in deck (40 - 7 = 33)
      expect(gameState.players['0'].zones.hand.entityIds.length).toBe(7);
      expect(gameState.players['0'].zones.deck.entityIds.length).toBe(33);
      expect(gameState.players['1'].zones.hand.entityIds.length).toBe(7);
      expect(gameState.players['1'].zones.deck.entityIds.length).toBe(33);

      // Check that entities were created
      expect(Object.keys(gameState.players['0'].entities).length).toBe(40);
      expect(Object.keys(gameState.players['1'].entities).length).toBe(40);
    });
  });

  describe('play phase', () => {
    it('should be defined', () => {
      const phases = GameEngine.phases as Record<string, PhaseConfig<GameState>>;
      expect(phases['play']).toBeDefined();
    });

    it('should have turn configuration', () => {
      const phases = GameEngine.phases as Record<string, PhaseConfig<GameState>>;
      const playPhase = phases['play'];
      expect(playPhase.turn).toBeDefined();
    });
  });

  describe('setup', () => {
    it('should initialize setupData with empty player setups', () => {
      const mockCtx = {
        playOrder: ['0', '1'],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialState = GameEngine.setup?.({ ctx: mockCtx } as any);

      expect(initialState).toBeDefined();
      expect(initialState?.setupData).toBeDefined();
      expect(initialState?.setupData?.playerSetup['0']).toEqual({
        name: undefined,
        selectedDeckIds: [],
        isReady: false,
      });
      expect(initialState?.setupData?.playerSetup['1']).toEqual({
        name: undefined,
        selectedDeckIds: [],
        isReady: false,
      });
    });
  });
});

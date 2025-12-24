import {
  shouldEndSetupPhase,
  onSetupPhaseEnd,
  onTurnBegin,
} from './phase-utils';
import { GameState, PlayerState } from '@game/models';

describe('phase-utils', () => {
  const createPlayerState = (
    handSize = 0,
    deckSize = 0
  ): PlayerState => ({
    resources: { life: 20, mana: 0 },
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
      pitch: { entityIds: [] },
    },
    entities: {},
  });

  describe('shouldEndSetupPhase', () => {
    it('should return true when all players are ready', () => {
      const gameState: GameState = {
        players: {},
        setupData: {
          playerSetup: {
            '0': {
              name: 'Alice',
              selectedDeckIds: ['deck-1', 'deck-2'],
              isReady: true,
            },
            '1': {
              name: 'Bob',
              selectedDeckIds: ['deck-3', 'deck-4'],
              isReady: true,
            },
          },
        },
      };

      const result = shouldEndSetupPhase({ G: gameState } as any);
      expect(result).toBe(true);
    });

    it('should return false when not all players are ready', () => {
      const gameState: GameState = {
        players: {},
        setupData: {
          playerSetup: {
            '0': {
              name: 'Alice',
              selectedDeckIds: ['deck-1', 'deck-2'],
              isReady: true,
            },
            '1': {
              name: 'Bob',
              selectedDeckIds: ['deck-3', 'deck-4'],
              isReady: false,
            },
          },
        },
      };

      const result = shouldEndSetupPhase({ G: gameState } as any);
      expect(result).toBe(false);
    });

    it('should return false when setupData is missing', () => {
      const gameState: GameState = {
        players: {},
      };

      const result = shouldEndSetupPhase({ G: gameState } as any);
      expect(result).toBe(false);
    });
  });

  describe('onSetupPhaseEnd', () => {
    it('should build player states from selected decks', () => {
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

      const mockRandom = {
        Shuffle: <T>(deck: T[]) => deck, // Identity function for testing
      };

      onSetupPhaseEnd({ G: gameState, ctx: mockCtx, random: mockRandom } as any);

      expect(gameState.players['0']).toBeDefined();
      expect(gameState.players['1']).toBeDefined();
      expect(gameState.players['0'].zones.hand.entityIds.length).toBe(7);
      expect(gameState.players['1'].zones.hand.entityIds.length).toBe(7);
    });

    it('should do nothing when setupData is missing', () => {
      const gameState: GameState = {
        players: {},
      };

      const mockCtx = {
        playOrder: ['0', '1'],
      };

      const mockRandom = {
        Shuffle: <T>(deck: T[]) => deck,
      };

      onSetupPhaseEnd({ G: gameState, ctx: mockCtx, random: mockRandom } as any);

      expect(gameState.players).toEqual({});
    });
  });

  describe('onTurnBegin', () => {
    it('should reset mana pool to 0', () => {
      const playerState = createPlayerState(5, 10);
      playerState.resources.mana = 5;

      const gameState: GameState = {
        players: {
          '0': playerState,
        },
      };

      const mockEvents = {
        setActivePlayers: jest.fn(),
      };

      onTurnBegin({
        G: gameState,
        ctx: { currentPlayer: '0' } as any,
        events: mockEvents,
      } as any);

      expect(gameState.players['0'].resources.mana).toBe(0);
    });

    it('should move cards from pitch zone to graveyard', () => {
      const playerState = createPlayerState(5, 10);
      playerState.zones.pitch.entityIds = ['pitch-1', 'pitch-2', 'pitch-3'];
      playerState.zones.graveyard.entityIds = ['grave-1'];

      const gameState: GameState = {
        players: {
          '0': playerState,
        },
      };

      const mockEvents = {
        setActivePlayers: jest.fn(),
      };

      onTurnBegin({
        G: gameState,
        ctx: { currentPlayer: '0' } as any,
        events: mockEvents,
      } as any);

      expect(gameState.players['0'].zones.pitch.entityIds).toEqual([]);
      expect(gameState.players['0'].zones.graveyard.entityIds).toEqual([
        'grave-1',
        'pitch-1',
        'pitch-2',
        'pitch-3',
      ]);
    });

    it('should draw a card and transition to mainStage', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5, 10),
        },
      };

      const mockEvents = {
        setActivePlayers: jest.fn(),
      };

      onTurnBegin({
        G: gameState,
        ctx: { currentPlayer: '0' } as any,
        events: mockEvents,
      } as any);

      // Should have drawn one card (6 total in hand)
      expect(gameState.players['0'].zones.hand.entityIds.length).toBe(6);
      expect(gameState.players['0'].zones.deck.entityIds.length).toBe(9);
      expect(mockEvents.setActivePlayers).toHaveBeenCalledWith({
        currentPlayer: 'mainStage',
      });
    });
  });
});

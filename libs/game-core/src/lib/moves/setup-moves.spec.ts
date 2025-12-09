import { setPlayerName, selectDeck, setReady } from './setup-moves';
import { GameState, PlayerSetup } from '@game/models';
import { INVALID_MOVE } from 'boardgame.io/core';
import type { FnContext } from 'boardgame.io';

// Type helper for calling move functions
const callMove = <TArg = void>(
  moveFn: unknown,
  context: Partial<FnContext<GameState>>,
  arg?: TArg
): GameState | string => {
  type MoveFn = (ctx: FnContext<GameState>, arg: TArg) => GameState | string;
  return (moveFn as MoveFn)(context as FnContext<GameState>, arg as TArg);
};

describe('Setup Moves', () => {
  const createSetupState = (
    playerSetup: Record<string, Partial<PlayerSetup>> = {}
  ): GameState => {
    const defaultSetup: PlayerSetup = {
      name: undefined,
      selectedDeckIds: [],
      isReady: false,
    };

    return {
      players: {},
      setupData: {
        playerSetup: {
          '0': { ...defaultSetup, ...playerSetup['0'] },
          '1': { ...defaultSetup, ...playerSetup['1'] },
        },
      },
    };
  };

  describe('setPlayerName', () => {
    it('should set player name', () => {
      const G = createSetupState();
      const result = callMove(setPlayerName, { G, playerID: '0' }, 'Alice');

      expect(result).not.toBe(INVALID_MOVE);
      expect(G.setupData?.playerSetup['0'].name).toBe('Alice');
    });

    it('should trim whitespace from player name', () => {
      const G = createSetupState();
      callMove(setPlayerName, { G, playerID: '0' }, '  Bob  ');

      expect(G.setupData?.playerSetup['0'].name).toBe('Bob');
    });

    it('should return INVALID_MOVE for empty name', () => {
      const G = createSetupState();
      const result = callMove(setPlayerName, { G, playerID: '0' }, '');

      expect(result).toBe(INVALID_MOVE);
    });

    it('should return INVALID_MOVE for whitespace-only name', () => {
      const G = createSetupState();
      const result = callMove(setPlayerName, { G, playerID: '0' }, '   ');

      expect(result).toBe(INVALID_MOVE);
    });

    it('should return INVALID_MOVE when setupData is missing', () => {
      const G: GameState = { players: {} };
      const result = callMove(setPlayerName, { G, playerID: '0' }, 'Alice');

      expect(result).toBe(INVALID_MOVE);
    });
  });

  describe('selectDeck', () => {
    it('should add deck to selection', () => {
      const G = createSetupState();
      const result = callMove(selectDeck, { G, playerID: '0' }, 'aggro-red');

      expect(result).not.toBe(INVALID_MOVE);
      expect(G.setupData?.playerSetup['0'].selectedDeckIds).toContain('aggro-red');
    });

    it('should allow selecting second deck', () => {
      const G = createSetupState({
        '0': { selectedDeckIds: ['aggro-red'] },
      });
      callMove(selectDeck, { G, playerID: '0' }, 'control-white');

      expect(G.setupData?.playerSetup['0'].selectedDeckIds).toEqual([
        'aggro-red',
        'control-white',
      ]);
    });

    it('should toggle deck selection when already selected', () => {
      const G = createSetupState({
        '0': { selectedDeckIds: ['aggro-red', 'control-white'] },
      });
      callMove(selectDeck, { G, playerID: '0' }, 'aggro-red');

      expect(G.setupData?.playerSetup['0'].selectedDeckIds).toEqual(['control-white']);
    });

    it('should return INVALID_MOVE when trying to select third deck', () => {
      const G = createSetupState({
        '0': { selectedDeckIds: ['aggro-red', 'control-white'] },
      });
      const result = callMove(selectDeck, { G, playerID: '0' }, 'balanced-green');

      expect(result).toBe(INVALID_MOVE);
      expect(G.setupData?.playerSetup['0'].selectedDeckIds).toEqual([
        'aggro-red',
        'control-white',
      ]);
    });

    it('should return INVALID_MOVE when selecting invalid deck ID', () => {
      const G = createSetupState();
      const result = callMove(selectDeck, { G, playerID: '0' }, 'non-existent-deck');

      expect(result).toBe(INVALID_MOVE);
      expect(G.setupData?.playerSetup['0'].selectedDeckIds).toEqual([]);
    });

    it('should reset ready state when deck selection changes', () => {
      const G = createSetupState({
        '0': { selectedDeckIds: ['aggro-red'], isReady: true },
      });
      callMove(selectDeck, { G, playerID: '0' }, 'control-white');

      expect(G.setupData?.playerSetup['0'].isReady).toBe(false);
    });

    it('should return INVALID_MOVE when setupData is missing', () => {
      const G: GameState = { players: {} };
      const result = callMove(selectDeck, { G, playerID: '0' }, 'aggro-red');

      expect(result).toBe(INVALID_MOVE);
    });
  });

  describe('setReady', () => {
    it('should set ready to true when player has name and 2 decks', () => {
      const G = createSetupState({
        '0': {
          name: 'Alice',
          selectedDeckIds: ['deck-1', 'deck-2'],
        },
      });
      const result = callMove(setReady, { G, playerID: '0' }, true);

      expect(result).not.toBe(INVALID_MOVE);
      expect(G.setupData?.playerSetup['0'].isReady).toBe(true);
    });

    it('should set ready to false', () => {
      const G = createSetupState({
        '0': {
          name: 'Alice',
          selectedDeckIds: ['deck-1', 'deck-2'],
          isReady: true,
        },
      });
      callMove(setReady, { G, playerID: '0' }, false);

      expect(G.setupData?.playerSetup['0'].isReady).toBe(false);
    });

    it('should return INVALID_MOVE when trying to ready without name', () => {
      const G = createSetupState({
        '0': { selectedDeckIds: ['deck-1', 'deck-2'] },
      });
      const result = callMove(setReady, { G, playerID: '0' }, true);

      expect(result).toBe(INVALID_MOVE);
    });

    it('should return INVALID_MOVE when trying to ready with only 1 deck', () => {
      const G = createSetupState({
        '0': { name: 'Alice', selectedDeckIds: ['deck-1'] },
      });
      const result = callMove(setReady, { G, playerID: '0' }, true);

      expect(result).toBe(INVALID_MOVE);
    });

    it('should return INVALID_MOVE when trying to ready with no decks', () => {
      const G = createSetupState({
        '0': { name: 'Alice', selectedDeckIds: [] },
      });
      const result = callMove(setReady, { G, playerID: '0' }, true);

      expect(result).toBe(INVALID_MOVE);
    });

    it('should return INVALID_MOVE when setupData is missing', () => {
      const G: GameState = { players: {} };
      const result = callMove(setReady, { G, playerID: '0' }, true);

      expect(result).toBe(INVALID_MOVE);
    });
  });
});

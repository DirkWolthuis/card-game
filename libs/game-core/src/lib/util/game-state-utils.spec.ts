import { GameState, PlayerState } from '@game/models';
import {
  getAllPlayerIds,
  getPlayerCount,
  getAlivePlayers,
  checkGameEnd,
  isPlayerEliminated,
  drawCardForPlayer,
  discardCardForPlayer,
} from './game-state-utils';

describe('game-state-utils', () => {
  const createPlayerState = (
    life: number,
    handEntityIds: string[] = [],
    deckEntityIds: string[] = []
  ): PlayerState => ({
    resources: { life },
    zones: {
      hand: { entityIds: [...handEntityIds] },
      deck: { entityIds: [...deckEntityIds] },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [] },
      exile: { entityIds: [] },
    },
    entities: {},
  });

  describe('getAllPlayerIds', () => {
    it('should return all player IDs from the game state', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(20),
        },
      };
      expect(getAllPlayerIds(gameState)).toEqual(['0', '1']);
    });
  });

  describe('getPlayerCount', () => {
    it('should return the total number of players', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(20),
          '2': createPlayerState(20),
        },
      };
      expect(getPlayerCount(gameState)).toBe(3);
    });
  });

  describe('isPlayerEliminated', () => {
    it('should return false for player with positive life', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
        },
      };
      expect(isPlayerEliminated(gameState, '0')).toBe(false);
    });

    it('should return true for player with zero life', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(0),
        },
      };
      expect(isPlayerEliminated(gameState, '0')).toBe(true);
    });

    it('should return true for player with negative life', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(-5),
        },
      };
      expect(isPlayerEliminated(gameState, '0')).toBe(true);
    });

    it('should return true for non-existent player', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
        },
      };
      expect(isPlayerEliminated(gameState, '1')).toBe(true);
    });
  });

  describe('getAlivePlayers', () => {
    it('should return all players with life > 0', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(10),
          '2': createPlayerState(0),
        },
      };
      const alivePlayers = getAlivePlayers(gameState);
      expect(alivePlayers).toContain('0');
      expect(alivePlayers).toContain('1');
      expect(alivePlayers).not.toContain('2');
      expect(alivePlayers).toHaveLength(2);
    });

    it('should return empty array when all players have 0 or less life', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(0),
          '1': createPlayerState(-5),
        },
      };
      expect(getAlivePlayers(gameState)).toHaveLength(0);
    });

    it('should not include players with negative life', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(-10),
        },
      };
      const alivePlayers = getAlivePlayers(gameState);
      expect(alivePlayers).toContain('0');
      expect(alivePlayers).not.toContain('1');
      expect(alivePlayers).toHaveLength(1);
    });
  });

  describe('checkGameEnd', () => {
    it('should return undefined when multiple players are alive', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(10),
        },
      };
      expect(checkGameEnd(gameState)).toBeUndefined();
    });

    it('should return winner when only one player remains alive', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20),
          '1': createPlayerState(0),
        },
      };
      expect(checkGameEnd(gameState)).toEqual({ winner: '0' });
    });

    it('should return the correct winner in a 4 player game', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(0),
          '1': createPlayerState(-5),
          '2': createPlayerState(5),
          '3': createPlayerState(-10),
        },
      };
      expect(checkGameEnd(gameState)).toEqual({ winner: '2' });
    });

    it('should return undefined when no players remain (edge case)', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(0),
          '1': createPlayerState(-5),
        },
      };
      expect(checkGameEnd(gameState)).toBeUndefined();
    });
  });

  describe('drawCardForPlayer', () => {
    it('should move the top card from deck to hand', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(
            20,
            ['hand-1', 'hand-2'],
            ['deck-1', 'deck-2', 'deck-3']
          ),
        },
      };

      drawCardForPlayer(gameState, '0');

      expect(gameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-1',
        'hand-2',
        'deck-1',
      ]);
      expect(gameState.players['0'].zones.deck.entityIds).toEqual([
        'deck-2',
        'deck-3',
      ]);
    });

    it('should do nothing if deck is empty', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20, ['hand-1', 'hand-2'], []),
        },
      };

      drawCardForPlayer(gameState, '0');

      expect(gameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-1',
        'hand-2',
      ]);
      expect(gameState.players['0'].zones.deck.entityIds).toEqual([]);
    });

    it('should only affect the specified player', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(20, ['hand-0-1'], ['deck-0-1']),
          '1': createPlayerState(20, ['hand-1-1'], ['deck-1-1', 'deck-1-2']),
        },
      };

      drawCardForPlayer(gameState, '1');

      // Player 0's state should be unchanged
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-0-1']);
      expect(gameState.players['0'].zones.deck.entityIds).toEqual(['deck-0-1']);

      // Player 1 should have drawn a card
      expect(gameState.players['1'].zones.hand.entityIds).toEqual([
        'hand-1-1',
        'deck-1-1',
      ]);
      expect(gameState.players['1'].zones.deck.entityIds).toEqual(['deck-1-2']);
    });
  });

  describe('discardCardForPlayer', () => {
    const createPlayerStateWithGraveyard = (
      life: number,
      handEntityIds: string[] = [],
      graveyardEntityIds: string[] = []
    ): PlayerState => ({
      resources: { life },
      zones: {
        hand: { entityIds: [...handEntityIds] },
        deck: { entityIds: [] },
        battlefield: { entityIds: [] },
        graveyard: { entityIds: [...graveyardEntityIds] },
        exile: { entityIds: [] },
      },
      entities: {},
    });

    it('should move a card from hand to graveyard', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerStateWithGraveyard(
            20,
            ['hand-1', 'hand-2', 'hand-3'],
            []
          ),
        },
      };

      const result = discardCardForPlayer(gameState, '0', 'hand-2');

      expect(result).toBe(true);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-1',
        'hand-3',
      ]);
      expect(gameState.players['0'].zones.graveyard.entityIds).toEqual([
        'hand-2',
      ]);
    });

    it('should return false if card is not in hand', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerStateWithGraveyard(20, ['hand-1', 'hand-2'], []),
        },
      };

      const result = discardCardForPlayer(gameState, '0', 'non-existent');

      expect(result).toBe(false);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([
        'hand-1',
        'hand-2',
      ]);
      expect(gameState.players['0'].zones.graveyard.entityIds).toEqual([]);
    });

    it('should only affect the specified player', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerStateWithGraveyard(20, ['hand-0-1'], []),
          '1': createPlayerStateWithGraveyard(
            20,
            ['hand-1-1', 'hand-1-2'],
            ['grave-1-1']
          ),
        },
      };

      discardCardForPlayer(gameState, '1', 'hand-1-1');

      // Player 0's state should be unchanged
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-0-1']);
      expect(gameState.players['0'].zones.graveyard.entityIds).toEqual([]);

      // Player 1 should have discarded
      expect(gameState.players['1'].zones.hand.entityIds).toEqual([
        'hand-1-2',
      ]);
      expect(gameState.players['1'].zones.graveyard.entityIds).toEqual([
        'grave-1-1',
        'hand-1-1',
      ]);
    });
  });
});

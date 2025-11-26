import { GameState, PlayerState } from '@game/models';
import {
  getAllPlayerIds,
  getPlayerCount,
  getAlivePlayers,
  checkGameEnd,
  isPlayerEliminated,
} from './game-state-utils';

describe('game-state-utils', () => {
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
});

import { GameState, PlayerState, Ability, AbilityType, Effect, EffectType, TargetType } from '@game/models';
import type { Ctx } from 'boardgame.io';
import {
  startChain,
  addToChain,
  passPriority,
  lockChain,
  resolveChain,
  hasActiveChain,
  isChainLocked,
  clearChain,
  shouldStartChain,
} from './chain-manager';

const createPlayerState = (): PlayerState => ({
  resources: { life: 20, mana: 5 },
  zones: {
    hand: { entityIds: [] },
    deck: { entityIds: [] },
    battlefield: { entityIds: [] },
    graveyard: { entityIds: [] },
    exile: { entityIds: [] },
    pitch: { entityIds: [] },
  },
  entities: {},
});

const createMockCtx = (numPlayers = 2): Ctx => ({
  numPlayers,
  playOrder: ['0', '1'],
  playOrderPos: 0,
  currentPlayer: '0',
  turn: 1,
  phase: 'play',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

const createTestAbility = (description: string): Ability => ({
  type: AbilityType.TRIGGERED,
  description,
  effects: [
    {
      type: EffectType.DEAL_DAMAGE,
      target: TargetType.OPPONENT,
      value: 2,
    },
  ],
});

describe('chain-manager', () => {
  describe('shouldStartChain', () => {
    it('should return true for ability with effects', () => {
      const ability = createTestAbility('Test ability');
      expect(shouldStartChain(ability)).toBe(true);
    });

    it('should return false for ability with no effects', () => {
      const ability: Ability = {
        type: AbilityType.TRIGGERED,
        description: 'No effects',
        effects: [],
      };
      expect(shouldStartChain(ability)).toBe(false);
    });
  });

  describe('startChain', () => {
    it('should initialize a new chain with first action', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      expect(gameState.chain).toBeDefined();
      expect(gameState.chain?.links).toHaveLength(1);
      expect(gameState.chain?.links[0].playerId).toBe('0');
      expect(gameState.chain?.links[0].ability).toBe(ability);
      expect(gameState.chain?.isLocked).toBe(false);
    });
  });

  describe('addToChain', () => {
    it('should add action to existing chain', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability1 = createTestAbility('First ability');
      const ability2 = createTestAbility('Second ability');

      startChain(gameState, ability1, '0', ability1.effects);
      addToChain(gameState, ability2, '1', ability2.effects);

      expect(gameState.chain?.links).toHaveLength(2);
      expect(gameState.chain?.links[1].playerId).toBe('1');
      expect(gameState.chain?.links[1].ability).toBe(ability2);
    });

    it('should reset consecutive passes when adding to chain', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability1 = createTestAbility('First ability');
      const ability2 = createTestAbility('Second ability');

      startChain(gameState, ability1, '0', ability1.effects);
      
      // Mark players as having passed
      if (gameState.chain) {
        gameState.chain.consecutivePasses = { '0': true, '1': true };
      }

      addToChain(gameState, ability2, '1', ability2.effects);

      expect(gameState.chain?.consecutivePasses).toEqual({});
    });

    it('should throw error when no active chain', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');

      expect(() => {
        addToChain(gameState, ability, '0', ability.effects);
      }).toThrow('Cannot add to chain: no active chain');
    });

    it('should throw error when chain is locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability1 = createTestAbility('First ability');
      const ability2 = createTestAbility('Second ability');

      startChain(gameState, ability1, '0', ability1.effects);
      lockChain(gameState);

      expect(() => {
        addToChain(gameState, ability2, '1', ability2.effects);
      }).toThrow('Cannot add to chain: chain is locked');
    });
  });

  describe('passPriority', () => {
    it('should mark player as having passed', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };
      const ctx = createMockCtx();

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      passPriority(gameState, '0', ctx);

      expect(gameState.chain?.consecutivePasses['0']).toBe(true);
    });

    it('should lock chain when all players pass consecutively', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };
      const ctx = createMockCtx();

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      passPriority(gameState, '0', ctx);
      expect(gameState.chain?.isLocked).toBe(false);

      passPriority(gameState, '1', ctx);
      expect(gameState.chain?.isLocked).toBe(true);
    });

    it('should throw error when no active chain', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };
      const ctx = createMockCtx();

      expect(() => {
        passPriority(gameState, '0', ctx);
      }).toThrow('Cannot pass priority: no active chain');
    });
  });

  describe('lockChain', () => {
    it('should lock the chain and set resolution index', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability1 = createTestAbility('First ability');
      const ability2 = createTestAbility('Second ability');

      startChain(gameState, ability1, '0', ability1.effects);
      addToChain(gameState, ability2, '1', ability2.effects);

      lockChain(gameState);

      expect(gameState.chain?.isLocked).toBe(true);
      expect(gameState.chain?.resolutionIndex).toBe(1); // Last index
    });
  });

  describe('resolveChain', () => {
    it('should resolve chain in LIFO order', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };
      const ctx = createMockCtx();

      const ability1 = createTestAbility('First ability');
      const ability2 = createTestAbility('Second ability');

      // Add targets for the effects that need them
      startChain(gameState, ability1, '0', ability1.effects, { 0: '1' });
      addToChain(gameState, ability2, '1', ability2.effects, { 0: '0' });
      lockChain(gameState);

      const initialLife0 = gameState.players['0'].resources.life;
      const initialLife1 = gameState.players['1'].resources.life;

      resolveChain(gameState, ctx);

      // Chain should be cleared after resolution
      expect(gameState.chain).toBeUndefined();
      
      // Effects should have been executed in LIFO order
      // Second ability (targeting player 0) resolves first, then first ability (targeting player 1)
      expect(gameState.players['0'].resources.life).toBe(initialLife0 - 2);
      expect(gameState.players['1'].resources.life).toBe(initialLife1 - 2);
    });

    it('should throw error when chain is not locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };
      const ctx = createMockCtx();

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      expect(() => {
        resolveChain(gameState, ctx);
      }).toThrow('Cannot resolve chain: chain is not locked');
    });
  });

  describe('hasActiveChain', () => {
    it('should return true when chain is active and not locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      expect(hasActiveChain(gameState)).toBe(true);
    });

    it('should return false when chain is locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);
      lockChain(gameState);

      expect(hasActiveChain(gameState)).toBe(false);
    });

    it('should return false when no chain exists', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      expect(hasActiveChain(gameState)).toBe(false);
    });
  });

  describe('isChainLocked', () => {
    it('should return true when chain is locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);
      lockChain(gameState);

      expect(isChainLocked(gameState)).toBe(true);
    });

    it('should return false when chain is not locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      expect(isChainLocked(gameState)).toBe(false);
    });

    it('should return false when no chain exists', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      expect(isChainLocked(gameState)).toBe(false);
    });
  });

  describe('clearChain', () => {
    it('should remove chain from game state', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      expect(gameState.chain).toBeDefined();

      clearChain(gameState);

      expect(gameState.chain).toBeUndefined();
    });
  });
});

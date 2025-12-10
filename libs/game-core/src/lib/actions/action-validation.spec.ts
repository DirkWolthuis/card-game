import {
  checkPlayerPriority,
  checkCosts,
  payCosts,
  validateAction,
  passPriority,
  resetConsecutivePasses,
} from './action-validation';
import {
  ActionType,
  CostType,
  GameState,
  PlayCardAction,
  ManaCost,
  PlayerState,
} from '@game/models';
import type { Ctx } from 'boardgame.io';

// Helper to create a basic player state
const createPlayerState = (mana = 0): PlayerState => ({
  resources: { life: 20, mana },
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

// Helper to create a basic Ctx
const createCtx = (
  currentPlayer = '0',
  phase = 'play',
  numPlayers = 2
): Ctx => ({
  currentPlayer,
  phase,
  numPlayers,
  playOrder: ['0', '1'],
  playOrderPos: 0,
  turn: 1,
  activePlayers: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

describe('action-validation', () => {
  describe('checkPlayerPriority', () => {
    it('should allow action during setup phase', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };
      const ctx = createCtx('0', 'setup');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '0',
        entityId: 'card-1',
      };

      const result = checkPlayerPriority(action, G, ctx);

      expect(result.valid).toBe(true);
    });

    it('should allow action for current player without priority system', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };
      const ctx = createCtx('0', 'play');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '0',
        entityId: 'card-1',
      };

      const result = checkPlayerPriority(action, G, ctx);

      expect(result.valid).toBe(true);
    });

    it('should reject action for non-current player', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };
      const ctx = createCtx('0', 'play');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '1',
        entityId: 'card-1',
      };

      const result = checkPlayerPriority(action, G, ctx);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Not your turn');
    });

    it('should allow action when player has priority', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '0',
          consecutivePasses: 0,
        },
      };
      const ctx = createCtx('0', 'play');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '0',
        entityId: 'card-1',
      };

      const result = checkPlayerPriority(action, G, ctx);

      expect(result.valid).toBe(true);
    });

    it('should reject action when player does not have priority', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '1',
          consecutivePasses: 0,
        },
      };
      const ctx = createCtx('0', 'play');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '0',
        entityId: 'card-1',
      };

      const result = checkPlayerPriority(action, G, ctx);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('You do not have priority');
    });
  });

  describe('checkCosts', () => {
    it('should validate sufficient mana', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      const result = checkCosts(costs, G, '0');

      expect(result.valid).toBe(true);
    });

    it('should reject insufficient mana', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(2),
        },
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      const result = checkCosts(costs, G, '0');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Insufficient mana');
    });

    it('should validate exact mana amount', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(3),
        },
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      const result = checkCosts(costs, G, '0');

      expect(result.valid).toBe(true);
    });

    it('should validate zero mana cost', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(0),
        },
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 0 },
      ];

      const result = checkCosts(costs, G, '0');

      expect(result.valid).toBe(true);
    });

    it('should validate no costs', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(0),
        },
      };

      const result = checkCosts([], G, '0');

      expect(result.valid).toBe(true);
    });

    it('should reject invalid player', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      const result = checkCosts(costs, G, '999');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Invalid player');
    });
  });

  describe('payCosts', () => {
    it('should deduct mana cost', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      payCosts(costs, G, '0');

      expect(G.players['0'].resources.mana).toBe(2);
    });

    it('should deduct exact mana', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(3),
        },
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      payCosts(costs, G, '0');

      expect(G.players['0'].resources.mana).toBe(0);
    });

    it('should handle no costs', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };

      payCosts([], G, '0');

      expect(G.players['0'].resources.mana).toBe(5);
    });
  });

  describe('validateAction', () => {
    it('should validate action with priority and sufficient costs', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };
      const ctx = createCtx('0', 'play');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '0',
        entityId: 'card-1',
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      const result = validateAction(action, costs, G, ctx);

      expect(result.valid).toBe(true);
    });

    it('should reject action without priority', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(5),
          '1': createPlayerState(0),
        },
      };
      const ctx = createCtx('0', 'play');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '1',
        entityId: 'card-1',
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      const result = validateAction(action, costs, G, ctx);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Not your turn');
    });

    it('should reject action with insufficient costs', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(2),
        },
      };
      const ctx = createCtx('0', 'play');
      const action: PlayCardAction = {
        type: ActionType.PLAY_CARD,
        playerId: '0',
        entityId: 'card-1',
      };
      const costs: ManaCost[] = [
        { type: CostType.MANA, amount: 3 },
      ];

      const result = validateAction(action, costs, G, ctx);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Insufficient mana');
    });
  });

  describe('passPriority', () => {
    it('should initialize priority system if not active', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };
      const ctx = createCtx('0', 'play');

      passPriority(G, ctx);

      expect(G.priority).toBeDefined();
      expect(G.priority?.currentPriorityPlayer).toBe('1');
      expect(G.priority?.consecutivePasses).toBe(1);
    });

    it('should switch priority to next player', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '0',
          consecutivePasses: 0,
        },
      };
      const ctx = createCtx('0', 'play');

      passPriority(G, ctx);

      expect(G.priority).toBeDefined();
      expect(G.priority?.currentPriorityPlayer).toBe('1');
      expect(G.priority?.consecutivePasses).toBe(1);
    });

    it('should increment consecutive passes', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '0',
          consecutivePasses: 1,
        },
      };
      const ctx = createCtx('0', 'play');

      passPriority(G, ctx);

      expect(G.priority).toBeDefined();
      expect(G.priority?.consecutivePasses).toBe(2);
    });

    it('should wrap around in multiplayer', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
          '2': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '2',
          consecutivePasses: 0,
        },
      };
      const ctx = createCtx('0', 'play', 3);
      ctx.playOrder = ['0', '1', '2'];

      passPriority(G, ctx);

      expect(G.priority).toBeDefined();
      expect(G.priority?.currentPriorityPlayer).toBe('0');
    });
  });

  describe('resetConsecutivePasses', () => {
    it('should reset consecutive passes counter', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
        priority: {
          currentPriorityPlayer: '0',
          consecutivePasses: 2,
        },
      };

      resetConsecutivePasses(G);

      expect(G.priority).toBeDefined();
      expect(G.priority?.consecutivePasses).toBe(0);
    });

    it('should handle no priority system gracefully', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };

      resetConsecutivePasses(G);

      expect(G.priority).toBeUndefined();
    });
  });
});

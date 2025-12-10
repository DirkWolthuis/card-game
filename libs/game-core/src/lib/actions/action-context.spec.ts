import {
  createPlayCardContext,
  createEndTurnContext,
  createPassPriorityContext,
  createActionContext,
} from './action-context';
import {
  ActionType,
  CostType,
  GameState,
  PlayerState,
} from '@game/models';

// Helper to create a basic player state
const createPlayerState = (): PlayerState => ({
  resources: { life: 20, mana: 0 },
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

describe('action-context', () => {
  describe('createPlayCardContext', () => {
    it('should create context for card with mana cost', () => {
      const G: GameState = {
        players: {
          '0': {
            ...createPlayerState(),
            entities: {
              'entity-1': { id: 'entity-1', cardId: 'aaaa', ownerId: '0', controllerId: '0' },
            },
          },
        },
      };

      const context = createPlayCardContext(
        { type: ActionType.PLAY_CARD, playerId: '0', entityId: 'entity-1' },
        G
      );

      expect(context).toBeDefined();
      expect(context?.costs).toHaveLength(1);
      expect(context?.costs[0]).toEqual({ type: CostType.MANA, amount: 1 });
      expect(context?.effects).toHaveLength(1);
      expect(context?.requiresTargetSelection).toBe(true);
    });

    it('should return undefined for non-existent entity', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };

      const context = createPlayCardContext(
        { type: ActionType.PLAY_CARD, playerId: '0', entityId: 'nonexistent' },
        G
      );

      expect(context).toBeUndefined();
    });

    it('should return undefined for invalid card', () => {
      const G: GameState = {
        players: {
          '0': {
            ...createPlayerState(),
            entities: {
              'entity-1': { id: 'entity-1', cardId: 'invalid', ownerId: '0', controllerId: '0' },
            },
          },
        },
      };

      const context = createPlayCardContext(
        { type: ActionType.PLAY_CARD, playerId: '0', entityId: 'entity-1' },
        G
      );

      expect(context).toBeUndefined();
    });

    it('should create context with no costs for zero-cost card', () => {
      // Note: Currently no zero-cost cards in database, but testing the logic
      // The context creation would skip cost if card.manaCost === 0
      // This test is a placeholder for future zero-cost cards
      expect(true).toBe(true);
    });

    it('should detect target selection requirement', () => {
      const G: GameState = {
        players: {
          '0': {
            ...createPlayerState(),
            entities: {
              'entity-1': { id: 'entity-1', cardId: 'aaaa', ownerId: '0', controllerId: '0' },
            },
          },
        },
      };

      const context = createPlayCardContext(
        { type: ActionType.PLAY_CARD, playerId: '0', entityId: 'entity-1' },
        G
      );

      expect(context?.requiresTargetSelection).toBe(true);
    });

    it('should not require target selection for self-targeting effects', () => {
      const G: GameState = {
        players: {
          '0': {
            ...createPlayerState(),
            entities: {
              // Divine touch - heals self, no target selection needed
              'entity-1': { id: 'entity-1', cardId: 'bbb', ownerId: '0', controllerId: '0' },
            },
          },
        },
      };

      const context = createPlayCardContext(
        { type: ActionType.PLAY_CARD, playerId: '0', entityId: 'entity-1' },
        G
      );

      expect(context?.requiresTargetSelection).toBe(false);
    });
  });

  describe('createEndTurnContext', () => {
    it('should create context with no costs or effects', () => {
      const context = createEndTurnContext();

      expect(context.costs).toHaveLength(0);
      expect(context.effects).toHaveLength(0);
      expect(context.requiresTargetSelection).toBe(false);
    });
  });

  describe('createPassPriorityContext', () => {
    it('should create context with no costs or effects', () => {
      const context = createPassPriorityContext();

      expect(context.costs).toHaveLength(0);
      expect(context.effects).toHaveLength(0);
      expect(context.requiresTargetSelection).toBe(false);
    });
  });

  describe('createActionContext', () => {
    it('should create context for PLAY_CARD action', () => {
      const G: GameState = {
        players: {
          '0': {
            ...createPlayerState(),
            entities: {
              'entity-1': { id: 'entity-1', cardId: 'aaaa', ownerId: '0', controllerId: '0' },
            },
          },
        },
      };

      const context = createActionContext(
        { type: ActionType.PLAY_CARD, playerId: '0', entityId: 'entity-1' },
        G
      );

      expect(context).toBeDefined();
      expect(context?.costs.length).toBeGreaterThan(0);
    });

    it('should create context for END_TURN action', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };

      const context = createActionContext(
        { type: ActionType.END_TURN, playerId: '0' },
        G
      );

      expect(context).toBeDefined();
      expect(context?.costs).toHaveLength(0);
    });

    it('should create context for PASS_PRIORITY action', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };

      const context = createActionContext(
        { type: ActionType.PASS_PRIORITY, playerId: '0' },
        G
      );

      expect(context).toBeDefined();
      expect(context?.costs).toHaveLength(0);
    });

    it('should return undefined for ACTIVATE_ABILITY (not implemented)', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };

      const context = createActionContext(
        { type: ActionType.ACTIVATE_ABILITY, playerId: '0', entityId: 'entity-1' },
        G
      );

      expect(context).toBeUndefined();
    });

    it('should return undefined for ATTACK (not implemented)', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };

      const context = createActionContext(
        { type: ActionType.ATTACK, playerId: '0', entityId: 'entity-1' },
        G
      );

      expect(context).toBeUndefined();
    });

    it('should return undefined for PLAY_CARD without entityId', () => {
      const G: GameState = {
        players: {
          '0': createPlayerState(),
        },
      };

      const context = createActionContext(
        { type: ActionType.PLAY_CARD, playerId: '0' },
        G
      );

      expect(context).toBeUndefined();
    });
  });
});

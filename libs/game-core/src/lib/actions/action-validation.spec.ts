import {
  checkPlayerPriority,
  checkResourcesForCost,
  checkRequiresTargetSelection,
  runChecks,
  ActionContext,
  SUCCESS,
} from './action-validation';
import {
  GameState,
  PlayerState,
  AbilityType,
  EffectType,
  TargetType,
  TriggeredAbility,
} from '@game/models';
import type { Ctx } from 'boardgame.io';

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

describe('action-validation', () => {
  describe('checkPlayerPriority', () => {
    it('should allow action when player has priority', () => {
      const context: ActionContext = {
        gameState: { players: {} },
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const result = checkPlayerPriority(context);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject action when player does not have priority', () => {
      const context: ActionContext = {
        gameState: { players: {} },
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '1',
      };

      const result = checkPlayerPriority(context);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Player does not have priority');
    });
  });

  describe('checkResourcesForCost', () => {
    it('should allow action when player has exact mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(3),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const result = checkResourcesForCost(3)(context);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow action when player has more than enough mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const result = checkResourcesForCost(3)(context);

      expect(result.valid).toBe(true);
    });

    it('should reject action when player has insufficient mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(2),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const result = checkResourcesForCost(3)(context);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Insufficient mana');
      expect(result.error).toContain('Required: 3');
      expect(result.error).toContain('Available: 2');
    });

    it('should allow action when cost is 0', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(0),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const result = checkResourcesForCost(0)(context);

      expect(result.valid).toBe(true);
    });

    it('should reject action when player ID is invalid', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '999', // Invalid player ID
      };

      const result = checkResourcesForCost(3)(context);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid player ID');
    });
  });

  describe('checkRequiresTargetSelection', () => {
    it('should return true for abilities with OPPONENT target', () => {
      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Deal 2 damage to opponent',
        effects: [
          {
            target: TargetType.OPPONENT,
            type: EffectType.DEAL_DAMAGE,
            value: 2,
          },
        ],
      };

      const result = checkRequiresTargetSelection(ability);

      expect(result).toBe(true);
    });

    it('should return true for abilities with PLAYER target', () => {
      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Deal 2 damage to any player',
        effects: [
          {
            target: TargetType.PLAYER,
            type: EffectType.DEAL_DAMAGE,
            value: 2,
          },
        ],
      };

      const result = checkRequiresTargetSelection(ability);

      expect(result).toBe(true);
    });

    it('should return false for abilities with SELF target', () => {
      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 3',
        effects: [
          {
            target: TargetType.SELF,
            type: EffectType.HEAL,
            value: 3,
          },
        ],
      };

      const result = checkRequiresTargetSelection(ability);

      expect(result).toBe(false);
    });

    it('should return true for abilities with mixed targets if any need selection', () => {
      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 3 and deal 2 damage to opponent',
        effects: [
          {
            target: TargetType.SELF,
            type: EffectType.HEAL,
            value: 3,
          },
          {
            target: TargetType.OPPONENT,
            type: EffectType.DEAL_DAMAGE,
            value: 2,
          },
        ],
      };

      const result = checkRequiresTargetSelection(ability);

      expect(result).toBe(true);
    });

    it('should return false for abilities with no effects needing targets', () => {
      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 3',
        effects: [
          {
            target: TargetType.SELF,
            type: EffectType.HEAL,
            value: 3,
          },
          {
            target: TargetType.SELF,
            type: EffectType.HEAL,
            value: 2,
          },
        ],
      };

      const result = checkRequiresTargetSelection(ability);

      expect(result).toBe(false);
    });
  });

  describe('runChecks', () => {
    it('should return success when all checks pass', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const checks = [
        checkPlayerPriority,
        checkResourcesForCost(3),
      ];

      const result = runChecks(checks, context);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return first failure when a check fails', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(2),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const checks = [
        checkPlayerPriority,
        checkResourcesForCost(3), // This will fail
      ];

      const result = runChecks(checks, context);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('Insufficient mana');
    });

    it('should stop at first failure and not run remaining checks', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
        },
      };

      const context: ActionContext = {
        gameState,
        ctx: { currentPlayer: '1' } as Ctx, // Wrong player
        playerID: '0',
      };

      const checks = [
        checkPlayerPriority, // This will fail
        checkResourcesForCost(3),
      ];

      const result = runChecks(checks, context);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Player does not have priority');
    });

    it('should handle empty checks array', () => {
      const context: ActionContext = {
        gameState: { players: {} },
        ctx: { currentPlayer: '0' } as Ctx,
        playerID: '0',
      };

      const result = runChecks([], context);

      expect(result.valid).toBe(true);
    });
  });

  describe('SUCCESS constant', () => {
    it('should have valid=true and no error', () => {
      expect(SUCCESS.valid).toBe(true);
      expect(SUCCESS.error).toBeUndefined();
    });
  });
});

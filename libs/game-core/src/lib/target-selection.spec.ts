import { GameEngine } from './game';
import { DamageEffect, EffectType, GameState, HealEffect, MoveType, TargetType } from '@game/models';
import { needsTargetSelection, getValidTargets } from './effects/target-utils';

describe('Target Selection', () => {
  describe('needsTargetSelection', () => {
    it('should return true for PLAYER target type', () => {
      const effect: DamageEffect = {
        type: EffectType.DEAL_DAMAGE,
        target: TargetType.PLAYER,
        value: 2,
      };
      expect(needsTargetSelection(effect)).toBe(true);
    });

    it('should return true for OPPONENT target type', () => {
      const effect: DamageEffect = {
        type: EffectType.DEAL_DAMAGE,
        target: TargetType.OPPONENT,
        value: 2,
      };
      expect(needsTargetSelection(effect)).toBe(true);
    });

    it('should return false for SELF target type', () => {
      const effect: HealEffect = {
        type: EffectType.HEAL,
        target: TargetType.SELF,
        value: 2,
      };
      expect(needsTargetSelection(effect)).toBe(false);
    });
  });

  describe('getValidTargets', () => {
    let gameState: GameState;

    beforeEach(() => {
      gameState = {
        players: {
          '0': {
            resources: { life: 20 },
            zones: { hand: { entityIds: [] }, deck: { entityIds: [] }, battlefield: { entityIds: [] }, graveyard: { entityIds: [] }, exile: { entityIds: [] } },
            entities: {},
          },
          '1': {
            resources: { life: 20 },
            zones: { hand: { entityIds: [] }, deck: { entityIds: [] }, battlefield: { entityIds: [] }, graveyard: { entityIds: [] }, exile: { entityIds: [] } },
            entities: {},
          },
        },
      };
    });

    it('should return all players for PLAYER target type', () => {
      const effect: DamageEffect = {
        type: EffectType.DEAL_DAMAGE,
        target: TargetType.PLAYER,
        value: 2,
      };
      const targets = getValidTargets(effect, gameState, '0');
      expect(targets).toContain('0');
      expect(targets).toContain('1');
      expect(targets).toHaveLength(2);
    });

    it('should return only opponents for OPPONENT target type', () => {
      const effect: DamageEffect = {
        type: EffectType.DEAL_DAMAGE,
        target: TargetType.OPPONENT,
        value: 2,
      };
      const targets = getValidTargets(effect, gameState, '0');
      expect(targets).not.toContain('0');
      expect(targets).toContain('1');
      expect(targets).toHaveLength(1);
    });

    it('should return only self for SELF target type', () => {
      const effect: HealEffect = {
        type: EffectType.HEAL,
        target: TargetType.SELF,
        value: 2,
      };
      const targets = getValidTargets(effect, gameState, '0');
      expect(targets).toContain('0');
      expect(targets).not.toContain('1');
      expect(targets).toHaveLength(1);
    });
  });
});

import { DamageEffect, EffectType, GameState, HealEffect, TargetType } from '@game/models';
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
            resources: { life: 20, mana: 0 },
            zones: { hand: { entityIds: [] }, deck: { entityIds: [] }, battlefield: { entityIds: [] }, graveyard: { entityIds: [] }, exile: { entityIds: [] }, pitch: { entityIds: [] } },
            entities: {},
          },
          '1': {
            resources: { life: 20, mana: 0 },
            zones: { hand: { entityIds: [] }, deck: { entityIds: [] }, battlefield: { entityIds: [] }, graveyard: { entityIds: [] }, exile: { entityIds: [] }, pitch: { entityIds: [] } },
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

    describe('with eliminated players', () => {
      beforeEach(() => {
        // Add a third player who is eliminated
        gameState.players['2'] = {
          resources: { life: 0, mana: 0 },
          zones: { hand: { entityIds: [] }, deck: { entityIds: [] }, battlefield: { entityIds: [] }, graveyard: { entityIds: [] }, exile: { entityIds: [] }, pitch: { entityIds: [] } },
          entities: {},
        };
      });

      it('should exclude eliminated players from PLAYER targets', () => {
        const effect: DamageEffect = {
          type: EffectType.DEAL_DAMAGE,
          target: TargetType.PLAYER,
          value: 2,
        };
        const targets = getValidTargets(effect, gameState, '0');
        expect(targets).toContain('0');
        expect(targets).toContain('1');
        expect(targets).not.toContain('2');
        expect(targets).toHaveLength(2);
      });

      it('should exclude eliminated players from OPPONENT targets', () => {
        const effect: DamageEffect = {
          type: EffectType.DEAL_DAMAGE,
          target: TargetType.OPPONENT,
          value: 2,
        };
        const targets = getValidTargets(effect, gameState, '0');
        expect(targets).toContain('1');
        expect(targets).not.toContain('0');
        expect(targets).not.toContain('2');
        expect(targets).toHaveLength(1);
      });

      it('should exclude eliminated players from OPPONENT targets in 4 player game', () => {
        // Player 3 is alive
        gameState.players['3'] = {
          resources: { life: 15, mana: 0 },
          zones: { hand: { entityIds: [] }, deck: { entityIds: [] }, battlefield: { entityIds: [] }, graveyard: { entityIds: [] }, exile: { entityIds: [] }, pitch: { entityIds: [] } },
          entities: {},
        };

        const effect: DamageEffect = {
          type: EffectType.DEAL_DAMAGE,
          target: TargetType.OPPONENT,
          value: 2,
        };
        const targets = getValidTargets(effect, gameState, '0');
        expect(targets).toContain('1');
        expect(targets).toContain('3');
        expect(targets).not.toContain('0');
        expect(targets).not.toContain('2');
        expect(targets).toHaveLength(2);
      });

      it('should return empty array for SELF target if current player is eliminated', () => {
        gameState.players['0'].resources.life = 0;
        
        const effect: HealEffect = {
          type: EffectType.HEAL,
          target: TargetType.SELF,
          value: 2,
        };
        const targets = getValidTargets(effect, gameState, '0');
        expect(targets).toHaveLength(0);
      });
    });
  });
});

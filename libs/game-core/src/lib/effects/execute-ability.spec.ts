import {
  executeAbility,
  canActivateAbility,
  payAbilityCost,
  getAbilitiesToActivateOnPlay,
} from './execute-ability';
import {
  GameState,
  PlayerState,
  AbilityType,
  EffectType,
  TargetType,
  Ability,
  ActivatedAbility,
  TriggeredAbility,
  StaticAbility,
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

describe('execute-ability', () => {
  describe('executeAbility', () => {
    it('should execute all effects when no targeting is needed', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
          '1': createPlayerState(0),
        },
      };

      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 3 health',
        effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 3 }],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = { currentPlayer: '0' } as any as Ctx;
      const needsTarget = executeAbility(gameState, ctx, ability);

      expect(needsTarget).toBe(false);
      expect(gameState.players['0'].resources.life).toBe(23); // 20 + 3
    });

    it('should set up target selection for targeting effects', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
          '1': createPlayerState(0),
        },
      };

      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Deal 2 damage to opponent',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = { currentPlayer: '0' } as any as Ctx;
      const needsTarget = executeAbility(gameState, ctx, ability);

      expect(needsTarget).toBe(true);
      expect(gameState.pendingTargetSelection).toBeDefined();
      expect(gameState.pendingTargetSelection?.effect).toBe(ability.effects[0]);
      expect(gameState.pendingTargetSelection?.sourceAbility).toBe(ability);
    });

    it('should execute non-targeting effects before setting up targeting', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(5),
          '1': createPlayerState(0),
        },
      };

      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Heal yourself for 3, then deal 2 damage to opponent',
        effects: [
          { target: TargetType.SELF, type: EffectType.HEAL, value: 3 },
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ctx = { currentPlayer: '0' } as any as Ctx;
      const needsTarget = executeAbility(gameState, ctx, ability);

      expect(needsTarget).toBe(true);
      expect(gameState.players['0'].resources.life).toBe(23); // Heal happened
      expect(gameState.pendingTargetSelection).toBeDefined();
      expect(gameState.pendingTargetSelection?.effect).toBe(ability.effects[1]); // Damage is pending
    });
  });

  describe('canActivateAbility', () => {
    it('should return true for activated ability with enough mana', () => {
      const ability: ActivatedAbility = {
        type: AbilityType.ACTIVATED,
        description: 'Deal 2 damage',
        cost: { mana: 2 },
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const playerState = createPlayerState(5);
      expect(canActivateAbility(ability, playerState)).toBe(true);
    });

    it('should return false for activated ability without enough mana', () => {
      const ability: ActivatedAbility = {
        type: AbilityType.ACTIVATED,
        description: 'Deal 2 damage',
        cost: { mana: 5 },
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const playerState = createPlayerState(3);
      expect(canActivateAbility(ability, playerState)).toBe(false);
    });

    it('should return false for non-activated ability', () => {
      const ability: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Deal 2 damage',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const playerState = createPlayerState(10);
      expect(canActivateAbility(ability, playerState)).toBe(false);
    });

    it('should handle ability with no mana cost', () => {
      const ability: ActivatedAbility = {
        type: AbilityType.ACTIVATED,
        description: 'Deal 2 damage',
        cost: {},
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const playerState = createPlayerState(0);
      expect(canActivateAbility(ability, playerState)).toBe(true);
    });
  });

  describe('payAbilityCost', () => {
    it('should reduce mana by the cost amount', () => {
      const ability: ActivatedAbility = {
        type: AbilityType.ACTIVATED,
        description: 'Deal 2 damage',
        cost: { mana: 3 },
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const playerState = createPlayerState(5);
      payAbilityCost(ability, playerState);

      expect(playerState.resources.mana).toBe(2);
    });

    it('should handle ability with no mana cost', () => {
      const ability: ActivatedAbility = {
        type: AbilityType.ACTIVATED,
        description: 'Deal 2 damage',
        cost: {},
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const playerState = createPlayerState(5);
      payAbilityCost(ability, playerState);

      expect(playerState.resources.mana).toBe(5); // Unchanged
    });
  });

  describe('getAbilitiesToActivateOnPlay', () => {
    it('should return triggered abilities', () => {
      const triggered: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Deal 2 damage',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const activated: ActivatedAbility = {
        type: AbilityType.ACTIVATED,
        description: 'Deal 3 damage',
        cost: { mana: 2 },
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 3 },
        ],
      };

      const abilities: Ability[] = [triggered, activated];
      const result = getAbilitiesToActivateOnPlay(abilities);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(triggered);
    });

    it('should return empty array when no triggered abilities', () => {
      const activated: ActivatedAbility = {
        type: AbilityType.ACTIVATED,
        description: 'Deal 3 damage',
        cost: { mana: 2 },
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 3 },
        ],
      };

      const staticAbility: StaticAbility = {
        type: AbilityType.STATIC,
        description: 'All units get +1 power',
        effects: [],
      };

      const abilities: Ability[] = [activated, staticAbility];
      const result = getAbilitiesToActivateOnPlay(abilities);

      expect(result).toHaveLength(0);
    });

    it('should return all triggered abilities when multiple exist', () => {
      const triggered1: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Deal 2 damage',
        effects: [
          { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 },
        ],
      };

      const triggered2: TriggeredAbility = {
        type: AbilityType.TRIGGERED,
        description: 'Heal 1 health',
        effects: [{ target: TargetType.SELF, type: EffectType.HEAL, value: 1 }],
      };

      const abilities: Ability[] = [triggered1, triggered2];
      const result = getAbilitiesToActivateOnPlay(abilities);

      expect(result).toHaveLength(2);
      expect(result).toContain(triggered1);
      expect(result).toContain(triggered2);
    });
  });
});

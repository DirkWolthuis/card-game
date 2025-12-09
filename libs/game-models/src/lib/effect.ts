export type Effect = DamageEffect | HealEffect | CounterEffect;

interface BaseEffect {
  type: EffectType;
}

export interface DamageEffect extends BaseEffect {
  type: EffectType.DEAL_DAMAGE;
  target: TargetType;
  value: number;
}

export interface HealEffect extends BaseEffect {
  type: EffectType.HEAL;
  target: TargetType.SELF;
  value: number;
}

export interface CounterEffect extends BaseEffect {
  type: EffectType.COUNTER;
  target: TargetType.CHAIN_ACTION; // Targets an action on the chain
}

export enum EffectType {
  DEAL_DAMAGE,
  HEAL,
  COUNTER,
}

export enum TargetType {
  SELF,
  PLAYER,
  OPPONENT,
  CHAIN_ACTION, // Target an action on the chain (for counter effects)
}

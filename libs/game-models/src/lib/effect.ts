export type Effect = DamageEffect | HealEffect;

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

export enum EffectType {
  DEAL_DAMAGE,
  HEAL,
}

export enum TargetType {
  SELF,
  PLAYER,
  OPPONENT,
}

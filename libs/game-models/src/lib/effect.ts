export type Effect = DamageEffect | HealEffect;

export interface DamageEffect {
  type: EffectType.DEAL_DAMAGE;
  target: TargetType;
  value: number;
}

export interface HealEffect {
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

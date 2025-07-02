export type Ability =
  | TriggeredAbility
  | ActionAbility
  | AuraAbility
  | ReactionAbility;

export type TriggeredAbility<E = any, R = any> = {
  type: AbillityType.TRIGGERED;
  trigger: TriggerType[];
  effect: Effect<E>;
  restriction?: Restriction<R>;
};

export type ActionAbility<E = any, R = any> = {
  type: AbillityType.ACTION;
  effect: Effect<E>;
  restriction?: Restriction<R>;
  cost?: Cost;
};

export type ReactionAbility<E = any, R = any> = {
  type: AbillityType.REACTION;
  trigger: TriggerType[];
  effect: Effect<E>;
  restriction?: Restriction<R>;
  cost?: Cost;
};

export type AuraAbility = {
  type: AbillityType.AURA;
  effect: Effect;
  restriction?: Restriction;
};

export type Effect<T = any> = { type: EffectType; value?: T };

export type Restriction<T = any> = { type: RestrictionType; value?: T };

export type Cost<T = any> = { type: CostType; value?: T };

export enum TriggerType {
  ON_ENTER_PLAY,
  RITUAL_ENTERS_STACK,
}

export enum EffectType {
  DRAW_CARD,
  COUNTER_RITUAL,
}

export enum CostType {
  PAY_MANA,
  PAY_AP,
}

export enum RestrictionType {
  MIN_UNITS_IN_PLAYER_CONTROL,
}

export enum AbillityType {
  AURA,
  ACTION,
  TRIGGERED,
  REACTION,
}

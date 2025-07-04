export type Ability =
  | TriggeredAbility
  | ActionAbility
  | AuraAbility
  | ReactionAbility;

export interface BaseAbility {
  name?: string;
  description: string;
}

export interface TriggeredAbility extends BaseAbility {
  type: AbillityType.TRIGGERED;
  trigger: TriggerType[];
  effect: Effect;
  restriction?: Restriction;
}

export interface ActionAbility extends BaseAbility {
  type: AbillityType.ACTION;
  effect: Effect;
  restriction?: Restriction;
  cost?: Cost;
}

export interface ReactionAbility extends BaseAbility {
  type: AbillityType.REACTION;
  trigger: TriggerType[];
  effect: Effect;
  restriction?: Restriction;
  cost?: Cost;
}

export interface AuraAbility extends BaseAbility {
  type: AbillityType.AURA;
  effect: Effect;
  restriction?: Restriction;
}

export type Effect = { type: EffectType; value?: number };

export type Restriction = { type: RestrictionType; value?: number };

export type Cost = { type: CostType; value?: number };

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

import { defineComponent, Types } from 'bitecs';

export const AbilityDataComponent = defineComponent({
  cardEntity: Types.eid,
  abilityBlueprintId: Types.ui32,
  type: Types.ui8,
});

export const AbilityTrigger = defineComponent({
  trigger: [Types.ui8, 16],
});

export const AbilityEffectComponent = defineComponent({
  type: Types.ui8,
  value: Types.ui16,
});

export const AbilityRestrictionComponent = defineComponent({
  type: Types.ui8,
  value: Types.ui16,
});

export const AbilityCostComponent = defineComponent({
  type: Types.ui8,
  value: Types.ui16,
});

import { defineComponent, Types } from 'bitecs';

export const UnitAttributesComponent = defineComponent({
  speed: Types.ui16,
  health: Types.ui16,
  resistance: Types.ui16,
  power: Types.ui16,
});

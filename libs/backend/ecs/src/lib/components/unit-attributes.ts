import { defineComponent, Types } from 'bitecs';

export const UnitAttributesComponent = defineComponent({
  speed: Types.ui16,
  attack: Types.ui16,
  defense: Types.ui16,
  manaCost: Types.ui16,
});

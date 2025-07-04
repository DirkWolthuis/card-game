import { defineComponent, Types } from 'bitecs';

export const CardDataComponent = defineComponent({
  cardId: Types.ui32,
  manaCost: Types.ui8,
  keywords: [Types.ui8, 24],
  cardType: Types.ui8,
});

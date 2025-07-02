import { defineComponent, Types } from 'bitecs';

export const CardOwnerComponent = defineComponent({
  controlledBy: Types.eid,
  ownedBy: Types.eid,
});

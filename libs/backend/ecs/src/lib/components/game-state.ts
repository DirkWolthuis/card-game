import { defineComponent, Types } from 'bitecs';

export const GameStateComponent = defineComponent({
  currentTurn: Types.ui8,
  currentTurnPlayer: Types.eid,
  playerTurnOrder: [Types.eid, 4],
});

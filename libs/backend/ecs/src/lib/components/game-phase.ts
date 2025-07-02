import { defineComponent, Types } from 'bitecs';

export const GamePhaseComponent = defineComponent({
  currentPhase: Types.ui8,
});

export enum GamePhase {
  RESTORE,
  MAGIC,
  END,
}

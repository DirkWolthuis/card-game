import {
  GameEvent,
  GameEventName,
  GameEventType,
} from '../models/game-event.model';

export class StartCombatPhaseEvent implements GameEvent {
  name = GameEventName.START_COMBAT_PHASE;
  type = GameEventType.PHASE_CHANGE;
}

export class SelectAttackersEvent implements GameEvent {
  name = GameEventName.SELECT_ATTACKERS;
  type = GameEventType.SUB_PHASE_CHANGE;
}

export class EndCombatPhaseEvent implements GameEvent {
  name = GameEventName.END_COMBAT_PHASE;
  type = GameEventType.PHASE_CHANGE;
}

export class WaitingForPlayerToSelectAttackersEvent implements GameEvent {
  name = GameEventName.WAITING_FOR_PLAYER_TO_SELECT_ATTACKERS;
  type = GameEventType.WAITING_FOR_INPUT;
}
export class PlayerSelectsAttackersEvent implements GameEvent {
  name = GameEventName.PLAYER_SELECTS_ATTACKERS;
  type = GameEventType.PLAYER_INPUT;
  constructor(public playerId: string, public attackers: string[]) {}
}
export class PlayerSkippedAttackersEvent implements GameEvent {
  name = GameEventName.PLAYER_SKIPPED_ATTACKERS;
  type = GameEventType.PLAYER_INPUT;
  constructor(public playerId: string) {}
}

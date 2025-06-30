export interface GameEvent {
  name: GameEventName;
  type: GameEventType;
  [key: string]: any;
}

export enum GameEventName {
  START_GAME = 'START_GAME',
  PLAY_CARD = 'PLAY_CARD',
  DAMAGE = 'DAMAGE',
  START_COMBAT_PHASE = 'START_COMBAT_PHASE',
  END_COMBAT_PHASE = 'END_COMBAT_PHASE',
  SELECT_ATTACKERS = 'SELECT_ATTACKERS',
  WAITING_FOR_PLAYER_TO_SELECT_ATTACKERS = 'WAITING_FOR_PLAYER_TO_SELECT_ATTACKERS',
  PLAYER_SELECTS_ATTACKERS = 'PLAYER_SELECTS_ATTACKERS',
  PLAYER_SKIPPED_ATTACKERS = 'PLAYER_SKIPPED_ATTACKERS',
}

export enum GameEventType {
  GAME_STATE = 'GAME_STATE',
  PHASE_CHANGE = 'PHASE_CHANGE',
  SUB_PHASE_CHANGE = 'SUB_PHASE_CHANGE',
  WAITING_FOR_INPUT = 'WAITING_FOR_INPUT',
  PLAYER_INPUT = 'PLAYER_INPUT',
  EFFECT = 'EFFECT',
}

export class DamageEvent implements GameEvent {
  name = GameEventName.DAMAGE;
  type = GameEventType.EFFECT;
  constructor(
    public fromEntityId: string,
    public targetEntityId: string,
    public amount: number
  ) {}
}

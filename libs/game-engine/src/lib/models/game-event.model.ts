export interface GameEvent {
  name: GameEventName;
  type: GameEventType;
  [key: string]: any;
}

export enum GameEventName {
  START_GAME = 'START_GAME',
  PLAY_CARD = 'PLAY_CARD',
  DAMAGE = 'DAMAGE',
}

export enum GameEventType {
  GAME_STATE = 'GAME_STATE',
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

export interface GameEvent {
  name: GameEventName;
  type: GameEventType;
  [key: string]: any;
}

export enum GameEventName {
  StartGame = 'Start',
  PlayCard = 'Play Card',
  Damage = 'Damage',
}

export enum GameEventType {
  EFFECT = 'EFFECT',
}

export class DamageEvent implements GameEvent {
  name: GameEventName.Damage;
  type = GameEventType.EFFECT;
  constructor(
    public fromEntityId: string,
    public targetEntityId: string,
    public amount: number
  ) {}
}

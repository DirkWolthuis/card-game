export interface GameEvent {
  type: string;
  [key: string]: any;
}

export enum GameEventType {
  StartGame = '[GAME] Start',
  PlayCard = '[GAME] Play Card',
  Damage = '[EFFECT] Damage',
}

export class DamageEvent implements GameEvent {
  type = GameEventType.Damage;
  constructor(
    public fromEntityId: string,
    public targetEntityId: string,
    public amount: number
  ) {}
}

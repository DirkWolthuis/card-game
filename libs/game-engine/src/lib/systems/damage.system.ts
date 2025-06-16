import {
  GameEvent,
  GameEventName,
  GameEventType,
} from '../models/game-event.model';
import { System } from '../models/system.model';

export class DamageSystem implements System {
  name = 'DamageSystem';
  handlesEvents = [GameEventName.Damage];

  async handle(event: GameEvent, ecs: any): Promise<GameEvent[]> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              name: GameEventName.StartGame,
              type: GameEventType.EFFECT,
            },
          ]),
        1000
      )
    );
  }
}

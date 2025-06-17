import {
  GameEvent,
  GameEventName,
  GameEventType,
} from '../models/game-event.model';
import { System } from '../models/system.model';

export class DamageSystem implements System {
  name = 'DamageSystem';
  handlesEvents = [GameEventName.DAMAGE];

  async handle(event: GameEvent, store: any): Promise<GameEvent[]> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              name: GameEventName.PLAY_CARD,
              type: GameEventType.EFFECT,
            },
          ]),
        1000
      )
    );
  }
}

import { GameEvent, GameEventType } from '../models/game-event.model';
import { System } from '../models/system.model';

export class DamageSystem implements System {
  name = 'DamageSystem';
  handlesEventTypes = [GameEventType.Damage];

  async handle(event: GameEvent, ecs: any): Promise<any[]> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve([
            {
              type: 'DamageApplied',
            },
          ]),
        1000
      )
    );
  }
}

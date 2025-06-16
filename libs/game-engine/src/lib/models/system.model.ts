import { GameEvent, GameEventName } from './game-event.model';

export class System {
  name: string;
  handlesEvents: GameEventName[];
  handle: (event: GameEvent, ecs: any) => Promise<GameEvent[]>;
}

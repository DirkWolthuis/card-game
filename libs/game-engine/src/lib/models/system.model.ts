import { GameEvent, GameEventType } from './game-event.model';

export class System {
  name: string;
  handlesEventTypes: GameEventType[];
  handle: (event: GameEvent, ecs: any) => Promise<GameEvent[]>;
}

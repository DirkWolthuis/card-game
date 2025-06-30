import { GameEventQueueService } from '../queue/game-event-queue.service';
import { Store } from '../store/store';
import { GameEvent, GameEventName } from './game-event.model';

export class System {
  name: string;
  handlesEvents: GameEventName[];
  handle: (
    event: GameEvent,
    store: Store,
    eventQueueService: GameEventQueueService
  ) => Promise<GameEvent[]>;
}

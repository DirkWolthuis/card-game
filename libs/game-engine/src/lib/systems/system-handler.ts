import { GameEvent } from '../models/game-event.model';
import { System } from '../models/system.model';
import { GameEventQueueService } from '../queue/game-event-queue.service';
import { Store } from '../store/store';
import { CombatPhaseSystem } from './combat-phase.system';
import { DamageSystem } from './damage.system';
import { GameSetupSystem } from './game-setup.system';

const systems: System[] = [
  new DamageSystem(),
  new GameSetupSystem(),
  new CombatPhaseSystem(),
];

export async function systemHandler(
  event: GameEvent,
  store: Store,
  gameEventQueueService: GameEventQueueService
): Promise<GameEvent[]> {
  const relevantSystems = systems.filter((system) =>
    system.handlesEvents.includes(event.name)
  );

  let newEvents: GameEvent[] = [];
  for (const system of relevantSystems) {
    // Each system's handle may return an array of events
    const result = await system.handle(event, store, gameEventQueueService);

    newEvents = newEvents.concat(result);
  }
  return newEvents;
}

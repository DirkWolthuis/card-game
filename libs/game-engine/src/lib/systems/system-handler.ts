import { Store } from '../event-bus/store';
import { GameEvent } from '../models/game-event.model';
import { System } from '../models/system.model';
import { DamageSystem } from './damage.system';

const systems: System[] = [new DamageSystem()];

export async function systemHandler(
  event: GameEvent,
  ecs: Store
): Promise<any[]> {
  const relevantSystems = systems.filter((system) =>
    system.handlesEvents.includes(event.name)
  );

  let newEvents: any[] = [];
  for (const system of relevantSystems) {
    // Each system's handle may return an array of events
    const result = await system.handle(event, ecs);
    if (Array.isArray(result)) {
      newEvents = newEvents.concat(result);
    }
  }
  return newEvents;
}

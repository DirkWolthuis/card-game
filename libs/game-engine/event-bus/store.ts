import { GameEvent } from '../events/events';

export type EntityId = string;

export interface Component {
  type: string;
}

export type ComponentStore = Map<EntityId, Component[]>;

export interface System {
  name: string;
  handle(event: GameEvent, ecs: ECS): GameEvent[];
}

export class ECS {
  components: ComponentStore = new Map();

  getComponents<T extends Component>(entityId: EntityId, type: string): T[] {
    return (this.components.get(entityId) || []).filter(
      (c) => c.type === type
    ) as T[];
  }

  addComponent(entityId: EntityId, component: Component) {
    if (!this.components.has(entityId)) this.components.set(entityId, []);
    this.components.get(entityId)!.push(component);
  }

  getAllEntitiesWith(type: string): EntityId[] {
    return [...this.components.entries()]
      .filter(([_, comps]) => comps.some((c) => c.type === type))
      .map(([id]) => id);
  }
}

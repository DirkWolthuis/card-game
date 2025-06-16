import { Entity, EntityId } from '../models/entity.model';

export class Store {
  store = new Map<EntityId, Entity>();

  getEntity<T extends Entity>(entityId: EntityId): T {
    return this.store.get(entityId) as T;
  }

  addEntity(entity: Entity): void {
    this.store.set(entity.id, entity);
  }
}

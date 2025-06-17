import { Component } from '../models/component.model';
import { Entity, EntityId } from '../models/entity.model';

export class Store {
  store = new Map<EntityId, Entity>();

  getEntity<T extends Entity>(entityId: EntityId): T {
    return this.store.get(entityId) as T;
  }

  addEntity(entity: Entity): void {
    this.store.set(entity.id, entity);
  }

  /**
   * Updates a component of an entity by merging the provided partial data.
   * @param entityId The ID of the entity to update.
   * @param componentName The name/key of the component to update.
   * @param partial The partial data to merge into the component.
   */
  updateEntityComponent<T extends Entity>(
    entityId: EntityId,
    component: Component
  ): void {
    const entity = this.getEntity<T>(entityId);
    if (!entity) throw new Error(`Entity ${entityId} not found.`);
    // search for all components in the entity and match by id
    Object.values(entity).forEach((comp) => {
      if (comp.id === component.id) {
        Object.assign(comp, component);
      }
    });

    this.store.set(entityId, entity);
  }
}

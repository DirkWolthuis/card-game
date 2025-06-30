import { EntityId } from '../models/entity.model';

export type BattlefieldLanesData = {
  [entityId: EntityId]: {
    combatLane: EntityId[];
    supportLane: EntityId[];
  };
};

export class BattlefieldLanesComponent {
  constructor(public data: BattlefieldLanesData) {}
}

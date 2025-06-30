import { Entity } from '../models/entity.model';
import { BattlefieldLanesComponent } from '../components/battlefield-lanes.component';

export class BattlefieldEntity implements Entity {
  constructor(
    public id: string,
    public battlefieldLanesComponent: BattlefieldLanesComponent
  ) {}
}

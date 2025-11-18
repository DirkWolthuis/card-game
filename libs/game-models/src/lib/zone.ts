import { EntityId } from './entity';

export interface Zone {
  entityIds: EntityId[];
}

export interface Zones {
  hand: Zone;
  battlefield: Zone;
  graveyard: Zone;
  exile: Zone;
  deck: Zone;
}

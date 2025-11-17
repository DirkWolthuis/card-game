export interface Zone {
  entityIds: string[];
}

export interface Zones {
  hand: Zone;
  battlefield: Zone;
  graveyard: Zone;
  exile: Zone;
  deck: Zone;
}

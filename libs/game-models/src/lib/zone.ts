export interface HandZone {
  cardIds: string[];
}

export interface BattlefieldZone {
  cardIds: string[];
}

export interface GraveyardZone {
  cardIds: string[];
}

export interface ExileZone {
  cardIds: string[];
}

export interface Library {
  cardIds: string[];
}

export interface Zones {
  hand: HandZone;
  battlefield: BattlefieldZone;
  graveyards: GraveyardZone;
  exile: ExileZone;
}

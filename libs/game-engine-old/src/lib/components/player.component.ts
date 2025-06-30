import { Component } from '../models/component.model';
import { EntityId } from '../models/entity.model';

export type PlayerData = {
  playerId: EntityId;
  name: string;
};

export class PlayerComponent implements Component {
  id = 'PLAYER';
  data: PlayerData;
  constructor(data: PlayerData) {
    this.data = data;
  }
}

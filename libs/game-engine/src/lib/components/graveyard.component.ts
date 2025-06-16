import { Component } from '../models/component.model';
import { EntityId } from '../models/entity.model';

export type GraveyardData = {
  cards: EntityId[];
};

export class GraveyardComponent implements Component {
  id = 'GRAVEYARD';
  data: GraveyardData;
  constructor(data: GraveyardData) {
    this.data = data;
  }
}

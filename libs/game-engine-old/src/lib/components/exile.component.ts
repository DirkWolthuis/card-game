import { Component } from '../models/component.model';
import { EntityId } from '../models/entity.model';

export type ExileData = {
  cards: EntityId[];
};

export class ExileComponent implements Component {
  id = 'EXILE';
  data: ExileData;
  constructor(data: ExileData) {
    this.data = data;
  }
}

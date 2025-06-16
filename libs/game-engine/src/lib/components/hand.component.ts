import { Component } from '../models/component.model';
import { EntityId } from '../models/entity.model';

export type HandData = {
  cards: EntityId[];
};

export class HandComponent implements Component {
  id = 'HAND';
  data: HandData;
  constructor(data: HandData) {
    this.data = data;
  }
}

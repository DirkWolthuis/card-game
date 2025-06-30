import { Component } from '../models/component.model';
import { EntityId } from '../models/entity.model';

export type DeckData = {
  cards: EntityId[];
};

export class DeckComponent implements Component {
  id = 'DECK';
  data: DeckData;
  constructor(data: DeckData) {
    this.data = data;
  }
}

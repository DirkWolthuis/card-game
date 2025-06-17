import { CardEntity } from '../entities/card.entity';
import { Component } from '../models/component.model';

export type HandData = {
  cards: CardEntity[];
};

export class HandComponent implements Component {
  id = 'HAND';
  data: HandData;
  constructor(data: HandData) {
    this.data = data;
  }
}

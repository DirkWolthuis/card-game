import { CardType } from '../models/card-type.model';
import { Component } from '../models/component.model';

export type CardAttributesData = {
  manaValue: number;
  cardName: string;
  descriptionText: string;
  keywords: string[];
  cardType: CardType;
};

export class CardAttributesComponent implements Component {
  id = 'CARD_ATTRIBUTES';
  data: CardAttributesData;
  constructor(data: CardAttributesData) {
    this.data = data;
  }
}

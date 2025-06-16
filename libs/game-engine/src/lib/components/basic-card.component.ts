import { CardType } from '../models/card-type.model';
import { Component } from '../models/component.model';

export type BasicCardInformationData = {
  manaValue: number;
  cardName: string;
  descriptionText: string;
  keywords: string[];
  cardType: CardType;
};

export class BasicCardInformationComponent implements Component {
  id = 'BASIC_CARD_INFORMATION';
  data: BasicCardInformationData;
  constructor(data: BasicCardInformationData) {
    this.data = data;
  }
}

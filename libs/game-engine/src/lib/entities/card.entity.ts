import { BasicCardInformationComponent } from '../components/basic-card.component';
import { Entity } from '../models/entity.model';

export class CardEntity implements Entity {
  id: string;

  constructor(
    id: string,
    public basicCardInformationComponent: BasicCardInformationComponent
  ) {
    this.id = id;
  }
}

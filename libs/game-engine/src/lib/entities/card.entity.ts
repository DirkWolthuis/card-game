import { BasicCardInformationComponent } from '../components/basic-card.component';
import { UnitAttributesComponent } from '../components/unit-stats.component';
import { Entity } from '../models/entity.model';

export class CardEntity implements Entity {
  id: string;

  constructor(
    id: string,
    public basicCardInformationComponent: BasicCardInformationComponent,
    public unitAttributesComponent?: UnitAttributesComponent
  ) {
    this.id = id;
  }
}

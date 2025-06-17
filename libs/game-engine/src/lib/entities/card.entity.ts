import { CardAttributesComponent } from '../components/card-attributes.component';
import { UnitAttributesComponent } from '../components/unit-attributes.component';
import { Entity } from '../models/entity.model';

export class CardEntity implements Entity {
  constructor(
    public id: string,
    public cardAttributesComponent: CardAttributesComponent,
    public unitAttributesComponent?: UnitAttributesComponent
  ) {}
}

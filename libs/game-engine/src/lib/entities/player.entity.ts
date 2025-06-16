import { Entity } from '../models/entity.model';

export class PlayerEntity implements Entity {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}

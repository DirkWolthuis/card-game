import { Component } from '../models/component.model';

export type UnitAttributesData = {
  speed: number;
  health: number;
  power: number;
  toughness: number;
};

export class UnitAttributesComponent implements Component {
  id = 'UNIT_ATTRIBUTES';
  data: UnitAttributesData;
  constructor(data: UnitAttributesData) {
    this.data = data;
  }
}

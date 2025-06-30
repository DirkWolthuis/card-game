import { Component } from '../models/component.model';

export type ManaResourceData = {
  currentMana: number;
  maxMana: number;
};

export class ManaResourceComponent implements Component {
  id = 'MANA_RESOURCE';
  data: ManaResourceData;
  constructor(data: ManaResourceData) {
    this.data = data;
  }
}

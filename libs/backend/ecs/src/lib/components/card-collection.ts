import { defineComponent, Types } from 'bitecs';

const cardCollectionObject = {
  cardReferences: [Types.eid, 200],
};

export const DeckComponent = defineComponent(cardCollectionObject);
export const HandComponent = defineComponent(cardCollectionObject);
export const GraveyardComponent = defineComponent(cardCollectionObject);
export const ExileComponent = defineComponent(cardCollectionObject);

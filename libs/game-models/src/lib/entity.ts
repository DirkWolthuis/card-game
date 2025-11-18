import { CardId } from './card';
import { PlayerId } from './player';

export type EntityId = string;

export interface Entity {
  id: EntityId;
  cardId: CardId;
  ownerId: PlayerId;
  controllerId: PlayerId;
}

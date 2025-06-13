import { Component, EntityId } from '../event-bus/store';

export type GameEvent =
  | { type: 'StartGame' }
  | { type: 'PlayCard'; playerId: EntityId; cardId: string }
  | { type: 'Damage'; targetId: EntityId; amount: number }
  | { type: 'Timeout'; playerId: EntityId }
  | { type: 'PingPlayer'; playerId: EntityId; prompt: string }
  | { type: 'PlayerResponded'; playerId: EntityId; response: string };

// Component: HitPoints
export interface HP extends Component {
  type: 'hp';
  value: number;
}

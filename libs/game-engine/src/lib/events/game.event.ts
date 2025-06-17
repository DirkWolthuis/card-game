import {
  GameEvent,
  GameEventName,
  GameEventType,
} from '../models/game-event.model';

export class StartGameEvent implements GameEvent {
  name = GameEventName.START_GAME;
  type = GameEventType.GAME_STATE;
}

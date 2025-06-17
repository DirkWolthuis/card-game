import { System } from '../models/system.model';
import { GameEvent, GameEventName } from '../models/game-event.model';
import { Store } from '../store/store';
import {
  EndCombatPhaseEvent,
  SelectAttackersEvent,
  WaitingForPlayerToSelectAttackersEvent,
} from '../events/combat.event';
import { GameEventQueueService } from '../queue/game-event-queue.service';

export class CombatPhaseSystem implements System {
  name = 'CombatPhaseSystem';
  handlesEvents = [GameEventName.START_COMBAT_PHASE];

  async handle(
    event: GameEvent,
    store: Store,
    gameEventQueueService: GameEventQueueService
  ): Promise<GameEvent[]> {
    switch (event.name) {
      case GameEventName.START_COMBAT_PHASE: {
        return this.startCombatPhase(event, store);
      }
      case GameEventName.SELECT_ATTACKERS: {
        return this.selectAttackers(event, store);
      }
      case GameEventName.WAITING_FOR_PLAYER_TO_SELECT_ATTACKERS: {
        return this.waitingForPlayerToSelectAttackers(
          event,
          store,
          gameEventQueueService
        );
      }
      case GameEventName.PLAYER_SELECTS_ATTACKERS: {
        gameEventQueueService.resumeFromPlayerInput();
        return this.playerSelectsAttackers(event, store);
      }
      case GameEventName.PLAYER_SKIPPED_ATTACKERS: {
        gameEventQueueService.resumeFromPlayerInput();
        return this.playerSkippedAttackers(event, store);
      }
      default:
        return [];
    }
  }

  startCombatPhase(event: GameEvent, store: Store): GameEvent[] {
    // Logic to start the combat phase
    return [new SelectAttackersEvent()];
  }

  selectAttackers(event: GameEvent, store: Store): GameEvent[] {
    // check if there are valid attackers for the current player
    // if so, waiting for player input to select attackers event
    if (!this.validAttackers(store)) {
      return [new EndCombatPhaseEvent()];
    }
    // ...additional logic...
    return [new WaitingForPlayerToSelectAttackersEvent()];
  }

  waitingForPlayerToSelectAttackers(
    event: GameEvent,
    store: Store,
    gameEventQueueService: GameEventQueueService
  ): GameEvent[] {
    // Pause the event queue and allow only the two events
    gameEventQueueService.waitingForPlayerInput([
      GameEventName.PLAYER_SELECTS_ATTACKERS,
      GameEventName.PLAYER_SKIPPED_ATTACKERS,
    ]);
    return [];
  }

  playerSelectsAttackers(event: GameEvent, store: Store): GameEvent[] {
    // Logic for when player selects attackers
    return [];
  }

  playerSkippedAttackers(event: GameEvent, store: Store): GameEvent[] {
    // Logic for when player skips selecting attackers
    return [new EndCombatPhaseEvent()];
  }

  validAttackers(store: Store): boolean {
    return true;
  }
}

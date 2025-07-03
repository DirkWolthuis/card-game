import { createWorld, IWorld } from 'bitecs';
import { EventQueueService } from '../event-queue/event-queue.service';
import { SystemEventMap } from '@loe/ecs';
import { GameEvent } from '@loe/shared/game-types';

type GameState =
  | 'AWAITING_ACTIVE_PLAYER_INPUT'
  | 'RESPONSE_WINDOW'
  | 'RESOLVING_STACK'
  | 'PROCESSING_EVENT'
  | 'READY_FOR_NEW_EVENT';

export class GameEngineService {
  private eventQueueService = new EventQueueService();
  private gameState: GameState = 'READY_FOR_NEW_EVENT';
  private tickInterval: NodeJS.Timeout | null = null;
  private tickDuration = 1 * 1000;
  private systemEventMap = SystemEventMap;
  private world!: IWorld;

  constructor() {
    this.world = createWorld();
    this.startGameLoop();
    this.eventQueueService.addEvents([
      {
        type: 'INTERNAL::SETUP_GAME',
        payload: {
          players: [
            { id: 1, deckId: 1 },
            { id: 2, deckId: 2 },
          ],
        },
      },
    ]);
  }

  public addEvents(events: GameEvent[]): void {
    this.eventQueueService.addEvents(events);
  }

  public updateGameState(newState: GameState): void {
    this.gameState = newState;
  }

  private startGameLoop(): void {
    this.tickInterval = setInterval(async () => {
      await this.tick();
    }, this.tickDuration);
  }

  private stopGameLoop(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private async tick() {
    switch (this.gameState) {
      case 'AWAITING_ACTIVE_PLAYER_INPUT':
        // Handle player input
        break;
      case 'RESPONSE_WINDOW':
        // Handle response window
        break;
      case 'RESOLVING_STACK':
        // Handle resolving stack
        break;
      case 'PROCESSING_EVENT':
        break;
      case 'READY_FOR_NEW_EVENT':
        this.processEvent();
        break;
    }
  }

  private async processEvent(): Promise<void> {
    this.updateGameState('PROCESSING_EVENT');
    const event = this.eventQueueService.getNextEvent();
    if (event) {
      const systems = this.systemEventMap.get(event.type);
      if (systems) {
        for (const system of systems) {
          await system(event, this.world, this);
        }
      } else {
        console.warn(`No systems found for event type: ${event.type}`);
      }
    }
    this.updateGameState('READY_FOR_NEW_EVENT');
  }
}

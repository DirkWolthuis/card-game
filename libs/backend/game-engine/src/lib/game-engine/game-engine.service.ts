import { EventQueueService } from '../event-queue/event-queue.service';

type GameState =
  | 'AWAITING_ACTIVE_PLAYER_INPUT'
  | 'RESPONSE_WINDOW'
  | 'RESOLVING_STACK'
  | 'PROCESSING';

export class GameEngineService {
  private eventQueueService = new EventQueueService();
  private gameState: GameState = 'PROCESSING';
  private tickInterval: NodeJS.Timeout | null = null;
  private tickDuration = 1 * 1000;

  constructor() {
    this.startGameLoop();
  }

  private updateGameState(newState: GameState): void {
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

  async tick() {
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
      case 'PROCESSING':
        // Handle processing
        break;
    }
  }
}

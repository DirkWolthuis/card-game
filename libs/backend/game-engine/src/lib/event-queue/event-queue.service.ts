import { GameEvent } from '@loe/shared/game-types';

export class EventQueueService {
  private queue: GameEvent[] = [];

  addEvents(event: GameEvent[]): void {
    this.queue.push(...event);
  }

  getNextEvent(): GameEvent | undefined {
    return this.queue.shift();
  }

  peek(): GameEvent | undefined {
    return this.queue[0];
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  clear(): void {
    this.queue = [];
  }

  getQueue(): GameEvent[] {
    return [...this.queue];
  }
}

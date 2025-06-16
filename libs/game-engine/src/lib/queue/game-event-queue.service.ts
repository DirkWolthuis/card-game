import { Injectable, OnModuleInit } from '@nestjs/common';
import { Store } from '../store/store';
import { GameEvent } from '../models/game-event.model';
import { systemHandler } from '../systems/system-handler';

/**
 * Tick-based event queue for deterministic, step-wise event processing.
 * Call tick() to process all queued events in order.
 */
@Injectable()
export class GameEventQueueService implements OnModuleInit {
  private queue: GameEvent[] = [];
  private resolvedEvents: GameEvent[] = []; // Track resolved events
  private store = new Store();
  private tickInterval: NodeJS.Timeout | null = null;
  private isTicking = false;
  private resolvedStates: any[] = []; // Store a copy of the state after each resolved event

  onModuleInit() {
    this.start();
  }

  /**
   * Add an event to the end of the queue.
   */
  emit(event: GameEvent) {
    this.queue.push(event);
  }

  /**
   * Add an event to the front of the queue (higher priority).
   */
  emitFirst(event: GameEvent) {
    this.queue.unshift(event);
  }

  /**
   * Process all events in the queue for this tick.
   * Any new events generated during processing are added to the next tick.
   */
  async tick() {
    const currentQueue = this.queue;
    this.queue = [];
    for (const event of currentQueue) {
      console.log('Tick processing:', event.type);
      const newEvents = await systemHandler(event, this.store);
      if (Array.isArray(newEvents)) {
        for (const newEvent of newEvents) {
          this.emit(newEvent);
        }
      }
      console.log('storevalues', JSON.stringify(this.store.store.values()));
      this.resolvedEvents.push(event); // Track resolved event
      // Save a copy of the state after resolving the event
      this.resolvedStates.push(this.cloneState());
      console.log('Tick processed:', event.type);
    }
  }

  /**
   * Returns true if there are events waiting to be processed.
   */
  hasPendingEvents() {
    return this.queue.length > 0;
  }

  /**
   * Get the list of resolved events.
   */
  getResolvedEvents(): GameEvent[] {
    return this.resolvedEvents;
  }

  /**
   * Get the list of resolved states (deep copies after each event).
   */
  getResolvedStates(): any[] {
    return this.resolvedStates;
  }

  /** Deep clone the current state of the store. */
  private cloneState(): any {
    // Simple deep clone using JSON (replace with a more robust method if needed)
    return JSON.parse(JSON.stringify(Array.from(this.store.store.entries())));
  }

  /**
   * Start processing events every 500ms.
   */
  start() {
    if (this.tickInterval) return; // Already started
    this.tickInterval = setInterval(async () => {
      if (this.isTicking) return;
      if (this.hasPendingEvents()) {
        this.isTicking = true;
        try {
          await this.tick();
        } finally {
          this.isTicking = false;
        }
      }
    }, 500);
  }

  /**
   * Stop the ticking process.
   */
  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}

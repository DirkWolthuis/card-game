import { Injectable, OnModuleInit } from '@nestjs/common';
import { Store } from '../store/store';
import { GameEvent, GameEventName } from '../models/game-event.model';
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
  private resolvedStates: [string, unknown][][] = []; // Store a copy of the state after each resolved event
  private isWaitingForPlayerInput = false;
  private allowedPlayerInputEvents: string[] = [];
  private playerInputTimeout: NodeJS.Timeout | null = null;

  onModuleInit() {
    this.start();
  }

  /**
   * Add an event to the end of the queue.
   */
  emit(events: GameEvent[]) {
    if (this.isWaitingForPlayerInput) {
      // Filter out events not allowed during player input
      if (
        !events.every((event) =>
          this.allowedPlayerInputEvents.includes(event.name)
        )
      ) {
        console.log(
          '[GameEventQueueService] Received unexpected event while waiting for player input, skipping:',
          events
        );
        return;
      }
    }
    for (const event of events) {
      this.queue.push(event);
      console.log('[GameEventQueueService] Event added to queue:', event);
    }
  }

  /**
   * Add an event to the front of the queue (higher priority).
   */
  emitFirst(event: GameEvent) {
    this.queue.unshift(event);
    console.log(
      '[GameEventQueueService] Event added to front of queue:',
      event
    );
  }

  /**
   * Process all events in the queue for this tick.
   * Any new events generated during processing are added to the next tick.
   */
  async tick() {
    if (!this.shouldProcessNextEvent()) {
      console.log(
        '[GameEventQueueService] Waiting for player input, skipping event handling'
      );
      return;
    }
    const eventToHandle = this.dequeueFirstEvent();
    if (!eventToHandle) {
      return; // Nothing to process
    }
    console.log('[GameEventQueueService] Handling event:', eventToHandle);
    const newEvents = await systemHandler(eventToHandle, this.store, this);

    this.emit(newEvents);

    this.resolvedEvents.push(eventToHandle); // Track resolved event
    this.resolvedStates.push(this.cloneState());
    console.log('[GameEventQueueService] Tick processed:', eventToHandle.name);
  }

  /**
   * Returns true if there are events waiting to be processed.
   */
  hasPendingEvents() {
    if (this.queue.length > 0) {
      console.log(
        '[GameEventQueueService] There are pending events in the queue'
      );
      return true;
    } else {
      console.log('[GameEventQueueService] No pending events in the queue');
      return false;
    }
  }

  /**
   * Get the list of resolved events.
   */
  getResolvedEvents(): GameEvent[] {
    console.log(
      '[GameEventQueueService] Returning resolved events:',
      this.resolvedEvents
    );
    return this.resolvedEvents;
  }

  /**
   * Get the list of resolved states (deep copies after each event).
   */
  getResolvedStates(): [string, unknown][][] {
    console.log(
      '[GameEventQueueService] Returning resolved states:',
      this.resolvedStates
    );
    return this.resolvedStates;
  }

  /** Deep clone the current state of the store. */
  private cloneState(): [string, unknown][] {
    const state = JSON.parse(
      JSON.stringify(Array.from(this.store.store.entries()))
    );

    return state;
  }

  /**
   * Start processing events every 500ms.
   */
  start() {
    if (this.tickInterval) {
      console.log('[GameEventQueueService] Tick interval already started');
      return; // Already started
    }
    this.tickInterval = setInterval(async () => {
      await this.tick();
    }, 1 * 1000);
    console.log('[GameEventQueueService] Started tick interval');
  }

  /**
   * Stop the ticking process.
   */
  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
      console.log('[GameEventQueueService] Stopped tick interval');
    } else {
      console.log('[GameEventQueueService] No tick interval to stop');
    }
  }

  waitingForPlayerInput(
    allowedEvents: GameEventName[],
    timeoutEvents: GameEvent[],
    timeoutMs = 60 * 1000 // Default to 60 seconds
  ) {
    this.isWaitingForPlayerInput = true;
    this.allowedPlayerInputEvents = allowedEvents;
    if (this.playerInputTimeout) {
      clearTimeout(this.playerInputTimeout);
      console.log(
        '[GameEventQueueService] Cleared previous player input timeout'
      );
    }
    this.playerInputTimeout = setTimeout(() => {
      if (this.isWaitingForPlayerInput) {
        console.log(
          '[GameEventQueueService] Player input timeout reached, emitting timeout events:',
          timeoutEvents
        );
        this.emit(timeoutEvents);
        this.resumeFromPlayerInput();
      }
    }, timeoutMs);
    console.log(
      '[GameEventQueueService] Waiting for player input. Allowed events:',
      allowedEvents,
      'Timeout in ms:',
      timeoutMs
    );
  }

  resumeFromPlayerInput() {
    this.isWaitingForPlayerInput = false;
    this.allowedPlayerInputEvents = [];
    if (this.playerInputTimeout) {
      clearTimeout(this.playerInputTimeout);
      this.playerInputTimeout = null;
      console.log(
        '[GameEventQueueService] Cleared player input timeout and resumed from player input'
      );
    } else {
      console.log(
        '[GameEventQueueService] Resumed from player input (no timeout was set)'
      );
    }
  }

  /**
   * Get and remove the first event in the queue.
   */
  dequeueFirstEvent(): GameEvent | undefined {
    if (this.queue.length === 0) {
      return undefined;
    }
    const event = this.queue.shift();
    console.log(
      '[GameEventQueueService] dequeueFirstEvent removed event:',
      event
    );
    return event;
  }

  /**
   * Check if the next event in the queue is allowed during player input and, if so, process it immediately.
   */
  shouldProcessNextEvent(): boolean {
    if (this.isWaitingForPlayerInput) {
      return this.allowedPlayerInputEvents.includes(this.queue?.[0]?.name);
    }
    return true;
  }
}

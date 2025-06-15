import { Injectable, OnModuleInit } from '@nestjs/common';
import { ReplaySubject, tap, concatMap } from 'rxjs';
import { ECS } from './store';
import { GameEvent } from '../models/game-event.model';
import { systemHandler } from '../systems/system-handler';

@Injectable()
export class EventBusService implements OnModuleInit {
  eventBus = new ReplaySubject<GameEvent>(Infinity);
  ecs = new ECS();

  onModuleInit() {
    this.eventBus
      .pipe(
        tap((event) => {
          console.log('Starting processing:', event.type);
        }),
        concatMap(async (event) => {
          console.log('Processing:', event.type);
          const newEvents = await systemHandler(event, this.ecs);
          newEvents.forEach((newEvent) => this.emit(newEvent));
          return event;
        }),
        tap((event) => {
          console.log('Event processed:', event.type);
        })
      )
      .subscribe();
  }

  emit(event: any) {
    this.eventBus.next(event);
  }
}

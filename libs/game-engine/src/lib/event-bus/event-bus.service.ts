import { Injectable, OnModuleInit } from '@nestjs/common';

import { ReplaySubject, tap, concatMap } from 'rxjs';
import { GameEvent } from '../events/events';
import {
  DamageSystem,
  PlayCardSystem,
  PlayerInputSystem,
} from '../systems/systems';
import { ECS, System } from './store';

@Injectable()
export class EventBusService implements OnModuleInit {
  eventBus = new ReplaySubject<GameEvent>(Infinity);
  ecs = new ECS();
  systems: System[] = [DamageSystem, PlayCardSystem, PlayerInputSystem];

  onModuleInit() {
    this.eventBus
      .pipe(
        concatMap(async (event) => {
          for (const system of this.systems) {
            const newEvents = await system.handle(event, this.ecs);
            newEvents.forEach((e) => this.eventBus.next(e));
          }
          return event;
        }),
        tap((event) => {
          console.log('Event processed:', event);
        })
      )
      .subscribe();
  }

  emit(event: any) {
    this.eventBus.next(event);
  }
}

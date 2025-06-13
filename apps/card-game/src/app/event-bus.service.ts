import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  DamageSystem,
  ECS,
  GameEvent,
  PlayCardSystem,
  PlayerInputSystem,
  System,
} from '@card-game/game-engine';
import { Subject, tap } from 'rxjs';

@Injectable()
export class EventBusService implements OnModuleInit {
  eventBus = new Subject<GameEvent>();
  ecs = new ECS();
  systems: System[] = [DamageSystem, PlayCardSystem, PlayerInputSystem];

  onModuleInit() {
    this.eventBus
      .pipe(
        tap((event) => {
          for (const system of this.systems) {
            const newEvents = system.handle(event, this.ecs);
            newEvents.forEach((e) => this.eventBus.next(e));
          }
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

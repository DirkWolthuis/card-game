import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { GameEventQueueService } from '@card-game/game-engine';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tickEventQueueService: GameEventQueueService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('events')
  receiveEvent(@Body() event: any) {
    this.tickEventQueueService.emit([event]);
    return { status: 'Event emitted' };
  }

  @Get('debug')
  getResolvedEventsWithStates() {
    const events = this.tickEventQueueService.getResolvedEvents();
    const states = this.tickEventQueueService.getResolvedStates();
    return events.map((event, idx) => ({ event, state: states[idx] }));
  }
}

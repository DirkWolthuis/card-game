import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { EventBusService } from '@card-game/game-engine';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly eventBusService: EventBusService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('events')
  receiveEvent(@Body() event: any) {
    this.eventBusService.emit(event);
    return { status: 'Event emitted' };
  }
}

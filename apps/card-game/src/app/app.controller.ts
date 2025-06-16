import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { TickEventQueueService } from '@card-game/game-engine';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly tickEventQueueService: TickEventQueueService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('events')
  receiveEvent(@Body() event: any) {
    this.tickEventQueueService.emit(event);
    // this.eventBusService.emit(event);
    return { status: 'Event emitted' };
  }
}

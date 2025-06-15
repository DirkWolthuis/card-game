import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventBusService, TickEventQueueService } from '@card-game/game-engine';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventBusService, TickEventQueueService],
})
export class AppModule {}

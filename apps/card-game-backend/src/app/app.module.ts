import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEventQueueService } from '@card-game/game-engine-old';
import { GameEventsGateway } from './game-events.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GameEventQueueService, GameEventsGateway],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameEventQueueService } from '@card-game/game-engine';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, GameEventQueueService],
})
export class AppModule {}

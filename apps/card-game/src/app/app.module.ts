import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventBusService } from '@card-game/game-engine';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventBusService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameController } from '@loe/game-engine';
@Module({
  imports: [],
  controllers: [AppController, GameController],
  providers: [AppService],
})
export class AppModule {}


import { Module } from '@nestjs/common';
import { GameController } from './game-engine/game.controller';
import { GameEngineService } from './game-engine/game-engine.service';

@Module({
  controllers: [GameController],
  providers: [GameEngineService],
  exports: [],
})
export class GameEngineModule {}

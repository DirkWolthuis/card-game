import { Controller, Post } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { GameEngineService } from './game-engine.service';

// In-memory store for game instances (for demo purposes)
const gameInstances = new Map<string, GameEngineService>();

@Controller('game')
export class GameController {
  @Post('new')
  createNewGame() {
    const gameId = uuidv4();
    const gameEngine = new GameEngineService();
    gameInstances.set(gameId, gameEngine);
    return { gameId };
  }
}

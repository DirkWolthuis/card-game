import { Controller, Post, Get, Param } from '@nestjs/common';
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

  @Get(':id/world')
  getWorldState(@Param('id') id: string) {
    const gameEngine = gameInstances.get(id);
    if (!gameEngine) {
      return { error: 'Game not found' };
    }
    const arrayBuffer = gameEngine.getWorldState();
    // Convert ArrayBuffer to base64 for JSON transport
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return { world: base64 };
  }
}

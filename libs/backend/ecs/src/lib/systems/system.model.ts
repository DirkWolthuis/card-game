import { IWorld } from 'bitecs';
import { GameEngineService } from '@loe/game-engine';
import { GameEvent } from '@loe/shared/game-types';

export type GameSystem<P extends GameEvent> = (
  event: P,
  world: IWorld,
  engine: GameEngineService
) => Promise<void>;

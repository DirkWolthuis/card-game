import { IWorld } from 'bitecs';
import { GameEngineService } from '@loe/game-engine';

export type GameSystem = (
  payload: any,
  world: IWorld,
  engine: GameEngineService
) => void;

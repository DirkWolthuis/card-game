import { GameState } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';

export function Board(props: BoardProps<GameState>) {
  console.log(props);
  return (
    <div>
      <h1>Welcome to Board!</h1>
    </div>
  );
}

export default Board;

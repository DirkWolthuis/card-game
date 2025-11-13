import { MyGameState } from '@game/core';
import type { BoardProps } from 'boardgame.io/react';

export function Board(props: BoardProps<MyGameState>) {
  return (
    <div>
      <h1>Welcome to Board!</h1>
    </div>
  );
}

export default Board;

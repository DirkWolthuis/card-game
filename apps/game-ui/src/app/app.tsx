// App.tsx
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';

import { GameEngine } from '@game/core';
import Board from '../board/Board';

const CardGameClient = Client({
  game: GameEngine,
  board: Board,
  multiplayer: Local(),
});

const App = () => (
  <div>
    <CardGameClient playerID="0" />
    <CardGameClient playerID="1" />
  </div>
);

export default App;

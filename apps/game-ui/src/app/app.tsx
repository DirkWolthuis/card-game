// App.tsx
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';

import { GameEngine } from '@game/core';
import MyGameBoard from '../board/board';

const CardGameClient = Client({
  game: GameEngine,
  board: MyGameBoard,
  multiplayer: Local(),
});

const App = () => (
  <div>
    <CardGameClient playerID="0" />
    <CardGameClient playerID="1" />
  </div>
);

export default App;

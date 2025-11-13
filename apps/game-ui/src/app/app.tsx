// App.tsx
import { Client } from 'boardgame.io/react';

import { MyGame } from '@game/core';
import MyGameBoard from '../board/board';

const App = Client({
  game: MyGame,
  board: MyGameBoard,
});
export default App;

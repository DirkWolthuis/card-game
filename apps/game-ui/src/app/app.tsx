// App.tsx
import { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';

import { GameEngine } from '@game/core';
import Board from '../board/board';

const CardGameClient = Client({
  game: GameEngine,
  board: Board,
  multiplayer: Local(),
});

const App = () => {
  const [activePlayer, setActivePlayer] = useState<'0' | '1'>('0');

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActivePlayer('0')}
          className={`px-4 py-2 rounded ${
            activePlayer === '0'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Player 0
        </button>
        <button
          onClick={() => setActivePlayer('1')}
          className={`px-4 py-2 rounded ${
            activePlayer === '1'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Player 1
        </button>
      </div>
      {activePlayer === '0' && <CardGameClient playerID="0" />}
      {activePlayer === '1' && <CardGameClient playerID="1" />}
    </div>
  );
};

export default App;

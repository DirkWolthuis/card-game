// App.tsx
import { useState } from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Debug } from 'boardgame.io/debug';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { GameEngine } from '@game/core';
import GameBoard from '../board/GameBoard';

const showDebugTools = import.meta.env.VITE_SHOW_DEBUG_TOOLS === 'true';

// Detect if the device supports touch
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Use TouchBackend for touch devices, HTML5Backend otherwise
const dndBackend = isTouchDevice() ? TouchBackend : HTML5Backend;

const CardGameClient = Client({
  game: GameEngine,
  board: GameBoard,
  multiplayer: Local(),
  debug: showDebugTools ? { impl: Debug } : false,
});

const App = () => {
  const playerIDs = ['0', '1'];
  const [activePlayer, setActivePlayer] = useState<string>(playerIDs[0]);

  return (
    <DndProvider backend={dndBackend}>
      <div>
        <div className="flex gap-2 mb-4" role="tablist">
          {playerIDs.map((playerID) => (
            <button
              key={playerID}
              id={`player-${playerID}-tab`}
              role="tab"
              aria-selected={activePlayer === playerID}
              aria-controls={`player-${playerID}-panel`}
              onClick={() => setActivePlayer(playerID)}
              className={`px-4 py-2 rounded ${
                activePlayer === playerID
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Player {playerID}
            </button>
          ))}
        </div>
        {playerIDs.map((playerID) => (
          <div
            key={playerID}
            id={`player-${playerID}-panel`}
            role="tabpanel"
            aria-labelledby={`player-${playerID}-tab`}
            className={activePlayer !== playerID ? 'hidden' : ''}
          >
            {activePlayer === playerID && <CardGameClient playerID={playerID} />}
          </div>
        ))}
      </div>
    </DndProvider>
  );
};

export default App;

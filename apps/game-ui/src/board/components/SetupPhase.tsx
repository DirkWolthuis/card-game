import { useState } from 'react';
import { GameState, MoveType } from '@game/models';
import { getSelectablePreconstructedDecks } from '@game/data';
import type { BoardProps } from 'boardgame.io/react';

interface SetupPhaseProps extends BoardProps<GameState> {
  playerID: string;
}

export function SetupPhase({ playerID, G, moves }: SetupPhaseProps) {
  const playerSetup = G.setupData?.playerSetup[playerID];
  const [nameInput, setNameInput] = useState(playerSetup?.name || '');
  
  if (!G.setupData || !playerSetup) {
    return <div>Loading setup...</div>;
  }

  const allDecks = getSelectablePreconstructedDecks();
  const selectedDeckIds = playerSetup.selectedDeckIds;
  const isReady = playerSetup.isReady;
  const canReady = playerSetup.name && selectedDeckIds.length === 2;

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      moves[MoveType.SET_PLAYER_NAME](nameInput.trim());
    }
  };

  const handleDeckClick = (deckId: string) => {
    moves[MoveType.SELECT_DECK](deckId);
  };

  const handleReadyToggle = () => {
    if (canReady) {
      moves[MoveType.SET_READY](!isReady);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Game Setup - Player {playerID}
        </h1>

        {/* Player Name Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Player Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              data-testid="player-name-input"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              placeholder="Enter your name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!!playerSetup.name}
            />
            {!playerSetup.name && (
              <button
                data-testid="set-name-button"
                onClick={handleNameSubmit}
                disabled={!nameInput.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Set Name
              </button>
            )}
          </div>
          {playerSetup.name && (
            <p className="mt-2 text-sm text-green-600">✓ Name set: {playerSetup.name}</p>
          )}
        </div>

        {/* Deck Selection Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Two Decks ({selectedDeckIds.length}/2)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allDecks.map((deck) => {
              const isSelected = selectedDeckIds.includes(deck.id);
              return (
                <button
                  key={deck.id}
                  data-testid={`deck-${deck.id}`}
                  onClick={() => handleDeckClick(deck.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {deck.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {deck.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        20 cards
                      </p>
                    </div>
                    {isSelected && (
                      <div className="ml-2 flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ready Button */}
        <div className="border-t pt-6">
          <button
            data-testid="ready-button"
            onClick={handleReadyToggle}
            disabled={!canReady}
            className={`w-full py-3 px-6 rounded-md font-semibold text-lg transition-all ${
              isReady
                ? 'bg-green-600 text-white hover:bg-green-700'
                : canReady
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isReady ? '✓ Ready - Waiting for opponent...' : 'Ready to Start'}
          </button>
          {!canReady && (
            <p className="text-sm text-center text-gray-500 mt-2">
              Please set your name and select 2 decks to continue
            </p>
          )}
        </div>

        {/* Status Section */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Other Players:</h3>
          <div className="space-y-1">
            {Object.entries(G.setupData.playerSetup)
              .filter(([id]) => id !== playerID)
              .map(([id, setup]) => (
                <div key={id} className="text-sm text-gray-600">
                  Player {id}: {setup.name || 'Not set'} - {
                    setup.isReady ? (
                      <span className="text-green-600">Ready ✓</span>
                    ) : (
                      <span className="text-yellow-600">Not ready</span>
                    )
                  }
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetupPhase;

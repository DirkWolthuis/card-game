import { ChainState, MoveType } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import { GameState } from '@game/models';

interface ChainDisplayProps {
  chain: ChainState;
  currentPlayerId: string;
  board: BoardProps<GameState>;
}

export function ChainDisplay({ chain, currentPlayerId, board }: ChainDisplayProps) {
  const handlePassPriority = () => {
    board.moves[MoveType.PASS_PRIORITY]();
  };

  const hasPlayerPassed = chain.consecutivePasses[currentPlayerId] === true;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 p-6 rounded-lg shadow-2xl border-4 border-yellow-500 z-50 min-w-96 max-w-2xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">
          {chain.isLocked ? 'Chain Resolving...' : 'Chain Active'}
        </h2>
        <p className="text-white text-sm">
          {chain.isLocked 
            ? 'Effects will resolve in reverse order (LIFO)'
            : 'Players can respond or pass priority'}
        </p>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Chain Links (LIFO order):</h3>
        <div className="space-y-2">
          {/* Display chain links in reverse order to show LIFO visually */}
          {[...chain.links].reverse().map((link, index) => {
            const actualIndex = chain.links.length - 1 - index;
            const isResolving = chain.isLocked && chain.resolutionIndex === actualIndex;
            
            return (
              <div 
                key={actualIndex}
                className={`p-3 rounded border-2 ${
                  isResolving 
                    ? 'border-green-400 bg-green-900/30' 
                    : 'border-gray-600 bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-400">
                      Link #{actualIndex + 1} - Player {link.playerId}
                    </div>
                    <div className="text-white font-medium">
                      {link.ability.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {link.effects.length} effect(s)
                    </div>
                  </div>
                  {isResolving && (
                    <div className="text-green-400 text-sm font-bold">
                      RESOLVING
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!chain.isLocked && (
        <div className="flex gap-4">
          <button
            onClick={handlePassPriority}
            disabled={hasPlayerPassed}
            className={`flex-1 py-2 px-4 rounded font-bold ${
              hasPlayerPassed
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {hasPlayerPassed ? 'Priority Passed' : 'Pass Priority'}
          </button>
          <div className="flex-1 py-2 px-4 bg-gray-700 rounded text-white text-center">
            <div className="text-sm text-gray-400">Passes:</div>
            <div className="font-bold">
              {Object.values(chain.consecutivePasses).filter(Boolean).length} / {Object.keys(chain.consecutivePasses).length || 2}
            </div>
          </div>
        </div>
      )}

      {chain.isLocked && (
        <div className="text-center text-yellow-400 font-bold">
          Chain Locked - Resolving...
        </div>
      )}
    </div>
  );
}

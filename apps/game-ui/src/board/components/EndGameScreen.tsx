import { GameState, PlayerId } from '@game/models';

interface EndGameScreenProps {
  gameState: GameState;
  gameover: { winner: PlayerId };
  currentPlayerId: PlayerId;
  totalTurns: number;
}

export function EndGameScreen({
  gameState,
  gameover,
  currentPlayerId,
  totalTurns,
}: EndGameScreenProps) {
  const isWinner = gameover.winner === currentPlayerId;
  const playerIds = Object.keys(gameState.players);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-game-title"
    >
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl max-w-lg w-full text-white">
        <h2
          id="end-game-title"
          className={`text-3xl font-bold mb-6 text-center ${
            isWinner ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isWinner ? '🎉 Victory!' : '💀 Defeat'}
        </h2>

        <div className="mb-6 text-center">
          <p className="text-xl">
            <span className="text-gray-400">Winner: </span>
            <span className="font-semibold text-yellow-400">
              Player {gameover.winner}
            </span>
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-bold mb-4 text-center">Game Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-gray-600 pb-2">
              <span className="text-gray-400">Total Turns:</span>
              <span className="font-semibold">{totalTurns}</span>
            </div>
            <div className="flex justify-between border-b border-gray-600 pb-2">
              <span className="text-gray-400">Players:</span>
              <span className="font-semibold">{playerIds.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-bold mb-4 text-center">
            Final Life Totals
          </h3>
          <div className="space-y-2">
            {playerIds.map((playerId) => {
              const player = gameState.players[playerId];
              const isPlayerWinner = playerId === gameover.winner;
              return (
                <div
                  key={playerId}
                  className={`flex justify-between items-center p-2 rounded ${
                    isPlayerWinner ? 'bg-yellow-600 bg-opacity-30' : ''
                  }`}
                >
                  <span
                    className={`${
                      isPlayerWinner ? 'text-yellow-400 font-bold' : ''
                    }`}
                  >
                    Player {playerId}
                    {isPlayerWinner && ' 👑'}
                  </span>
                  <span
                    className={`font-semibold ${
                      player.resources.life <= 0
                        ? 'text-red-400'
                        : 'text-green-400'
                    }`}
                  >
                    {player.resources.life} HP
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EndGameScreen;

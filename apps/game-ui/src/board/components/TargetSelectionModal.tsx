import { PlayerId, GameState } from '@game/models';

interface TargetSelectionModalProps {
  gameState: GameState;
  validTargets: PlayerId[];
  onSelectTarget: (targetId: PlayerId) => void;
}

export function TargetSelectionModal(props: TargetSelectionModalProps) {
  const { gameState, validTargets, onSelectTarget } = props;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Select a Target</h2>
        <p className="mb-4 text-gray-600">Choose a target for this effect:</p>
        <div className="space-y-2">
          {validTargets.map((playerId) => {
            const player = gameState.players[playerId];
            return (
              <button
                key={playerId}
                onClick={() => onSelectTarget(playerId)}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex justify-between items-center"
              >
                <span>Player {playerId}</span>
                <span className="text-sm">Life: {player.resources.life}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TargetSelectionModal;

interface OpponentZonesProps {
  opponentIds: string[];
  currentTurnPlayerId: string;
  currentPlayerId: string;
}

export function OpponentZones({
  opponentIds,
  currentTurnPlayerId,
  currentPlayerId,
}: OpponentZonesProps) {
  // Filter out the current player - they should never appear as their own opponent
  const opponents = opponentIds.filter((id) => id !== currentPlayerId);

  if (opponents.length === 0) {
    return null;
  }

  // Determine active opponent:
  // If the current turn player is an opponent, show them as active
  // Otherwise, default to the first opponent
  const activeOpponent = opponents.includes(currentTurnPlayerId)
    ? currentTurnPlayerId
    : opponents[0];
  const otherOpponents = opponents.filter((id) => id !== activeOpponent);

  return (
    <div className="flex gap-2 h-full">
      {/* Active opponent takes up 1/2 of the space */}
      <div className="flex-1 bg-blue-900 text-white p-4 rounded-lg border-2 border-blue-400">
        <div className="bg-blue-800 px-3 py-1 rounded mb-2">
          <span className="font-bold">Player {activeOpponent}</span>
          <span className="ml-2 text-xs">(Active Opponent)</span>
        </div>
        <div className="text-sm">
          <p>Zones placeholder</p>
        </div>
      </div>

      {/* Other opponents split the remaining 1/2 space */}
      {otherOpponents.length > 0 && (
        <div className="flex-1 flex gap-2">
          {otherOpponents.map((opponentId) => (
            <div
              key={opponentId}
              className="flex-1 bg-gray-700 text-white p-4 rounded-lg border-2 border-gray-500"
            >
              <div className="bg-gray-600 px-3 py-1 rounded mb-2">
                <span className="font-bold">Player {opponentId}</span>
              </div>
              <div className="text-sm">
                <p>Zones placeholder</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OpponentZones;

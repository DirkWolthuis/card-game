interface GameStatsOverviewProps {
  currentTurn: number;
  currentPlayer: string;
  isMyTurn: boolean;
}

export function GameStatsOverview({
  currentTurn,
  currentPlayer,
  isMyTurn,
}: GameStatsOverviewProps) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-2">Game Stats</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Turn:</span>
          <span className="font-semibold">{currentTurn}</span>
        </div>
        <div className="flex justify-between">
          <span>Current Player:</span>
          <span className="font-semibold">Player {currentPlayer}</span>
        </div>
        <div className="flex justify-between">
          <span>Your Turn:</span>
          <span className="font-semibold">{isMyTurn ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
}

export default GameStatsOverview;

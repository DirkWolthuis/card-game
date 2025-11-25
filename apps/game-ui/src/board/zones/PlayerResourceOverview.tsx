import { Resources } from '@game/models';

interface PlayerResourceOverviewProps {
  resources: Resources;
  playerName?: string;
}

export function PlayerResourceOverview({
  resources,
  playerName,
}: PlayerResourceOverviewProps) {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-2">
        {playerName || 'Player'} Resources
      </h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Life:</span>
          <span className="font-semibold">{resources.life}</span>
        </div>
      </div>
    </div>
  );
}

export default PlayerResourceOverview;

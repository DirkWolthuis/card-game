import { Entity, Resources, Zones, GameState, MoveType } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import HandZone from './HandZone';
import BattlefieldZone from './BattlefieldZone';

const gridTemplateAreas = `
  "battlefield battlefield battlefield resources"
  "battlefield battlefield battlefield card-zones"
  "hand hand hand card-zones"
`;

interface PlayerZonesProps {
  playerId: string;
  zones: Zones;
  entities: Record<string, Entity>;
  resources: Resources;
  isMyTurn: boolean;
  board: BoardProps<GameState>;
}

export function PlayerZones({
  zones,
  entities,
  isMyTurn,
  board,
}: PlayerZonesProps) {
  const { hand } = zones;
  const entitiesInHand = hand.entityIds.map((id) => entities[id]);

  return (
    <div
      style={{ gridTemplateAreas: gridTemplateAreas }}
      className="grid w-full h-full"
    >
      <div style={{ gridArea: 'battlefield' }}>
        <BattlefieldZone />
      </div>
      <div style={{ gridArea: 'resources' }}>resources</div>
      <div style={{ gridArea: 'card-zones' }}>card zones</div>
      <div style={{ gridArea: 'hand' }}>
        <div className="h-full bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">Hand</h3>
            <button
              onClick={() => board.moves[MoveType.END_TURN]()}
              disabled={!isMyTurn}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              End Turn
            </button>
          </div>
          <HandZone board={board} entities={entitiesInHand} />
        </div>
      </div>
    </div>
  );
}

export default PlayerZones;

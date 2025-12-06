import { Entity, Resources, Zones, GameState } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

interface PlayerZonesProps {
  playerId: string;
  zones: Zones;
  entities: Record<string, Entity>;
  resources: Resources;
  isMyTurn: boolean;
  board: BoardProps<GameState>;
}

/**
 * Container component that renders all zones for a player.
 * This component can be reused for both the current player and opponents.
 */
export function PlayerZones({
  playerId,
  zones,
  entities,
  resources,
  isMyTurn,
  board,
}: PlayerZonesProps) {
  const { hand } = zones;
  const entitiesInHand = hand.entityIds.map((id) => entities[id]);

  return (
    <PanelGroup direction="horizontal">
      <Panel className="bg-red-500" defaultSize={30} minSize={20}>
        left
      </Panel>
      <PanelResizeHandle />
      <Panel className="bg-green-500" defaultSize={30} minSize={20}>
        right
      </Panel>
    </PanelGroup>
  );

  // return (
  //   <>
  //     {/* Battlefield */}
  //     <div style={{ gridArea: 'battlefield' }} className="overflow-auto">
  //       <BattlefieldZone />
  //     </div>

  //     {/* Player Resources */}
  //     <div style={{ gridArea: 'resources' }} className="overflow-auto">
  //       <PlayerResourceOverview
  //         resources={resources}
  //         playerName={`Player ${playerId}`}
  //       />
  //     </div>

  //     {/* Card Zones (Deck, Graveyard, Exile) */}
  //     <div
  //       style={{ gridArea: 'card-zones' }}
  //       className="flex flex-col gap-1 overflow-auto"
  //     >
  //       <DeckZone />
  //       <GraveyardZone />
  //       <ExileZone />
  //     </div>

  //     {/* Hand */}
  //     <div style={{ gridArea: 'hand' }} className="overflow-auto">
  //       <div className="bg-gray-800 p-4 rounded-lg">
  //         <div className="flex justify-between items-center mb-2">
  //           <h3 className="text-white font-bold">Hand</h3>
  //           <button
  //             onClick={() => board.moves[MoveType.END_TURN]()}
  //             disabled={!isMyTurn}
  //             className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
  //           >
  //             End Turn
  //           </button>
  //         </div>
  //         <HandZone board={board} entities={entitiesInHand} />
  //       </div>
  //     </div>
  //   </>
  // );
}

export default PlayerZones;

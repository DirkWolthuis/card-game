import { GameState, MoveType } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import { HandZone } from './zones/HandZone';
import { DeckZone } from './zones/DeckZone';
import { GraveyardZone } from './zones/GraveyardZone';
import { ExileZone } from './zones/ExileZone';
import { BattlefieldZone } from './zones/BattlefieldZone';
import { PlayerResourceOverview } from './zones/PlayerResourceOverview';
import { GameStatsOverview } from './zones/GameStatsOverview';
import { OpponentZones } from './zones/OpponentZones';
import { TargetSelectionModal } from './components/TargetSelectionModal';
import { getValidTargets } from '@game/core';
import { getGridConfig } from './grid-config';

const DEFAULT_PLAYER_ID = '0';

export function Board(props: BoardProps<GameState>) {
  const { playerID, G, ctx, moves } = props;
  const currentPlayerID = playerID ?? DEFAULT_PLAYER_ID;
  const { zones, entities, resources } = G.players[currentPlayerID];
  const { hand } = zones;

  const entitiesInHand = hand.entityIds.map((id) => entities[id]);
  const isMyTurn = ctx.currentPlayer === playerID;

  // Check if there's a pending target selection
  const pendingSelection = G.pendingTargetSelection;
  const showTargetModal = !!pendingSelection && isMyTurn;
  const validTargets = pendingSelection
    ? getValidTargets(pendingSelection.effect, G, ctx.currentPlayer)
    : [];

  // Get all player IDs for opponent zones
  const allPlayerIds = Object.keys(G.players);
  const playerCount = allPlayerIds.length;
  
  // Get grid configuration based on player count
  const gridConfig = getGridConfig(playerCount);

  return (
    <div
      className="h-screen p-4 bg-gray-900"
      style={{
        display: 'grid',
        gridTemplateAreas: gridConfig.gridTemplateAreas,
        gridTemplateColumns: gridConfig.gridTemplateColumns,
        gridTemplateRows: gridConfig.gridTemplateRows,
        gap: gridConfig.gap,
      }}
    >
      {/* Opponent Zones - Top half */}
      <div style={{ gridArea: 'opponents' }} className="overflow-hidden">
        <OpponentZones
          opponentIds={allPlayerIds}
          activeOpponentId={ctx.currentPlayer}
          currentPlayerId={currentPlayerID}
        />
      </div>

      {/* Game Stats - Center left */}
      <div style={{ gridArea: 'game-stats' }} className="overflow-auto">
        <GameStatsOverview
          currentTurn={ctx.turn}
          currentPlayer={ctx.currentPlayer}
          isMyTurn={isMyTurn}
        />
      </div>

      {/* Battlefield - Center */}
      <div style={{ gridArea: 'battlefield' }} className="overflow-auto">
        <BattlefieldZone />
      </div>

      {/* Player Resources - Center right */}
      <div style={{ gridArea: 'resources' }} className="overflow-auto">
        <PlayerResourceOverview
          resources={resources}
          playerName={`Player ${currentPlayerID}`}
        />
      </div>

      {/* Graveyard/Exile zones - Bottom left (stacked) */}
      <div style={{ gridArea: 'zones' }} className="flex flex-col gap-2 overflow-auto">
        <GraveyardZone />
        <ExileZone />
      </div>

      {/* Deck - Bottom right */}
      <div style={{ gridArea: 'deck' }} className="overflow-auto">
        <DeckZone />
      </div>

      {/* Hand - Bottom */}
      <div style={{ gridArea: 'hand' }} className="overflow-auto">
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">Hand</h3>
            <button
              onClick={() => moves[MoveType.END_TURN]()}
              disabled={!isMyTurn}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              End Turn
            </button>
          </div>
          <HandZone board={props} entities={entitiesInHand} />
        </div>
      </div>

      {showTargetModal && (
        <TargetSelectionModal
          gameState={G}
          validTargets={validTargets}
          onSelectTarget={(targetId) => moves[MoveType.SELECT_TARGET](targetId)}
        />
      )}
    </div>
  );
}

export default Board;

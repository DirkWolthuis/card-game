import { GameState, MoveType } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import { GameStatsOverview } from './zones/GameStatsOverview';
import { OpponentZones } from './zones/OpponentZones';
import { PlayerZones } from './zones/PlayerZones';
import { TargetSelectionModal } from './components/TargetSelectionModal';
import { EndGameScreen } from './components/EndGameScreen';
import { getValidTargets, getAllPlayerIds, getPlayerCount } from '@game/core';
import { getGridConfig } from './grid-config';

export function Board(props: BoardProps<GameState>) {
  const { playerID, G, ctx, moves } = props;
  const currentPlayerID = playerID as string;
  const { zones, entities, resources } = G.players[currentPlayerID];

  const isMyTurn = ctx.currentPlayer === playerID;

  // Check if there's a pending target selection
  const pendingSelection = G.pendingTargetSelection;
  const showTargetModal = !!pendingSelection && isMyTurn;
  const validTargets = pendingSelection
    ? getValidTargets(pendingSelection.effect, G, ctx.currentPlayer)
    : [];

  // Get all player IDs and count using utility functions
  const allPlayerIds = getAllPlayerIds(G);
  const playerCount = getPlayerCount(G);

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
          currentTurnPlayerId={ctx.currentPlayer}
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

      {/* Current Player Zones */}
      <PlayerZones
        playerId={currentPlayerID}
        zones={zones}
        entities={entities}
        resources={resources}
        isMyTurn={isMyTurn}
        board={props}
      />

      {showTargetModal && (
        <TargetSelectionModal
          gameState={G}
          validTargets={validTargets}
          onSelectTarget={(targetId) => moves[MoveType.SELECT_TARGET](targetId)}
        />
      )}

      {ctx.gameover && (
        <EndGameScreen
          gameState={G}
          gameover={ctx.gameover}
          currentPlayerId={currentPlayerID}
          totalTurns={ctx.turn}
        />
      )}
    </div>
  );
}

export default Board;

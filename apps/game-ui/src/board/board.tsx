import { GameState, MoveType } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import { HandZone } from './zones/HandZone';
import { TargetSelectionModal } from './components/TargetSelectionModal';
import { getValidTargets } from '@game/core';

const DEFAULT_PLAYER_ID = '0';

export function Board(props: BoardProps<GameState>) {
  const { playerID, G, ctx, moves } = props;
  const currentPlayerID = playerID ?? DEFAULT_PLAYER_ID;
  const { zones, entities } = G.players[currentPlayerID];
  const { hand } = zones;

  const entitiesInHand = hand.entityIds.map((id) => entities[id]);
  const isMyTurn = ctx.currentPlayer === playerID;

  // Check if there's a pending target selection
  const showTargetModal = !!G.pendingTargetSelection && isMyTurn;
  const validTargets = showTargetModal
    ? getValidTargets(G.pendingTargetSelection!.effect, G, currentPlayerID)
    : [];

  return (
    <div>
      <p>Player ID: {playerID}</p>
      <p>Current Turn: Player {ctx.currentPlayer}</p>
      <HandZone board={props} entities={entitiesInHand}></HandZone>
      <div className="mt-4">
        <button
          onClick={() => moves[MoveType.END_TURN]()}
          disabled={!isMyTurn}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          End Turn
        </button>
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

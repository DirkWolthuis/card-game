import { GameState, MoveType } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import { HandZone } from './zones/HandZone';

export function Board(props: BoardProps<GameState>) {
  const { playerID, G, ctx, moves } = props;
  const { zones, entities } = G.players[playerID ?? '0'];
  const { hand } = zones;

  const entitiesInHand = hand.entityIds.map((id) => entities[id]);
  const isMyTurn = ctx.currentPlayer === playerID;

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
    </div>
  );
}

export default Board;

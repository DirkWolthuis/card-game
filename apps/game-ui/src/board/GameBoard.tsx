import { GameState, MoveType } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';
import { PlayerZones } from './zones/PlayerZones';
import { TargetSelectionModal } from './components/TargetSelectionModal';
import { EndGameScreen } from './components/EndGameScreen';
import { SetupPhase } from './components/SetupPhase';
import { ChainDisplay } from './components/ChainDisplay';
import { getValidTargets } from '@game/core';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

function PanelResizeHandleWrapper() {
  return (
    <PanelResizeHandle className="flex items-center justify-center w-4 bg-white">
      <svg
        className="OG5fOa_Icon AzW8qW_ResizeHandleThumb"
        viewBox="0 0 24 24"
        data-direction="horizontal"
      >
        <path
          fill="currentColor"
          d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2m-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2m0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2"
        ></path>
      </svg>
    </PanelResizeHandle>
  );
}

export function GameBoard(props: BoardProps<GameState>) {
  const { playerID, G, ctx, moves } = props;
  const currentPlayerID = playerID as string;

  // Show setup phase if we're in the setup phase
  if (ctx.phase === 'setup') {
    return <SetupPhase {...props} playerID={currentPlayerID} />;
  }

  const { zones, entities, resources } = G.players[currentPlayerID];

  const isMyTurn = ctx.currentPlayer === playerID;

  // Check if there's a pending target selection
  const pendingSelection = G.pendingTargetSelection;
  const showTargetModal = !!pendingSelection && isMyTurn;
  
  // Determine which effect we're currently selecting a target for
  const currentEffect = pendingSelection
    ? pendingSelection.allEffects[
        pendingSelection.effectIndicesNeedingTargets[
          Object.keys(pendingSelection.selectedTargets).length
        ]
      ]
    : undefined;
  
  const validTargets =
    pendingSelection && currentEffect
      ? getValidTargets(currentEffect, G, ctx.currentPlayer)
      : [];

  // Check if there's an active chain
  const hasChain = !!G.chain;

  return (
    <>
      <div className="h-screen w-screen">
        <PanelGroup direction="vertical">
          <Panel defaultSize={50} maxSize={75}>
            Opponent
          </Panel>
          <PanelResizeHandleWrapper />
          <Panel defaultSize={50} maxSize={75}>
            <PlayerZones
              playerId={currentPlayerID}
              zones={zones}
              entities={entities}
              resources={resources}
              isMyTurn={isMyTurn}
              board={props}
            />
          </Panel>
        </PanelGroup>
      </div>

      {hasChain && G.chain && (
        <ChainDisplay 
          chain={G.chain} 
          currentPlayerId={currentPlayerID}
          board={props}
          numPlayers={ctx.numPlayers}
        />
      )}

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
    </>
  );
}

export default GameBoard;

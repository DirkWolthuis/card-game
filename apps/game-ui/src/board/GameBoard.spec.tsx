import { render } from '@testing-library/react';
import type { BoardProps } from 'boardgame.io/react';
import type { GameState } from '@game/models';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import GameBoard from './GameBoard';

describe('GameBoard', () => {
  it('should render successfully', () => {
    const mockBoard: Partial<BoardProps<GameState>> = {
      G: {
        players: {
          '0': {
            zones: {
              hand: { entityIds: [] },
              deck: { entityIds: [] },
              graveyard: { entityIds: [] },
              battlefield: { entityIds: [] },
              exile: { entityIds: [] },
            },
            entities: {},
            resources: {
              life: 20,
            },
          },
        },
      },
      ctx: {
        currentPlayer: '0',
        turn: 1,
        numPlayers: 1,
        playOrder: ['0'],
        playOrderPos: 0,
        phase: 'null',
        activePlayers: null,
      },
      moves: {},
      playerID: '0',
    };

    const { baseElement } = render(
      <DndProvider backend={HTML5Backend}>
        <GameBoard {...(mockBoard as BoardProps<GameState>)} />
      </DndProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});

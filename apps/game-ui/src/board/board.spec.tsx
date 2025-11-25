import { render } from '@testing-library/react';
import type { BoardProps } from 'boardgame.io/react';
import type { GameState } from '@game/models';

import Board from './board';

describe('Board', () => {
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
        phase: null,
        activePlayers: null,
      },
      moves: {},
      playerID: '0',
    };

    const { baseElement } = render(<Board {...(mockBoard as BoardProps<GameState>)} />);
    expect(baseElement).toBeTruthy();
  });
});

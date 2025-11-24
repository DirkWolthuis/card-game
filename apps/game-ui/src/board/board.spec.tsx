import { render } from '@testing-library/react';
import { GameState } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';

import Board from './board';

describe('Board', () => {
  it('should render successfully', () => {
    const mockBoard = {
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
      },
      moves: {},
      playerID: '0',
    } as BoardProps<GameState>;

    const { baseElement } = render(<Board {...mockBoard} />);
    expect(baseElement).toBeTruthy();
  });
});

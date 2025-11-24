import { render } from '@testing-library/react';
import { Entity, GameState } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';

import HandZone from './HandZone';

describe('HandZone', () => {
  it('should render successfully', () => {
    const mockEntities: Entity[] = [];
    const mockBoard: BoardProps<GameState> = {
      moves: {},
    } as BoardProps<GameState>;

    const { baseElement } = render(
      <HandZone board={mockBoard} entities={mockEntities} />
    );
    expect(baseElement).toBeTruthy();
  });
});

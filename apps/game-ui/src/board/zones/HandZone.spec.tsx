import { render } from '@testing-library/react';
import { Entity } from '@game/models';
import { BoardProps } from 'boardgame.io/dist/types/packages/react';

import HandZone from './HandZone';

describe('HandZone', () => {
  it('should render successfully', () => {
    const mockEntities: Entity[] = [];
    const mockBoard = {
      moves: {},
    } as unknown as BoardProps;

    const { baseElement } = render(
      <HandZone board={mockBoard} entities={mockEntities} />
    );
    expect(baseElement).toBeTruthy();
  });
});

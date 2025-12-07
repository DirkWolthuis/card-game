import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import BattlefieldZone from './BattlefieldZone';

describe('BattlefieldZone', () => {
  it('should render successfully', () => {
    const mockOnPlayCard = vi.fn();
    const mockOnPitchCard = vi.fn();

    const { baseElement } = render(
      <DndProvider backend={HTML5Backend}>
        <BattlefieldZone 
          onPlayCard={mockOnPlayCard} 
          onPitchCard={mockOnPitchCard}
          battlefieldEntities={[]}
        />
      </DndProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});

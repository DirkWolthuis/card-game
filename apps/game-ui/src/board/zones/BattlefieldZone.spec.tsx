import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import BattlefieldZone from './BattlefieldZone';

// Detect if the device supports touch
const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

describe('BattlefieldZone', () => {
  it('should render successfully', () => {
    const mockOnPlayCard = vi.fn();
    const mockOnPitchCard = vi.fn();
    
    // Use TouchBackend for touch devices, HTML5Backend otherwise
    const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

    const { baseElement } = render(
      <DndProvider backend={backend}>
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

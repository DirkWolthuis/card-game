import { render } from '@testing-library/react';
import { Card as CardModel, CardType, Entity } from '@game/models';
import { vi } from 'vitest';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Card from './Card';

describe('Card', () => {
  it('should render successfully', () => {
    const mockCard: CardModel = {
      id: 'test-card-1',
      name: 'Test Card',
      displayText: 'Test card description',
      types: [CardType.SPELL],
      effects: [],
      pitchValue: 1,
      manaCost: 2,
    };
    const mockEntity: Entity = {
      id: 'entity-1',
      cardId: 'test-card-1',
      ownerId: 'player-1',
      controllerId: 'player-1',
    };
    const mockOnPlayCard = vi.fn();

    const { baseElement } = render(
      <DndProvider backend={HTML5Backend}>
        <Card card={mockCard} entity={mockEntity} onPlayCard={mockOnPlayCard} />
      </DndProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});

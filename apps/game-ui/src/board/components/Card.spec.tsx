import { render } from '@testing-library/react';
import { Card as CardModel } from '@game/models';
import { vi } from 'vitest';

import Card from './Card';

describe('Card', () => {
  it('should render successfully', () => {
    const mockCard: CardModel = {
      id: 'test-card-1',
      name: 'Test Card',
      displayText: 'Test card description',
      effects: [],
    };
    const mockOnPlayCard = vi.fn();

    const { baseElement } = render(
      <Card card={mockCard} onPlayCard={mockOnPlayCard} />
    );
    expect(baseElement).toBeTruthy();
  });
});

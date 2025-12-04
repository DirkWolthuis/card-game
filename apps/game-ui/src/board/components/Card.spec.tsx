import { render, screen, fireEvent } from '@testing-library/react';
import { Card as CardModel, CardType } from '@game/models';
import { vi } from 'vitest';

import Card from './Card';

describe('Card', () => {
  const createMockCard = (overrides: Partial<CardModel> = {}): CardModel => ({
    id: 'test-card-1',
    name: 'Test Card',
    displayText: 'Test card description',
    effects: [],
    cardType: CardType.SPELL,
    cost: 3,
    pitchValue: 1,
    ...overrides,
  });

  it('should render successfully', () => {
    const mockCard = createMockCard();
    const mockOnPlayCard = vi.fn();

    const { baseElement } = render(
      <Card card={mockCard} onPlayCard={mockOnPlayCard} />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display card name', () => {
    const mockCard = createMockCard({ name: 'Firebolt' });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    expect(screen.getByText('Firebolt')).toBeTruthy();
  });

  it('should display card cost', () => {
    const mockCard = createMockCard({ cost: 5 });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    expect(screen.getByText('5')).toBeTruthy();
  });

  it('should display card display text', () => {
    const mockCard = createMockCard({ displayText: 'Deal 2 damage' });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    expect(screen.getByText('Deal 2 damage')).toBeTruthy();
  });

  it('should display pitch value', () => {
    const mockCard = createMockCard({ pitchValue: 2 });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    // Pitch value should be displayed
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('should display card type badge', () => {
    const mockCard = createMockCard({ cardType: CardType.LEADER });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    expect(screen.getByText('leader')).toBeTruthy();
  });

  it('should display attack and health for unit cards', () => {
    const mockCard = createMockCard({
      cardType: CardType.LEADER,
      attack: 4,
      health: 6,
    });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getByText('6')).toBeTruthy();
    expect(screen.getByLabelText('Attack')).toBeTruthy();
    expect(screen.getByLabelText('Health')).toBeTruthy();
  });

  it('should not display attack/health for spell cards without stats', () => {
    const mockCard = createMockCard({ cardType: CardType.SPELL });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    expect(screen.queryByLabelText('Attack')).toBeNull();
    expect(screen.queryByLabelText('Health')).toBeNull();
  });

  it('should call onPlayCard when play button is clicked', () => {
    const mockCard = createMockCard();
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    const playButton = screen.getByText('Play Card');
    fireEvent.click(playButton);

    expect(mockOnPlayCard).toHaveBeenCalledTimes(1);
  });

  it('should call onPlayCard when card is clicked', () => {
    const mockCard = createMockCard();
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    const card = screen.getByTestId('card');
    fireEvent.click(card);

    expect(mockOnPlayCard).toHaveBeenCalledTimes(1);
  });

  it('should display art placeholder when no artUrl is provided', () => {
    const mockCard = createMockCard({ artUrl: undefined });
    const mockOnPlayCard = vi.fn();

    render(<Card card={mockCard} onPlayCard={mockOnPlayCard} />);

    expect(screen.getByText('Art Placeholder')).toBeTruthy();
  });
});

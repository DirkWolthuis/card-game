import { render, screen } from '@testing-library/react';
import { OpponentZones } from './OpponentZones';

describe('OpponentZones', () => {
  it('should render nothing when no opponents', () => {
    const { container } = render(
      <OpponentZones
        opponentIds={['0']}
        currentPlayerId="0"
        currentTurnPlayerId="0"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render opponent zones with current turn player as active', () => {
    render(
      <OpponentZones
        opponentIds={['0', '1', '2']}
        currentPlayerId="0"
        currentTurnPlayerId="1"
      />
    );

    expect(screen.getByText(/player 1/i)).toBeTruthy();
    expect(screen.getByText(/active opponent/i)).toBeTruthy();
  });

  it('should render multiple opponents', () => {
    render(
      <OpponentZones
        opponentIds={['0', '1', '2', '3']}
        currentPlayerId="0"
        currentTurnPlayerId="1"
      />
    );

    expect(screen.getByText(/player 1/i)).toBeTruthy();
    expect(screen.getByText(/player 2/i)).toBeTruthy();
    expect(screen.getByText(/player 3/i)).toBeTruthy();
  });

  it('should not show current player as opponent when it is their turn', () => {
    const { container } = render(
      <OpponentZones
        opponentIds={['0', '1']}
        currentPlayerId="0"
        currentTurnPlayerId="0"
      />
    );

    // Player 1 should be the only opponent shown
    expect(screen.getByText(/player 1/i)).toBeTruthy();
    // Player 0 should not appear in opponent zones
    expect(container.textContent).not.toContain('Player 0');
  });
});

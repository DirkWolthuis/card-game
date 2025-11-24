import { render, screen } from '@testing-library/react';
import { OpponentZones } from './OpponentZones';

describe('OpponentZones', () => {
  it('should render nothing when no opponents', () => {
    const { container } = render(
      <OpponentZones
        opponentIds={['0']}
        currentPlayerId="0"
        activeOpponentId="0"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render opponent zones', () => {
    render(
      <OpponentZones
        opponentIds={['0', '1', '2']}
        currentPlayerId="0"
        activeOpponentId="1"
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
        activeOpponentId="1"
      />
    );

    expect(screen.getByText(/player 1/i)).toBeTruthy();
    expect(screen.getByText(/player 2/i)).toBeTruthy();
    expect(screen.getByText(/player 3/i)).toBeTruthy();
  });
});

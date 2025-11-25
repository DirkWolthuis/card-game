import { render, screen } from '@testing-library/react';
import { GameStatsOverview } from './GameStatsOverview';

describe('GameStatsOverview', () => {
  it('should render game statistics', () => {
    render(
      <GameStatsOverview currentTurn={5} currentPlayer="1" isMyTurn={false} />
    );

    expect(screen.getByText(/game stats/i)).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText(/player 1/i)).toBeTruthy();
    expect(screen.getByText(/no/i)).toBeTruthy();
  });

  it('should show when it is player turn', () => {
    render(
      <GameStatsOverview currentTurn={1} currentPlayer="0" isMyTurn={true} />
    );

    expect(screen.getByText(/yes/i)).toBeTruthy();
  });
});

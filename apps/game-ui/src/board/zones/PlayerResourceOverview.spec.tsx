import { render, screen } from '@testing-library/react';
import { PlayerResourceOverview } from './PlayerResourceOverview';

describe('PlayerResourceOverview', () => {
  it('should render resource information', () => {
    const resources = { life: 20 };
    render(<PlayerResourceOverview resources={resources} />);

    expect(screen.getByText(/life/i)).toBeTruthy();
    expect(screen.getByText('20')).toBeTruthy();
  });

  it('should render player name when provided', () => {
    const resources = { life: 20 };
    render(
      <PlayerResourceOverview resources={resources} playerName="Test Player" />
    );

    expect(screen.getByText(/test player resources/i)).toBeTruthy();
  });

  it('should render default player name when not provided', () => {
    const resources = { life: 20 };
    render(<PlayerResourceOverview resources={resources} />);

    expect(screen.getByText(/player resources/i)).toBeTruthy();
  });
});

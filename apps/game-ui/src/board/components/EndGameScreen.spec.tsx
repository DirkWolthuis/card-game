import { render, screen } from '@testing-library/react';
import { EndGameScreen } from './EndGameScreen';
import { GameState } from '@game/models';

describe('EndGameScreen', () => {
  const mockGameState: GameState = {
    players: {
      '0': {
        resources: { life: 5 },
        zones: {
          hand: { entityIds: [] },
          deck: { entityIds: [] },
          battlefield: { entityIds: [] },
          graveyard: { entityIds: [] },
          exile: { entityIds: [] },
        },
        entities: {},
      },
      '1': {
        resources: { life: 0 },
        zones: {
          hand: { entityIds: [] },
          deck: { entityIds: [] },
          battlefield: { entityIds: [] },
          graveyard: { entityIds: [] },
          exile: { entityIds: [] },
        },
        entities: {},
      },
    },
  };

  it('should render victory message when current player wins', () => {
    render(
      <EndGameScreen
        gameState={mockGameState}
        gameover={{ winner: '0' }}
        currentPlayerId="0"
        totalTurns={10}
      />
    );

    expect(screen.getByText('🎉 Victory!')).toBeTruthy();
    expect(screen.getByText('Player 0')).toBeTruthy();
  });

  it('should render defeat message when current player loses', () => {
    render(
      <EndGameScreen
        gameState={mockGameState}
        gameover={{ winner: '0' }}
        currentPlayerId="1"
        totalTurns={10}
      />
    );

    expect(screen.getByText('💀 Defeat')).toBeTruthy();
  });

  it('should display game summary with total turns and player count', () => {
    render(
      <EndGameScreen
        gameState={mockGameState}
        gameover={{ winner: '0' }}
        currentPlayerId="0"
        totalTurns={15}
      />
    );

    expect(screen.getByText('Game Summary')).toBeTruthy();
    expect(screen.getByText('Total Turns:')).toBeTruthy();
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText('Players:')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy();
  });

  it('should display final life totals for all players', () => {
    render(
      <EndGameScreen
        gameState={mockGameState}
        gameover={{ winner: '0' }}
        currentPlayerId="0"
        totalTurns={10}
      />
    );

    expect(screen.getByText('Final Life Totals')).toBeTruthy();
    expect(screen.getByText('5 HP')).toBeTruthy();
    expect(screen.getByText('0 HP')).toBeTruthy();
  });

  it('should highlight the winner with crown emoji', () => {
    render(
      <EndGameScreen
        gameState={mockGameState}
        gameover={{ winner: '0' }}
        currentPlayerId="0"
        totalTurns={10}
      />
    );

    expect(screen.getByText(/Player 0.*👑/)).toBeTruthy();
  });
});

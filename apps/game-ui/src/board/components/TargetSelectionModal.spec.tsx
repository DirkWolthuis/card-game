import { render, screen } from '@testing-library/react';
import { TargetSelectionModal } from './TargetSelectionModal';
import { GameState } from '@game/models';
import { vi } from 'vitest';

describe('TargetSelectionModal', () => {
  it('should render modal with player options', () => {
    const mockGameState: GameState = {
      players: {
        '0': {
          resources: { life: 20 },
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
          resources: { life: 15 },
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

    const mockOnSelectTarget = vi.fn();

    const { baseElement } = render(
      <TargetSelectionModal
        gameState={mockGameState}
        validTargets={['0', '1']}
        onSelectTarget={mockOnSelectTarget}
      />
    );

    expect(baseElement).toBeTruthy();
    expect(screen.getByText('Select a Target')).toBeTruthy();
    expect(screen.getByText('Player 0')).toBeTruthy();
    expect(screen.getByText('Player 1')).toBeTruthy();
    expect(screen.getByText('Life: 20')).toBeTruthy();
    expect(screen.getByText('Life: 15')).toBeTruthy();
  });
});

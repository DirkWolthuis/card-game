import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SetupPhase } from './SetupPhase';
import { GameState } from '@game/models';
import type { BoardProps } from 'boardgame.io/react';

// Mock the game data module
vi.mock('@game/data', () => ({
  getAllPreconstructedDecks: () => [
    {
      id: 'aggro-red',
      name: 'Aggressive Red',
      description: 'Fast-paced deck focused on dealing direct damage',
      cardIds: Array(20).fill('card-1'),
    },
    {
      id: 'control-white',
      name: 'Control White',
      description: 'Defensive deck focused on healing and controlling the board',
      cardIds: Array(20).fill('card-2'),
    },
  ],
  getSelectablePreconstructedDecks: () => [
    {
      id: 'aggro-red',
      name: 'Aggressive Red',
      description: 'Fast-paced deck focused on dealing direct damage',
      cardIds: Array(20).fill('card-1'),
    },
    {
      id: 'control-white',
      name: 'Control White',
      description: 'Defensive deck focused on healing and controlling the board',
      cardIds: Array(20).fill('card-2'),
    },
  ],
}));

describe('SetupPhase', () => {
  const createMockProps = (overrides?: Partial<BoardProps<GameState>>): BoardProps<GameState> => {
    const defaultProps: BoardProps<GameState> = {
      G: {
        players: {},
        setupData: {
          playerSetup: {
            '0': { name: undefined, selectedDeckIds: [], isReady: false },
            '1': { name: undefined, selectedDeckIds: [], isReady: false },
          },
        },
      },
      ctx: {
        currentPlayer: '0',
        numPlayers: 2,
        playOrder: ['0', '1'],
        playOrderPos: 0,
        activePlayers: null,
        turn: 1,
        phase: 'setup',
      } as any,
      moves: {
        setPlayerName: vi.fn(),
        selectDeck: vi.fn(),
        setReady: vi.fn(),
      } as any,
      events: {} as any,
      reset: vi.fn(),
      undo: vi.fn(),
      redo: vi.fn(),
      log: [],
      playerID: '0',
      matchData: undefined,
      chatMessages: [],
      sendChatMessage: vi.fn(),
      matchID: 'test-match',
      isActive: true,
      isMultiplayer: false,
      isConnected: true,
      credentials: undefined,
      ...overrides,
    };
    return defaultProps;
  };

  it('should render player name input', () => {
    const props = createMockProps();
    render(<SetupPhase {...props} playerID="0" />);
    
    const nameInput = screen.getByPlaceholderText('Enter your name');
    expect(nameInput).toBeTruthy();
  });

  it('should render deck selection cards', () => {
    const props = createMockProps();
    render(<SetupPhase {...props} playerID="0" />);
    
    expect(screen.getByText('Aggressive Red')).toBeTruthy();
    expect(screen.getByText('Control White')).toBeTruthy();
  });

  it('should display ready button as disabled when requirements not met', () => {
    const props = createMockProps();
    render(<SetupPhase {...props} playerID="0" />);
    
    const readyButton = screen.getByText('Ready to Start');
    expect(readyButton.hasAttribute('disabled')).toBe(true);
  });

  it('should show player name when set', () => {
    const props = createMockProps({
      G: {
        players: {},
        setupData: {
          playerSetup: {
            '0': { name: 'Alice', selectedDeckIds: [], isReady: false },
            '1': { name: undefined, selectedDeckIds: [], isReady: false },
          },
        },
      },
    });
    render(<SetupPhase {...props} playerID="0" />);
    
    expect(screen.getByText('✓ Name set: Alice')).toBeTruthy();
  });
});

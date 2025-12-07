import { pitchCard } from './resource-moves';
import { GameState, PlayerState } from '@game/models';
import { INVALID_MOVE } from 'boardgame.io/core';
import type { FnContext } from 'boardgame.io';

// Type helper for calling move functions
const callMove = <T>(
  moveFn: unknown,
  context: Partial<FnContext<GameState>>,
  arg?: T
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (moveFn as (ctx: FnContext<GameState>, arg: T) => any)(
    context as FnContext<GameState>,
    arg as T
  );
};

describe('resource-moves', () => {
  const createPlayerState = (
    handEntityIds: string[] = [],
    pitchEntityIds: string[] = [],
    mana = 0
  ): PlayerState => ({
    resources: { life: 20, mana },
    zones: {
      hand: { entityIds: [...handEntityIds] },
      deck: { entityIds: [] },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [] },
      exile: { entityIds: [] },
      pitch: { entityIds: [...pitchEntityIds] },
    },
    entities: {
      'hand-1': { id: 'hand-1', cardId: 'aaaa', ownerId: '0', controllerId: '0' },
      'hand-2': { id: 'hand-2', cardId: 'bbb', ownerId: '0', controllerId: '0' },
      'hand-3': { id: 'hand-3', cardId: 'cccc', ownerId: '0', controllerId: '0' },
    },
  });

  describe('pitchCard', () => {
    it('should move a card from hand to pitch zone', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1', 'hand-2'], [], 0),
        },
      };

      const result = callMove(
        pitchCard,
        {
          G: gameState,
          playerID: '0',
        },
        'hand-1'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-2']);
      expect(gameState.players['0'].zones.pitch.entityIds).toEqual(['hand-1']);
    });

    it('should add pitch value to mana pool (pitch value 1)', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], [], 0),
        },
      };

      callMove(
        pitchCard,
        {
          G: gameState,
          playerID: '0',
        },
        'hand-1'
      );

      // Card 'aaaa' has pitch value 1
      expect(gameState.players['0'].resources.mana).toBe(1);
    });

    it('should add pitch value to mana pool (pitch value 2)', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-2'], [], 0),
        },
      };

      callMove(
        pitchCard,
        {
          G: gameState,
          playerID: '0',
        },
        'hand-2'
      );

      // Card 'bbb' has pitch value 2
      expect(gameState.players['0'].resources.mana).toBe(2);
    });

    it('should add pitch value to mana pool (pitch value 3)', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-3'], [], 0),
        },
      };

      callMove(
        pitchCard,
        {
          G: gameState,
          playerID: '0',
        },
        'hand-3'
      );

      // Card 'cccc' has pitch value 3
      expect(gameState.players['0'].resources.mana).toBe(3);
    });

    it('should accumulate mana when pitching multiple cards', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1', 'hand-2', 'hand-3'], [], 0),
        },
      };

      // Pitch first card (value 1)
      callMove(pitchCard, { G: gameState, playerID: '0' }, 'hand-1');
      expect(gameState.players['0'].resources.mana).toBe(1);

      // Pitch second card (value 2)
      callMove(pitchCard, { G: gameState, playerID: '0' }, 'hand-2');
      expect(gameState.players['0'].resources.mana).toBe(3);

      // Pitch third card (value 3)
      callMove(pitchCard, { G: gameState, playerID: '0' }, 'hand-3');
      expect(gameState.players['0'].resources.mana).toBe(6);
    });

    it('should return INVALID_MOVE if card is not in hand', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], [], 0),
        },
      };

      const result = callMove(
        pitchCard,
        {
          G: gameState,
          playerID: '0',
        },
        'non-existent'
      );

      expect(result).toBe(INVALID_MOVE);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-1']);
      expect(gameState.players['0'].zones.pitch.entityIds).toEqual([]);
      expect(gameState.players['0'].resources.mana).toBe(0);
    });

    it('should pitch cards from the correct player', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], [], 0),
          '1': {
            resources: { life: 20, mana: 5 },
            zones: {
              hand: { entityIds: ['hand-1-p1'] },
              deck: { entityIds: [] },
              battlefield: { entityIds: [] },
              graveyard: { entityIds: [] },
              exile: { entityIds: [] },
              pitch: { entityIds: [] },
            },
            entities: {
              'hand-1-p1': { id: 'hand-1-p1', cardId: 'aaaa', ownerId: '1', controllerId: '1' },
            },
          },
        },
      };

      callMove(
        pitchCard,
        {
          G: gameState,
          playerID: '1',
        },
        'hand-1-p1'
      );

      // Player 0's state should be unchanged
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-1']);
      expect(gameState.players['0'].zones.pitch.entityIds).toEqual([]);
      expect(gameState.players['0'].resources.mana).toBe(0);

      // Player 1 should have pitched the card
      expect(gameState.players['1'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['1'].zones.pitch.entityIds).toEqual(['hand-1-p1']);
      expect(gameState.players['1'].resources.mana).toBe(6); // 5 + 1
    });
  });
});

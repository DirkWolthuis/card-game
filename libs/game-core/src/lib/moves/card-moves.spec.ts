import { playCardFromHand } from './card-moves';
import { GameState, PlayerState, AbilityType } from '@game/models';
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

describe('card-moves', () => {
  const createPlayerState = (
    handEntityIds: string[] = [],
    mana = 0
  ): PlayerState => ({
    resources: { life: 20, mana },
    zones: {
      hand: { entityIds: [...handEntityIds] },
      deck: { entityIds: [] },
      battlefield: { entityIds: [] },
      graveyard: { entityIds: [] },
      exile: { entityIds: [] },
      pitch: { entityIds: [] },
    },
    entities: {
      'hand-1': { id: 'hand-1', cardId: 'aaaa', ownerId: '0', controllerId: '0' }, // Firebolt - cost 1
      'hand-2': { id: 'hand-2', cardId: 'bbb', ownerId: '0', controllerId: '0' }, // Divine touch - cost 2
      'hand-3': { id: 'hand-3', cardId: 'cccc', ownerId: '0', controllerId: '0' }, // Kill - cost 5
      'hand-4': { id: 'hand-4', cardId: 'dddd', ownerId: '0', controllerId: '0' }, // 20 Damage Spell - cost 3
    },
  });

  describe('playCardFromHand - mana cost', () => {
    it('should allow playing a card when player has exact mana cost', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 1), // 1 mana for Firebolt (cost 1)
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-1'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['0'].resources.mana).toBe(0); // 1 - 1 = 0
    });

    it('should allow playing a card when player has more than enough mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 5), // 5 mana for Firebolt (cost 1)
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-1'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['0'].resources.mana).toBe(4); // 5 - 1 = 4
    });

    it('should not allow playing a card when player has insufficient mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-2'], 1), // 1 mana for Divine touch (cost 2)
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-2'
      );

      expect(result).toBe(INVALID_MOVE);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-2']);
      expect(gameState.players['0'].resources.mana).toBe(1); // Unchanged
    });

    it('should not allow playing a card when player has zero mana but card costs mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 0), // 0 mana for Firebolt (cost 1)
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-1'
      );

      expect(result).toBe(INVALID_MOVE);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-1']);
      expect(gameState.players['0'].resources.mana).toBe(0); // Unchanged
    });

    it('should correctly reduce mana for expensive cards', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-3'], 5), // 5 mana for Kill (cost 5)
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-3'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['0'].resources.mana).toBe(0); // 5 - 5 = 0
    });

    it('should not allow playing expensive card with insufficient mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-3'], 4), // 4 mana for Kill (cost 5)
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-3'
      );

      expect(result).toBe(INVALID_MOVE);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-3']);
      expect(gameState.players['0'].resources.mana).toBe(4); // Unchanged
    });

    it('should allow playing multiple cards sequentially if enough mana', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1', 'hand-2'], 5), // 5 mana for 2 cards
          '1': createPlayerState([], 0),
        },
      };

      // Play first card (Firebolt - cost 1)
      callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-1'
      );

      expect(gameState.players['0'].resources.mana).toBe(4); // 5 - 1 = 4
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-2']);

      // Play second card (Divine touch - cost 2)
      callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-2'
      );

      expect(gameState.players['0'].resources.mana).toBe(2); // 4 - 2 = 2
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
    });

    it('should not reduce mana if card is not in hand', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 5),
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'non-existent'
      );

      expect(result).toBe(INVALID_MOVE);
      expect(gameState.players['0'].resources.mana).toBe(5); // Unchanged
    });
  });

  describe('playCardFromHand - unit cards', () => {
    it('should place a leader card on the battlefield when played', () => {
      const gameState: GameState = {
        players: {
          '0': {
            ...createPlayerState([], 3),
            zones: {
              ...createPlayerState([], 3).zones,
              hand: { entityIds: ['unit-1'] },
            },
            entities: {
              'unit-1': { id: 'unit-1', cardId: 'leader-1', ownerId: '0', controllerId: '0' }, // Knight Commander - cost 3
            },
          },
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'unit-1'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['0'].zones.battlefield.entityIds).toEqual(['unit-1']);
      expect(gameState.players['0'].resources.mana).toBe(0); // 3 - 3 = 0
    });

    it('should place a troop card on the battlefield when played', () => {
      const gameState: GameState = {
        players: {
          '0': {
            ...createPlayerState([], 1),
            zones: {
              ...createPlayerState([], 1).zones,
              hand: { entityIds: ['unit-2'] },
            },
            entities: {
              'unit-2': { id: 'unit-2', cardId: 'troop-1', ownerId: '0', controllerId: '0' }, // Foot Soldier - cost 1
            },
          },
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'unit-2'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['0'].zones.battlefield.entityIds).toEqual(['unit-2']);
      expect(gameState.players['0'].resources.mana).toBe(0); // 1 - 1 = 0
    });

    it('should not place spell cards on the battlefield', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 1), // Firebolt spell
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-1'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['0'].zones.battlefield.entityIds).toEqual([]);
    });

    it('should place multiple unit cards on the battlefield', () => {
      const gameState: GameState = {
        players: {
          '0': {
            ...createPlayerState([], 10),
            zones: {
              ...createPlayerState([], 10).zones,
              hand: { entityIds: ['unit-1', 'unit-2'] },
            },
            entities: {
              'unit-1': { id: 'unit-1', cardId: 'leader-1', ownerId: '0', controllerId: '0' }, // Knight Commander - cost 3
              'unit-2': { id: 'unit-2', cardId: 'troop-1', ownerId: '0', controllerId: '0' }, // Foot Soldier - cost 1
            },
          },
          '1': createPlayerState([], 0),
        },
      };

      // Play first unit
      callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'unit-1'
      );

      expect(gameState.players['0'].zones.battlefield.entityIds).toEqual(['unit-1']);
      expect(gameState.players['0'].resources.mana).toBe(7); // 10 - 3 = 7

      // Play second unit
      callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'unit-2'
      );

      expect(gameState.players['0'].zones.battlefield.entityIds).toEqual(['unit-1', 'unit-2']);
      expect(gameState.players['0'].resources.mana).toBe(6); // 7 - 1 = 6
    });
  });

  describe('playCardFromHand - multiple triggered abilities', () => {
    it('should handle card with multiple triggered abilities that need targets', () => {
      // NOTE: Current implementation limitation - only first ability with targeting executes
      // Multiple abilities with targeting is not yet fully supported
      // This test documents the current behavior
      
      const gameState: GameState = {
        players: {
          '0': {
            ...createPlayerState([], 5),
            zones: {
              ...createPlayerState([], 5).zones,
              hand: { entityIds: ['multi-ability-card'] },
            },
            entities: {
              'multi-ability-card': { 
                id: 'multi-ability-card', 
                cardId: 'test-multi-ability',
                ownerId: '0', 
                controllerId: '0' 
              },
            },
          },
          '1': createPlayerState([], 0),
        },
      };

      // Mock a card with multiple triggered abilities
      // This would need to be added to the actual game data to fully test
      // For now, this test documents the expected behavior
      
      // When a card has multiple triggered abilities that need targeting:
      // 1. First ability sets up pendingTargetSelection
      // 2. Loop breaks, so second ability is not processed
      // 3. After target selection completes, second ability is never executed
      // 
      // TODO: Fix this limitation - see comment thread on PR
      
      // This is a known limitation that will be addressed in a future update
    });
  });

  describe('playCardFromHand - priority validation', () => {
    it('should reject action when player does not have priority', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 5),
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any, // Player 0 has priority
          playerID: '1', // But player 1 is trying to act
        },
        'hand-1'
      );

      expect(result).toBe(INVALID_MOVE);
      // State should not change
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-1']);
      expect(gameState.players['0'].resources.mana).toBe(5); // Unchanged
    });

    it('should allow action when player has priority', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 5),
          '1': createPlayerState([], 0),
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0', // Same player has priority and is acting
        },
        'hand-1'
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual([]);
      expect(gameState.players['0'].resources.mana).toBe(4); // 5 - 1 = 4
    });

    it('should validate priority before checking mana cost', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 0), // No mana
          '1': createPlayerState([], 0),
        },
      };

      // Wrong player tries to act
      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '1', // Player 1 trying to act when player 0 has priority
        },
        'hand-1'
      );

      expect(result).toBe(INVALID_MOVE);
      // Should fail on priority check, not mana check
      // State should remain unchanged
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-1']);
    });
  });

  describe('playCardFromHand - chain interactions', () => {
    it('should allow playing spell card when chain is active but not locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1', 'hand-2'], 3), // 3 mana, has Firebolt and Divine touch
          '1': createPlayerState([], 0),
        },
        chain: {
          links: [
            {
              ability: {
                type: AbilityType.TRIGGERED,
                description: 'Test',
                effects: [],
              },
              playerId: '1',
              effects: [],
            },
          ],
          consecutivePasses: {},
          isLocked: false, // Chain is active but not locked
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-1' // Play Firebolt (cost 1) - requires target selection
      );

      expect(result).toBe(gameState);
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-2']);
      expect(gameState.players['0'].resources.mana).toBe(2); // 3 - 1 = 2
      // Chain should still have 1 link (Firebolt not added yet - waiting for target selection)
      expect(gameState.chain?.links.length).toBe(1);
      // pendingTargetSelection should be set with isForChain: true
      expect(gameState.pendingTargetSelection).toBeDefined();
      expect(gameState.pendingTargetSelection?.isForChain).toBe(true);
      expect(gameState.pendingTargetSelection?.chainPlayerId).toBe('0');
    });

    it('should not allow playing spell card when chain is locked', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(['hand-1'], 3), // 3 mana, has Firebolt
          '1': createPlayerState([], 0),
        },
        chain: {
          links: [
            {
              ability: {
                type: AbilityType.TRIGGERED,
                description: 'Test',
                effects: [],
              },
              playerId: '1',
              effects: [],
            },
          ],
          consecutivePasses: {},
          isLocked: true, // Chain is locked (resolving)
          resolutionIndex: 0,
        },
      };

      const result = callMove(
        playCardFromHand,
        {
          G: gameState,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ctx: { currentPlayer: '0' } as any,
          playerID: '0',
        },
        'hand-1'
      );

      expect(result).toBe(INVALID_MOVE);
      // State should remain unchanged
      expect(gameState.players['0'].zones.hand.entityIds).toEqual(['hand-1']);
      expect(gameState.players['0'].resources.mana).toBe(3);
    });
  });
});

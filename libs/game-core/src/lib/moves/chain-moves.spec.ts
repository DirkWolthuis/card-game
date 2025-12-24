import { passPriority } from './chain-moves';
import { GameState, PlayerState, Ability, AbilityType, EffectType, TargetType } from '@game/models';
import { INVALID_MOVE } from 'boardgame.io/core';
import type { FnContext, Ctx } from 'boardgame.io';
import { startChain } from '../chain/chain-manager';

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

const createPlayerState = (): PlayerState => ({
  resources: { life: 20, mana: 5 },
  zones: {
    hand: { entityIds: [] },
    deck: { entityIds: [] },
    battlefield: { entityIds: [] },
    graveyard: { entityIds: [] },
    exile: { entityIds: [] },
    pitch: { entityIds: [] },
  },
  entities: {},
});

const createMockCtx = (numPlayers = 2): Ctx => ({
  numPlayers,
  playOrder: ['0', '1'],
  playOrderPos: 0,
  currentPlayer: '0',
  turn: 1,
  phase: 'play',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

const createTestAbility = (description: string): Ability => ({
  type: AbilityType.TRIGGERED,
  description,
  effects: [
    {
      type: EffectType.DEAL_DAMAGE,
      target: TargetType.OPPONENT,
      value: 2,
    },
  ],
});

describe('chain-moves', () => {
  describe('passPriority', () => {
    it('should return INVALID_MOVE when there is no active chain', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ctx = createMockCtx();

      const result = callMove(passPriority, {
        G: gameState,
        ctx,
        playerID: '0',
      });

      expect(result).toBe(INVALID_MOVE);
    });

    it('should mark player as having passed priority', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects);

      const ctx = createMockCtx();

      const result = callMove(passPriority, {
        G: gameState,
        ctx,
        playerID: '0',
      });

      expect(result).not.toBe(INVALID_MOVE);
      expect(gameState.chain?.consecutivePasses['0']).toBe(true);
    });

    it('should lock chain and resolve when all players pass', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects, { 0: '1' });

      const ctx = createMockCtx();

      // First player passes
      callMove(passPriority, {
        G: gameState,
        ctx,
        playerID: '0',
      });

      expect(gameState.chain?.isLocked).toBe(false);

      // Second player passes - should lock and resolve
      callMove(passPriority, {
        G: gameState,
        ctx,
        playerID: '1',
      });

      // Chain should be cleared after resolution
      expect(gameState.chain).toBeUndefined();
    });

    it('should not lock chain if only one player passes in multi-player game', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
          '2': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects, { 0: '1' });

      const ctx = {
        numPlayers: 3,
        playOrder: ['0', '1', '2'],
        playOrderPos: 0,
        currentPlayer: '0',
        turn: 1,
        phase: 'play',
      } as Ctx;

      // First player passes
      callMove(passPriority, {
        G: gameState,
        ctx,
        playerID: '0',
      });

      expect(gameState.chain?.isLocked).toBe(false);
      expect(gameState.chain?.consecutivePasses['0']).toBe(true);

      // Second player passes
      callMove(passPriority, {
        G: gameState,
        ctx,
        playerID: '1',
      });

      expect(gameState.chain?.isLocked).toBe(false);
      expect(gameState.chain?.consecutivePasses['1']).toBe(true);
    });

    it('should properly execute effects when chain resolves', () => {
      const gameState: GameState = {
        players: {
          '0': createPlayerState(),
          '1': createPlayerState(),
        },
      };

      const ability = createTestAbility('Test ability');
      startChain(gameState, ability, '0', ability.effects, { 0: '1' });

      const ctx = createMockCtx();
      const initialLife = gameState.players['1'].resources.life;

      // Both players pass
      callMove(passPriority, { G: gameState, ctx, playerID: '0' });
      callMove(passPriority, { G: gameState, ctx, playerID: '1' });

      // Effect should have executed (2 damage to player 1)
      expect(gameState.players['1'].resources.life).toBe(initialLife - 2);
    });
  });
});

import { Effect, EffectType, GameState } from '@game/models';
import { Ctx } from 'boardgame.io';

export const executeEffect = (
  gameState: GameState,
  ctx: Ctx,
  effect: Effect,
  targetPlayerId?: string
): void => {
  switch (effect.type) {
    case EffectType.DEAL_DAMAGE: {
      if (!targetPlayerId) {
        throw new Error('Target player ID is required for DEAL_DAMAGE effect');
      }
      gameState.players[targetPlayerId].resources.life -= effect.value;
      break;
    }
    case EffectType.HEAL: {
      // HEAL always targets self
      gameState.players[ctx.currentPlayer].resources.life += effect.value;
      break;
    }
  }
};

import { Effect, EffectType, GameState, TargetType } from '@game/models';
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
        throw new Error(
          `Target player ID is required for ${EffectType[effect.type]} effect with target type ${TargetType[effect.target]}`
        );
      }
      gameState.players[targetPlayerId].resources.life -= effect.value;
      break;
    }
    case EffectType.HEAL: {
      // HEAL effects currently always target the player who played the card
      // In the future, this could be extended to support other targets
      gameState.players[ctx.currentPlayer].resources.life += effect.value;
      break;
    }
  }
};

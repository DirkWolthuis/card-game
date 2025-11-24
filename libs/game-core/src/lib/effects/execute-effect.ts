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
      // Resolve target: use SELF for TargetType.SELF, otherwise require explicit target
      let resolvedTargetPlayerId = targetPlayerId;
      if (effect.target === TargetType.SELF) {
        resolvedTargetPlayerId = ctx.currentPlayer;
      } else if (
        (effect.target === TargetType.PLAYER || effect.target === TargetType.OPPONENT) &&
        !targetPlayerId
      ) {
        const effectTypeName = EffectType[effect.type];
        const targetTypeName = TargetType[effect.target];
        throw new Error(
          `Target player ID is required for ${effectTypeName} effect with target type ${targetTypeName}`
        );
      }
      if (!gameState.players[resolvedTargetPlayerId!]) {
        throw new Error(`Invalid target player ID: ${resolvedTargetPlayerId}`);
      }
      gameState.players[resolvedTargetPlayerId!].resources.life -= effect.value;
      break;
    }
    case EffectType.HEAL: {
      // HEAL effects always target the player who played the card (TargetType.SELF)
      // The type system enforces this constraint via the HealEffect interface
      gameState.players[ctx.currentPlayer].resources.life += effect.value;
      break;
    }
  }
};

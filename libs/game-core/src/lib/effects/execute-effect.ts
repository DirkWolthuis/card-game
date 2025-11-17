import { Effect, EffectType, GameState } from '@game/models';
import { Ctx } from 'boardgame.io';

export const executeEffect = (
  gameState: GameState,
  ctx: Ctx,
  effect: Effect
): void => {
  switch (effect.type) {
    case EffectType.DEAL_DAMAGE: {
      const opponentIds = Object.keys(gameState.players).filter(
        (id) => id !== ctx.currentPlayer
      );
      const targetOpponentId =
        opponentIds[Math.floor(Math.random() * opponentIds.length)];
      gameState.players[targetOpponentId].resources.life -= effect.value;
      break;
    }
  }
};

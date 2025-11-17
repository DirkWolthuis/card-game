import { Effect, EffectType, GameState } from '@game/models';
import { Ctx } from 'boardgame.io';
import { produce } from 'immer';

export const executeEffect = (
  gameState: GameState,
  ctx: Ctx,
  effect: Effect
): GameState => {
  switch (effect.type) {
    case EffectType.DEAL_DAMAGE:
      return produce(gameState, (draftState: GameState) => {
        const currentPlayerId = ctx.currentPlayer;
        const opponentId = ctx.playOrder.find(
          (playerId) => playerId !== currentPlayerId
        );
        if (opponentId) {
          draftState.players[opponentId].life -= effect.value;
        }
      });
    default:
      return gameState;
  }
};

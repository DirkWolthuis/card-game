import { Effect, TargetType, PlayerId, GameState } from '@game/models';
import { isPlayerEliminated } from '../util/game-state-utils';

export const needsTargetSelection = (effect: Effect): boolean => {
  return (
    effect.target === TargetType.PLAYER || effect.target === TargetType.OPPONENT
  );
};

export const getValidTargets = (
  effect: Effect,
  gameState: GameState,
  currentPlayerId: string
): PlayerId[] => {
  const allPlayerIds = Object.keys(gameState.players);
  // Filter out eliminated players - they cannot be targets
  const alivePlayerIds = allPlayerIds.filter(id => !isPlayerEliminated(gameState, id));
  
  switch (effect.target) {
    case TargetType.PLAYER:
      // All alive players including self
      return alivePlayerIds;
    case TargetType.OPPONENT:
      // All alive players except self
      return alivePlayerIds.filter(id => id !== currentPlayerId);
    case TargetType.SELF:
      // Only self (if alive)
      return alivePlayerIds.filter(id => id === currentPlayerId);
    default:
      return [];
  }
};

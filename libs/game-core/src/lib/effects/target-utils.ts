import { Effect, TargetType, PlayerId, GameState } from '@game/models';

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
  
  switch (effect.target) {
    case TargetType.PLAYER:
      // All players including self
      return allPlayerIds;
    case TargetType.OPPONENT:
      // All players except self
      return allPlayerIds.filter(id => id !== currentPlayerId);
    case TargetType.SELF:
      // Only self
      return [currentPlayerId];
    default:
      return [];
  }
};

import { getCardById } from '@game/data';
import { GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';
import { INVALID_MOVE } from 'boardgame.io/core';
import { needsTargetSelection } from '../effects/target-utils';

export const playCardFromHand: Move<GameState> = (
  { G, ctx, playerID },
  entityId: string
) => {
  const playerState = G.players[playerID];
  const hasCardInHand = playerState.zones.hand.entityIds.find(
    (handEntityId) => handEntityId === entityId
  );
  const cardId = playerState.entities[entityId]?.cardId;

  const card = getCardById(cardId);
  if (!card) {
    return INVALID_MOVE;
  }

  if (hasCardInHand && card) {
    // Check if any effect needs target selection
    const firstEffectNeedingTarget = card.effects.find(needsTargetSelection);
    
    if (firstEffectNeedingTarget) {
      // Set up pending target selection
      const effectIndex = card.effects.indexOf(firstEffectNeedingTarget);
      G.pendingTargetSelection = {
        effect: firstEffectNeedingTarget,
        remainingEffects: card.effects.slice(effectIndex + 1),
      };
    } else {
      // No targeting needed, execute all effects immediately
      card.effects.forEach((effect) => executeEffect(G, ctx, effect));
    }
  }

  // Remove card from hand
  playerState.zones.hand.entityIds = playerState.zones.hand.entityIds.filter(
    (handEntityId) => handEntityId !== entityId
  );

  return G;
};

export const selectTarget: Move<GameState> = (
  { G, ctx },
  targetPlayerId: string
) => {
  if (!G.pendingTargetSelection) {
    return INVALID_MOVE;
  }

  const { effect, remainingEffects } = G.pendingTargetSelection;

  // Execute the current effect with the selected target
  executeEffect(G, ctx, effect, targetPlayerId);

  // Clear the pending selection
  G.pendingTargetSelection = undefined;

  // Process remaining effects
  const nextEffectNeedingTarget = remainingEffects.find(needsTargetSelection);
  
  if (nextEffectNeedingTarget) {
    // Another effect needs targeting
    const effectIndex = remainingEffects.indexOf(nextEffectNeedingTarget);
    G.pendingTargetSelection = {
      effect: nextEffectNeedingTarget,
      remainingEffects: remainingEffects.slice(effectIndex + 1),
    };
  } else {
    // Execute remaining effects that don't need targeting
    remainingEffects.forEach((effect) => executeEffect(G, ctx, effect));
  }

  return G;
};

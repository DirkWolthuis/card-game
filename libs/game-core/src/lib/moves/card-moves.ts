import { getCardById } from '@game/data';
import { Card, CardType, GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';
import { INVALID_MOVE } from 'boardgame.io/core';
import { needsTargetSelection, getValidTargets } from '../effects/target-utils';
import {
  isChainableAction,
  canPlayAsReaction,
  initializeChain,
  addActionToChain,
  hasActiveChain,
} from '../chain/chain-utils';

/**
 * Checks if a card has the UNIT type
 */
function isUnitCard(card: Card): boolean {
  return card.types.includes(CardType.UNIT);
}

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
    // Check if player has enough mana to play the card
    if (playerState.resources.mana < card.manaCost) {
      return INVALID_MOVE;
    }

    // Check if this is a reaction card being played during an active chain
    const isReaction = canPlayAsReaction(card);
    const activeChain = hasActiveChain(G);

    if (isReaction && !activeChain) {
      // Reaction cards can only be played when there's an active chain
      return INVALID_MOVE;
    }

    if (isReaction && activeChain) {
      // Check if it's this player's priority
      if (G.chain!.priorityPlayer !== playerID) {
        return INVALID_MOVE;
      }
    }

    // Reduce mana before playing the card
    playerState.resources.mana -= card.manaCost;

    // Remove card from hand
    playerState.zones.hand.entityIds = playerState.zones.hand.entityIds.filter(
      (handEntityId) => handEntityId !== entityId
    );

    // If the card is a unit, place it on the battlefield
    // Units go to battlefield immediately, not on the chain
    if (isUnitCard(card)) {
      playerState.zones.battlefield.entityIds.push(entityId);
    }

    // Check if this action is chainable
    if (isChainableAction(card)) {
      // If there's no active chain, start one
      if (!G.chain) {
        G.chain = initializeChain(playerID, entityId, card.effects, ctx);
      } else {
        // Add to existing chain
        addActionToChain(G.chain, playerID, entityId, card.effects, ctx);
        // Pass priority to the next player
        const playOrder = ctx.playOrder || ['0', '1'];
        const numPlayers = ctx.numPlayers || playOrder.length;
        const nextPlayerIndex =
          (playOrder.indexOf(playerID) + 1) % numPlayers;
        G.chain.priorityPlayer = playOrder[nextPlayerIndex];
      }
    } else {
      // Non-chainable actions execute immediately
      // Check if any effect needs target selection
      const firstEffectNeedingTarget = card.effects.find(needsTargetSelection);

      if (firstEffectNeedingTarget) {
        const effectIndex = card.effects.indexOf(firstEffectNeedingTarget);

        // Execute all effects before the first targeting effect
        for (let i = 0; i < effectIndex; i++) {
          executeEffect(G, ctx, card.effects[i]);
        }

        // Set up pending target selection for the first targeting effect
        G.pendingTargetSelection = {
          effect: firstEffectNeedingTarget,
          remainingEffects: card.effects.slice(effectIndex + 1),
        };
      } else {
        // No targeting needed, execute all effects immediately
        card.effects.forEach((effect) => executeEffect(G, ctx, effect));
      }
    }

    return G;
  }

  return INVALID_MOVE;
};

/**
 * Handles player selection of a target for a pending effect.
 * Validates the target is valid for the current effect, executes the effect with the target,
 * and either continues with remaining effects or sets up the next targeting selection.
 * 
 * @param G - The current game state
 * @param ctx - The boardgame.io context
 * @param targetPlayerId - The ID of the player being targeted
 * @returns Updated game state or INVALID_MOVE if the target is invalid
 */
export const selectTarget: Move<GameState> = (
  { G, ctx, playerID },
  targetPlayerId: string
) => {
  if (!G.pendingTargetSelection) {
    return INVALID_MOVE;
  }

  // Validate the caller is the current player
  if (ctx.currentPlayer !== playerID) {
    return INVALID_MOVE;
  }

  const { effect, remainingEffects } = G.pendingTargetSelection;

  // Validate the target is valid for this effect
  const validTargets = getValidTargets(effect, G, ctx.currentPlayer);
  if (!validTargets.includes(targetPlayerId)) {
    return INVALID_MOVE;
  }

  // Execute the current effect with the selected target
  executeEffect(G, ctx, effect, targetPlayerId);

  // Clear the pending selection
  G.pendingTargetSelection = undefined;

  // Process remaining effects
  const nextEffectNeedingTarget = remainingEffects.find(needsTargetSelection);
  
  if (nextEffectNeedingTarget) {
    const effectIndex = remainingEffects.indexOf(nextEffectNeedingTarget);
    
    // Execute all effects before the next targeting effect
    for (let i = 0; i < effectIndex; i++) {
      executeEffect(G, ctx, remainingEffects[i]);
    }
    
    // Set up pending target selection for the next targeting effect
    G.pendingTargetSelection = {
      effect: nextEffectNeedingTarget,
      remainingEffects: remainingEffects.slice(effectIndex + 1),
    };
  } else {
    // Execute all remaining effects that don't need targeting
    remainingEffects.forEach((effect) => executeEffect(G, ctx, effect));
  }

  return G;
};

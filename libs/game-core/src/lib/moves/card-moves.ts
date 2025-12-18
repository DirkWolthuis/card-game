import { getCardById } from '@game/data';
import { Card, CardType, GameState } from '@game/models';
import { Move } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';
import {
  executeAbility,
  getAbilitiesToActivateOnPlay,
} from '../effects/execute-ability';
import { INVALID_MOVE } from 'boardgame.io/core';
import { needsTargetSelection, getValidTargets } from '../effects/target-utils';

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

    // Reduce mana before playing the card
    playerState.resources.mana -= card.manaCost;

    // Remove card from hand
    playerState.zones.hand.entityIds = playerState.zones.hand.entityIds.filter(
      (handEntityId) => handEntityId !== entityId
    );

    // If the card is a unit, place it on the battlefield
    if (isUnitCard(card)) {
      playerState.zones.battlefield.entityIds.push(entityId);
    }

    // Get abilities that should activate when the card is played
    // For spells, this includes all triggered abilities
    // For units, this would be "enters battlefield" triggered abilities
    const abilitiesToActivate = getAbilitiesToActivateOnPlay(card.abilities);

    // Execute the abilities
    for (const ability of abilitiesToActivate) {
      const needsTarget = executeAbility(G, ctx, ability);
      if (needsTarget) {
        // If an ability needs a target, execution will pause here
        // The player must use selectTarget to continue
        break;
      }
    }

    return G;
  }

  return INVALID_MOVE;
};

/**
 * Handles player selection of a target for a pending effect.
 * Collects targets for all effects that need targeting.
 * Once all targets are collected, executes all effects with their targets.
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

  const {
    sourceAbility,
    allEffects,
    effectsNeedingTargets,
    selectedTargets,
  } = G.pendingTargetSelection;

  // Determine which effect we're selecting a target for
  const numTargetsSelected = Object.keys(selectedTargets).length;
  if (numTargetsSelected >= effectsNeedingTargets.length) {
    // All targets already selected
    return INVALID_MOVE;
  }

  const currentEffect = effectsNeedingTargets[numTargetsSelected];

  // Validate the target is valid for this effect
  const validTargets = getValidTargets(currentEffect, G, ctx.currentPlayer);
  if (!validTargets.includes(targetPlayerId)) {
    return INVALID_MOVE;
  }

  // Store the selected target
  const effectIndex = allEffects.indexOf(currentEffect);
  selectedTargets[effectIndex] = targetPlayerId;

  // Check if we have all targets now
  if (Object.keys(selectedTargets).length === effectsNeedingTargets.length) {
    // All targets collected - now execute all effects
    allEffects.forEach((effect, index) => {
      const target = selectedTargets[index];
      executeEffect(G, ctx, effect, target);
    });

    // Clear the pending selection
    G.pendingTargetSelection = undefined;
  }
  // Otherwise, keep pendingTargetSelection for next target selection

  return G;
};

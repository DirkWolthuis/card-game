import { getCardById } from '@game/data';
import { Card, CardType, GameState, TargetType } from '@game/models';
import { Move } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';
import {
  executeAbility,
  getAbilitiesToActivateOnPlay,
} from '../effects/execute-ability';
import { INVALID_MOVE } from 'boardgame.io/core';
import { getValidTargets } from '../effects/target-utils';
import {
  checkPlayerPriority,
  checkResourcesForCost,
  runChecks,
  ActionContext,
} from '../actions/action-validation';
import {
  startChain,
  shouldStartChain,
  hasActiveChain,
  addToChain,
} from '../chain/chain-manager';

/**
 * Checks if a card has the UNIT type
 */
function isUnitCard(card: Card): boolean {
  return card.types.includes(CardType.UNIT);
}

/**
 * Checks if a card has the SPELL type
 */
function isSpellCard(card: Card): boolean {
  return card.types.includes(CardType.SPELL);
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

  if (!hasCardInHand) {
    return INVALID_MOVE;
  }

  // STEP 1: Run all validation checks before making any state changes
  const actionContext: ActionContext = {
    gameState: G,
    ctx,
    playerID,
  };

  const checks = [
    checkPlayerPriority,
    checkResourcesForCost(card.manaCost),
  ];

  const validationResult = runChecks(checks, actionContext);
  if (!validationResult.valid) {
    return INVALID_MOVE;
  }

  // STEP 2: All checks passed - now pay the costs
  playerState.resources.mana -= card.manaCost;

  // STEP 3: Execute the action - move card and activate abilities
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

  // STEP 4: Determine if we should use the chain mechanic
  // For now, playing spell cards starts a chain
  if (isSpellCard(card) && abilitiesToActivate.length > 0) {
    // Playing a spell starts a chain
    for (const ability of abilitiesToActivate) {
      if (shouldStartChain(ability)) {
        // Check if ability needs target selection
        const effectIndicesNeedingTargets: number[] = [];
        ability.effects.forEach((effect, index) => {
          if (
            effect.target === TargetType.PLAYER ||
            effect.target === TargetType.OPPONENT
          ) {
            effectIndicesNeedingTargets.push(index);
          }
        });

        if (effectIndicesNeedingTargets.length > 0) {
          // Set up target selection for chain
          G.pendingTargetSelection = {
            sourceAbility: ability,
            allEffects: ability.effects,
            effectIndicesNeedingTargets,
            selectedTargets: {},
            isForChain: true,
            chainPlayerId: playerID,
          };
          // Break here - player must select targets before ability is added to chain
          break;
        } else {
          // No targeting needed, add to chain immediately
          if (!hasActiveChain(G)) {
            startChain(G, ability, playerID, ability.effects);
          } else {
            addToChain(G, ability, playerID, ability.effects);
          }
        }
      }
    }
    // Chain is now active, waiting for other players to respond or pass priority
  } else {
    // For non-spell cards (units for now), resolve abilities immediately
    // This is the old behavior - will be updated in future to also use chains
    for (const ability of abilitiesToActivate) {
      const needsTarget = executeAbility(G, ctx, ability);
      if (needsTarget) {
        // If an ability needs a target, resolution of that ability will pause here.
        // The player must use selectTarget to continue resolving that pending effect.
        // We break here because only one ability can have pending target selection at a time.
        break;
      }
    }
  }

  return G;
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

  // STEP 1: Validate player has priority
  const actionContext: ActionContext = {
    gameState: G,
    ctx,
    playerID,
  };

  const validationResult = checkPlayerPriority(actionContext);
  if (!validationResult.valid) {
    return INVALID_MOVE;
  }

  // Defensive check: ensure we have valid effects arrays
  if (!G.pendingTargetSelection.allEffects || !Array.isArray(G.pendingTargetSelection.allEffects) || G.pendingTargetSelection.allEffects.length === 0) {
    console.error('Invalid pendingTargetSelection: allEffects is missing or empty');
    return INVALID_MOVE;
  }

  if (!G.pendingTargetSelection.effectIndicesNeedingTargets || !Array.isArray(G.pendingTargetSelection.effectIndicesNeedingTargets)) {
    console.error('Invalid pendingTargetSelection: effectIndicesNeedingTargets is missing or invalid');
    return INVALID_MOVE;
  }

  // Determine which effect we're selecting a target for
  const numTargetsSelected = Object.keys(G.pendingTargetSelection.selectedTargets).length;
  if (numTargetsSelected >= G.pendingTargetSelection.effectIndicesNeedingTargets.length) {
    // All targets already selected
    return INVALID_MOVE;
  }

  // Get the index of the effect that needs a target
  const effectIndex = G.pendingTargetSelection.effectIndicesNeedingTargets[numTargetsSelected];
  const currentEffect = G.pendingTargetSelection.allEffects[effectIndex];

  // Validate the target is valid for this effect
  const validTargets = getValidTargets(currentEffect, G, ctx.currentPlayer);
  if (!validTargets.includes(targetPlayerId)) {
    return INVALID_MOVE;
  }

  // Store the selected target - directly mutate G to work correctly with immer
  G.pendingTargetSelection.selectedTargets[effectIndex] = targetPlayerId;

  // Check if we have all targets now
  if (Object.keys(G.pendingTargetSelection.selectedTargets).length === G.pendingTargetSelection.effectIndicesNeedingTargets.length) {
    // All targets collected
    const isForChain = G.pendingTargetSelection.isForChain;
    const chainPlayerId = G.pendingTargetSelection.chainPlayerId;
    
    if (isForChain && chainPlayerId) {
      // Add ability with targets to chain
      const ability = G.pendingTargetSelection.sourceAbility;
      const effects = G.pendingTargetSelection.allEffects;
      const selectedTargets = { ...G.pendingTargetSelection.selectedTargets };
      
      // Clear pending selection first
      G.pendingTargetSelection = undefined;
      
      // Add to chain with targets
      if (!hasActiveChain(G)) {
        startChain(G, ability, chainPlayerId, effects, selectedTargets);
      } else {
        addToChain(G, ability, chainPlayerId, effects, selectedTargets);
      }
    } else {
      // Execute all effects immediately (non-chain mode)
      G.pendingTargetSelection.allEffects.forEach((effect, index) => {
        // Defensive check: ensure effect is not undefined
        if (!effect) {
          console.error(`Effect at index ${index} is undefined in allEffects`);
          return;
        }
        // Non-null assertion is safe here because we're inside the if block that checks pendingTargetSelection exists
        const target = G.pendingTargetSelection!.selectedTargets[index];
        executeEffect(G, ctx, effect, target);
      });

      // Clear the pending selection
      G.pendingTargetSelection = undefined;
    }
  }
  // Otherwise, keep pendingTargetSelection for next target selection

  return G;
};

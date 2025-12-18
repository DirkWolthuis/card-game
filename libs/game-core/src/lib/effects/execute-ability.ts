import {
  Ability,
  AbilityType,
  ActivatedAbility,
  TriggeredAbility,
  GameState,
} from '@game/models';
import { Ctx } from 'boardgame.io';
import { executeEffect } from './execute-effect';
import { needsTargetSelection } from './target-utils';

/**
 * Executes an ability's effects.
 * Handles different ability types and manages target selection flow.
 * 
 * For abilities with effects that need targeting:
 * - Executes all non-targeting effects first
 * - Sets up pendingTargetSelection for the first targeting effect
 * - Remaining effects will be handled after target selection
 * 
 * @param gameState - The current game state
 * @param ctx - The boardgame.io context
 * @param ability - The ability to execute
 * @returns true if target selection is needed, false if all effects resolved immediately
 */
export const executeAbility = (
  gameState: GameState,
  ctx: Ctx,
  ability: Ability
): boolean => {
  const effects = ability.effects;

  // Find the first effect that needs target selection
  const firstEffectNeedingTarget = effects.find(needsTargetSelection);

  if (firstEffectNeedingTarget) {
    const effectIndex = effects.indexOf(firstEffectNeedingTarget);

    // Execute all effects before the first targeting effect
    for (let i = 0; i < effectIndex; i++) {
      executeEffect(gameState, ctx, effects[i]);
    }

    // Set up pending target selection for the first targeting effect
    gameState.pendingTargetSelection = {
      effect: firstEffectNeedingTarget,
      remainingEffects: effects.slice(effectIndex + 1),
      sourceAbility: ability,
    };

    return true; // Target selection needed
  } else {
    // No targeting needed, execute all effects immediately
    effects.forEach((effect) => executeEffect(gameState, ctx, effect));
    return false; // No target selection needed
  }
};

/**
 * Checks if an ability can be activated by the current player.
 * Validates that the ability is an activated ability and that the player
 * has enough resources to pay the cost.
 * 
 * @param ability - The ability to check
 * @param playerState - The current player's state
 * @returns true if the ability can be activated, false otherwise
 */
export const canActivateAbility = (
  ability: Ability,
  playerState: { resources: { mana: number } }
): boolean => {
  if (ability.type !== AbilityType.ACTIVATED) {
    return false;
  }

  const activatedAbility = ability as ActivatedAbility;
  const manaCost = activatedAbility.cost.mana ?? 0;

  return playerState.resources.mana >= manaCost;
};

/**
 * Pays the cost for activating an ability.
 * Currently only handles mana costs.
 * 
 * @param ability - The ability being activated
 * @param playerState - The current player's state (will be mutated)
 */
export const payAbilityCost = (
  ability: ActivatedAbility,
  playerState: { resources: { mana: number } }
): void => {
  const manaCost = ability.cost.mana ?? 0;
  playerState.resources.mana -= manaCost;
};

/**
 * Determines which abilities should be automatically activated when a card is played.
 * Currently, triggered abilities are activated when the card enters play.
 * 
 * @param abilities - All abilities on the card
 * @returns Array of abilities that should be activated
 */
export const getAbilitiesToActivateOnPlay = (
  abilities: Ability[]
): Ability[] => {
  // When a spell is played, all triggered abilities activate automatically
  // For units, triggered abilities would activate on entering battlefield
  return abilities.filter(
    (ability) => ability.type === AbilityType.TRIGGERED
  );
};

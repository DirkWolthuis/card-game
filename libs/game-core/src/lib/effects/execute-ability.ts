import {
  Ability,
  AbilityType,
  ActivatedAbility,
  GameState,
} from '@game/models';
import { Ctx } from 'boardgame.io';
import { executeEffect } from './execute-effect';
import { needsTargetSelection } from './target-utils';

/**
 * Executes an ability's effects.
 * Handles different ability types and manages target selection flow.
 * 
 * NEW BEHAVIOR: All targets must be selected before any effects resolve.
 * - Identifies all effects that need targeting
 * - Sets up pendingTargetSelection with all effects and empty target map
 * - Effects only execute after all targets are collected
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

  // Defensive check: filter out any undefined or null effects
  const validEffects = effects.filter((effect) => effect != null);
  
  if (validEffects.length !== effects.length) {
    console.error(`Warning: Ability had ${effects.length - validEffects.length} undefined/null effects that were filtered out`);
  }

  // Find all effects that need target selection
  const effectsNeedingTargets = validEffects.filter(needsTargetSelection);

  if (effectsNeedingTargets.length > 0) {
    // Set up pending target selection for all targeting effects
    // No effects execute until all targets are collected
    gameState.pendingTargetSelection = {
      sourceAbility: ability,
      allEffects: validEffects,
      effectsNeedingTargets: effectsNeedingTargets,
      selectedTargets: {},
    };

    return true; // Target selection needed
  } else {
    // No targeting needed, execute all effects immediately
    validEffects.forEach((effect) => {
      // Double-check effect is valid before executing
      if (effect) {
        executeEffect(gameState, ctx, effect);
      }
    });
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

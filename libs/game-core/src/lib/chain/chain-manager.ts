import {
  GameState,
  ChainLink,
  PlayerId,
  Ability,
  Effect,
} from '@game/models';
import { Ctx } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';

/**
 * Checks if an action should start a new chain.
 * According to the game design, the following actions start a chain:
 * - Playing a spell card (for now, we'll check this in the move itself)
 * - Declaring an attack (future)
 * - Activating an ability (future)
 * - Playing a unit card (future)
 * - Using a card effect that targets (future)
 */
export function shouldStartChain(ability: Ability): boolean {
  // For now, all abilities with effects are chainable
  // This can be extended in the future to check specific conditions
  return ability.effects && ability.effects.length > 0;
}

/**
 * Initializes a new chain with the first action.
 */
export function startChain(
  gameState: GameState,
  ability: Ability,
  playerId: PlayerId,
  effects: Effect[],
  selectedTargets?: Record<number, string>
): void {
  const link: ChainLink = {
    ability,
    playerId,
    effects,
    selectedTargets,
  };

  gameState.chain = {
    links: [link],
    consecutivePasses: {},
    isLocked: false,
  };
}

/**
 * Adds an action to an existing chain.
 */
export function addToChain(
  gameState: GameState,
  ability: Ability,
  playerId: PlayerId,
  effects: Effect[],
  selectedTargets?: Record<number, string>
): void {
  if (!gameState.chain) {
    throw new Error('Cannot add to chain: no active chain');
  }

  if (gameState.chain.isLocked) {
    throw new Error('Cannot add to chain: chain is locked');
  }

  const link: ChainLink = {
    ability,
    playerId,
    effects,
    selectedTargets,
  };

  gameState.chain.links.push(link);
  
  // Reset consecutive passes when someone adds to the chain
  gameState.chain.consecutivePasses = {};
}

/**
 * Handles a player passing priority on the chain.
 * If both players pass consecutively, the chain is locked.
 */
export function passPriority(
  gameState: GameState,
  playerId: PlayerId,
  ctx: Ctx
): void {
  if (!gameState.chain) {
    throw new Error('Cannot pass priority: no active chain');
  }

  if (gameState.chain.isLocked) {
    throw new Error('Cannot pass priority: chain is already locked');
  }

  // Mark this player as having passed
  gameState.chain.consecutivePasses[playerId] = true;

  // Check if all players have passed consecutively
  const allPlayersPassed = ctx.playOrder.every(
    (pid) => gameState.chain?.consecutivePasses[pid] === true
  );

  if (allPlayersPassed) {
    lockChain(gameState);
  }
}

/**
 * Locks the chain, preventing any more actions from being added.
 * After locking, the chain will be resolved in LIFO order.
 */
export function lockChain(gameState: GameState): void {
  if (!gameState.chain) {
    throw new Error('Cannot lock chain: no active chain');
  }

  gameState.chain.isLocked = true;
  gameState.chain.resolutionIndex = gameState.chain.links.length - 1;
}

/**
 * Resolves the next link on the chain in LIFO order.
 * Returns true if there are more links to resolve, false if chain is complete.
 */
export function resolveNextChainLink(
  gameState: GameState,
  ctx: Ctx
): boolean {
  if (!gameState.chain) {
    throw new Error('Cannot resolve chain: no active chain');
  }

  if (!gameState.chain.isLocked) {
    throw new Error('Cannot resolve chain: chain is not locked');
  }

  const resolutionIndex = gameState.chain.resolutionIndex;
  
  if (resolutionIndex === undefined || resolutionIndex < 0) {
    // Chain resolution complete
    clearChain(gameState);
    return false;
  }

  const link = gameState.chain.links[resolutionIndex];
  
  // Execute all effects in this link
  link.effects.forEach((effect, index) => {
    const target = link.selectedTargets?.[index];
    executeEffect(gameState, ctx, effect, target);
  });

  // Move to next link (going backwards through the array for LIFO)
  gameState.chain.resolutionIndex = resolutionIndex - 1;

  // Check if we're done
  if (gameState.chain.resolutionIndex < 0) {
    clearChain(gameState);
    return false;
  }

  return true;
}

/**
 * Resolves all links on the chain in LIFO order.
 * This is called automatically when the chain is locked.
 */
export function resolveChain(gameState: GameState, ctx: Ctx): void {
  if (!gameState.chain) {
    return;
  }

  if (!gameState.chain.isLocked) {
    throw new Error('Cannot resolve chain: chain is not locked');
  }

  // Resolve all links in LIFO order (last added resolves first)
  for (let i = gameState.chain.links.length - 1; i >= 0; i--) {
    const link = gameState.chain.links[i];
    
    // Execute all effects in this link
    link.effects.forEach((effect, index) => {
      const target = link.selectedTargets?.[index];
      executeEffect(gameState, ctx, effect, target);
    });
  }

  // Clear the chain after resolution
  clearChain(gameState);
}

/**
 * Clears the chain from the game state.
 */
export function clearChain(gameState: GameState): void {
  gameState.chain = undefined;
}

/**
 * Checks if a chain is currently active.
 */
export function hasActiveChain(gameState: GameState): boolean {
  return gameState.chain !== undefined && !gameState.chain.isLocked;
}

/**
 * Checks if a chain is locked and ready for resolution.
 */
export function isChainLocked(gameState: GameState): boolean {
  return gameState.chain?.isLocked === true;
}

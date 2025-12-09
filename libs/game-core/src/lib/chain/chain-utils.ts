import {
  Chain,
  ChainAction,
  GameState,
  PlayerId,
  EntityId,
  Effect,
  Card,
  ActionSpeed,
  EffectType,
  TargetType,
} from '@game/models';
import { Ctx } from 'boardgame.io';
import { executeEffect } from '../effects/execute-effect';

/**
 * Determines if a card action is chainable (i.e., starts a chain or can be added to a chain).
 * According to game design:
 * - Playing a spell card is chainable (ActionSpeed.NORMAL)
 * - Playing a unit card is chainable (ActionSpeed.NORMAL)
 * - Reaction cards can be played in response (ActionSpeed.REACTION)
 * - Declaring an attack is chainable (not yet implemented)
 * - Activating an ability is chainable (not yet implemented)
 * 
 * Actions that do NOT start a chain:
 * - Pitching cards for mana
 * - Drawing cards (unless from an effect)
 * - Untapping cards
 * - Discarding cards
 * - Trading in marketplace
 * 
 * Implementation note: Currently checks ActionSpeed, which defaults to NORMAL for spells and units.
 */
export function isChainableAction(card: Card): boolean {
  const speed = card.speed || ActionSpeed.NORMAL;
  return speed === ActionSpeed.NORMAL || speed === ActionSpeed.REACTION;
}

/**
 * Checks if a card can be played as a reaction (i.e., in response to something on the chain).
 */
export function canPlayAsReaction(card: Card): boolean {
  const speed = card.speed || ActionSpeed.NORMAL;
  return speed === ActionSpeed.REACTION;
}

/**
 * Initializes a new chain with the first action.
 * For effects that target OPPONENT, we automatically select the first opponent as the target.
 */
export function initializeChain(
  playerId: PlayerId,
  entityId: EntityId | undefined,
  effects: Effect[],
  ctx: Ctx
): Chain {
  const chainId = `chain-${Date.now()}-${playerId}`;
  
  // Determine target for OPPONENT effects
  const targetPlayerId = determineTargetPlayerId(playerId, effects, ctx);
  
  const action: ChainAction = {
    id: `${chainId}-action-0`,
    playerId,
    entityId,
    effects,
    targetPlayerId,
    countered: false,
  };

  // Determine next player to have priority (opponent of the player who started the chain)
  const nextPriorityPlayer = getNextPlayer(playerId, ctx);

  return {
    actions: [action],
    priorityPlayer: nextPriorityPlayer,
    consecutivePasses: 0,
    isLocked: false,
    isResolving: false,
  };
}

/**
 * Adds an action to an existing chain.
 */
export function addActionToChain(
  chain: Chain,
  playerId: PlayerId,
  entityId: EntityId | undefined,
  effects: Effect[],
  ctx: Ctx
): void {
  const actionIndex = chain.actions.length;
  
  // Determine target for OPPONENT effects
  const targetPlayerId = determineTargetPlayerId(playerId, effects, ctx);
  
  const action: ChainAction = {
    id: `chain-action-${actionIndex}`,
    playerId,
    entityId,
    effects,
    targetPlayerId,
    countered: false,
  };

  chain.actions.push(action);
  // Reset consecutive passes since an action was added
  chain.consecutivePasses = 0;
}

/**
 * Helper function to determine the target player ID for effects.
 * For OPPONENT effects, selects the first opponent in turn order.
 */
function determineTargetPlayerId(
  playerId: PlayerId,
  effects: Effect[],
  ctx: Ctx
): PlayerId | undefined {
  // Find the first opponent effect
  const opponentEffect = effects.find(
    (effect) => 'target' in effect && effect.target === TargetType.OPPONENT
  );

  if (opponentEffect) {
    // Select the next player in turn order as the opponent
    return getNextPlayer(playerId, ctx);
  }

  return undefined;
}

/**
 * Handles a player passing priority.
 * Returns true if the chain should be locked (both players passed consecutively).
 */
export function passPriority(chain: Chain, ctx: Ctx): boolean {
  chain.consecutivePasses++;

  const numPlayers = ctx.numPlayers || 2;
  
  // If both players have passed consecutively, lock the chain
  if (chain.consecutivePasses >= numPlayers) {
    chain.isLocked = true;
    return true;
  }

  // Move priority to the next player
  chain.priorityPlayer = getNextPlayer(chain.priorityPlayer!, ctx);
  return false;
}

/**
 * Resolves the chain by executing all actions in LIFO order.
 * Countered actions are skipped.
 */
export function resolveChain(gameState: GameState, ctx: Ctx): void {
  if (!gameState.chain) {
    return;
  }

  const chain = gameState.chain;
  chain.isResolving = true;

  // Resolve in LIFO order (last action added resolves first)
  // We resolve from the end of the array to the beginning
  // Example: Chain = [Firebolt, Counterspell]
  // - Resolve Counterspell (i=1): counters Firebolt at i-1=0
  // - Resolve Firebolt (i=0): skipped because countered=true
  for (let i = chain.actions.length - 1; i >= 0; i--) {
    const action = chain.actions[i];
    
    if (!action.countered) {
      // Execute each effect in the action
      for (const effect of action.effects) {
        // Special handling for COUNTER effects
        if (effect.type === EffectType.COUNTER) {
          // Counter the action that was added to the chain before this counter
          // In LIFO resolution, we mark it as countered before we reach it
          if (i > 0) {
            chain.actions[i - 1].countered = true;
          }
        } else {
          // Use the stored target player ID for effects that need it
          executeEffect(gameState, ctx, effect, action.targetPlayerId);
        }
      }
    }
  }

  // Clear the chain after resolution
  gameState.chain = undefined;
}

/**
 * Counters the top action on the chain.
 */
export function counterTopChainAction(chain: Chain): void {
  if (chain.actions.length > 0) {
    const topAction = chain.actions[chain.actions.length - 1];
    topAction.countered = true;
  }
}

/**
 * Gets the next player in turn order.
 */
function getNextPlayer(currentPlayerId: PlayerId, ctx: Ctx): PlayerId {
  // Provide defaults for testing when playOrder is not set
  const playOrder = ctx.playOrder || ['0', '1'];
  const currentIndex = playOrder.indexOf(currentPlayerId);
  const numPlayers = ctx.numPlayers || playOrder.length;
  const nextIndex = (currentIndex + 1) % numPlayers;
  return playOrder[nextIndex];
}

/**
 * Checks if there is an active chain.
 */
export function hasActiveChain(gameState: GameState): boolean {
  return gameState.chain !== undefined && !gameState.chain.isLocked;
}

/**
 * Checks if the chain is locked and ready to resolve.
 */
export function isChainLocked(gameState: GameState): boolean {
  return gameState.chain !== undefined && gameState.chain.isLocked;
}

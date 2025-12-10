# Action System Architecture

This document describes the action system implementation in the Lords of Estraven card game, which provides a uniform way to handle all player actions with composable validation checks.

## Overview

The action system separates **player intent** (actions) from **game state changes** (effects) by introducing a validation layer that checks whether actions can be performed before executing them.

## Core Concepts

### Actions

Actions represent player intentions in the game. Each action type corresponds to a move that players can make:

- **PLAY_CARD**: Playing a card from hand
- **ACTIVATE_ABILITY**: Activating an ability of a card (not yet implemented)
- **ATTACK**: Attacking with a unit (not yet implemented)
- **PASS_PRIORITY**: Passing priority to the opponent
- **END_TURN**: Ending the current turn

All actions are defined in `libs/game-models/src/lib/action.ts`.

### Costs

Costs are requirements that must be met before an action can be executed:

- **MANA**: Requires spending mana from the player's mana pool
- **TAP**: Requires tapping cards (not yet implemented)
- **SACRIFICE**: Requires sacrificing cards (not yet implemented)

### Action Context

An `ActionContext` bundles together all the information needed to execute an action:

```typescript
interface ActionContext {
  costs: Cost[];              // Costs that must be paid
  effects: Effect[];          // Effects that will execute
  requiresTargetSelection: boolean;  // Whether target selection is needed
}
```

## Validation Flow

The action system uses a multi-step validation process:

1. **Priority Check**: Is the player allowed to take an action?
   - Is it the player's turn? (boardgame.io level)
   - Does the player have priority? (custom priority system)

2. **Cost Check**: Can the player pay the required costs?
   - Does the player have enough mana?
   - Are other resources available? (for future cost types)

3. **Target Selection**: Does the action require target selection?
   - If yes, pause execution and wait for target selection
   - If no, proceed to execution

4. **Execution**: After all checks pass:
   - Pay costs
   - Execute effects

## Implementation

### Creating Actions

Actions are created through boardgame.io moves. Each move:

1. Creates an action object
2. Builds an action context (costs + effects)
3. Validates the action
4. Pays costs
5. Executes effects

Example from `playCardFromHand`:

```typescript
// 1. Create action
const action: PlayCardAction = {
  type: ActionType.PLAY_CARD,
  playerId: playerID,
  entityId,
};

// 2. Build context
const actionContext = createPlayCardContext(action, G);

// 3. Validate
const validationResult = validateAction(action, actionContext.costs, G, ctx);
if (!validationResult.valid) {
  return INVALID_MOVE;
}

// 4. Pay costs
payCosts(actionContext.costs, G, playerID);

// 5. Execute effects
actionContext.effects.forEach(effect => executeEffect(G, ctx, effect));
```

### Priority System

The priority system tracks which player can currently take actions:

```typescript
interface PriorityState {
  currentPriorityPlayer: PlayerId;  // Who has priority
  consecutivePasses: number;         // For chain locking
}
```

When priority is undefined, the game follows boardgame.io's default turn-based system. When priority is active (during chain resolution), it tracks custom priority passing.

### Action Validation Functions

Located in `libs/game-core/src/lib/actions/action-validation.ts`:

- `checkPlayerPriority()`: Validates player can take actions
- `checkCosts()`: Validates costs can be paid
- `payCosts()`: Pays the costs (modifies game state)
- `validateAction()`: Main validation entry point
- `passPriority()`: Passes priority to next player
- `resetConsecutivePasses()`: Resets pass counter when action is added to chain

### Action Context Functions

Located in `libs/game-core/src/lib/actions/action-context.ts`:

- `createPlayCardContext()`: Builds context for playing a card
- `createEndTurnContext()`: Builds context for ending turn
- `createPassPriorityContext()`: Builds context for passing priority
- `createActionContext()`: Main entry point for building contexts

## Future Extensions

### Adding New Actions

To add a new action type:

1. Add the action type to `ActionType` enum in `action.ts`
2. Create an interface for the action extending `BaseAction`
3. Add the action to the `Action` union type
4. Implement a context builder in `action-context.ts`
5. Create a move in the moves directory
6. Add the move to the game engine

### Adding New Costs

To add a new cost type:

1. Add the cost type to `CostType` enum
2. Create an interface for the cost extending `BaseCost`
3. Add the cost to the `Cost` union type
4. Implement validation in `checkCosts()`
5. Implement payment in `payCosts()`

## Testing

The action system has comprehensive test coverage:

- **action-validation.spec.ts**: Tests priority checks, cost validation, and payment (42 tests)
- **action-context.spec.ts**: Tests context building for different action types (15 tests)
- **priority-moves.spec.ts**: Tests the passPriority move (5 tests)

All existing card-moves tests continue to pass, demonstrating backward compatibility.

## Integration with Chain System

The action system is designed to integrate with the future chain implementation:

1. When an action is validated and costs are paid, it can be added to the chain
2. Priority passes between players as they respond
3. `consecutivePasses` tracks when both players pass without adding actions
4. When `consecutivePasses >= 2`, the chain locks and resolves in LIFO order

This matches the design specified in `docs/taking-actions.md` and `docs/game-design.md`.

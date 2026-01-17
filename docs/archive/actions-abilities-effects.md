# Actions, Abilities, and Effects Implementation

This document describes the technical implementation of the Actions, Abilities, and Effects system in the Lords of Estraven card game.

## Overview

The game uses a clear separation between:
- **Actions**: Game moves that players can take (implemented as boardgame.io moves)
- **Abilities**: Properties of cards/entities that wrap effects and define when they can be used
- **Effects**: Events that change the game state

## Core Concepts

### Actions

Actions are moves in the boardgame.io framework. They represent player-initiated game actions such as:
- Playing a card from hand (`playCardFromHand`)
- Selecting a target (`selectTarget`)
- Pitching a card for mana (`pitchCard`)
- Activating an ability (future implementation)
- Ending turn (`endTurn`)

Each action includes validation checks to ensure:
1. The player is allowed to take the action
2. Required resources are available
3. Game state permits the action

### Abilities

Abilities are properties of cards/entities that result in effects. All effects must be wrapped in an ability.

#### Ability Types

```typescript
enum AbilityType {
  ACTIVATED = 'ACTIVATED',   // Can be activated by paying a cost
  TRIGGERED = 'TRIGGERED',   // Automatically triggers on events
  STATIC = 'STATIC',         // Continuously affects the game
  REACTION = 'REACTION',     // Can respond to actions (future)
}
```

#### Activated Abilities

Notation: `{cost}: {effect}`

Example: `{2 mana}: Deal 2 damage to target opponent`

```typescript
interface ActivatedAbility {
  type: AbilityType.ACTIVATED;
  description: string;
  cost: AbilityCost;
  effects: Effect[];
}

interface AbilityCost {
  mana?: number;
  // Future: tap?, discard?, sacrifice?, etc.
}
```

**Usage:**
- Player must pay the cost to activate
- Can be activated during main phase when player has priority
- Future: Add validation for timing and priority rules

#### Triggered Abilities

Automatically activate when specific events occur.

Example: "When this unit enters the battlefield, deal 1 damage to opponent"

```typescript
interface TriggeredAbility {
  type: AbilityType.TRIGGERED;
  description: string;
  effects: Effect[];
  // Future: trigger condition (e.g., 'onEnterBattlefield', 'onDeath')
}
```

**Current Implementation:**
- Triggered abilities on spells activate when the spell is played
- Triggered abilities on units would activate when entering the battlefield
- Future: Add specific trigger conditions and event system

#### Static Abilities

Continuously affect the game while the card is in play.

Example: "All your units get +1 power"

```typescript
interface StaticAbility {
  type: AbilityType.STATIC;
  description: string;
  effects: Effect[];
  // Future: condition for when the ability is active
}
```

**Status:** Placeholder for future implementation of continuous effects

#### Reaction Abilities

Can respond to actions (to be implemented later).

Example: "When an opponent plays a spell, counter that spell"

```typescript
interface ReactionAbility {
  type: AbilityType.REACTION;
  description: string;
  effects: Effect[];
  // Future: reaction trigger and conditions
}
```

**Status:** Defined but not yet implemented

### Effects

Effects are events that change the game state. They are always wrapped in abilities.

```typescript
enum EffectType {
  DEAL_DAMAGE,
  HEAL,
  // Future: DRAW_CARD, DESTROY_UNIT, etc.
}
```

#### Effect Targeting

Effects can target different entities:

```typescript
enum TargetType {
  SELF,      // The player who controls the source
  PLAYER,    // Any player (requires target selection)
  OPPONENT,  // An opponent (requires target selection)
}
```

## Implementation Details

### Card Structure

Cards now use abilities instead of direct effects:

```typescript
interface Card {
  id: CardId;
  name: string;
  displayText: string;
  types: CardType[];
  abilities: Ability[];  // Changed from effects: Effect[]
  pitchValue: number;
  manaCost: number;
  unitStats?: UnitStats;
}
```

### Playing Cards

When a card is played, the action now follows a structured validation and resolution flow:

1. **Validate Card Exists**: Check card is valid and in hand
2. **Run Validation Checks**: Composable checks in sequence
   - **Priority Check**: Validate player has priority (is current player)
   - **Cost Check**: Validate player has enough resources (mana)
3. **Pay Costs**: After all checks pass, reduce player's mana
4. **Execute Action**: Move card and update zones
   - Remove from hand
   - Place on battlefield if unit card
5. **Activate Abilities**: Get abilities that activate on play (triggered abilities)
6. **Resolve Abilities**: Execute each ability's effects (may pause for targeting)

```typescript
export const playCardFromHand: Move<GameState> = ({ G, ctx, playerID }, entityId: string) => {
  // 1. Validate and get card
  const card = getCardById(cardId);
  if (!card || !hasCardInHand) {
    return INVALID_MOVE;
  }
  
  // 2. Run all validation checks before making state changes
  const actionContext: ActionContext = { gameState: G, ctx, playerID };
  const checks = [
    checkPlayerPriority,           // Has priority?
    checkResourcesForCost(card.manaCost), // Has resources?
  ];
  
  const validationResult = runChecks(checks, actionContext);
  if (!validationResult.valid) {
    return INVALID_MOVE;
  }
  
  // 3. All checks passed - pay costs
  playerState.resources.mana -= card.manaCost;
  
  // 4. Execute action - move card
  // Remove from hand, add to battlefield if unit
  
  // 5. Activate triggered abilities
  const abilitiesToActivate = getAbilitiesToActivateOnPlay(card.abilities);
  
  // 6. Resolve abilities (may pause for target selection)
  for (const ability of abilitiesToActivate) {
    const needsTarget = executeAbility(G, ctx, ability);
    if (needsTarget) {
      break; // Pause for target selection
    }
  }
};
```

### Action Validation System

The validation system provides composable checks that can be applied to any action:

```typescript
// Core validation types
interface ValidationResult {
  valid: boolean;
  error?: string;
}

interface ActionContext {
  gameState: GameState;
  ctx: Ctx;
  playerID: string;
}

type ActionCheck = (context: ActionContext) => ValidationResult;

// Available checks
checkPlayerPriority: ActionCheck          // Validates player has priority
checkResourcesForCost(mana: number): ActionCheck  // Validates resources
checkRequiresTargetSelection(ability: Ability): boolean // Checks if targeting needed

// Composing checks
const checks = [checkPlayerPriority, checkResourcesForCost(3)];
const result = runChecks(checks, context);
if (!result.valid) {
  return INVALID_MOVE;
}
```

**Key Benefits:**
- Checks run **before** any state changes (no partial updates on failure)
- Checks are composable and reusable across different actions
- Clear separation between validation, cost payment, and resolution
- Foundation for future chain and reaction systems

### Ability Execution

The `executeAbility` function handles the execution flow:

**IMPORTANT**: All targets must be selected before any effects resolve.

```typescript
export const executeAbility = (
  gameState: GameState,
  ctx: Ctx,
  ability: Ability
): boolean => {
  const effects = ability.effects;

  // Find all effects that need target selection
  const effectsNeedingTargets = effects.filter(needsTargetSelection);

  if (effectsNeedingTargets.length > 0) {
    // Set up pending target selection for all targeting effects
    // NO effects execute until all targets are collected
    // Return true (target selection needed)
  } else {
    // No targeting needed, execute all effects immediately
    // Return false (no target selection needed)
  }
};
```

### Target Selection Flow

When an ability has effects that require targeting:

1. **Identify Targeting Effects**: Find all effects that need target selection
2. **Set Pending Selection**: Game state stores all effects and prepares to collect targets
3. **Wait for Player**: Game pauses for player to select targets via `selectTarget` move
4. **Collect All Targets**: Player selects a target for each effect that needs one
5. **Execute All Effects**: Once all targets are collected, ALL effects execute with their targets

**Key Difference**: No effects execute until ALL targets are selected. This ensures predictable execution order.

```typescript
interface PendingTargetSelection {
  sourceAbility: Ability;
  allEffects: Effect[];
  effectsNeedingTargets: Effect[];
  selectedTargets: Record<number, string>;
}
```

#### Example Flow

For an ability with: `[Heal self 3, Deal 2 damage to opponent]`

**OLD behavior** (incorrect):
1. Heal executes immediately → Player gains 3 life
2. Pause for target selection
3. Target selected → Damage executes

**NEW behavior** (correct):
1. Identify damage needs target
2. Pause for target selection
3. Target selected
4. Both heal AND damage execute together

### Activated Ability System

Helper functions for activated abilities:

```typescript
// Check if ability can be activated
canActivateAbility(ability: Ability, playerState): boolean

// Pay the cost to activate
payAbilityCost(ability: ActivatedAbility, playerState): void

// Get abilities that activate when card is played
getAbilitiesToActivateOnPlay(abilities: Ability[]): Ability[]
```

## Example Cards

### Spell with Triggered Ability

```typescript
{
  id: 'aaaa',
  name: 'Firebolt',
  types: [CardType.SPELL],
  manaCost: 1,
  abilities: [
    {
      type: AbilityType.TRIGGERED,
      description: 'Deal 2 damage to opponent',
      effects: [
        { target: TargetType.OPPONENT, type: EffectType.DEAL_DAMAGE, value: 2 }
      ],
    },
  ],
}
```

When played:
1. Player pays 1 mana
2. Triggered ability automatically activates
3. Player selects opponent as target (if needed)
4. Effect deals 2 damage

### Unit with No Abilities

```typescript
{
  id: 'troop-1',
  name: 'Foot Soldier',
  types: [CardType.UNIT, CardType.TROOP],
  manaCost: 1,
  abilities: [],
  unitStats: { power: 2, resistance: 0, health: 1 },
}
```

When played:
1. Player pays 1 mana
2. Unit enters battlefield
3. No abilities activate

### Future: Unit with Activated Ability

```typescript
{
  id: 'future-card',
  name: 'Combat Medic',
  types: [CardType.UNIT, CardType.TROOP],
  manaCost: 2,
  abilities: [
    {
      type: AbilityType.ACTIVATED,
      description: '{1 mana}: Heal target unit for 2 health',
      cost: { mana: 1 },
      effects: [
        { target: TargetType.UNIT, type: EffectType.HEAL, value: 2 }
      ],
    },
  ],
  unitStats: { power: 1, resistance: 1, health: 2 },
}
```

Future implementation:
1. Player plays unit (pays 2 mana)
2. Unit enters battlefield
3. Later, player can activate ability (pays 1 mana)
4. Player selects target unit
5. Effect heals target

## Testing

The implementation includes comprehensive tests:

- **Action Validation Tests** (16 tests)
  - Priority validation
  - Resource cost validation
  - Target requirement checks
  - Composable check system
  
- **Ability Execution Tests** (12 tests)
  - Execute non-targeting effects
  - Set up target selection for targeting effects
  - Execute mixed targeting/non-targeting effects
  
- **Activated Ability Tests**
  - Validate mana costs
  - Pay ability costs
  - Check activation eligibility
  
- **Integration Tests**
  - Playing cards with abilities
  - Priority validation in moves
  - Target selection flow
  - All existing functionality maintained (143 total tests)

## Future Enhancements

### Chain and Reaction System
The validation system provides the foundation for implementing chains:
- Priority system is now in place for basic turn-based play
- Can be extended to support chain priority (both players can respond)
- Validation checks can include "can action be added to chain?"
- Cost payment and effect resolution already separated as required

**Implementation path for chains:**
1. Add chain state to game state
2. Extend priority check to support chain responses
3. Add "pass priority" action
4. Implement LIFO resolution when both players pass
5. Add reaction ability support

### Activated Abilities for Units
- Add move to activate unit abilities
- Implement timing restrictions
- Add tap cost support

### Trigger Conditions
- Define event system for triggers
- Implement specific trigger conditions
- Support multiple triggers per ability

### Static Abilities
- Implement continuous effect system
- Add state modification layer
- Handle ability activation/deactivation

### Reaction System
- Implement priority and chain system
- Add reaction timing rules
- Support reaction speed abilities

### Additional Effect Types
- Draw cards
- Destroy units
- Move cards between zones
- Modify stats
- Grant temporary abilities

### Cost Expansion
- Tap/untap costs
- Discard costs
- Sacrifice costs
- Life payment costs

## Migration Notes

The refactoring maintains backward compatibility:
- All existing tests pass (122 tests)
- No changes to game behavior for existing cards
- Card data updated to use abilities
- New ability system is extensible for future features

## References

- See `libs/game-models/src/lib/ability.ts` for type definitions
- See `libs/game-core/src/lib/effects/execute-ability.ts` for execution logic
- See `libs/game-core/src/lib/actions/action-validation.ts` for validation system
- See `libs/game-core/src/lib/moves/card-moves.ts` for action implementation
- See `docs/game-design.md` for game design context
- See `docs/taking-actions.md` for action flow diagrams

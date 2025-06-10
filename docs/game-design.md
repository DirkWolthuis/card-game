## Multiplayer card game

Inspired by Magic: The Gathering, Runeterra, Hearthstone, and 40K Warpforge.

## Unique gameplay:

- Players get the same starting deck, but cards evolve based on how they are used in game. Players will create a more unique deck over time. Simple cards get traits, while complex cards evolve into new and unique cards.
- Objective of the game: reduce the enemy commander to 0 health.
- Non-traditional battlefield with two lanes: the battle lane (for troops/captains that are cast in the battle lane) and the support lane (for leaders and captains cast in the support lane).
- Every player has a commander (functions the same as a leader), that starts the battle in the support lane, but if their commander hits zero health they lose the game.
- All cards have a mana cost.
- Players earn mana each turn, starting with 1 for turn one, ramping up to a max of ten per turn. Players lose mana at the start of their turn, and then gain mana for their turn. If they had mana left when gaining mana, they will receive one extra mana.
- Unit card attributes:
  - Speed
  - Health
  - Resistance
  - Power
- Permanent cards are cards that are kept in play until an ability says otherwise.
- Spells are one-time effects that are moved to the graveyard when resolved.
- Cards in play receive an action token, that can be spent on an action, like fighting/blocking in combat, or activating an ability.
- Card types:
  - Unit:
    - Troop (fighting units)
    - Captain (can be cast as troop or leader)
    - Leader (support units)
  - Spell:
    - Ritual (default spell)
    - Reaction (a spell that can be cast on a specific trigger)
    - Blitz (a spell that can't be countered)
  - Rift: permanent cards with abilities that affect (part of) the battlefield
  - Boons/Relics: permanent cards with abilities that affect units
- The stack is created when an ability is triggered and the other player can react to that ability by casting spells or triggering other abilities. When both players pass, the stacked abilities are resolved in reverse order (the last one added is resolved first).
- Ability:
  - Types:
  - Passive: continuous effect while the card is in play
  - Active: an effect that triggers, or is activated
  - Template:
    - Costs [COSTS]
    - When [TRIGGER]
    - Then [EFFECT]
    - Only [RESTRICTION]
- Turn structure:
  - Begin phase:
    - Start of begin phase effects
    - Restore mana
    - Restore action tokens
    - Draw card
    - End of begin phase effects
  - Magic Phase:
    - Start of magic phase effects
    - Cast cards
    - Trigger abilities
    - End of magic phase effects
  - Combat phase:
    - Start of combat phase effects
    - Combat
    - End of combat phase effects
  - End phase:
    - Start of end phase effects
    - Trigger abilities
    - End of end phase effects
- Combat:
  - Player with initiative declares which cards attack, defending player chooses which units block. A unit can only block when its speed is more than half the attacker's speed. If a creature's damage goes unblocked, the attacking player can choose the leader to allocate the damage to.

### Technical architecture

- State machines with XState everywhere
- Spawned machines that communicate with each other
- Client/server architecture

# Game design: Lords of Estraven - web-based online (trading) card game

Inspired by Magic: The Gathering, Runeterra, Hearthstone, and 40K Warpforge.

## Gameplay design

### Game setup

- The game is played 1 vs 1.
- Players have unique decks.
- Before playing, a player chooses a lord and starting deck (flavored as the province the lord rules over).
- Some cards will evolve based on how they are used in-game. Over time, players will create a more unique deck. Simple cards gain traits, while complex cards evolve into new and unique cards.
- The objective of the game: reduce the enemy lord to 0 health.
- Players earn mana each turn, starting with 1 on turn one, ramping up to a maximum of ten per turn. Players lose mana at the start of their turn, then gain mana for their turn. If they had mana left when gaining mana, they receive one extra mana.
- Players have:
  - A deck of n cards
  - A hand of drawn cards
  - A graveyard pile
  - An exile pile

### Cards in hand

- A player can have a maximum of n cards in their hand at the beginning of the end phase.
- If they exceed the maximum, they discard cards (send to the graveyard pile) until they reach the maximum size.

### The battlefield

- The battlefield is divided into two sections, one for each player. Each section has two lanes: the battle lane (for troops/captains cast in the battle lane) and the support lane (for leaders and captains cast in the support lane).
- Every player has a lord (functions the same as a leader), who starts the battle in the support lane.

### Phases

- The game is divided into sequential turns.
- The player going first is chosen at random.
- There is no maximum number of turns.
- Turn structure:
  - Restore phase:
    - Restore mana
    - Restore action tokens
    - Draw a card
  - Magic phase:
    - Cast cards
    - Activate abilities
  - End phase:
    - Discard cards

### Cards

- All cards have a mana cost (can be 0).
- Card types:
  - Unit (permanent):
    - Troop (fighting units)
    - Captain (can be cast as troop or leader)
    - Leader (support units)
  - Spell (non-permanent):
    - Ritual (default spell)
    - Reaction (a spell that can be cast on a specific trigger)
    - Blitz (a spell that can't be countered)
  - Rift (permanent): cards with abilities that affect (part of) the battlefield
  - Boons/Relics (permanent): cards with abilities that affect units
- Unit card attributes:
  - Speed
  - Health
  - Resistance
  - Power
- Permanent cards remain in play until an ability says otherwise.
- Spells are one-time effects that are moved to the graveyard when resolved.
- When unit cards lose health, it's permanent. If their health hits 0, the unit is killed and sent to the graveyard.

### Abilities and effects

- Every card has abilities; there are no actions in the game that are not abilities.
- Abilities have effects; effects change the game state.
- Ability types:
  - Aura: continuous passive effect while the ability is in play
  - Activated: an ability that needs to be activated and then produces an effect
  - Triggered: an ability that is triggered by a trigger (such as other effects or game states) and produces an effect
- Before the effect of an ability is resolved, the ability is placed on a stack. Other abilities can react to this ability. Those abilities are also placed on the stack. When both players pass, the stacked abilities are resolved in reverse order (the last one added is resolved first).
- Ability template:
  - Cost [COSTS]
  - When [TRIGGER]
  - Then [EFFECT]
  - Only [RESTRICTION]

Example:
Fight ability:

- Cost [1 Action token]
- Then [Deal damage (equal to strength - resistance)]

Block ability:

- When [A fight ability is added to the stack]
- Then [Block attacking creature]

Counter spell ability as part of a ritual card:

- When [A spell card ability is added to the stack]
- Effect [Remove that card from the stack]

Notes:

- No costs, because the mana value is already paid for this card.
- Blitz spells are not excluded in the Counter spell ability, because those spell abilities do not create a stack.

Ideas:

- EXP earning, for individual cards, leaders, or players → to mutate cards or buy abilities
- Players can tweak the visuals of their own cards, for example naming and art, providing flavor/themes
- Lords of Estraven: when starting, players choose a lord and a province (province = starting deck, lord = their commander)
- Troops can evolve into lords? Something like Shadows of Mordor

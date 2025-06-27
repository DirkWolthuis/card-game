## Multiplayer card game

Inspired by Magic: The Gathering, Runeterra, Hearthstone, and 40K Warpforge.

Working title: Lords of Estraven

## Game design:

### Game

- The game is played 1 vs 1
- Players have unique decks
- Before playing, a player chooses a lord and starting deck (flavoured as province the lords rules over)
- Some cards will evolve based on how they are used in-game. In time, players will create a more unique deck. Simple cards gain traits, while complex cards evolve into new and unique cards.
- The objective of the game: reduce the enemy lord to 0 health.
- Players earn mana each turn, starting with 1 on turn one, ramping up to a maximum of ten per turn. Players lose mana at the start of their turn, then gain mana for their turn. If they had mana left when gaining mana, they receive one extra mana.
- Players have:
  - A deck of nth cards
  - A hand of drawn cards
  - A graveyard pile
  - A exile pile

### Cards in hand

- Player can have max n cards in their hand at the beginning of the end phase
- If they exceed the maximum, they discard cards (send to the graveyard pile) untul they reach the maximum size

### The battlefield

- The battlefield is divided into two sections for each player. A section has two lanes: the battle lane (for troops/captains cast in the battle lane) and the support lane (for leaders and captains cast in the support lane).
- Every player has a lord (functions the same as a leader), who starts the battle in the support lane.

### Phases

- The game is divided in sequential turns
- The player going first is chosen at random
- No max amount of turns
- Turn structure:
  - Restore phase:
    - Restore mana
    - Restore action tokens
    - Draw card
  - Magic phase:
    - Cast cards
    - Activate abilities
  - End phase:
    - Discard card

### Cards

- All cards have a mana cost (can be 0)
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
- Permanent cards remain in play until an ability says otherwise
- Spells are one-time effects that are moved to the graveyard when resolved
- When unit cards loose health, it's permanent. If their health hits 0, the unit is killed and send to the graveyard

### Abilities and effects

- Every card has abilities, there a no actions in the game that are not abilities
- Abilities have effects, effects change the game state
- Ability types:
  - Aura: continuous passive effect while the ability is in play
  - Activated: an ability that needs to be activated and the produces an effect
  - Triggered: an ability that is triggered by a trigger (such as other effects or game states) and produces an effect
- Before effect of an ability is resolved, the ability is placed on a stack. Other abilities can react to this ability. Those abilities are also placed on the stack. When both players pass, the stacked abilities are resolved in reverse order (the last one added is resolved first)
- Ability template:
  - Cost [COSTS]
  - When [TRIGGER]
  - Then [EFFECT]
  - Only [RESTRICTION]

Example:
Fight ability:

- Cost [1 Action token]
- Then [Deal damage (equal to strength - resitance)]

Block ability:

- When [A fight ability is added to the stack]
- Then [Assign blocker to fight ability]

Counter spell ability as part of a ritual card

- When [A spell card ability is added to the stack]
- Effect [Remove that card from the stack]

Notes:

- No costs, because the mana value is already payed for this card
- Blitz spells are not excluded in the Counter spell ability, because those spell abilites do not create a stack

### MVP

We are working on an MVP with the main goal of playtesting the mechanics of the game. The front-end application should only focus on allowing for the necessary interaction and debugging. Design and flavour are out of scope.

Requirements:

- A backend with a queue mechanism that functions as the core game engine
- The core game engine is built with the ECS (entity component system) architecture
- A frontend that can receive/send events
- Two players can connect via a game ID
- An endpoint that returns a mock deck based on a user ID
- All phases are implemented and players can:
  - Draw cards
  - Play cards
    - Play rituals
    - Summon troops to the battlefield
  - Combat
    - Declare attackers
    - Declare blockers
    - Assign damage
    - Pass combat

Tech stack:

- Frontend:
  - React
  - Xstate
  - TailwindCSS
- Backend:
  - NodeJS
  - Game engine queue / ECS

Ideas:

- EXP earning, for individual cards, leaders, or players → to mutate cards or buy abilities
- Players can tweak the visuals of their own cards, for example naming and art, providing flavour/themes
- Lords of Estraven: when starting, players choose a lord and a province (province = starting deck, lord = their commander)
- Troops can evolve into lords? Something like Shadows of Mordor

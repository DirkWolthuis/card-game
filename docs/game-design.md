# Lords of Estraven (LOE) Card Game Design v2

---

## Table of Contents

- [Game Setup](#game-setup)
- [Turn Structure](#turn-structure)
- [Card Types](#card-types)
- [Combat Mechanics](#combat-mechanics)
- [Resource System](#resource-system)
- [Marketplace](#marketplace)

---

## Game Setup

**Deck Construction:**

- Players choose two pre-constructed 20 card decks (40 cards total)

**Starting Conditions:**

- Players start with 20 health each

**Shared Resources:**

- There is a shared resource cards deck containing 20 resource cards
- 5 resource cards are placed face-up in the marketplace at the start of the game

---

## Turn Structure

**Start of Turn:**

- Draw cards until you have 7 cards in hand

**Main Phase:**

- Play cards from hand
- Activate abilities on cards you control
- Attack with Leaders
- Interact with the marketplace

**End of Turn:**

- Discard down to a maximum of 7 cards in hand
- Damage on Troop units resets

---

## Card Types

**Unit Cards:**

- Unit cards are cards that enter the battlefield

**Leader Cards:**

- Unit Leader cards can attack
- Only one Leader can attack each of your turns (by tapping it)
- Leaders can attack the same turn as they are played, but most cards will enter tapped
- Leaders have a keyword: `Leader - {Troop type} (X)` (e.g., `Leader - Zombie (5)`)
  - This indicates how many Troops of that type can join the attacking Leader
- Damage on Leaders is permanent but can be healed by effects
- When attacking, a Leader can choose to target the player or another unit Leader

**Troop Cards:**

- Unit Troop cards can join an attacking Leader
- Unit Troop cards can block as a reaction to an attacking unit
- Damage on Troops resets at the end of each turn

---

## Combat Mechanics

**Attacking:**

- Attacking is an activated ability, just like playing a card
- Only one Leader can attack per turn (by tapping it)
- When a Leader attacks, Troop entities can join the attack based on the Leader's keyword

**Blocking:**

- Players can block attacking Leaders by tapping their own Leaders
- Any number of Leaders can block a single attacker
- Blocking is a reaction

**Troop Combat:**

- When an attacking Leader is joined by Troops, only the Troop units can be blocked
- Excess damage from blocked Troops is allocated to the attacking Leader
- Example: A Leader attacks with 2x 2/2 Zombie Troops. Each is blocked by a 3/3 Troop. The 2 excess damage points are allocated to the attacking Leader.

---

## Resource System

**Pitching Cards for Mana:**

- Pitch any card for mana by playing it upside down for its pitch value (1, 2, or 3)
- Pitching cards can be done as an instant speed action
- When mana is used, the pitched card goes to the graveyard

**Unused Pitch Cards:**

- Unused pitch cards return to hand and deal one damage to player
- Partially used pitch cards go to the graveyard

**Additional Resource Costs:**

- Big cards need additional resources, like resource cards that need to be sacrificed (subjects/materials/influence)

**Deck Depletion:**

- When deck is empty, player loses the game
- Important to manage card usage: if you use many cards to pitch/generate mana, you must close the game quickly or you will burn through resources too fast

---

## Marketplace

**Shared Resource Deck:**

- 20 resource cards in a shared deck
- 5 cards are face-up in the market at all times

**Market Refresh:**

- At the end of each round (after all players have taken a turn), cards refresh (first in, first out)

**Trading:**

- In their turn, players can swap one card from their hand with a card in the marketplace
- Note: Cards that opponents previously traded into the marketplace are available for all players to swap
- Players can play as many resource cards during their turn as they want

# MVP Design Questions

This document outlines the open questions that need to be answered to create a Minimum Viable Product (MVP) for Lords of Estraven.

---

## Table of Contents

- [Card Design](#card-design)
- [Combat System](#combat-system)
- [Resource System](#resource-system)
- [Marketplace](#marketplace)
- [Game Balance](#game-balance)
- [Win Conditions](#win-conditions)
- [Game Flow](#game-flow)

---

## Card Design

### Unit Cards

- [ ] What stats do unit cards have? (Attack/Defense/Health?)
- [ ] How do we represent the pitch value (1/2/3) on cards?
- [ ] What is the distribution of pitch values across card types?
- [ ] Do all cards have a pitch value, or only certain types?

### Leaders

- [ ] What are the base stats for Leader cards?
- [ ] How many different Troop types will exist? (e.g., Zombie, Soldier, etc.)
- [ ] What is the maximum number of Troops a Leader can lead? (The example shows 5)
- [ ] Can Leaders have abilities beyond their leadership keyword?

### Troops

- [ ] What are the base stats for Troop cards?
- [ ] Can Troops exist on the battlefield without a Leader?
- [ ] How are Troops summoned? (Same as other cards?)
- [ ] Do Troops tap when attacking or blocking?

### Other Card Types

- [ ] Will there be spell/instant cards?
- [ ] Will there be equipment/attachment cards?
- [ ] Will there be enchantment/continuous effect cards?

---

## Combat System

### Attacking

- [ ] What happens if a Leader attacks but no Troops join?
- [ ] Can a Leader attack without any Troops?
- [ ] If a Leader is blocked, what determines combat resolution?
- [ ] How is damage calculated between Leader vs Leader combat?

### Blocking

- [ ] Can Troops block without a Leader?
- [ ] How many Troops can block a single attacking Troop?
- [ ] If multiple Leaders block, how is damage distributed?
- [ ] Can you choose not to block?

### Damage Resolution

- [ ] How exactly is excess damage calculated and assigned?
- [ ] What happens when a Leader takes lethal damage during their attack?
- [ ] Does the attacking player or blocking player assign damage?

---

## Resource System

### Pitching

- [ ] When can you pitch cards? (Only during your turn, or anytime?)
- [ ] Is there a limit to how many cards you can pitch per turn?
- [ ] Can you pitch cards in response to opponent actions?
- [ ] What happens if you pitch a card but don't use all the mana? (Specified: returns to hand, deals 1 damage)

### Resource Cards

- [ ] What types of resources exist? (Subjects/Materials/Influence mentioned)
- [ ] What is the cost range for cards? (How much mana do cards typically cost?)
- [ ] How do sacrifice costs work? (Tap? Discard? Destroy?)
- [ ] Can resource cards be pitched for mana as well?

### Mana Pool

- [ ] Does unused mana empty at end of turn or end of phase?
- [ ] Is there a mana pool limit?
- [ ] Can mana be stored between turns?

---

## Marketplace

### Market Mechanics

- [ ] How does "first in, first out" refresh work exactly?
- [ ] When exactly does the market refresh? (After all players take a turn?)
- [ ] What happens if the resource card deck runs out?
- [ ] Can you view cards in the resource deck?

### Trading

- [ ] Is there a cost to swap cards with the marketplace?
- [ ] Can you swap any card type, or only certain types?
- [ ] What does "including cards from opponents" mean? (Cards they've traded in?)
- [ ] Is there a limit to how many swaps per turn?

---

## Game Balance

### Starting Resources

- [ ] Do players start with any cards on the battlefield?
- [ ] Is there a mulligan system?
- [ ] Do players draw 7 cards on the first turn?
- [ ] Does the second player get any compensation for going second?

### Card Economy

- [ ] What is the composition of the pre-constructed 20 card decks? (How many Leaders, Troops, other cards?)
- [ ] What is the ratio of Leaders to Troops to other cards?
- [ ] How fast should games end? (What's the target game length?)
- [ ] At what point does deck depletion become a real concern?

### Damage and Health

- [ ] What is the typical damage output per turn?
- [ ] How much healing should be available in the game?
- [ ] Is 20 starting health the right amount?
- [ ] Should there be a maximum health?

---

## Win Conditions

### Victory

- [ ] Primary win: Reduce opponent to 0 health?
- [ ] Are there alternative win conditions?
- [ ] What happens if both players would lose simultaneously?

### Loss Conditions

- [ ] Deck depletion is a loss - is this the only deck-related loss?
- [ ] Can you concede?
- [ ] Are there any draw conditions?

---

## Game Flow

### Turn Order

- [ ] How is first player determined?
- [ ] Does first player skip their draw phase?
- [ ] Is there priority/response windows during opponent's turn?

### Timing and Priority

- [ ] When can reactions be played?
- [ ] Is there a stack for resolving multiple effects?
- [ ] Can you respond to marketplace actions?
- [ ] Can you pitch cards during opponent's turn to pay for reactions?

### Phases

- [ ] Are there distinct phases (draw, main, combat, end)?
- [ ] Can you play cards after attacking?
- [ ] When exactly does Troop damage reset?

---

## Implementation Questions (for Digital Version)

### MVP Scope

- [ ] What is the minimum number of unique card designs needed?
- [ ] How many pre-constructed decks should be available at launch?
- [ ] Is multiplayer (2+ players) needed for MVP?
- [ ] Should there be AI opponents for single player?

### User Interface

- [ ] How should the marketplace be visually represented?
- [ ] How should pitching cards be implemented (drag? button?)
- [ ] How should attacking/blocking assignments be shown?
- [ ] How should the "tapped" state be visualized?

---

## Next Steps

1. Prioritize which questions need answers for a playable prototype
2. Create paper prototype to test core mechanics
3. Define minimum card set for initial playtesting
4. Document answers as they are determined

---

*This document should be updated as design decisions are made. Check off items as questions are answered and update `game-design.md` accordingly.*

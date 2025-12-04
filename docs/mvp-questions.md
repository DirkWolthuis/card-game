# MVP Design Questions

This document outlines the open questions that need to be answered to create a Minimum Viable Product (MVP) for Lords of Estraven.

> **Note**: Items marked with [x] have been addressed in `game-design.md`.

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

- [x] What stats do unit cards have? (Attack/Defense/Health?) → **Attack and Health**
- [ ] How do we represent the pitch value (1/2/3) on cards?
- [ ] What is the distribution of pitch values across card types?
- [x] Do all cards have a pitch value, or only certain types? → **All cards have a pitch value**

### Leaders

- [ ] What are the base stats for Leader cards?
- [ ] How many different Troop types will exist? (e.g., Zombie, Soldier, etc.)
- [x] What is the maximum number of Troops a Leader can lead? → **Defined by the (X) in the keyword**
- [ ] Can Leaders have abilities beyond their leadership keyword?

### Troops

- [ ] What are the base stats for Troop cards?
- [x] Can Troops exist on the battlefield without a Leader? → **Yes**
- [ ] How are Troops summoned? (Same as other cards?)
- [x] Do Troops tap when attacking or blocking? → **Yes**

### Other Card Types

- [ ] Will there be spell/instant cards?
- [ ] Will there be equipment/attachment cards?
- [ ] Will there be enchantment/continuous effect cards?

---

## Combat System

### Attacking

- [x] What happens if a Leader attacks but no Troops join? → **Leader attacks alone**
- [x] Can a Leader attack without any Troops? → **Yes**
- [ ] If a Leader is blocked, what determines combat resolution?
- [ ] How is damage calculated between Leader vs Leader combat?

### Blocking

- [x] Can Troops block without a Leader? → **Yes**
- [ ] How many Troops can block a single attacking Troop?
- [ ] If multiple Leaders block, how is damage distributed?
- [x] Can you choose not to block? → **Yes, blocking is optional**

### Damage Resolution

- [x] How exactly is excess damage calculated and assigned? → **Excess damage beyond Troop's Health spills to attacking Leader**
- [x] What happens when a Leader takes lethal damage during their attack? → **Destroyed after combat resolves**
- [ ] Does the attacking player or blocking player assign damage?

---

## Resource System

### Pitching

- [x] When can you pitch cards? (Only during your turn, or anytime?) → **Instant speed, anytime**
- [x] Is there a limit to how many cards you can pitch per turn? → **No limit**
- [x] Can you pitch cards in response to opponent actions? → **Yes**
- [x] What happens if you pitch a card but don't use all the mana? → **Returns to hand, deals 1 damage per card**

### Resource Cards

- [x] What types of resources exist? → **Subjects, Materials, Influence**
- [ ] What is the cost range for cards? (How much mana do cards typically cost?)
- [x] How do sacrifice costs work? → **Destroy from battlefield**
- [ ] Can resource cards be pitched for mana as well?

### Mana Pool

- [x] Does unused mana empty at end of turn or end of phase? → **End of phase**
- [ ] Is there a mana pool limit?
- [x] Can mana be stored between turns? → **No**

---

## Marketplace

### Market Mechanics

- [x] How does "first in, first out" refresh work exactly? → **Oldest card is discarded, new card revealed**
- [x] When exactly does the market refresh? → **End of each round (after all players take a turn)**
- [x] What happens if the resource card deck runs out? → **No new cards revealed, remaining face-up cards stay**
- [ ] Can you view cards in the resource deck?

### Trading

- [x] Is there a cost to swap cards with the marketplace? → **No cost**
- [ ] Can you swap any card type, or only certain types?
- [ ] What does "including cards from opponents" mean? (Cards they've traded in?)
- [x] Is there a limit to how many swaps per turn? → **One per turn (your turn only)**

---

## Game Balance

### Starting Resources

- [ ] Do players start with any cards on the battlefield?
- [ ] Is there a mulligan system?
- [x] Do players draw 7 cards on the first turn? → **Yes, both players draw 7; first player skips draw on turn 1**
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

- [x] Primary win: Reduce opponent to 0 health? → **Yes**
- [x] Are there alternative win conditions? → **Opponent cannot draw (deck depletion)**
- [x] What happens if both players would lose simultaneously? → **Draw**

### Loss Conditions

- [x] Deck depletion is a loss - is this the only deck-related loss? → **Yes**
- [ ] Can you concede?
- [x] Are there any draw conditions? → **Yes, simultaneous loss**

---

## Game Flow

### Turn Order

- [x] How is first player determined? → **Random**
- [x] Does first player skip their draw phase? → **Yes, skip draw on turn 1**
- [x] Is there priority/response windows during opponent's turn? → **Yes (reactions, pitching)**

### Timing and Priority

- [x] When can reactions be played? → **After attackers are declared (blocking)**
- [ ] Is there a stack for resolving multiple effects?
- [ ] Can you respond to marketplace actions?
- [x] Can you pitch cards during opponent's turn to pay for reactions? → **Yes**

### Phases

- [x] Are there distinct phases (draw, main, combat, end)? → **Start (untap + draw), Main, End**
- [ ] Can you play cards after attacking?
- [x] When exactly does Troop damage reset? → **End of each turn, during End phase**

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

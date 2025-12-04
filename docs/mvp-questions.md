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

- [x] What stats do unit cards have? (Attack/Defense/Health?)
  - **Troops**: Power / Toughness (when Toughness reaches zero, unit is destroyed)
  - **Leaders**: Power / Resistance / Health (takes damage equal to attacker's Power - Resistance, reduces health. When health reaches zero, unit is destroyed)
- [x] How do we represent the pitch value (1/2/3) on cards?
  - Pitch value is printed on the front of the card
- [ ] What is the distribution of pitch values across card types?
- [x] Do all cards have a pitch value, or only certain types?
  - All cards have a pitch value, but some special cards may have a value of 0

### Leaders

- [ ] What are the base stats for Leader cards?
  - TBD: Need to experiment with playtesting
- [x] How many different Troop types will exist? (e.g., Zombie, Soldier, etc.)
  - Card design is out of scope; cards can be added at any time
- [x] What is the maximum number of Troops a Leader can lead? (The example shows 5)
  - No maximum
- [x] Can Leaders have abilities beyond their leadership keyword?
  - Yes, triggered abilities and activated abilities with costs, noted as: `{cost}: {effect}`

### Troops

- [ ] What are the base stats for Troop cards?
  - TBD: Need to experiment with playtesting
- [x] Can Troops exist on the battlefield without a Leader?
  - Yes, because they can have effects or block
- [x] How are Troops summoned? (Same as other cards?)
  - Same as other cards, or created by other effects
- [x] Do Troops tap when attacking or blocking?
  - Yes

### Other Card Types

- [x] Will there be spell/instant cards?
  - Yes, Spells and Reactions. Reactions are like instants, but more scoped when they can be used
- [x] Will there be equipment/attachment cards?
  - Later, not in MVP
- [x] Will there be enchantment/continuous effect cards?
  - Later, not in MVP

---

## Combat System

### Attacking

- [x] What happens if a Leader attacks but no Troops join?
  - It can be blocked directly, but combat functions the same
- [x] Can a Leader attack without any Troops?
  - Yes
- [x] If a Leader is blocked, what determines combat resolution?
  - Leader deals damage equal to its Power to all blockers (no assigning damage individually). Blockers deal damage to Leader equal to (blocker's Power - Leader's Resistance), only if Power > Resistance
- [x] How is damage calculated between Leader vs Leader combat?
  - Same as above. The Resistance value is not reduced when multiple units block a Leader

### Blocking

- [x] Can Troops block without a Leader?
  - Yes
- [x] How many Troops can block a single attacking Troop?
  - As many as you want, but Leaders can have abilities to limit the number of blockers
- [ ] If multiple Leaders block, how is damage distributed?
  - TBD
- [x] Can you choose not to block?
  - Yes

### Damage Resolution

- [x] How exactly is excess damage calculated and assigned?
  - When Power is greater than Toughness or Resistance, there is excess damage
- [x] What happens when a Leader takes lethal damage during their attack?
  - All damage happens at the same time, then there is a check for what units are destroyed
- [x] Does the attacking player or blocking player assign damage?
  - There is no assigning damage (Leaders deal damage to all blockers equally)

---

## Resource System

### Pitching

- [x] When can you pitch cards? (Only during your turn, or anytime?)
  - Anytime you have priority
- [x] Is there a limit to how many cards you can pitch per turn?
  - No
- [x] Can you pitch cards in response to opponent actions?
  - Yes
- [x] What happens if you pitch a card but don't use all the mana? (Specified: returns to hand, deals 1 damage)
  - If partially used, the card is discarded at the beginning of your turn. If no mana was used, it returns to hand and deals 1 damage (also at the beginning of your turn)

### Resource Cards

- [x] What types of resources exist? (Subjects/Materials/Influence mentioned)
  - Subjects, Materials, Influence
- [ ] What is the cost range for cards? (How much mana do cards typically cost?)
  - TBD
- [x] How do sacrifice costs work? (Tap? Discard? Destroy?)
  - Specified on each card. Could be tap and sacrifice, or just sacrifice
- [x] Can resource cards be pitched for mana as well?
  - No

### Mana Pool

- [x] Does unused mana empty at end of turn or end of phase?
  - No
- [x] Is there a mana pool limit?
  - No
- [x] Can mana be stored between turns?
  - Yes, you can pitch a card and use the mana later

---

## Marketplace

### Market Mechanics

- [x] How does "first in, first out" refresh work exactly?
  - At the start of the game, 5 cards are revealed. At the start of each subsequent round:
    1. Remove the oldest card (first revealed)
    2. Shift remaining cards to fill the gap
    3. Add a new card from the resource deck
- [x] When exactly does the market refresh? (After all players take a turn?)
  - At the start of each round (after all players have taken a turn)
- [x] What happens if the resource card deck runs out?
  - It doesn't. Resource cards (and traded cards) are shuffled back into the resource deck
- [x] Can you view cards in the resource deck?
  - No

### Trading

- [x] Is there a cost to swap cards with the marketplace?
  - No, just a once per turn restriction
- [x] Can you swap any card type, or only certain types?
  - Any
- [x] What does "including cards from opponents" mean? (Cards they've traded in?)
  - Yes, cards traded in by opponents are available in the marketplace
- [x] Is there a limit to how many swaps per turn?
  - Yes, once per turn

---

## Game Balance

### Starting Resources

- [x] Do players start with any cards on the battlefield?
  - No
- [x] Is there a mulligan system?
  - Not in the MVP
- [x] Do players draw 7 cards on the first turn?
  - Yes
- [x] Does the second player get any compensation for going second?
  - Not in the MVP

### Card Economy

- [ ] What is the composition of the pre-constructed 20 card decks? (How many Leaders, Troops, other cards?)
  - TBD
- [ ] What is the ratio of Leaders to Troops to other cards?
  - TBD
- [ ] How fast should games end? (What's the target game length?)
  - TBD
- [ ] At what point does deck depletion become a real concern?
  - TBD

### Damage and Health

- [ ] What is the typical damage output per turn?
  - TBD
- [ ] How much healing should be available in the game?
  - TBD
- [ ] Is 20 starting health the right amount?
  - TBD
- [x] Should there be a maximum health?
  - No

---

## Win Conditions

### Victory

- [x] Primary win: Reduce opponent to 0 health?
  - Yes
- [x] Are there alternative win conditions?
  - Yes, but not in MVP
- [x] What happens if both players would lose simultaneously?
  - Draw

### Loss Conditions

- [x] Deck depletion is a loss - is this the only deck-related loss?
  - Yes, for the MVP
- [x] Can you concede?
  - Yes, but not in MVP
- [x] Are there any draw conditions?
  - No, except both players losing at the same time

---

## Game Flow

### Turn Order

- [x] How is first player determined?
  - Random
- [x] Does first player skip their draw phase?
  - Not relevant; there is no draw extra card. All players start at 7
- [x] Is there priority/response windows during opponent's turn?
  - Yes

### Timing and Priority

- [x] When can reactions be played?
  - When a relevant action is played/activated and you get priority
- [x] Is there a stack for resolving multiple effects?
  - Yes, based on MTG stack. May need to simplify more
- [x] Can you respond to marketplace actions?
  - If a reaction card/ability allows it, yes
- [x] Can you pitch cards during opponent's turn to pay for reactions?
  - Yes

### Phases

- [x] Are there distinct phases (draw, main, combat, end)?
  - Yes: Start (untap, handle pitched cards, draw to 7), Main (play cards, abilities, attack, trade), End (discard to 7, troop damage resets)
- [x] Can you play cards after attacking?
  - Yes, during the main phase
- [x] When exactly does Troop damage reset?
  - At end of turn (during End phase)

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

## Summary

Many core design questions have been answered. The remaining open questions are primarily:

1. **Balance questions** (base stats, damage output, health values, deck composition) - require playtesting
2. **Implementation questions** (UI/UX, MVP scope) - for digital version development
3. **Pitch value distribution** - card design specific

---

## Next Steps

1. ~~Prioritize which questions need answers for a playable prototype~~ (Done - core mechanics are defined)
2. Create paper prototype to test core mechanics
3. Determine base stats through playtesting
4. Define minimum card set for initial playtesting

---

*This document should be updated as design decisions are made. Check off items as questions are answered and update `game-design.md` accordingly.*

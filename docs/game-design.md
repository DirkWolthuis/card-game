# Lords of Estraven (LOE) — Game Design v2

## Game Setup

- Each player selects two pre-constructed 20-card decks (40 cards total)
- Each player starts with 20 health
- A shared marketplace contains 20 resource cards, with 5 face-up at game start
- First player is determined randomly
- All players draw 7 cards to start

---

## Turn Structure

| Phase | Actions |
|-------|---------|
| **Start** | Untap all your cards; handle pitched cards (partially used → discard, unused → return to hand and deal 1 damage); draw to 7 cards |
| **Main** | Play cards, activate abilities, attack, trade in marketplace |
| **End** | Discard down to 7 cards; troop damage resets |

---

## Card Types

### Units

Units are cards that enter the battlefield. All units can block by tapping. Only untapped units can attack or block. Units tap when attacking or blocking.

#### Unit Stats

- **Troops**: Power / Toughness
  - When Toughness reaches zero, unit is destroyed
  - Damage resets at end of turn
- **Leaders**: Power / Resistance / Health
  - Takes damage equal to (attacker's Power - Leader's Resistance)
  - Only takes damage when attacker's Power exceeds Resistance
  - When Health reaches zero, unit is destroyed
  - Damage is permanent (can be healed by effects)

### Leaders

- Only **one Leader** may attack per turn (by tapping)
- Leaders can attack the turn they're played (unless they enter tapped)
- Attack target: opponent's health **or** another Leader
- Leaders deal damage equal to their Power to **all** blockers (no assigning damage individually)
- Keyword `Leader - {Troop type}` defines which troop types can join attacks
- No maximum number of Troops that can join a Leader's attack (unless specified by abilities)
- Leaders can have triggered and activated abilities with costs, noted as: `{cost}: {effect}`

### Troops

- Join an attacking Leader by tapping (must match Leader's troop type)
- Block attacking units as a reaction (by tapping)
- Can exist on the battlefield without a Leader
- Summoned the same as other cards, or created by effects
- Multiple blockers can gang up on a single attacking Troop

### Spells

- One-time effects that go to the graveyard after resolving
- Played during your main phase

### Reactions

- Similar to instants but with scoped conditions for when they can be used
- Can be played when a relevant action is played/activated and you have priority
- Played during either player's turn when conditions are met

---

## Combat

### Attacking

1. Declare one untapped Leader as attacker (tap it)
2. Choose target: opponent or enemy Leader
3. Untapped Troops matching the Leader's type may join (they tap)
4. A Leader can attack without any Troops joining

### Blocking

- Blocking is a **reaction**
- Any untapped unit may block by tapping
- Multiple blockers can gang up on one attacker
- Troops can block without a Leader on the battlefield
- You can choose not to block
- Leaders can have abilities that limit the number of blockers

### Damage Resolution

- All damage happens simultaneously, then destroyed units are determined
- **Leader vs Blockers**: Leader deals damage equal to its Power to all blockers; blockers deal damage to Leader equal to (blocker's Power minus Leader's Resistance), but only when blocker's Power exceeds Leader's Resistance
- **Troop vs Blockers**: Compare Power vs Toughness
- Excess damage: When Power is greater than Toughness (for Troops) or Resistance (for Leaders)
- When a Leader attacks but is blocked, combat functions the same as if Troops joined

---

## Priority and the Stack

- Players can respond to actions when they have priority
- Multiple effects resolve using a stack system (based on MTG rules)
- Priority passes between players during key moments
- You can pitch cards during opponent's turn to pay for reactions

---

## Resources

### Pitching for Mana

- Any card can be pitched for its pitch value (1, 2, or 3 mana)
- **Pitch value is printed on the front of the card**
- All cards have a pitch value, though some special cards may have a value of 0
- Pitching is **instant speed** — can be done anytime you have priority
- No limit to how many cards you can pitch per turn
- Can pitch cards in response to opponent actions
- **At the beginning of your turn**:
  - Partially used pitched cards → graveyard
  - Unused pitched cards → return to hand and deal 1 damage to you

### Mana Pool

- Unused mana does **not** empty at end of turn or phase
- No mana pool limit
- Mana can be stored between turns

### Resource Cards

- Three types: Subjects, Materials, Influence
- Resource cards **cannot** be pitched for mana
- Sacrifice costs are specified on each card (may require tap, discard, destroy, etc.)

### Deck Depletion

- **Empty deck = you lose**
- Balance mana usage: over-pitching burns through your deck

---

## Marketplace

- **Shared deck**: 20 resource cards, 5 face-up at game start
- **Refresh**: At the start of each round, the oldest card (first revealed) is removed and all cards shift; a new card is added from the resource deck
- **Trade**: Once per turn, swap any card from your hand with any marketplace card (including cards traded in by opponents)
- Cards removed from marketplace and traded cards are shuffled back into the resource deck
- Resource deck does not run out (cards cycle back)
- Cannot view cards in the resource deck
- Reactions to marketplace actions are possible if a reaction card/ability allows it
- Play unlimited resource cards per turn

---

## Win Conditions

### Victory

- Reduce opponent to 0 health

### Loss

- Your health reaches 0
- Your deck is empty (deck depletion)

### Draw

- If both players would lose simultaneously, the game is a draw

---

## Out of MVP Scope

The following features are planned but not included in the MVP:

- Equipment/attachment cards
- Enchantment/continuous effect cards
- Alternative win conditions
- Mulligan system
- Compensation for going second
- Concede option

---

## Glossary

| Term | Definition |
|------|------------|
| **Activated ability** | An ability with a cost that can be activated by paying that cost, noted as `{cost}: {effect}` |
| **Battlefield** | The play area where units exist after being played from hand |
| **Block** | A reaction where a unit intercepts an attacking unit to prevent damage |
| **Deck** | A player's draw pile; running out means you lose |
| **FIFO** | First In, First Out — oldest items are removed first |
| **Graveyard** | Discard pile where used or destroyed cards go |
| **Health** | A player's or Leader's life total; reaching 0 means defeat/destruction |
| **Instant speed** | An action that can be performed at any time, even during opponent's turn |
| **Mana** | Resource used to pay for cards and abilities; generated by pitching |
| **Pitch** | Playing a card to generate mana equal to its pitch value (1–3) |
| **Pitch value** | The mana a card produces when pitched (printed on the front as 1, 2, or 3) |
| **Power** | A unit's offensive strength; determines damage dealt in combat |
| **Priority** | The right to take an action or respond; passes between players |
| **Reaction** | A scoped instant-speed action that can be played when specific conditions are met |
| **Resistance** | A Leader's defensive stat; reduces incoming damage (only takes damage when attacker's Power > Resistance) |
| **Round** | A complete cycle where all players have taken one turn |
| **Spell** | A one-time effect card that goes to graveyard after resolving |
| **Stack** | A system for resolving multiple effects in order (last in, first out) |
| **Tap** | Turning a card sideways to indicate it has been used this turn |
| **Toughness** | A Troop's defensive stat; when reduced to 0, the Troop is destroyed |
| **Triggered ability** | An ability that automatically triggers when a specific condition is met |
| **Turn** | One player's complete sequence of phases (Start → Main → End) |
| **Untap** | Returning a tapped card to upright position, making it usable again |

# Lords of Estraven (LOE) — Game Design v2

## Game Setup

- Each player selects two pre-constructed 20-card decks (40 cards total)
- Each player starts with 20 health
- A shared marketplace contains 20 resource cards, with 5 face-up at game start

---

## Turn Structure

| Phase | Actions |
|-------|---------|
| **Start** | Untap all your cards, then draw to 7 cards in hand |
| **Main** | Play cards, activate abilities, attack, trade in marketplace |
| **End** | Discard down to 7 cards; troop damage resets |

---

## Card Types

### Units

Units are cards that enter the battlefield. All units can block by tapping. Only untapped units can attack or block.

### Leaders

- Only **one Leader** may attack per turn (by tapping)
- Leaders can attack the turn they're played (unless they enter tapped)
- Attack target: opponent's health **or** another Leader
- **Damage is permanent** (can be healed by effects)
- Keyword `Leader - {Troop type} (X)` defines which troops can join (e.g., `Leader - Zombie (5)`)

### Troops

- Join an attacking Leader by tapping (up to the Leader's X limit)
- Block attacking units as a reaction (by tapping)
- **Damage resets** at end of turn

---

## Combat

### Attacking

1. Declare one untapped Leader as attacker (tap it)
2. Choose target: opponent or enemy Leader
3. Untapped Troops matching the Leader's type may join (they tap)

### Blocking

- Blocking is a **reaction**
- Any untapped unit may block by tapping
- Multiple blockers can gang up on one attacker

### Damage Resolution

- When Troops join an attack, only the Troops can be blocked
- Excess damage from blocked Troops spills to the attacking Leader
- *Example: Leader attacks with 2× 2/2 Zombies. Each blocked by a 3/3 → 2 excess damage hits the Leader*

---

## Resources

### Pitching for Mana

- Play any card face-down for its pitch value (1, 2, or 3 mana)
- Pitching is **instant speed**
- Used pitch cards → graveyard
- Unused pitch cards → return to hand and deal 1 damage to you
- Partially used pitch cards → graveyard

### Additional Costs

- Powerful cards require sacrificing resource cards (subjects, materials, influence)

### Deck Depletion

- **Empty deck = you lose**
- Balance mana usage: over-pitching burns through your deck

---

## Marketplace

- **Shared deck**: 20 resource cards, 5 face-up
- **Refresh**: End of each round, oldest card cycles out (FIFO)
- **Trade**: Once per turn, swap a hand card with any marketplace card
- Play unlimited resource cards per turn

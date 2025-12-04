# Lords of Estraven (LOE) — Game Design v2

## Game Setup

- Each player selects two pre-constructed 20-card decks (40 cards total)
- Each player starts with 20 health
- A shared marketplace contains 20 resource cards, with 5 face-up at game start
- Randomly determine who goes first
- Each player draws 7 cards to form their starting hand

---

## Turn Structure

| Phase | Actions |
|-------|---------|
| **Start** | Untap all your cards, then draw cards until you have 7 in hand (skip draw on turn 1 for first player) |
| **Main** | Play cards, activate abilities, attack, trade in marketplace |
| **End** | Discard down to 7 cards; Troop damage resets; unused mana empties |

---

## Card Types

### Units

Units are cards that enter the battlefield. All units have Attack and Health stats. Only untapped units can attack or block.

### Leaders

- Each Leader has Attack, Health, and a Troop type keyword
- Only **one Leader** may attack per turn (by tapping)
- Leaders can attack the turn they're played (unless they enter tapped)
- Leaders can block by tapping (as a reaction)
- Attack target: opponent's health **or** another Leader
- **Damage is permanent** on Leaders (can be healed by effects); Leaders are destroyed when Health reaches 0
- Keyword `Leader - {Troop type} (X)` defines which Troop type can join attacks and the maximum number of Troops that can join (e.g., `Leader - Zombie (5)` means up to 5 Zombie Troops can join)

### Troops

- Each Troop has Attack, Health, and a Troop type
- Troops **cannot attack independently**; they can only join a matching Leader's attack
- Join an attacking Leader by tapping (up to the Leader's X limit)
- Troops can block any attacking unit as a reaction (by tapping)
- Troops can exist on the battlefield without a Leader
- **Damage resets** on Troops at end of turn

---

## Combat

### Attacking

1. Declare one untapped Leader as attacker (tap it)
2. Choose target: opponent's health or an enemy Leader
3. Declare which untapped Troops of the matching type join the attack (tap them)

### Blocking

- Blocking is a **reaction** (occurs after attackers are declared)
- Any untapped unit (Leader or Troop) may block by tapping
- Each blocker is assigned to block one attacking unit
- Multiple blockers can gang up on one attacker; damage is divided by the attacker

### Damage Resolution

- When Troops join an attack, the defending player **must block the Troops first** (the Leader cannot be blocked while unblocked Troops remain)
- Combat damage is dealt simultaneously
- Excess damage (damage beyond a Troop's remaining Health) spills over to the attacking Leader
- *Example: A Leader attacks with 2 Zombie Troops (each 2/2). Defender blocks each with a 3/3. Each Zombie deals 2 damage and takes 3 (lethal). The Zombies had 2 Health each, so the 3/3s dealt 1 excess damage each → 2 total excess damage hits the attacking Leader*
- If the attacking Leader takes lethal damage during combat, it is destroyed after combat resolves
- Unblocked attackers deal their damage to the original target (opponent or enemy Leader)

---

## Resources

### Pitching for Mana

- Play any card face-down as a pitch for its pitch value (1, 2, or 3 mana)
- All cards have a pitch value printed on them
- Pitching is **instant speed** (can be done during your turn or opponent's turn to pay for reactions)
- At end of phase: fully used pitch cards → graveyard
- At end of phase: pitch cards with **any** unused mana → return to hand and deal 1 damage to you per card
- Mana pool empties at end of each phase

### Additional Costs

- Some powerful cards require sacrificing resource cards (destroying them from your battlefield)
- Resource types: Subjects, Materials, Influence

### Deck Depletion

- **Empty deck = you lose** (when you would draw but cannot)
- Balance mana usage: over-pitching burns through your deck

---

## Marketplace

- **Shared deck**: 20 resource cards, 5 face-up (available for purchase/trade)
- **Refresh**: At end of each round (after all players have taken a turn), the oldest face-up card is discarded and a new card is revealed
- **Trade**: Once during **your** turn, you may swap one card from your hand with any face-up marketplace card
- Resource cards can be played from hand to your battlefield (no limit per turn)
- If the marketplace deck runs out, no new cards are revealed but remaining face-up cards stay available

---

## Win Conditions

- Reduce opponent's health to 0 → **you win**
- Opponent cannot draw a card (empty deck) → **you win**
- If both players would lose simultaneously → **the game is a draw**

---

## Clarifications & FAQ

**Q: Can a Leader attack alone without Troops?**
A: Yes. A Leader can attack without any Troops joining.

**Q: Can Troops attack without a Leader?**
A: No. Troops can only join a Leader's attack; they cannot attack independently.

**Q: Can you choose not to block?**
A: Yes. Blocking is optional.

**Q: What happens if a Leader is destroyed mid-attack?**
A: The attack continues. Damage from joining Troops is still dealt.

**Q: Can you pitch multiple cards at once?**
A: Yes. You can pitch as many cards as needed to pay costs.

**Q: When exactly does Troop damage reset?**
A: At the end of each turn, during the End phase.

---

## Glossary

| Term | Definition |
|------|------------|
| **Attack** | A unit's offensive stat; the damage it deals in combat |
| **Battlefield** | The play area where units exist after being played from hand |
| **Block** | A reaction where a unit intercepts an attacking unit to absorb and deal combat damage |
| **Deck** | A player's draw pile; running out means you lose |
| **FIFO** | First In, First Out — oldest items are removed first |
| **Graveyard** | Discard pile where used or destroyed cards go |
| **Health** | A unit's defensive stat; damage taken is subtracted from Health. For players, starts at 20; reaching 0 means defeat |
| **Instant speed** | An action that can be performed at any time, even during opponent's turn |
| **Mana** | Resource used to pay for cards and abilities; generated by pitching |
| **Phase** | A segment of a turn (Start, Main, End); mana empties between phases |
| **Pitch** | Playing a card face-down to generate mana equal to its pitch value (1–3) |
| **Pitch value** | The mana a card produces when pitched (printed as 1, 2, or 3) |
| **Reaction** | An action taken in response to an opponent's action (e.g., blocking, pitching for defense) |
| **Round** | A complete cycle where all players have taken one turn |
| **Tap** | Turning a card sideways to indicate it has been used this turn |
| **Troop type** | A creature classification (e.g., Zombie, Soldier) that determines which Troops can join which Leaders |
| **Turn** | One player's complete sequence of phases (Start → Main → End) |
| **Untap** | Returning a tapped card to upright position, making it usable again |

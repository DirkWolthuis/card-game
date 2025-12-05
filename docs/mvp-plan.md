# MVP Plan - Lords of Estraven

This document outlines the work needed to realize a Minimum Viable Product (MVP) for Lords of Estraven, based on the game design document and current implementation state.

## Overview

The MVP should provide a playable card game with the core mechanics defined in [game-design.md](./game-design.md). The focus is on implementing the fundamental gameplay loop with essential features, deferring advanced mechanics to future iterations.

---

## Current State Analysis

### What's Implemented ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Game framework (boardgame.io) | ✅ Complete | Basic game engine integration |
| Turn structure | ✅ Complete | Start → Main → End stages |
| Basic card playing | ✅ Complete | Play cards from hand |
| Simple effects | ✅ Complete | Damage, Heal effects |
| Target selection | ✅ Complete | Player targeting modal |
| Win/Loss conditions | ✅ Complete | Health to 0, deck depletion |
| Basic UI zones | ✅ Complete | Hand, battlefield, deck, graveyard, exile |
| Draw to 7 cards | ✅ Complete | At start of turn |
| Discard to 7 cards | ✅ Complete | At end of turn |

### What's Missing for MVP ❌

| Feature | Priority | Complexity | Notes |
|---------|----------|------------|-------|
| Unit card types (Leaders, Troops) | High | Medium | Power/Resistance/Health stats |
| Combat system | High | High | Attack, block, damage resolution |
| Lead ability | High | Medium | Leaders leading troops |
| Tap/Untap mechanics | High | Low | Units tap when attacking/blocking |
| Pitching for mana | High | Medium | Pitch cards for mana pool |
| Mana costs on cards | High | Low | Cards require mana to play |
| Spell cards | Medium | Low | One-time effects |
| Reaction cards | Medium | High | Chain mechanism |
| Priority/Chain system | Medium | High | Response windows, LIFO resolution |
| Marketplace | Medium | Medium | Shared resource deck, trading |
| Resource cards | Medium | Medium | Subjects, Materials, Influence |
| Pre-game deck selection | Low | Medium | Choose 2x 20-card decks |

---

## MVP Scope Definition

### Must Have (MVP Core)

These features are essential for a playable game:

1. **Unit System**
   - Leader and Troop card types
   - Unit stats: Power, Resistance, Health
   - Tap/Untap mechanics

2. **Combat System**
   - Declare attacker (one unit per turn)
   - Lead ability for Leaders
   - Blocking mechanics
   - Simultaneous damage resolution
   - Unit destruction

3. **Resource System**
   - Pitching cards for mana
   - Mana pool
   - Mana costs on cards
   - Pitched cards to graveyard at turn start

4. **Basic Card Types**
   - Leaders (with Lead ability)
   - Troops (combat units)
   - Spells (one-time effects)

### Should Have (Enhanced MVP)

These features improve the experience but aren't strictly required:

5. **Reaction System**
   - Basic chain mechanism
   - Reaction cards
   - Priority passing

6. **Marketplace**
   - Shared resource deck
   - Card trading (once per turn)
   - FIFO refresh

7. **Resource Cards**
   - Basic resource card type
   - Sacrifice mechanics

### Won't Have (Post-MVP)

Explicitly excluded from MVP:

- Fast speed cards
- Equipment/attachment cards
- Enchantment cards
- Alternative win conditions
- Mulligan system
- Second player compensation
- Concede option
- AI opponents

---

## Implementation Phases

### Phase 1: Core Unit System (Foundation)

**Goal**: Enable units to exist on the battlefield with proper stats.

| Issue | Title | Description |
|-------|-------|-------------|
| #1 | [MODELS] Add unit card types | Add Leader and Troop card types to models |
| #2 | [MODELS] Add unit stats | Add Power, Resistance, Health to unit cards |
| #3 | [MODELS] Add tap state | Add tapped/untapped state to entities |
| #4 | [CORE] Implement untap phase | Untap all units at start of turn |
| #5 | [CORE] Play units to battlefield | Move units from hand to battlefield |

**Dependencies**: None
**Estimated Issues**: 5

### Phase 2: Combat System (Core Gameplay)

**Goal**: Enable attacking and blocking between players.

| Issue | Title | Description |
|-------|-------|-------------|
| #6 | [MODELS] Add combat state | Track attacking/blocking declarations |
| #7 | [CORE] Declare attacker move | Allow declaring one unit as attacker |
| #8 | [CORE] Lead ability | Leaders can bring troops to attack |
| #9 | [CORE] Declare blocker move | Allow blocking with one unit (Lead for more) |
| #10 | [CORE] Damage resolution | Simultaneous damage calculation |
| #11 | [CORE] Unit destruction | Remove units with 0 health |
| #12 | [UI] Combat visualization | Show attackers, blockers, damage |

**Dependencies**: Phase 1
**Estimated Issues**: 7

### Phase 3: Mana System (Resource Management)

**Goal**: Implement pitching cards for mana to play cards.

| Issue | Title | Description |
|-------|-------|-------------|
| #13 | [MODELS] Add mana pool | Track player's mana pool |
| #14 | [MODELS] Add pitch value to cards | Add pitch value (1-3) to cards |
| #15 | [MODELS] Add mana cost to cards | Add mana cost to play cards |
| #16 | [CORE] Pitch card for mana | Move card to pitched zone, gain mana |
| #17 | [CORE] Pay mana for cards | Require mana to play cards |
| #18 | [CORE] Handle pitched cards | Move to graveyard at turn start |
| #19 | [UI] Mana pool display | Show current mana |
| #20 | [UI] Pitch zone | Show pitched cards |

**Dependencies**: None (parallel with Phase 2)
**Estimated Issues**: 8

### Phase 4: Chain/Priority System (Reactions)

**Goal**: Enable response windows and reaction cards.

| Issue | Title | Description |
|-------|-------|-------------|
| #21 | [MODELS] Add chain state | Track chain of effects |
| #22 | [MODELS] Add reaction card type | Cards that respond to actions |
| #23 | [CORE] Priority system | Passing priority between players |
| #24 | [CORE] Chain building | Add reactions to chain |
| #25 | [CORE] Chain resolution | LIFO resolution of effects |
| #26 | [UI] Priority indicator | Show who has priority |
| #27 | [UI] Chain visualization | Show chain stack |

**Dependencies**: Phase 1, Phase 3
**Estimated Issues**: 7

### Phase 5: Marketplace (Optional MVP Feature)

**Goal**: Implement shared resource deck and trading.

| Issue | Title | Description |
|-------|-------|-------------|
| #28 | [MODELS] Add marketplace state | Shared deck and visible cards |
| #29 | [MODELS] Add resource card type | Subjects, Materials, Influence |
| #30 | [CORE] Setup marketplace | Initialize with 20 cards, 5 visible |
| #31 | [CORE] Trade with marketplace | Swap card from hand once per turn |
| #32 | [CORE] Marketplace refresh | FIFO refresh at round start |
| #33 | [UI] Marketplace display | Show available cards |

**Dependencies**: None
**Estimated Issues**: 6

### Phase 6: Card Data & Balancing

**Goal**: Create initial card set for playtesting.

| Issue | Title | Description |
|-------|-------|-------------|
| #34 | [DATA] Create Leader cards | Design initial leader cards |
| #35 | [DATA] Create Troop cards | Design initial troop cards |
| #36 | [DATA] Create Spell cards | Design initial spell cards |
| #37 | [DATA] Create Reaction cards | Design initial reaction cards |
| #38 | [DATA] Create Resource cards | Design resource cards |
| #39 | [CORE] Pre-constructed decks | Define 2 starter decks |

**Dependencies**: All previous phases
**Estimated Issues**: 6

---

## Summary

### Total Estimated Issues: ~39

| Phase | Issues | Priority | Dependencies |
|-------|--------|----------|--------------|
| Phase 1: Unit System | 5 | Must Have | None |
| Phase 2: Combat System | 7 | Must Have | Phase 1 |
| Phase 3: Mana System | 8 | Must Have | None |
| Phase 4: Chain/Priority | 7 | Should Have | Phase 1, 3 |
| Phase 5: Marketplace | 6 | Should Have | None |
| Phase 6: Card Data | 6 | Must Have | All |

### Recommended Implementation Order

1. **Phase 1 + Phase 3** (parallel) - Foundation
2. **Phase 2** - Core gameplay
3. **Phase 4** - Enhanced gameplay (can be simplified for MVP)
4. **Phase 5** - Optional feature
5. **Phase 6** - Throughout development

### MVP Milestones

| Milestone | Description | Phases Required |
|-----------|-------------|-----------------|
| **M1: Playable Units** | Units on battlefield, basic stats | Phase 1 |
| **M2: Basic Combat** | Attack and block, damage | Phase 1, 2 |
| **M3: Mana Economy** | Pitch cards, pay costs | Phase 3 |
| **M4: Core MVP** | Basic game playable | Phase 1, 2, 3, 6 |
| **M5: Full MVP** | With reactions and marketplace | All phases |

---

## Existing Open Issues

The following open issues are related to MVP work:

| Issue | Title | MVP Phase |
|-------|-------|-----------|
| #13 | [CORE] Priority / stack system | Phase 4 |
| #14 | [CORE] Pre-game phase / deck selection | Phase 6 |
| #15 | [CORE] Permanent card type | Phase 1 |
| #27 | [GAME-DESIGN] card types | Phase 1, 4, 5 |
| #32 | [GAME-DESIGN] clarify game design | Documentation |
| #34 | [UI] Create card UI based on game design document | UI |

---

## Next Steps

1. **Prioritize issues**: Review this plan and prioritize based on team capacity
2. **Create GitHub issues**: Convert the issue table entries into actual GitHub issues
3. **Assign phases**: Group issues into sprints/phases
4. **Begin development**: Start with Phase 1 (Unit System)

---

*This document should be updated as the MVP develops. Check off completed phases and adjust priorities as needed.*

# The Lost Stories of Estraven — A Magic: The Gathering Variant

## Goals of this format variant

This format is an experiment to see how specific rule changes influence the pace and feel of a Magic game. A version of these rules was written as a stand-alone game, and by using Magic: The Gathering as an engine it becomes easier to test them. This format aims to:

- Create a closed environment that feels more like a board game and is less complex for new players
- Give players and format developers a platform for more storytelling in their games and decks
- Make the mana system less frustrating and more balanced
- Give creatures and combat more weight by restricting them further
- Emphasize the strategic use of resources by forcing players to balance card usage against the risk of decking themselves
- Reduce the importance of card advantage
- Provide a built-in way to steal cards

## Rules

### Game setup

This format supports 1v1 play. Players start with 20 life and decide who takes the first turn by whatever method they prefer.

#### Deck selection

In this format, each player chooses two pre-constructed theme decks and shuffles them together, similar to the Jumpstart format.

#### The story deck

In addition to the player decks, a pre-constructed shared story deck is chosen. It contains land cards and "event" cards. The deck is placed between the players.

#### Event cards

Event cards can be non-permanent or permanent cards that represent events in the game world. They are usually symmetrical effects. If a permanent effect is drawn or played, it goes in the event slot and replaces any previous permanent in that slot. If a non-permanent card is drawn, it is played immediately before any other actions can be taken.

Events are not cast and neither player controls them. Players can interact with them as usual.

#### Market and Market Interaction

The market is a shared zone populated with land cards from the story deck. It has five slots, and at the start of the game five land cards are placed in the slots and then the deck is shuffled. Players agree which card is first and which is last, marking the slots accordingly (for example, by placing dice numbered 1–5). At the end of each turn, the last card in the market is placed at the bottom of the story deck, all other cards move one slot forward, and a new card is drawn. If it is an event card, it is played and resolved. Repeat this process until the market is refilled.

_Design note: If players only trade for the card in slot five, other players have fewer chances to steal cards._

All cards in hand gain the ability: `Trade — Swap this card with any card from the market. Activate only as a sorcery and only twice each turn.`

### Draw phase

In addition to drawing a card, players draw additional cards until they have seven cards in hand.

### Mana

#### Keep mana until start of your next turn

Players don’t lose unspent mana as steps and phases end until the start of their next turn.

#### Exile cards from hand to add mana

All cards in hand gain the ability: `Pitch — Exile {cardname}: Add {C}. Activate only as a sorcery.` _Design note: Consider limiting the number of pitches per turn._

### Combat

#### Restrictions

In the "declare attackers" step of the combat phase, players may select only one creature to attack. In the "declare blockers" step, players may select only one blocker.

#### Legendary creatures

Legendary creatures lose all abilities associated with attacking and blocking and gain the "Leader" type. Leaders are permanents that have a power and toughness value and enter the battlefield with health counters equal to their toughness. They let the controlling player declare additional attackers or blockers based on their power and toughness values. They can be targeted by spells as normal, based on their creature type. They can also be targeted by attacking creatures in the same way as planeswalkers, and their health counters are reduced by incoming damage. If all counters are removed, the leader dies. When a leader dies, its controller loses the ability to declare additional attackers or blockers granted by that leader. When a player controls more than one leader, the abilities to declare additional attackers or blockers stack.

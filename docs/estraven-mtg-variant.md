# The lost stories of Estraven - a Magic: the Gathering variant

## Goals of this format variant

This format is an experiment to see how specific rule changes will influence the pace and feel of a Magic game. A version of these rules were written as a stand-alone game, and by using the Magic: the Gathering game as an engine, it is more easy to test them. This format tries to achieve the following:

- Create a closed environment that feels more like a board game and less complex for new players
- Give players and format developers a platform for more storytelling in their games / decks
- To make the mana system less frustrating and more balanced
- Give creatures and combat more weight, by restricting it futher
- Emphasy the strategic use of resources. A new tention added to the game is how quickly do I want to burn trough cards in hand, with the risk of decking myself
- Reduce the importance of card advandage
- Provide a build in way to steal cards

## Rules

### Game setup

This format supports 1v1. Players start with 20 life total and decided who takes first turn by whatever method they like.

#### Deck selection

In this format, each player chooses two pre-constructed theme decks and shuffle them together, the same way as in the Jumpstart format.

#### The story deck

In addition to the player decks, a pre-constructed shared story deck is chosen. It contains land cards and 'event' cards. The deck is placed in between players.

#### Event cards

Event cards can be non-permanent or permanent cards that represent events in the game world. Usally it are symetrical effects. If a permanent effect is drawn / played, it goes in the event slot and replaces any previous permanents in that slot. If a non-permanent card is drawn, it is played directly before any other actions can be taken.

Events are not cast and neither player controls them. They can be interacted with as normal by players.

#### Market & Market interaction

The market is a shared zone populated with land cards from the story deck. It has 5 slots and at the start of the game 5 land cards are placed in the slots and then the deck is shuffled. Players agree what the first and last card are and mark the slots as such. For example by placing dice at the slots (1-5). At the end of each turn the last card in the market is placed at the bottom of the story deck, all other cards move one slot up and a new card is drawn. If it is an Event card, it is played and resolved. Repeat this process until the market is refilled.

_@dirk this is not great, if you keep on only trading for land in slot 5, other players don't get to steal cards_

All cards in hand gain the ability: `Trade -- Swap card with any card from the market. Activate only as a sorcery and only twice each turn.`

### Draw phase

In addition to drawing a card, players draw additional cards until they have 7 cards in hand.

### Mana

#### Keep mana until start of your next turn

Player's don’t lose unspent mana as steps and phases end, until the start of their next turn.

#### Exile cards from hand to add mana

All cards in hand gain the ability: `Pitch -- Exile {cardname}: Add {C}. Activate only as a sorcery.` _@dirk maybe limit to x amount each turn_

### Combat

#### Restrictions

In the 'declare attackers' step of the combat phase, players are only allowed to select one creature to attack. In the 'declare blockers' step players are only allowed to select one blocker.

#### Legendary creatures

Legendary creatures loose all abilities associated with attacking and blocking and gain the 'Leader' type. Leaders are permanents that have a power and toughness value, and enter the battlefield with health counters equal to their toughness value. They give the controlling player the ability to declare additional attackers / blockers based on their power / toughness values. They can be targeted by spells normally based on their creature type. Additionally they can be targeted by attacking creatures in the same way as planes walkers and their health counter is reduced by incoming damage. If all counters are removed, the leader dies. When it dies, players loose the ability to declare additional attackers / blockers. When a player controls more than one leader, the ability to declare additional attackers / blockers stacks.

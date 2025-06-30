import { BattlefieldLanesComponent } from '../components/battlefield-lanes.component';
import { CardAttributesComponent } from '../components/card-attributes.component';
import { DeckComponent } from '../components/deck.component';
import { ExileComponent } from '../components/exile.component';
import { GraveyardComponent } from '../components/graveyard.component';
import { HandComponent } from '../components/hand.component';
import { ManaResourceComponent } from '../components/mana-resource.component';
import { PlayerComponent } from '../components/player.component';
import { UnitAttributesComponent } from '../components/unit-attributes.component';
import { cardsData } from '../data/cards.data';
import { BattlefieldEntity } from '../entities/battlefield.entity';
import { CardEntity } from '../entities/card.entity';
import { PlayerEntity } from '../entities/player.entity';
import { StartCombatPhaseEvent } from '../events/combat.event';
import { GameEvent, GameEventName } from '../models/game-event.model';
import { System } from '../models/system.model';
import { Store } from '../store/store';

export class GameSetupSystem implements System {
  name = 'DamageSystem';
  handlesEvents = [GameEventName.START_GAME];

  async handle(event: GameEvent, store: Store): Promise<GameEvent[]> {
    switch (event.name) {
      case GameEventName.START_GAME: {
        const newEvents = await this.startGame(event, store);
        return newEvents;
      }
    }
  }

  async startGame(event: GameEvent, store: Store): Promise<GameEvent[]> {
    // create two player entities
    const player1 = this.createPlayerEntity('John', 'player1');
    const player2 = this.createPlayerEntity('Jane', 'player2');
    store.addEntity(player1);
    store.addEntity(player2);
    // create battlefield entity
    const battlefield = this.createBattlefieldEntity([player1.id, player2.id]);
    store.addEntity(battlefield);

    // update hands with initial cards
    store.updateEntityComponent(
      'player1',
      new HandComponent({
        cards: [this.createCardEntity('card-1')],
      })
    );
    store.updateEntityComponent(
      'player2',
      new HandComponent({
        cards: [this.createCardEntity('card-2')],
      })
    );
    return [new StartCombatPhaseEvent()];
  }

  createPlayerEntity(name: string, playerId: string): PlayerEntity {
    return new PlayerEntity(
      playerId,
      new PlayerComponent({ name, playerId }),
      new ManaResourceComponent({ currentMana: 0, maxMana: 0 }),
      new HandComponent({ cards: [] }),
      new DeckComponent({ cards: [] }),
      new GraveyardComponent({ cards: [] }),
      new ExileComponent({ cards: [] })
    );
  }

  createBattlefieldEntity(playerIds: string[]): BattlefieldEntity {
    const lanes = playerIds.reduce((acc, id) => {
      return {
        ...acc,
        [id]: {
          combatLane: [],
          supportLane: [],
        },
      };
    }, {});
    return new BattlefieldEntity(
      'battlefield-entity',
      new BattlefieldLanesComponent(lanes)
    );
  }

  createCardEntity(cardId: string): CardEntity {
    const card = cardsData.find((card) => card.id === cardId);
    return new CardEntity(
      cardId,
      new CardAttributesComponent(card.cardAttributes),
      new UnitAttributesComponent(card.unitAttributes)
    );
  }
}

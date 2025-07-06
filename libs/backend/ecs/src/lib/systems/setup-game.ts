import { GameEvent, SetupGameEvent } from '@loe/shared/game-types';
import { GameSystem } from './system.model';
import { addComponent, addEntity } from 'bitecs';
import { Player } from '../components/player-tag';
import {
  DeckComponent,
  ExileComponent,
  GraveyardComponent,
  HandComponent,
} from '../components/card-collection';

export const setupGameSystem: GameSystem<SetupGameEvent> = async (
  event,
  world,
  engine
) => {
  let newEvents: GameEvent[] = [];
  event.payload.players.forEach((player) => {
    const playerEntity = addEntity(world);
    addComponent(world, Player, playerEntity);
    addComponent(world, DeckComponent, playerEntity);
    addComponent(world, GraveyardComponent, playerEntity);
    addComponent(world, ExileComponent, playerEntity);
    addComponent(world, HandComponent, playerEntity);

    newEvents.push({
      type: 'INTERNAL::CREATE_CARD_ENTITIES',
      payload: {
        playerId: player.id,
        deckId: player.deckId,
      },
    });
    newEvents.push({
      type: 'INTERNAL::CREATE_CARD_COLLECTIONS',
      payload: {
        playerId: player.id,
      },
    });
  });
  engine.addEvents(newEvents);
};

import { Card as CardModel, Entity, GameState, MoveType } from '@game/models';
import { getCardById } from '@game/data';
import Card from '../components/Card';
import { BoardProps } from 'boardgame.io/dist/types/packages/react';

interface HandZoneProps {
  board: BoardProps<GameState>;
  entities: Entity[];
}

export function HandZone(props: HandZoneProps) {
  const cardsToRender: [Entity, CardModel][] = props.entities
    .map((entity) => {
      const card = getCardById(entity.cardId);
      return [entity, card] as [Entity, CardModel];
    })
    .filter(([entity, card]) => !!card) as [Entity, CardModel][];

  const renderCards = () => {
    return cardsToRender.map(([entity, card]) => (
      <Card
        key={entity.id}
        card={card}
        entity={entity}
        onPlayCard={() =>
          props.board.moves[MoveType.PLAY_CARD_FROM_HAND](entity.id)
        }
      ></Card>
    ));
  };

  return <div className="flex gap-4">{renderCards()}</div>;
}

export default HandZone;

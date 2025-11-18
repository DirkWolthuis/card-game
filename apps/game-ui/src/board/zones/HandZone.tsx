import { Card as CardModel, Entity } from '@game/models';
import { getCardById } from '@game/data';
import Card from '../components/Card';

interface HandZoneProps {
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
      <Card key={entity.id} card={card}></Card>
    ));
  };

  return <div className="flex gap-4">{renderCards()}</div>;
}

export default HandZone;

import { Card as CardModel, Entity } from '@game/models';
import { useDrag } from 'react-dnd';

interface CardProps {
  card: CardModel;
  entity: Entity;
  onPlayCard: () => void;
}

interface DragItem {
  type: string;
  entityId: string;
  card: CardModel;
}

export const CARD_DRAG_TYPE = 'CARD';

export function Card(props: CardProps) {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: CARD_DRAG_TYPE,
    item: {
      type: CARD_DRAG_TYPE,
      entityId: props.entity.id,
      card: props.card,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [props.entity.id, props.card]);

  return (
    <div
      ref={drag}
      className="border-2 border-black bg-white rounded-md flex flex-col p-4 shadow-md cursor-grab active:cursor-grabbing min-w-[150px]"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
          {props.card.manaCost}
        </div>
        <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
          {props.card.pitchValue}
        </div>
      </div>
      <h1 className="text-center font-bold mb-2">{props.card.name}</h1>
      <p className="text-xs text-gray-600 text-center mb-2">{props.card.displayText}</p>
      <button
        onClick={() => props.onPlayCard()}
        className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
      >
        play card
      </button>
    </div>
  );
}

export default Card;

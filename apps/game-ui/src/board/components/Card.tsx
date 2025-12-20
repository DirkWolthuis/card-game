import React from 'react';
import { Card as CardModel, Entity } from '@game/models';
import { useDrag } from 'react-dnd';

interface CardProps {
  card: CardModel;
  entity: Entity;
  onPlayCard: () => void;
}

interface DragItem {
  entityId: string;
  card: CardModel;
}

export const CARD_DRAG_TYPE = 'CARD';

function CardHeader({ manaCost, pitchValue }: { manaCost: number; pitchValue: number }) {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
        {manaCost}
      </div>
      <div className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
        {pitchValue}
      </div>
    </div>
  );
}

function CardTitle({ name }: { name: string }) {
  return <h1 className="text-center font-bold mb-2">{name}</h1>;
}

function CardTypeBadge({ types }: { types: string[] }) {
  return (
    <div className="text-center mb-2">
      <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded text-xs">
        {types.join(' ')}
      </span>
    </div>
  );
}

function UnitStatsDisplay({ power, resistance, health }: { power: number; resistance: number; health: number }) {
  return (
    <div className="flex justify-around mb-2 text-xs border-t border-b py-2">
      <div className="text-center">
        <div className="font-bold">⚔️ {power}</div>
        <div className="text-gray-600">PWR</div>
      </div>
      <div className="text-center">
        <div className="font-bold">🛡️ {resistance}</div>
        <div className="text-gray-600">RES</div>
      </div>
      <div className="text-center">
        <div className="font-bold">❤️ {health}</div>
        <div className="text-gray-600">HP</div>
      </div>
    </div>
  );
}

function CardDescription({ displayText }: { displayText: string }) {
  return <p className="text-xs text-gray-600 text-center mb-2">{displayText}</p>;
}

function PlayCardButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
    >
      play card
    </button>
  );
}

export function Card(props: CardProps) {
  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>(() => ({
    type: CARD_DRAG_TYPE,
    item: {
      entityId: props.entity.id,
      card: props.card,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [props.entity.id, props.card]);

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className="border-2 border-black bg-white rounded-md flex flex-col p-4 shadow-md cursor-grab active:cursor-grabbing min-w-[150px]"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <CardHeader manaCost={props.card.manaCost} pitchValue={props.card.pitchValue} />
      <CardTitle name={props.card.name} />
      <CardTypeBadge types={props.card.types} />
      {props.card.unitStats && (
        <UnitStatsDisplay 
          power={props.card.unitStats.power}
          resistance={props.card.unitStats.resistance}
          health={props.card.unitStats.health}
        />
      )}
      <CardDescription displayText={props.card.displayText} />
      <PlayCardButton onClick={() => props.onPlayCard()} />
    </div>
  );
}

export default Card;

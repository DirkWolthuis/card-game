import { useDrop } from 'react-dnd';
import { CARD_DRAG_TYPE } from '../components/Card';
import { Card as CardModel, Entity } from '@game/models';
import { useState } from 'react';
import { getCardById } from '@game/data';

interface DragItem {
  entityId: string;
  card: CardModel;
}

interface BattlefieldZoneProps {
  onPlayCard: (entityId: string) => void;
  onPitchCard: (entityId: string) => void;
  battlefieldEntities: Entity[];
}

function DropZone({ 
  dropRef, 
  isOver, 
  title, 
  description, 
  overColor, 
  defaultColor,
  testId 
}: { 
  dropRef: (node: HTMLDivElement | null) => void;
  isOver: boolean;
  title: string;
  description: string;
  overColor: string;
  defaultColor: string;
  testId: string;
}) {
  return (
    <div
      ref={dropRef}
      data-testid={testId}
      className={`flex-1 border-4 border-dashed rounded-lg flex items-center justify-center transition-colors ${
        isOver ? overColor : defaultColor
      }`}
    >
      <div className="text-center pointer-events-none">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}

function DragDropZones({ 
  dropPlayRef, 
  dropPitchRef, 
  isOverPlay, 
  isOverPitch 
}: { 
  dropPlayRef: (node: HTMLDivElement | null) => void;
  dropPitchRef: (node: HTMLDivElement | null) => void;
  isOverPlay: boolean;
  isOverPitch: boolean;
}) {
  return (
    <div className="flex gap-4 w-full h-full">
      <DropZone
        dropRef={dropPlayRef}
        isOver={isOverPlay}
        title="Play Card"
        description="Drop here to play"
        overColor="bg-blue-500 border-blue-300"
        defaultColor="bg-green-800 border-green-500"
        testId="play-card-zone"
      />
      <DropZone
        dropRef={dropPitchRef}
        isOver={isOverPitch}
        title="Pitch Card"
        description="Drop here to pitch for mana"
        overColor="bg-yellow-500 border-yellow-300"
        defaultColor="bg-green-800 border-green-500"
        testId="pitch-card-zone"
      />
    </div>
  );
}

function BattlefieldUnitCard({ entity }: { entity: Entity }) {
  const card = getCardById(entity.cardId);
  
  if (!card) {
    console.error(`Card not found for entity ${entity.id} with cardId ${entity.cardId}`);
    return null;
  }
  
  return (
    <div
      className="border-2 border-yellow-400 bg-green-800 rounded-md flex flex-col p-4 shadow-lg min-w-[150px]"
    >
      <h3 className="text-center font-bold text-yellow-300 mb-2">{card.name}</h3>
      {card.unitStats && (
        <div className="flex justify-around mb-2 text-sm">
          <div className="text-center">
            <div className="text-red-400 font-bold">⚔️ {card.unitStats.power}</div>
            <div className="text-xs text-gray-300">Power</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold">🛡️ {card.unitStats.resistance}</div>
            <div className="text-xs text-gray-300">Res</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold">❤️ {card.unitStats.health}</div>
            <div className="text-xs text-gray-300">HP</div>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-300 text-center">{card.displayText}</p>
      <div className="mt-2 text-center">
        <span className="inline-block bg-purple-600 text-white px-2 py-1 rounded text-xs">
          {card.types.join(' ')}
        </span>
      </div>
    </div>
  );
}

function BattlefieldUnitsDisplay({ entities }: { entities: Entity[] }) {
  return (
    <div className="w-full h-full overflow-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Battlefield</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {entities.map((entity) => (
          <BattlefieldUnitCard key={entity.id} entity={entity} />
        ))}
      </div>
    </div>
  );
}

function EmptyBattlefield() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-2">Battlefield</h2>
      <p className="text-gray-300">Drag cards here to play or pitch</p>
    </div>
  );
}

export function BattlefieldZone(props: BattlefieldZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const [{ isOverPlay, canDropPlay }, dropPlay] = useDrop<DragItem, void, { isOverPlay: boolean; canDropPlay: boolean }>(() => ({
    accept: CARD_DRAG_TYPE,
    drop: (item) => {
      props.onPlayCard(item.entityId);
      setIsDragging(false);
    },
    collect: (monitor) => ({
      isOverPlay: !!monitor.isOver(),
      canDropPlay: !!monitor.canDrop(),
    }),
    hover: () => {
      setIsDragging(true);
    },
  }), [props.onPlayCard]);

  const [{ isOverPitch, canDropPitch }, dropPitch] = useDrop<DragItem, void, { isOverPitch: boolean; canDropPitch: boolean }>(() => ({
    accept: CARD_DRAG_TYPE,
    drop: (item) => {
      props.onPitchCard(item.entityId);
      setIsDragging(false);
    },
    collect: (monitor) => ({
      isOverPitch: !!monitor.isOver(),
      canDropPitch: !!monitor.canDrop(),
    }),
    hover: () => {
      setIsDragging(true);
    },
  }), [props.onPitchCard]);

  const showDropZones = isDragging || canDropPlay || canDropPitch;
  const hasUnits = props.battlefieldEntities.length > 0;

  const renderContent = () => {
    if (showDropZones) {
      return (
        <DragDropZones 
          dropPlayRef={dropPlay}
          dropPitchRef={dropPitch}
          isOverPlay={isOverPlay}
          isOverPitch={isOverPitch}
        />
      );
    }
    
    if (hasUnits) {
      return <BattlefieldUnitsDisplay entities={props.battlefieldEntities} />;
    }
    
    return <EmptyBattlefield />;
  };

  return (
    <div className="bg-green-900 text-white p-6 rounded-lg h-full flex items-center justify-center border-2 border-green-700">
      {renderContent()}
    </div>
  );
}

export default BattlefieldZone;

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

  // Show drop zones when dragging
  const showDropZones = isDragging || canDropPlay || canDropPitch;
  const hasUnits = props.battlefieldEntities.length > 0;

  return (
    <div className="bg-green-900 text-white p-6 rounded-lg h-full flex items-center justify-center border-2 border-green-700">
      {showDropZones ? (
        <div className="flex gap-4 w-full h-full">
          <div
            ref={dropPlay}
            className={`flex-1 border-4 border-dashed rounded-lg flex items-center justify-center transition-colors ${
              isOverPlay
                ? 'bg-blue-500 border-blue-300'
                : 'bg-green-800 border-green-500'
            }`}
          >
            <div className="text-center pointer-events-none">
              <h3 className="text-2xl font-bold mb-2">Play Card</h3>
              <p className="text-gray-300">Drop here to play</p>
            </div>
          </div>
          <div
            ref={dropPitch}
            className={`flex-1 border-4 border-dashed rounded-lg flex items-center justify-center transition-colors ${
              isOverPitch
                ? 'bg-yellow-500 border-yellow-300'
                : 'bg-green-800 border-green-500'
            }`}
          >
            <div className="text-center pointer-events-none">
              <h3 className="text-2xl font-bold mb-2">Pitch Card</h3>
              <p className="text-gray-300">Drop here to pitch for mana</p>
            </div>
          </div>
        </div>
      ) : hasUnits ? (
        <div className="w-full h-full overflow-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Battlefield</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {props.battlefieldEntities.map((entity) => {
              const card = getCardById(entity.cardId);
              if (!card) {
                console.error(`Card not found for entity ${entity.id} with cardId ${entity.cardId}`);
                return null;
              }
              
              return (
                <div
                  key={entity.id}
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
                      {card.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Battlefield</h2>
          <p className="text-gray-300">Drag cards here to play or pitch</p>
        </div>
      )}
    </div>
  );
}

export default BattlefieldZone;

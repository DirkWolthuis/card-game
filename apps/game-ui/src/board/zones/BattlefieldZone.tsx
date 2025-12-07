import { useDrop } from 'react-dnd';
import { CARD_DRAG_TYPE } from '../components/Card';
import { Card as CardModel } from '@game/models';
import { useState } from 'react';

interface DragItem {
  entityId: string;
  card: CardModel;
}

interface BattlefieldZoneProps {
  onPlayCard: (entityId: string) => void;
  onPitchCard: (entityId: string) => void;
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

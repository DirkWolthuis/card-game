import { useDrop } from 'react-dnd';
import { CARD_DRAG_TYPE } from '../components/Card';
import { Card as CardModel } from '@game/models';

interface DragItem {
  entityId: string;
  card: CardModel;
}

interface BattlefieldZoneProps {
  onPlayCard: (entityId: string) => void;
  onPitchCard: (entityId: string) => void;
}

export function BattlefieldZone(props: BattlefieldZoneProps) {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: CARD_DRAG_TYPE,
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  }), []);

  const [{ isOverPlay }, dropPlay] = useDrop<DragItem, void, { isOverPlay: boolean }>(() => ({
    accept: CARD_DRAG_TYPE,
    drop: (item) => {
      props.onPlayCard(item.entityId);
    },
    collect: (monitor) => ({
      isOverPlay: !!monitor.isOver(),
    }),
  }), [props.onPlayCard]);

  const [{ isOverPitch }, dropPitch] = useDrop<DragItem, void, { isOverPitch: boolean }>(() => ({
    accept: CARD_DRAG_TYPE,
    drop: (item) => {
      props.onPitchCard(item.entityId);
    },
    collect: (monitor) => ({
      isOverPitch: !!monitor.isOver(),
    }),
  }), [props.onPitchCard]);

  return (
    <div
      ref={drop}
      className="bg-green-900 text-white p-6 rounded-lg h-full flex items-center justify-center border-2 border-green-700"
    >
      {isOver ? (
        <div className="flex gap-4 w-full h-full">
          <div
            ref={dropPlay}
            className={`flex-1 border-4 border-dashed rounded-lg flex items-center justify-center ${
              isOverPlay
                ? 'bg-blue-500 border-blue-300'
                : 'bg-green-800 border-green-500'
            }`}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Play Card</h3>
              <p className="text-gray-300">Drop here to play</p>
            </div>
          </div>
          <div
            ref={dropPitch}
            className={`flex-1 border-4 border-dashed rounded-lg flex items-center justify-center ${
              isOverPitch
                ? 'bg-yellow-500 border-yellow-300'
                : 'bg-green-800 border-green-500'
            }`}
          >
            <div className="text-center">
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

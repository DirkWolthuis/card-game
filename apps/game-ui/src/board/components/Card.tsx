import { Card as CardModel } from '@game/models';

interface CardProps {
  card: CardModel;
  onPlayCard: () => void;
}

export function Card(props: CardProps) {
  return (
    <div className="border-solid border-black bg-white rounded-md flex flex-col items-center justify-center p-4 shadow-md">
      <h1>{props.card.name}</h1>
      <button onClick={() => props.onPlayCard()}>play card</button>
    </div>
  );
}

export default Card;

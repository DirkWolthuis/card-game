import { Card as CardModel, CardType } from '@game/models';

interface CardProps {
  card: CardModel;
  onPlayCard: () => void;
}

/**
 * Get the color scheme based on card type
 */
function getCardTypeColor(cardType: CardType): {
  border: string;
  header: string;
  badge: string;
} {
  switch (cardType) {
    case CardType.LEADER:
      return {
        border: 'border-yellow-500',
        header: 'bg-yellow-600',
        badge: 'bg-yellow-500',
      };
    case CardType.TROOP:
      return {
        border: 'border-green-500',
        header: 'bg-green-600',
        badge: 'bg-green-500',
      };
    case CardType.SPELL:
      return {
        border: 'border-blue-500',
        header: 'bg-blue-600',
        badge: 'bg-blue-500',
      };
    case CardType.RESOURCE:
      return {
        border: 'border-purple-500',
        header: 'bg-purple-600',
        badge: 'bg-purple-500',
      };
    default:
      return {
        border: 'border-gray-500',
        header: 'bg-gray-600',
        badge: 'bg-gray-500',
      };
  }
}

/**
 * Get pitch value indicator color
 */
function getPitchColor(pitchValue: 1 | 2 | 3): string {
  switch (pitchValue) {
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-yellow-400';
    case 3:
      return 'bg-blue-400';
    default:
      return 'bg-gray-400';
  }
}

export function Card({ card, onPlayCard }: CardProps) {
  const colors = getCardTypeColor(card.cardType);
  const pitchColor = getPitchColor(card.pitchValue);
  const hasStats = card.attack !== undefined && card.health !== undefined;

  return (
    <div
      className={`relative w-48 h-72 rounded-lg border-2 ${colors.border} bg-gray-800 shadow-lg overflow-hidden flex flex-col cursor-pointer hover:scale-105 transition-transform`}
      onClick={onPlayCard}
      data-testid="card"
    >
      {/* Cost Badge - Top Left */}
      <div className="absolute top-1 left-1 w-8 h-8 rounded-full bg-blue-700 border-2 border-blue-300 flex items-center justify-center text-white font-bold text-sm z-10">
        {card.cost}
      </div>

      {/* Pitch Value Indicator - Top Right */}
      <div
        className={`absolute top-1 right-1 w-6 h-6 rounded-full ${pitchColor} border-2 border-white flex items-center justify-center text-white font-bold text-xs z-10`}
        title={`Pitch value: ${card.pitchValue}`}
      >
        {card.pitchValue}
      </div>

      {/* Card Header with Name */}
      <div className={`${colors.header} px-2 py-1 pt-3`}>
        <h3 className="text-white text-sm font-bold text-center truncate">
          {card.name}
        </h3>
      </div>

      {/* Card Art Placeholder */}
      <div className="flex-1 bg-gray-700 flex items-center justify-center mx-2 mt-1 rounded border border-gray-600">
        {card.artUrl ? (
          <img
            src={card.artUrl}
            alt={card.name}
            className="w-full h-full object-cover rounded"
          />
        ) : (
          <div className="text-gray-500 text-xs text-center p-2">
            <div className="text-3xl mb-1">
              <span role="img" aria-label="Card art placeholder">
                🎴
              </span>
            </div>
            <span>Art Placeholder</span>
          </div>
        )}
      </div>

      {/* Card Type Badge */}
      <div className="flex justify-center my-1">
        <span
          className={`${colors.badge} text-white text-xs px-2 py-0.5 rounded-full uppercase font-semibold`}
        >
          {card.cardType}
        </span>
      </div>

      {/* Card Text */}
      <div className="bg-gray-900 mx-2 mb-1 p-1.5 rounded text-white text-xs min-h-[40px] overflow-auto">
        {card.displayText}
      </div>

      {/* Attack/Health Stats (for Leaders and Troops) */}
      {hasStats && (
        <div className="flex justify-between px-2 pb-1">
          <div className="flex items-center bg-red-600 rounded-full px-2 py-0.5">
            <span className="text-white font-bold text-sm">
              <span role="img" aria-label="Attack">
                ⚔️
              </span>{' '}
              {card.attack}
            </span>
          </div>
          <div className="flex items-center bg-green-600 rounded-full px-2 py-0.5">
            <span className="text-white font-bold text-sm">
              <span role="img" aria-label="Health">
                ❤️
              </span>{' '}
              {card.health}
            </span>
          </div>
        </div>
      )}

      {/* Play Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlayCard();
        }}
        className="mx-2 mb-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-bold rounded transition-colors"
      >
        Play Card
      </button>
    </div>
  );
}

export default Card;

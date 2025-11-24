export function DeckZone() {
  return (
    <div className="bg-purple-900 text-white p-2 rounded-lg border-2 border-purple-700">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold">Deck</h4>
        <div className="flex items-center gap-1">
          <span role="img" aria-label="deck of cards" className="text-lg">🃏</span>
          <span className="text-xs">0</span>
        </div>
      </div>
    </div>
  );
}

export default DeckZone;

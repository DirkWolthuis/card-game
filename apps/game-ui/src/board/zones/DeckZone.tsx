export function DeckZone() {
  return (
    <div className="bg-purple-900 text-white p-4 rounded-lg h-full border-2 border-purple-700">
      <h3 className="text-lg font-bold mb-2">Deck</h3>
      <div className="flex items-center justify-center h-32 bg-purple-800 rounded border-2 border-purple-600">
        <div className="text-center">
          <div className="text-4xl mb-2">
            <span role="img" aria-label="deck of cards">🃏</span>
          </div>
          <p className="text-sm">0 cards</p>
        </div>
      </div>
    </div>
  );
}

export default DeckZone;

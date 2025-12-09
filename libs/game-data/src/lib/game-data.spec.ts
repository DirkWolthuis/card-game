import {
  getAllPreconstructedDecks,
  getPreconstructedDeckById,
  getAllCards,
} from './game-data';

describe('Preconstructed Decks', () => {
  describe('getAllPreconstructedDecks', () => {
    it('should return 4 preconstructed decks', () => {
      const decks = getAllPreconstructedDecks();
      expect(decks).toHaveLength(4);
    });

    it('should have decks with unique IDs', () => {
      const decks = getAllPreconstructedDecks();
      const ids = decks.map((d) => d.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(decks.length);
    });

    it('should have decks with exactly 20 cards each', () => {
      const decks = getAllPreconstructedDecks();
      decks.forEach((deck) => {
        expect(deck.cardIds).toHaveLength(20);
      });
    });

    it('should have decks with name and description', () => {
      const decks = getAllPreconstructedDecks();
      decks.forEach((deck) => {
        expect(deck.name).toBeDefined();
        expect(deck.name.length).toBeGreaterThan(0);
        expect(deck.description).toBeDefined();
        expect(deck.description.length).toBeGreaterThan(0);
      });
    });

    it('should have all card IDs exist in card database', () => {
      const decks = getAllPreconstructedDecks();
      const allCards = getAllCards();
      const validCardIds = new Set(allCards.map((c) => c.id));

      decks.forEach((deck) => {
        deck.cardIds.forEach((cardId) => {
          expect(validCardIds.has(cardId)).toBe(true);
        });
      });
    });
  });

  describe('getPreconstructedDeckById', () => {
    it('should return deck by ID', () => {
      const deck = getPreconstructedDeckById('aggro-red');
      expect(deck).toBeDefined();
      expect(deck?.id).toBe('aggro-red');
      expect(deck?.name).toBe('Aggressive Red');
    });

    it('should return undefined for non-existent ID', () => {
      const deck = getPreconstructedDeckById('non-existent');
      expect(deck).toBeUndefined();
    });

    it('should find all 4 decks by their IDs', () => {
      const deckIds = ['aggro-red', 'control-white', 'balanced-green', 'combo-blue'];
      deckIds.forEach((id) => {
        const deck = getPreconstructedDeckById(id);
        expect(deck).toBeDefined();
        expect(deck?.id).toBe(id);
      });
    });
  });
});

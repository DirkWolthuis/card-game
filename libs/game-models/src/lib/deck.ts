export interface Deck {
  cardIds: string[];
}

export interface PreconstructedDeck {
  id: string;
  name: string;
  description: string;
  cardIds: string[]; // Array of 20 card IDs
}

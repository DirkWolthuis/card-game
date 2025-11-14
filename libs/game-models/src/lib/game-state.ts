import { Deck } from './deck';
import { Player } from './player';
import { Zones } from './zone';

export interface GameState {
  players: Player[];
  zones: Zones[];
  decks: Deck[];
}

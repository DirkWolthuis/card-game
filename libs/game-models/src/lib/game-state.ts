import { Deck } from './deck';
import { Player, PlayerId } from './player';
import { Zones } from './zone';

export interface GameState {
  players: Record<PlayerId, Player>;
  zones: Record<PlayerId, Zones>;
  decks: Record<PlayerId, Deck>;
}

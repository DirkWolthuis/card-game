import { PlayerComponent } from '../components/player.component';
import { ManaResourceComponent } from '../components/mana-resource.component';
import { HandComponent } from '../components/hand.component';
import { DeckComponent } from '../components/deck.component';
import { GraveyardComponent } from '../components/graveyard.component';
import { ExileComponent } from '../components/exile.component';
import { Entity } from '../models/entity.model';

export class PlayerEntity implements Entity {
  id: string;

  constructor(
    id: string,
    public playerComponent: PlayerComponent,
    public manaResourceComponent: ManaResourceComponent,
    public handComponent: HandComponent,
    public deckComponent: DeckComponent,
    public graveyardComponent: GraveyardComponent,
    public exileComponent: ExileComponent
  ) {
    this.id = id;
  }
}
